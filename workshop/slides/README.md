# Slidev deck — The Hidden Parrot

The workshop presentation. ~33 slides mapped 1:1 to `../00-RUN-OF-SHOW.md`.

## Run it
```bash
cd workshop/slides
npm install            # first time only
npm run dev            # opens http://localhost:3030 (live edit)
```

## Export
```bash
npm run build          # static site → dist/  (host anywhere)
npm run export         # single PDF (needs playwright-chromium, already a devDep)
```

## Structure
- `slides.md` — the deck (Slidev markdown + MDC + inline HTML/CSS).
- `styles/index.css` — Prompt Security theme (purple/dark, brand tokens, the flat-string diagram,
  terminal + card + tag components).
- `public/` — brand logo + icon.

## Notes for the presenter
- **Presenter view + speaker notes:** press `p` in dev, or open `/presenter/`. Every content slide
  has `<!-- notes -->` with talk-track and timing cues.
- **Brand:** theme pulled live from prompt.security (2026) — navy `#0b0c1b`, electric purple `#6100ff`,
  lime `#8fff08`, Quicksand font. Tokens live in `styles/index.css`.
- **Real demo recordings:** `public/hidden_parrot_rec` and `public/ps_fuzz_rec` are reused from
  David's research repo (github.com/abutbul/hidden_parrot) via `slidev-addon-asciinema`. The
  "Recorded: clean → poisoned" slide is the canonical run / total-failure fallback; the ps-fuzz slide
  is a bonus appendix. The small inline terminals on the lab slides are labeled *schematic* (expected
  output), not placeholders.
- **This is the WORKSHOP deck.** David's research-talk deck is a separate companion (kept distinct by
  decision) — the closing slide links to it as the deep-dive/overview.
- **Fill in before the event:** the workshop repo/branch URL on the closing slide, and confirm the
  code harness commands shown on the lab slides once that branch exists (`../03-BUILD-LIST.md`).
