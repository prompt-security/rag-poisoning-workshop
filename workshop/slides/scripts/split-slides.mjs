#!/usr/bin/env node
/**
 * split-slides.mjs — break the monolithic Slidev deck into one file per slide.
 *
 * Before:  slides.md            (45 slides, ~1200 lines, one file to edit)
 * After:   slides.md            (deck headmatter + an ordered list of `src:` imports)
 *          slides/01-*.md       (one file per slide, verbatim source)
 *
 * Slide bodies are copied byte-for-byte out of the parsed source — no re-serialisation,
 * so MDC, inline HTML, `v-click`s and `<!-- notes -->` survive untouched.
 *
 * Verification (always runs, before the change is allowed to stand):
 *   1. Slidev's own parser resolves the new deck with zero errors.
 *   2. The resolved deck is compared slide-by-slide against the pre-migration deck —
 *      count, frontmatter, content, speaker notes, titles, headmatter and detected
 *      features must all match exactly.
 *   3. `slidev build` runs to completion (skip with --no-build).
 * If any step fails the original slides.md is restored and every generated file removed.
 *
 * Usage:
 *   node scripts/split-slides.mjs [options]
 *     --dir <name>     output folder for the slide files (default: slides)
 *     --entry <file>   deck entry file (default: slides.md)
 *     -n, --dry-run    print the plan, write nothing
 *     --no-build       skip the `slidev build` check (parser checks still run)
 *     --no-backup      don't leave a .bak of the original entry file
 *     --force          re-split even if the deck already uses `src:` imports
 *     -h, --help       this text
 */

import fs from 'node:fs'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { parse } from '@slidev/parser'
import { load } from '@slidev/parser/fs'

const DECK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------- cli

function usage() {
  const text = fs.readFileSync(fileURLToPath(import.meta.url), 'utf-8')
  console.log(text.slice(text.indexOf('/**'), text.indexOf('*/') + 2))
}

function parseArgs(argv) {
  const opts = { entry: 'slides.md', dir: 'slides', dryRun: false, build: true, backup: true, force: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dir') opts.dir = argv[++i]
    else if (arg === '--entry') opts.entry = argv[++i]
    else if (arg === '-n' || arg === '--dry-run') opts.dryRun = true
    else if (arg === '--no-build') opts.build = false
    else if (arg === '--no-backup') opts.backup = false
    else if (arg === '--force') opts.force = true
    else if (arg === '-h' || arg === '--help') { usage(); process.exit(0) }
    else die(`unknown argument: ${arg}  (try --help)`)
    if (opts.dir == null || opts.entry == null) die(`missing value for ${arg}`)
  }
  return opts
}

const die = (msg) => { console.error(`\n  ✗ ${msg}\n`); process.exit(1) }
const say = (msg = '') => console.log(msg)

// ---------------------------------------------------------------- naming

function slugify(text) {
  return (text || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '')
}

const stripTags = (html) => html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ')

/** Best available human label: the slide title, else a heading or kicker in its HTML. */
function labelFor(slide) {
  if (slide.title) return slide.title
  const body = slide.content ?? ''
  const heading =
    body.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i) ??
    body.match(/class="[^"]*\bkicker\b[^"]*"[^>]*>([\s\S]*?)</i)
  return heading ? stripTags(heading[1]) : (slide.frontmatter?.layout ?? '')
}

/** A stable, human-meaningful file name per slide: 07-what-rag-is-used-for.md */
function planNames(slides) {
  const used = new Set()
  return slides.map((slide, i) => {
    const base = slugify(labelFor(slide)) || 'slide'
    let name = `${String(i + 1).padStart(2, '0')}-${base}`
    let n = 2
    while (used.has(name)) name = `${String(i + 1).padStart(2, '0')}-${base}-${n++}`
    used.add(name)
    return `${name}.md`
  })
}

// ---------------------------------------------------------------- comparison

/** Key-sorted deep copy, so JSON.stringify is a stable equality test. */
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical(value[k])]))
  return value
}
const stable = (value) => JSON.stringify(canonical(value))

function snapshot(data) {
  return {
    count: data.slides.length,
    headmatter: data.headmatter ?? {},
    features: data.features ?? {},
    slides: data.slides.map((s) => ({
      title: s.title ?? null,
      level: s.level ?? null,
      frontmatter: s.frontmatter ?? {},
      content: s.content ?? '',
      note: s.note ?? '',
    })),
  }
}

