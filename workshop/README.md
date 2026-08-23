# Workshop Planning — The Hidden Parrot (RAG Poisoning)

Staged planning docs for the 90-minute instructor-led, hands-on workshop. **Review these before we
build the Slidev deck and the code harness.**

| Doc | What's in it |
|---|---|
| [00-RUN-OF-SHOW.md](00-RUN-OF-SHOW.md) | The minute-by-minute 90-min timeline (7 segments, 40 min hands-on) |
| [01-CONTENT-OUTLINE.md](01-CONTENT-OUTLINE.md) | Teaching content: concept ladder, literature, threat model, mitigations, accuracy caveats |
| [02-PREFLIGHT-AND-ENDPOINTS.md](02-PREFLIGHT-AND-ENDPOINTS.md) | Participant prep + endpoint matrix (llama-server / Ollama / LM Studio / shared) |
| [03-BUILD-LIST.md](03-BUILD-LIST.md) | Everything to build before the deck (code harness, assets, slides, handouts) |
| [04-DECISIONS-RISKS-OPEN.md](04-DECISIONS-RISKS-OPEN.md) | Learning objectives, decision log, risk register, open questions for the owner |
| [slides/](slides/README.md) | The Slidev deck (`slides.md`) + brand theme — run with `npm run dev` |
| [HiddenParrot-workshop-deck.pdf](HiddenParrot-workshop-deck.pdf) | Exported PDF of the current deck, for review |

**Status:** timeline + content staged, and a full ~33-slide Slidev deck built (deck-first per owner
request). Terminal-output slides are marked placeholders pending the code harness (see 03-BUILD-LIST).

**Provenance:** grounded in an 11-agent recon that *ran* the install (rather than guessing) on this
machine, plus three independent judge panels (operational realism / pedagogy / security credibility)
scoring three candidate timelines. Key measured findings drove the plan — see 02 and 04.
