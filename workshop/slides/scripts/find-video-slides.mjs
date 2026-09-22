// Prints the 1-based Slidev slide numbers of the recording slides.
// Uses Slidev's own loader so numbers always match the export, even if slides move
// between files (the deck is split one-file-per-slide under ./slides/).
//   node find-video-slides.mjs            -> JSON: {"hidden_parrot_rec":17,"ps_fuzz_rec":43}
//   node find-video-slides.mjs ps_fuzz_rec -> just: 43
import { load } from '@slidev/parser/fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entry = resolve(root, 'slides.md')
const { slides } = await load({ roots: [root], userRoot: root, allowedRoots: [root] }, entry)

const ids = ['hidden_parrot_rec', 'ps_fuzz_rec']
const found = Object.fromEntries(ids.map(id => [id, null]))
slides.forEach((s, i) => {
  const raw = s.source?.raw || s.content || ''
  for (const id of ids) if (found[id] === null && raw.includes(id)) found[id] = i + 1
})

const arg = process.argv[2]
if (arg) {
  if (!(arg in found)) { console.error(`unknown id: ${arg}`); process.exit(1) }
  console.log(found[arg])
} else {
  console.log(JSON.stringify(found))
}
