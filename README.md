# RAG Poisoning Workshop — The Hidden Parrot

A 90-minute, instructor-led, **hands-on** workshop on RAG poisoning / indirect prompt injection via
vector-database embeddings. Participants run the attack themselves against a small local model endpoint.

> **Status:** internal (org-visible), in preparation.
> This repo holds the **workshop design + slide deck**. The runnable demo code lives in the separate,
> public [prompt-security/RAG_Poisoning_POC](https://github.com/prompt-security/RAG_Poisoning_POC)
> repo (a lightly patched fork of [abutbul/hidden_parrot](https://github.com/abutbul/hidden_parrot)) —
> clone and run that one; see [`workshop/02-PREFLIGHT-AND-ENDPOINTS.md`](workshop/02-PREFLIGHT-AND-ENDPOINTS.md)
> for exact steps, or [`workshop/03-BUILD-LIST.md`](workshop/03-BUILD-LIST.md) for what changed there and why.

## What's here
| Path | What |
|------|------|
| [`workshop/00-RUN-OF-SHOW.md`](workshop/00-RUN-OF-SHOW.md) | Minute-by-minute 90-min timeline (Parts 1–6) |
| [`workshop/01-CONTENT-OUTLINE.md`](workshop/01-CONTENT-OUTLINE.md) | Teaching content, literature, mitigations, accuracy caveats |
| [`workshop/02-PREFLIGHT-AND-ENDPOINTS.md`](workshop/02-PREFLIGHT-AND-ENDPOINTS.md) | Participant setup + endpoint matrix (llama-server / Ollama / LM Studio / shared) |
| [`workshop/03-BUILD-LIST.md`](workshop/03-BUILD-LIST.md) | The 5 code edits + infra needed before the workshop |
| [`workshop/04-DECISIONS-RISKS-OPEN.md`](workshop/04-DECISIONS-RISKS-OPEN.md) | Decisions, risk register, open questions |
| [`workshop/slides/`](workshop/slides/) | The Slidev deck (`slides.md`) — `npm i && npm run dev` |
| `workshop/HiddenParrot-workshop-deck.pdf` | Exported PDF of the deck for quick review |

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
| **Live Slidev** | GitHub Pages (org-members only — see repo **Settings → Pages** for the current URL) | play as interactive asciinema players (with controls) |
| **PPTX** | attached to each [Release](../../releases) | embedded as low-quality MP4 movies (play in PowerPoint) |
| **PDF** | attached to each [Release](../../releases) | a placeholder card (a static PDF can't hold video) |

> **Pages is access-controlled.** This is an **internal** org repo, so GitHub serves the deck from an
> obfuscated `https://<random>.pages.github.io/` URL visible only to `prompt-security` members (find it
> in **Settings → Pages**). The `pages.yml` workflow derives the correct base path automatically, so it
> keeps working the same way if the repo is ever made public.

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

## Companion
The research-talk deck, full paper, and blog posts live in
[github.com/abutbul/hidden_parrot](https://github.com/abutbul/hidden_parrot). This workshop deck is the
hands-on "lab" companion to that overview.

## Note: known quirks in the upstream PoC (and why they're instructive)

The workshop runs on a lightly patched copy of the public
[abutbul/hidden_parrot](https://github.com/abutbul/hidden_parrot) PoC. If you clone the **as-shipped**
upstream and run it, you'll hit a few rough edges — each is a small, real RAG-security lesson:

- **Hardcoded model** `llama3:8b-instruct-q5_0` in `llm_factory.py` → 404s every Ollama / LM Studio user.
  *Fixed on `main` (prompt-security/RAG_Poisoning_POC#1) — there is no separate workshop branch; the
  model now reads from config, and a generic OpenAI-compatible provider was added.*
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
