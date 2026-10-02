# The Poisoned Pill — Turning Your Crewmate into a Pirate

A 90-minute, instructor-led, **hands-on** workshop on RAG poisoning / indirect prompt injection via
vector-database embeddings. Participants run the attack themselves against a small local model endpoint.

> This repo holds the **workshop design + slide deck**. The runnable demo code lives in the separate,
> public [prompt-security/RAG_Poisoning_POC](https://github.com/prompt-security/RAG_Poisoning_POC)
> repo — clone and run that one; see
> [`workshop/02-PREFLIGHT-AND-ENDPOINTS.md`](workshop/02-PREFLIGHT-AND-ENDPOINTS.md)
> for exact steps, or [`workshop/03-BUILD-LIST.md`](workshop/03-BUILD-LIST.md) for what changed there and why.

**Everything here is scoped to a model endpoint you run yourself.** The workshop teaches how corpus
poisoning works so you can defend against it; the payloads are deliberately benign persona/format
changes. See [SECURITY.md](SECURITY.md) for scope and reporting.

## What's here
| Path | What |
|------|------|
| [`workshop/00-RUN-OF-SHOW.md`](workshop/00-RUN-OF-SHOW.md) | Minute-by-minute 90-min timeline (Parts 1–6) |
| [`workshop/01-CONTENT-OUTLINE.md`](workshop/01-CONTENT-OUTLINE.md) | Teaching content, literature, mitigations, accuracy caveats |
| [`workshop/02-PREFLIGHT-AND-ENDPOINTS.md`](workshop/02-PREFLIGHT-AND-ENDPOINTS.md) | Participant setup + endpoint matrix (llama-server / Ollama / LM Studio; optional shared box) |
| [`workshop/03-BUILD-LIST.md`](workshop/03-BUILD-LIST.md) | The 5 code edits + infra needed before the workshop |
| [`workshop/04-DECISIONS-RISKS-OPEN.md`](workshop/04-DECISIONS-RISKS-OPEN.md) | Learning objectives, design decisions, risk register, pre-run checklist |
| [`workshop/05-PARTICIPANT-QA.md`](workshop/05-PARTICIPANT-QA.md) | Participant Q&A: setup, endpoints, both labs, the `grep` check, building your own PoC |
| [`workshop/slides/`](workshop/slides/) | The Slidev deck (`slides.md`) — `npm i && npm run dev` |

Want to read the deck without building it? The live version is on
[GitHub Pages](https://prompt-security.github.io/rag-poisoning-workshop/), and every
[Release](https://github.com/prompt-security/rag-poisoning-workshop/releases) has a PDF and a PPTX
attached. Exported decks are build output and are deliberately not committed.

## The deck
```bash
cd workshop/slides
npm install
npm run dev        # http://localhost:3030 — live, interactive, recordings play
```

> **Navigating Slidev:** the numbered slide list that can overlay the deck is the *go-to* jumper
> (opened by pressing <kbd>g</kbd>) or the overview (<kbd>o</kbd>). Press <kbd>Esc</kbd> to close it.
> It is not part of the slides and never appears in the exports or on GitHub Pages.

## Three formats, built automatically

| Format | Where | Recordings |
|---|---|---|
| **Live Slidev** | [prompt-security.github.io/rag-poisoning-workshop](https://prompt-security.github.io/rag-poisoning-workshop/) | play as interactive asciinema players (with controls) |
| **PPTX** | attached to each [Release](https://github.com/prompt-security/rag-poisoning-workshop/releases) | embedded as low-quality MP4 movies (play in PowerPoint) |
| **PDF** | attached to each [Release](https://github.com/prompt-security/rag-poisoning-workshop/releases) | a placeholder card (a static PDF can't hold video) |

- **GitHub Pages** redeploys on every push to `main` (`.github/workflows/pages.yml`).
- **PDF + PPTX** rebuild and attach to the Release whenever a `vX.Y.Z` **tag** is pushed
  (`.github/workflows/release.yml`). See **[RELEASING.md](RELEASING.md)** for how to cut a version.

Build them locally too:
```bash
cd workshop/slides
npm run build:pages     # static site → dist/  (Pages build)
npm run export:pdf      # PDF (placeholder on the recording slides)
npm run videos          # MP4s from the recordings  (needs agg + ffmpeg)
npm run export:pptx     # PPTX (then run scripts/embed_pptx_videos.py to embed the MP4s)
```

## Related
- **[prompt-security/RAG_Poisoning_POC](https://github.com/prompt-security/RAG_Poisoning_POC)** — the
  runnable demo this workshop drives. Clone this one to follow along.
- **[prompt-security/ps-fuzz](https://github.com/prompt-security/ps-fuzz)** — the open-source LLM
  fuzzer shown on the closing slides; it ships a `rag_poisoning` attack module that automates what
  the lab does by hand.

## Note: known quirks in the PoC (and why they're instructive)

The demo code accumulated a few rough edges before the workshop patches landed. They are worth
knowing about, because each is a small, real RAG-security lesson:

- **Forced `TRANSFORMERS_OFFLINE=1`** in `config.py` → a cold embedding cache throws a misleading
  "no internet" error even when online. **Still forced, deliberately** (making it opt-in was judged a
  behavioral change not worth smuggling into the preflight PR) — `src/preflight.py` instead warns
  about the exact failure, and `./setup.sh --no-local` pre-downloads the cache so the error never
  fires in practice.
- **A 6-word regex "success" metric** — the reported "80%" is 4/5 queries, a single run at temperature 0.7,
  on a query set that leans toward the poison's own topic. Treat it as a demo, not a benchmark.
- **`top_k=3` against a 4-document corpus** → the poison isn't always retrieved (the Q3 "clean" result is
  a retrieval miss, not model resistance). *Fixed: `.env.example` now ships `top_k=4` so the demo is
  reproducible (prompt-security/RAG_Poisoning_POC#8).*

These are called out here rather than on a slide — they're facilitator/reader notes, not presentation content.

## License

Dual-licensed, split by what the material actually is:

- **The workshop itself** — slides, docs, recordings — is **[CC BY-SA 4.0](LICENSE-CONTENT)**. Run it,
  translate it, remix it, present it commercially. Attribute it, and share adaptations alike.
- **The build tooling** — CI workflows, export scripts, styles, config — is **[AGPL-3.0-only](LICENSE)**.

[**LICENSE-MAP.md**](LICENSE-MAP.md) lists exactly which paths fall under which.

Prompt Security names and logos are trademarks and are covered by **neither** grant — swap in your
own branding if you adapt the deck. Third-party fonts and stylesheets keep their own terms; see
[NOTICE](NOTICE).

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