function diffSnapshots(before, after, names) {
  const problems = []
  if (before.count !== after.count)
    problems.push(`slide count changed: ${before.count} → ${after.count}`)
  if (stable(before.headmatter) !== stable(after.headmatter))
    problems.push('deck headmatter changed')
  if (stable(before.features) !== stable(after.features))
    problems.push('detected Slidev features changed')

  for (let i = 0; i < Math.min(before.count, after.count); i++) {
    const a = before.slides[i]
    const b = after.slides[i]
    const where = `slide ${i + 1}${names?.[i] ? ` (${names[i]})` : ''}`
    for (const field of ['title', 'level', 'frontmatter', 'content', 'note']) {
      if (stable(a[field]) === stable(b[field])) continue
      problems.push(`${where}: ${field} differs`)
      if (typeof a[field] === 'string') {
        const at = a[field].split('\n')
        const bt = b[field].split('\n')
        const line = at.findIndex((l, n) => l !== bt[n])
        problems.push(`    expected: ${JSON.stringify(at[line] ?? '<end of slide>')}`)
        problems.push(`    actual:   ${JSON.stringify(bt[line] ?? '<end of slide>')}`)
      } else {
        problems.push(`    expected: ${stable(a[field])}`)
        problems.push(`    actual:   ${stable(b[field])}`)
      }
    }
  }
  return problems
}

/** Parse errors recorded by Slidev for the entry file and every imported file. */
function collectErrors(data) {
  const out = []
  for (const md of [data.entry, ...Object.values(data.markdownFiles ?? {})]) {
    for (const err of md?.errors ?? [])
      out.push(`${path.relative(DECK_ROOT, md.filepath)}:${err.row + 1} — ${err.message}`)
  }
  return [...new Set(out)]
}

const loadDeck = (entryPath) =>
  load({ roots: [DECK_ROOT], userRoot: DECK_ROOT, allowedRoots: [DECK_ROOT] }, entryPath)

// ---------------------------------------------------------------- slidev build

