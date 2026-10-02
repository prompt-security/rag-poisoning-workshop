# Releasing & versioning

This repo uses [semantic versioning](https://semver.org/) tags of the form `vMAJOR.MINOR.PATCH`.

Two things happen automatically from GitHub Actions:

| Trigger | Workflow | Result |
|---|---|---|
| push to `main` (touching `workshop/slides/**`) | `.github/workflows/pages.yml` | Rebuilds and redeploys the **live Slidev deck** to GitHub Pages |
| push a `v*` **tag** | `.github/workflows/release.yml` | Builds **PDF + PPTX** and attaches them to the GitHub Release for that tag |

## The three formats

- **Slidev / GitHub Pages** — the live, interactive deck. The two recorded terminal sessions
  play as real asciinema players (with controls).
- **PPTX** — the deck as PowerPoint. The two recordings are embedded as **low-quality MP4 movies**
  (they play in PowerPoint's slideshow).
- **PDF** — a static handout. A video can't live in a PDF, so the two recording slides show a
  **placeholder** pointing to the PPTX / Slidev versions. Everything else is identical.

## Cut a release

```bash
# 1. make sure main is green and up to date
git switch main && git pull

# 2. bump `version` and `date-released` in CITATION.cff to the new tag, and merge that to main
#    before tagging, so the tagged commit cites itself correctly

# 3. tag with the new version (annotated tag)
git tag -a v1.1.0 -m "v1.1.0 — <one line summary>"

# 4. push the tag — this triggers the release workflow
git push origin v1.1.0
```

Within a few minutes the **Releases** page will have `The-Poisoned-Pill-Workshop-1.1.0.pdf` and
`…-1.1.0.pptx` attached. The same files are also on the workflow run as downloadable artifacts.

### Rebuild artifacts for an existing tag

If a build failed or you changed the export pipeline, re-run without moving the tag:
**Actions → “Build release artifacts” → Run workflow → enter the tag** (e.g. `v1.0.0`).

### Choosing the bump

- **PATCH** (`v1.0.1`) — typo/wording fixes, a restyle, a placeholder tweak.
- **MINOR** (`v1.1.0`) — new slides, a new section, new content, a new recording.
- **MAJOR** (`v2.0.0`) — a restructured deck or a change in how the workshop is run.

## How the video embedding works (for maintainers)

`release.yml` runs `workshop/slides/scripts/make-videos.sh`, which:
1. converts each asciicast **v3** recording to v2 (`cast_v3_to_v2.py`) so `agg` can read it,
2. renders it to a low-quality GIF with `agg`, then to a small MP4 (+ poster) with `ffmpeg`.

It then exports the PPTX with `--no-with-clicks` (one slide per deck slide, so indices are stable),
asks Slidev's parser which slides hold the recordings (`find-video-slides.mjs`), and embeds the MP4s
with `embed_pptx_videos.py` (python-pptx `add_movie`). The PDF export needs none of this — the
recording slides render their placeholder in export context automatically.
