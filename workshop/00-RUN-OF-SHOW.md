# The Poisoned Pill — 90-Minute Workshop Run-of-Show

**Format:** instructor-led, hands-on. Every participant personally runs the RAG-poisoning
attack against an endpoint they control (or a shared fallback).
**Spine:** *Threat-model first* — the load-bearing idea is taught keyboards-down before anyone
runs code, then a single self-paced lab lets participants reproduce, weaponize, and defeat a
naive defense with their own hands.

**Design principle #1 — latency is the enemy.** The original recorded run took 26–90 s *per query*
× 10 queries. The workshop harness runs at **temperature 0, max_tokens 128** for fast, reproducible
results (~2–3 s/query local). There is no single-query or streaming mode — the script still runs the
whole clean-then-poisoned batch in one invocation — so always teach *while* it generates: narrate the
mechanism on the projector, or run with `--show-prompt` and point at the assembled prompt as it prints.
Nobody watches a silent spinner.

**Design principle #0 — no invented tooling.** The lab uses the repo's real `src/rag_poisoning_demo.py`
with two added flags (`--show-prompt`, `--payload-file`), plus the existing `--infer openai-compat` /
`ollama` / `deepseek` provider selection. There is no `ctf.py`, no levels, no leaderboard — just the one
script that builds a corpus and runs it with and without the poisoned document.

**Design principle #2 — nothing that can't finish in-room happens in-room.** All installs, model
downloads, and the embedding-model cache are PRE-FLIGHT (see `02-PREFLIGHT-AND-ENDPOINTS.md`).

---

## Timeline (sums to 90, honest buffer)

| Time | Min | Mode | Segment |
|------|-----|------|---------|
| 0–8   | 8  | SETUP      | Prove your endpoint before we teach |
| 8–18  | 10 | TEACH (P1) | "You still run RAG, it's just called grounding" + the load-bearing model: one flat string, no privilege bit |
| 18–28 | 10 | HANDS-ON (P2) | **Lab 1** — run `rag_poisoning_demo.py` yourself + recorded run + results summary |
| 28–38 | 10 | TEACH (P3) | Threat model: ingestion surface, persistence, retrieval-gating, a real incident |
| 38–46 | 8  | TEACH (P4) | **How to craft a poison doc** — semantic width · top-k · payload placement |
| 46–66 | 20 | HANDS-ON (P5) | **Lab 2** — write your own payload with `--payload-file`, apply the 3 levers |
| 66–84 | 18 | DISCUSSION (P6) | Debrief + honest mitigations: what actually bounds the loss |
| 84–90 | 6  | BUFFER     | Buffer, wrap, honest-homework caveat |

**Hands-on total: 30 min** (Lab 1 + Lab 2), plus 26 min of teaching that is directly about *doing* the attack (mechanism + how-to-craft). **What gets cut first if late:** the `grep`-bypass bonus challenge → then P1's "Why it went quiet, and where it went" slide (long context / infrastructure / GraphRAG / Agentic RAG) → then the how-to-craft section (P4) compresses to the single "3 levers" slide → then mitigations trim to three lines (the rest is on the take-home 1-pager). P1's "You may not call it RAG" alias slide is *not* cut — without it a chunk of the room files this under "2023 problem." The "write your own payload" beat (Lab 2) is *never* cut.

> **Note:** the deck (`slides/slides.md`) is the source of truth for exact content and maps to
> Parts 1–6 as in the table above. Treat the per-segment write-ups below as intent and talk-track,
> and the deck as authoritative for what's on screen.

---

