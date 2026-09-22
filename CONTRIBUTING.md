# Contributing

Thanks for helping improve the workshop. This repo holds the **design docs and the slide deck**; the
runnable demo lives in
[prompt-security/RAG_Poisoning_POC](https://github.com/prompt-security/RAG_Poisoning_POC), so
demo-code changes belong there.

## What's most useful

- **Corrections.** Wrong citation, stale command, a claim that overstates the evidence. The deck
  deliberately flags its own accuracy caveats; hold it to that standard.
- **Delivery reports.** If you ran this workshop, what broke? Timing, endpoint setup, and room
  logistics feedback is genuinely valuable and belongs in `workshop/04-DECISIONS-RISKS-OPEN.md`.
- **New mitigations or literature.** The field moves; `workshop/01-CONTENT-OUTLINE.md` is the place.

## What we won't merge

- Payloads that go beyond benign persona/format changes — no exfiltration, no credential access, no
  destructive instructions. The lab's scoping is a deliberate design constraint, not an oversight.
- Content that names a third party as vulnerable without a citation and a disclosure date.

## Working on the deck

```bash
cd workshop/slides
npm ci
npm run dev        # http://localhost:3030
```

The deck is split one slide per file under `workshop/slides/slides/`, stitched together by
`slides.md`. Edit the individual slide files — `slides.md` holds the headmatter and the `src:`
includes.

Exports need extra tooling:

```bash
npm run export:pdf     # needs playwright-chromium (a devDependency)
npm run videos         # needs `agg` and `ffmpeg` on PATH
npm run export:pptx    # then scripts/embed_pptx_videos.py (needs python-pptx)
```

`npm run split` is a spent one-time migration that produced the current layout. It refuses to run on
an already-split deck; you should not need it.

## Pull requests

- Branch from `main`, one topic per PR.
- CI (`.github/workflows/validate.yml`) builds the deck and exports PDF + PPTX on every PR. It must
  pass. First-time contributors need a maintainer to approve the workflow run.
- If you change dependencies, commit the updated `package-lock.json` — CI installs with `npm ci`.
- Releases are cut by maintainers; see [RELEASING.md](RELEASING.md).

## Reporting security issues

Do not open a public issue. See [SECURITY.md](SECURITY.md).

## License

This repo is dual-licensed — see [LICENSE-MAP.md](LICENSE-MAP.md). By contributing you agree your
contribution is licensed under whichever applies to the files you touched: **CC BY-SA 4.0** for
slides, docs and recordings, or **AGPL-3.0-only** for build scripts, workflows, styles and config.
