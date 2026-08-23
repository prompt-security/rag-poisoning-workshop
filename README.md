# RAG Poisoning Workshop — The Hidden Parrot

A 90-minute, instructor-led, **hands-on** workshop on RAG poisoning / indirect prompt injection via
vector-database embeddings. Participants run the attack themselves against a small local model endpoint.

> **Status:** private, in preparation. Will be made public before the workshop.
> This repo currently holds the **workshop design + slide deck**. The runnable demo code (a lightly
> patched version of the public [abutbul/hidden_parrot](https://github.com/abutbul/hidden_parrot) PoC)
> will be added during the code phase — see [`workshop/03-BUILD-LIST.md`](workshop/03-BUILD-LIST.md).

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
npm run dev        # http://localhost:3030
```

## Companion
The research-talk deck, full paper, and blog posts live in
[github.com/abutbul/hidden_parrot](https://github.com/abutbul/hidden_parrot). This workshop deck is the
hands-on "lab" companion to that overview.