### 0–8 · SETUP · Prove your endpoint before we teach
**Objective:** get every laptop green (or routed to the shared endpoint) BEFORE teaching, so
broken setups surface at minute 0, not minute 45. Fire a warm-up query so nobody's first real
query eats the 16–25 s cold-start.
- **Instructor:** project the hook slide (pirate answer → "now imagine that instruction said
  *approve the wire transfer*") + the one self-check command. Write shared-endpoint IP on the
  board: **BARE ORIGIN — no `/v1`, no trailing slash.** Confirm shared llama-server is up and warm.
- **TA / co-instructor:** owns red-light triage — anyone not printing `PREFLIGHT PASS` switches ONE
  line in `.env` to the shared endpoint and re-runs; still red → pair with a green neighbor.
- **Participants:** run `python3 src/preflight.py --one-line` → confirm `PREFLIGHT PASS` (this warms
  your endpoint).
- **Hard cap 8:00.** Don't start teaching until ~80% green or routed.
- **Risk:** guest wifi client-isolation kills the shared endpoint for everyone.
  **Fallback:** phone hotspot or pre-stood tunnelled cloud box (tested from the room beforehand);
  pre-baked `rag_poisoning_demo.out` is the read-only last resort so nobody is empty-handed.

### 8–18 · TEACH · You still run RAG · one flat string, no privilege bit
**Objective (first ~2 min) — kill the "RAG is a 2023 problem" objection before it forms.** Most of the room
ships retrieval under another name: *grounding* (Microsoft, Google), Bedrock *Knowledge Bases* (AWS), a
*knowledge tool* / connector / `file_search` / MCP server inside an agent, *in-context learning* in a
paper. Ask out loud: "who has GROUNDING or KNOWLEDGE BASE in a design doc this quarter?" — more hands
than for the word RAG. Long context did not replace it (cost, latency, accuracy — and a bigger window is
*more* attacker room); GraphRAG and Agentic RAG widen the funnel and take humans out of the loop. The
transferable test: **does text somebody else wrote reach the context window?** Then:

**Objective (remaining ~8 min):** install the single transferable idea, keyboards-down: at generation time the
framework concatenates *system prompt + retrieved chunk + user question* into ONE undifferentiated
token stream with **no privilege label on any span** — so the model cannot tell instruction from
data, and **write-access to the corpus is instruction-authoring access.** A property of the
paradigm, not a bug in LangChain/Chroma/the model.
- Show the repo's actual `RetrievalQA(chain_type="stuff")` — "stuff" literally means stuff every
  retrieved chunk into the prompt. The artifact names its own vulnerability.
- **Plant a prediction:** "In 90 seconds you'll run this. Will the model obey an instruction it
  finds in the MIDDLE of a retrieved document?"
- **Non-cuttable slide:** the flat-string prompt-assembly diagram.
- **Risk:** longest pure-talk block; a hands-on audience checks out. **Fallback:** hard 10-min
  timer; if energy dips, cut to L1 and backfill the "stuff template" point during L1's `--show-prompt`.

### 18–26 · HANDS-ON · L1: run the pirate yourself
**Objective:** everyone personally lands the injection once (the non-negotiable core) and resolves
their planted prediction — a confirmed prediction, not a passive reveal. Warms every endpoint.
- **Instructor:** 60-s theatrical run on the 7–8B showpiece box first (reads better on a
  projector), then kick the room off. WHILE queries generate, narrate the `--show-prompt` output —
  physically point at the `[CRITICAL SYSTEM INSTRUCTION …]` chunk sitting inside `{context}`.
- **Participants:** `python src/rag_poisoning_demo.py --infer openai-compat`, then re-run with
  `--show-prompt`; find the injected instruction inside their own printed prompt; check their
  prediction.
- **Risk:** a too-small/too-aligned model doesn't comply, or Ollama silently truncates on small
  `n_ctx`. **Fallback:** reframe non-compliance AS the lesson ("attack success is model-dependent —
  an argument against trusting any one model's resistance as a control"); project the instructor's
  result as canonical; truncated laptops → shared endpoint; total network death → pre-recorded capture.

### 26–38 · TEACH · Threat model
**Objective:** turn the mechanism they just felt into a threat model they can carry to their org.
- Attacker capability = just write-access to something indexed. No model access, no weights, no exploit.
- **Ingestion surface** (one dense slide): wiki/Notion/SharePoint, tickets incl. external, inbound
  email, PDF/DOCX with hidden text, public web crawl, over-scoped SaaS connectors, agent memory —
  each now an instruction-authoring interface.
- **Retrieval-gating** (cut-proof, inference-free): show the repo's OWN recorded `Sources:` line —
  the one poisoned-run query that stayed clean ("Explain machine learning algorithms") is exactly
  the one where the poison was never retrieved. No poisoned chunk → no compromise. **This is why
  the headline is 80% (4/5), not 100% — a retrieval miss (top-k=3 vs a 4-doc corpus), NOT the model
  resisting.** Retrieval logs = highest-signal defensive telemetry.
- **Persistence:** stored persistence with a retrieval trigger — the AI-pipeline analogue of stored
  XSS. Survives session resets, model swaps, prompt rewrites; can be latent/date-gated.
- **Real incident:** MITRE ATLAS AML.CS0035 (Slack AI) — attacker posts in a PUBLIC channel,
  assistant exfiltrates an API key from a PRIVATE channel the attacker couldn't read.
- **Standards (dual numbering on one slide):** OWASP LLM01 Prompt Injection, LLM05:2026 (was
  LLM04:2025) Data & Model Poisoning, LLM09:2026 (was LLM08:2025) Vector & Embedding Weaknesses.
- **Honesty:** correct the README's "first demonstration" overclaim (Greshake 2023; PoisonedRAG).
- **Risk:** citation soup. **Fallback:** drop to two anchors — the Slack AI incident + "LLM01 + LLM09".

### 38–70 · HANDS-ON · The lab (self-paced)
**Objective:** one continuous flow. Self-pacing absorbs latency heterogeneity — a slow endpoint
just means fewer iterations, not a room-wide desync.
- **Set pace out loud first:** single queries only; ~2–3 s local / 15–30 s shared; "slow is
  queueing — do NOT re-run and hammer the shared box."
- **Beat B (~14 min):** everyone writes their OWN benign instruction (persona/format change) into a
  file and re-runs with `--payload-file my_poison.txt`, confirming it fires. Harvest 2–3 divergent
  results aloud.
- **Beat C (~12 min):** grep your own payload for the obvious markers (`grep -iE
  'system|ignore previous|\[' my_poison.txt`). The bracketed payload gets CAUGHT. Challenge: rewrite
  it as ordinary prose (an "editor's note on house style") so it passes that grep but still hijacks
  the model. **Bound the lesson honestly:** this proves *naive* pattern-matching fails; ML classifiers
  / LLM-judges raise the bar; the optimized-payload literature defeats even those. Don't let one grep
  stand for all content inspection.
- **Stretch (fast finishers):** widen the payload's semantic reach — rewrite it to sit near several
  unrelated queries at once (the "semantic width" lever from P4) and see which questions start
  retrieving it. Retrieval engineering, and the `Sources:` line gives feedback without a second
  inference pass.
- **Risk:** (1) weak/over-aligned models → muddy success spread; (2) mass fallback saturates the
  shared box. **Fallback:** (1) reframe the spread AS the lesson; route below-par laptops to the
  known-good shared 3B; (2) shared box is sized (`-np 12 -c 32768`, measured ~3.5 min for the room);
  stagger halves; hand stuck participants a 3-step escalating-hint card. Beat C collapses LAST to
  instructor-led; Beat B is never cut.

### 70–84 · DISCUSSION · Debrief + honest mitigations
**Objective:** consolidate into defenses rated by honesty, using what the room just did as evidence
(they defeated input-scanning with their own hands).
- **Mitigation ladder, "do it / don't count it" per control:**
  - *Ingestion provenance / allowlisting* — the only control that shrinks the attacker population
    (but protects only FUTURE writes — who re-scans last year's corpus?).
  - *Content sanitization* — cheapest layer, defeated first (they just proved it). Never report green.
  - *Prompt-boundary / spotlighting* — best risk-reduction-per-effort, but a probabilistic mitigation
    *inside the same token stream*; the ">50% → <2%" number is from FRONTIER models — expect worse on
    the small quantized models in this room.
  - *Retrieval logging* — cheapest, most under-deployed, the only one that yields incident response.
  - *Tenant / permission-mirroring* — the specific fix for the Slack AI privilege crossing.
  - *Least-privilege + human-in-the-loop on any tool the model can call* — the only thing that bounds loss.
- **Business-impact escalation:** silent retrieval bias (BadRAG — passes spot-check QA) → Slack AI
  exfiltration → agentic action hijack (AgentPoison; OWASP moved Excessive Agency up to LLM03:2026).
- **Through-line:** "You defeated the filter yourselves — that's why the real controls are structural:
  who can write to the corpus, and what the model may do without a human. This is incident response,
  not prompt tuning."
- **Governing question:** for each AI system we run, what is the most expensive thing it can do
  without a human?

### 84–90 · BUFFER · Wrap + honest-homework caveat
- Absorb overrun; take the best two or three payloads from the room and read them out.
- **Honest homework caveat:** "The demo you ran is patched. Read the known-quirks section in the
  workshop README and see how the hardcoded `llama3:8b-instruct-q5_0` would 404 you, how the forced
  `TRANSFORMERS_OFFLINE` flag misleads you, and how a 6-word regex overcounts success — those defects
  are themselves the lesson."
- **Closing line:** *"A document in your RAG corpus is not data the model reads — it is code the
  model may run, and it persists until you evict the embedding."*
