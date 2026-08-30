// Prints the 1-based Slidev slide numbers of the recording slides.
// Uses Slidev's own parser so numbers always match the export, even if slides move.
//   node find-video-slides.mjs            -> JSON: {"hidden_parrot_rec":17,"ps_fuzz_rec":43}
//   node find-video-slides.mjs ps_fuzz_rec -> just: 43
import { parse } from '@slidev/parser'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const file = resolve(here, '../slides.md')
const parsed = await parse(readFileSync(file, 'utf-8'), file)

const ids = ['hidden_parrot_rec', 'ps_fuzz_rec']
const found = Object.fromEntries(ids.map(id => [id, null]))
parsed.slides.forEach((s, i) => {
  const raw = s.raw || s.content || ''
  for (const id of ids) if (found[id] === null && raw.includes(id)) found[id] = i + 1
})

const arg = process.argv[2]
if (arg) {
  if (!(arg in found)) { console.error(`unknown id: ${arg}`); process.exit(1) }
  console.log(found[arg])
} else {
  console.log(JSON.stringify(found))
}