function runSlidevBuild(entryPath) {
  const local = path.join(DECK_ROOT, 'node_modules', '.bin', 'slidev')
  const [cmd, argv] = fs.existsSync(local) ? [local, []] : ['npx', ['--no-install', 'slidev']]
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'slidev-verify-'))
  try {
    const res = spawnSync(cmd, [...argv, 'build', '--out', out, entryPath], {
      cwd: DECK_ROOT,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    if (res.error) return `could not run slidev (${res.error.message})`
    if (res.status !== 0) {
      const log = `${res.stdout ?? ''}${res.stderr ?? ''}`.trimEnd().split('\n').slice(-25).join('\n')
      return `slidev build exited ${res.status}:\n${log}`
    }
    if (!fs.existsSync(path.join(out, 'index.html')))
      return 'slidev build produced no index.html'
    return null
  } finally {
    fs.rmSync(out, { recursive: true, force: true })
  }
}

// ---------------------------------------------------------------- main

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const entryPath = path.resolve(DECK_ROOT, opts.entry)
  const outDir = path.resolve(DECK_ROOT, opts.dir)
  const rel = (p) => path.relative(DECK_ROOT, p) || '.'

  if (!fs.existsSync(entryPath)) die(`entry file not found: ${rel(entryPath)}`)
  if (path.relative(DECK_ROOT, outDir).startsWith('..'))
    die(`--dir must stay inside the deck (${rel(DECK_ROOT)})`)

  const original = await fsp.readFile(entryPath, 'utf-8')
  const md = await parse(original, entryPath)

  if (md.slides.some((s) => s.frontmatter?.src) && !opts.force)
    die(`${rel(entryPath)} already uses \`src:\` imports — it looks split already.\n` +
        `    Restore the monolithic deck (git checkout / the .bak file) before re-running, or pass --force.`)

  // --- plan ------------------------------------------------------
  const names = planNames(md.slides)
  const first = md.slides[0]
  if (first.frontmatterStyle && first.frontmatterStyle !== 'frontmatter')
    die(`slide 1 uses "${first.frontmatterStyle}" frontmatter; only standard --- frontmatter is supported`)

  // Slide 1 stays put. Its frontmatter *is* the deck headmatter — Slidev reads deck config
  // from the entry file's first slide — and `title:` there doubles as the slide's own title.
  // Routing it through `src:` would either drop that title or duplicate it in two files that
  // then drift. So the entry keeps headmatter + slide 1; slides 2..n move out.
  const firstLines = first.raw.split('\n')
  const bodyOffset = first.contentStart - first.start
  const headBlock = firstLines.slice(0, bodyOffset).join('\n')
  const firstBody = firstLines.slice(bodyOffset).join('\n')
  if ([headBlock, firstBody].join('\n') !== first.raw)
    die('could not separate the deck headmatter from slide 1 — aborting rather than guessing')

  const tidy = (text) => `${text.replace(/^\n+/, '').replace(/\s+$/, '')}\n`
  const moved = md.slides.slice(1).map((slide, i) => ({
    index: i + 1,
    name: names[i + 1],
    file: path.join(outDir, names[i + 1]),
    src: `./${[...path.relative(DECK_ROOT, outDir).split(path.sep), names[i + 1]].join('/')}`,
    body: tidy(slide.raw),
  }))

  const entryOut = [
    `${headBlock.replace(/\n*$/, '\n')}\n${tidy(firstBody)}`,
    ...moved.map((m) => `---\nsrc: ${m.src}\n---\n`),
  ].join('\n')

  say(`\n  ${md.slides.length} slides in ${rel(entryPath)}\n`)
  say(`    ${' 1'}  ${names[0].replace(/\.md$/, '').padEnd(54)} stays in ${rel(entryPath)} (carries deck headmatter)`)
  for (const m of moved)
    say(`    ${String(m.index + 1).padStart(2)}  ${m.name.padEnd(54)} → ${rel(outDir)}/  ${m.body.split('\n').length} lines`)

  if (opts.dryRun) {
    say(`\n  dry run — nothing written.\n`)
    return
  }

  // --- snapshot the deck as it is today --------------------------
  const before = snapshot(await loadDeck(entryPath))

  // --- write -----------------------------------------------------
  const dirExisted = fs.existsSync(outDir)
  const written = []
  const backupPath = `${entryPath}.bak`
  const rollback = () => {
    fs.writeFileSync(entryPath, original, 'utf-8')
    for (const f of written) fs.rmSync(f, { force: true })
    if (!dirExisted) fs.rmSync(outDir, { recursive: true, force: true })
    if (fs.existsSync(backupPath) && fs.readFileSync(backupPath, 'utf-8') === original)
      fs.rmSync(backupPath, { force: true })
  }

  try {
    await fsp.mkdir(outDir, { recursive: true })
    for (const m of moved) {
      await fsp.writeFile(m.file, m.body, 'utf-8')
      written.push(m.file)
    }
    if (opts.backup) await fsp.writeFile(backupPath, original, 'utf-8')
    await fsp.writeFile(entryPath, entryOut, 'utf-8')
  } catch (err) {
    rollback()
    die(`failed while writing: ${err.message}`)
  }

  // --- verify ----------------------------------------------------
  say(`\n  verifying…`)
  const failures = []

  let after = null
  try {
    const data = await loadDeck(entryPath)
    const errors = collectErrors(data)
    if (errors.length) failures.push(`Slidev reported parse errors:\n    ${errors.join('\n    ')}`)
    after = snapshot(data)
    say(`    ✓ slidev parser resolved ${after.count} slides across ${Object.keys(data.markdownFiles).length} files`)
  } catch (err) {
    failures.push(`slidev parser could not load the deck: ${err.message}`)
  }

  if (after) {
    const problems = diffSnapshots(before, after, names)
    if (problems.length) failures.push(`deck content changed:\n    ${problems.join('\n    ')}`)
    else say(`    ✓ all ${after.count} slides identical to the original (frontmatter, content, notes)`)
  }

  if (!failures.length && opts.build) {
    const buildError = runSlidevBuild(entryPath)
    if (buildError) failures.push(buildError)
    else say(`    ✓ slidev build succeeded`)
  } else if (!opts.build) {
    say(`    – slidev build skipped (--no-build)`)
  }

  if (failures.length) {
    rollback()
    say(`\n  rolled back: ${rel(entryPath)} restored, generated files removed.`)
    die(`verification failed:\n\n    ${failures.join('\n\n    ')}`)
  }

  say(`\n  ✓ done — ${moved.length} slides moved into ${rel(outDir)}/`)
  say(`    ${rel(entryPath)} now holds the headmatter, the title slide, and the slide order.`)
  if (opts.backup) say(`    original kept at ${rel(backupPath)}`)
  say()
}

main().catch((err) => die(err.stack ?? String(err)))
