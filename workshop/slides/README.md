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
- `slides.md` — deck headmatter (theme, fonts, addons), the title slide, and the slide **order**
  as a list of `src:` imports. Reorder or drop a slide by editing this list.
- `slides/NN-title.md` — one file per slide, numbered by position in the deck. Edit these for
  content changes; each holds that slide's frontmatter, body and `<!-- speaker notes -->`.
  Slidev resolves the imports, so `npm run dev` / `build` / `export` are unchanged.
- `scripts/split-slides.mjs` — the one-time migration that produced this layout
  (`npm run split`). Re-running is refused unless the deck is a single file again; it verifies
  the result against Slidev's parser and a real `slidev build`, and rolls back on any mismatch.

  > The title slide stays in `slides.md` on purpose: its frontmatter *is* the deck headmatter,
  > and `title:` there doubles as that slide's own title. Splitting it would mean keeping the
  > same title in two files that then drift.
- `styles/index.css` — Prompt Security theme (purple/dark, brand tokens, the flat-string diagram,
  terminal + card + tag components).
- `public/` — brand logo + icon.

## Notes for the presenter
- **Presenter view + speaker notes:** press `p` in dev, or open `/presenter/`. Every content slide
  has `<!-- notes -->` with talk-track and timing cues.
- **Brand:** theme pulled live from prompt.security (2026) — navy `#0b0c1b`, electric purple `#6100ff`,
  lime `#8fff08`, Quicksand font. Tokens live in `styles/index.css`.
- **Real demo recordings:** `public/hidden_parrot_rec` and `public/ps_fuzz_rec` are real captures,
  played via `slidev-addon-asciinema`. The "Recorded: clean → poisoned" slide is the canonical run and
  the total-failure fallback; the ps-fuzz slide is a bonus appendix. The small inline terminals on the
  lab slides are labeled *schematic* (expected output), not placeholders.
- **This is the WORKSHOP deck** — the hands-on lab. It stands alone; a research-talk deck covering the
  same mechanism is a separate companion and the two are deliberately not merged.
- **Before you present:** re-run the lab commands on the current `main` of
  [RAG_Poisoning_POC](https://github.com/prompt-security/RAG_Poisoning_POC) and confirm the flags on
  the lab slides still match (see `../03-BUILD-LIST.md`).
