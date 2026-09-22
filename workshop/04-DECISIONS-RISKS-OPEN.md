# Decisions, Risks, and Open Questions

## Learning objectives (a participant can, 24h later…)
1. Explain why RAG is vulnerable *by construction* — retrieved chunk + system prompt are one flat,
   unlabelled token stream; the model has no privilege boundary; so corpus-write = instruction-authoring.
   A property of the paradigm, not a bug in any framework or model.
2. Reproduce the attack end-to-end on an endpoint they control, and locate the injected instruction
   inside the actual assembled prompt via `--show-prompt`.
3. Author an original payload and demonstrate first-hand that a naive instruction scanner is defeated
   by paraphrase — and state the honest limit of content inspection as a control.
4. State that the attack is *retrieval-gated, not model-gated* (no poisoned chunk in top-k → no
   compromise) and conclude that retrieval logging is the highest-signal telemetry.
5. Map the mechanism to real consequences and standards (Slack AI / ATLAS AML.CS0035; BadRAG;
   AgentPoison; OWASP LLM01 / LLM05:2026 / LLM09:2026; NIST AI 100-2e2025).
6. Prioritize defenses honestly — provenance, retrieval logging, permission-mirroring, and
   least-privilege + human-in-the-loop as the controls that bound loss; content filtering and
   spotlighting as mitigations, not boundaries.

## Key decisions (with the rejected alternative)
- **Spine = Threat-Model First** (over Demo-Spine lockstep and a 4-level CTF). Won all three judge
  lenses. Its self-paced lab absorbs latency heterogeneity instead of amplifying it into a room-wide
  desync; its structure *is* the mechanism.
- **Grafted an early guaranteed win (L1) at minute 18** — fixes the "no keyboard until 36" front-load
  that all three judges flagged, without abandoning mechanism-first teaching.
- **Temp 0, max_tokens 128, warm 3B** — over the shipped 10-query temp-0.7 batch (10+ min of spinner,
  non-reproducible). Shipped as defaults in `llm_factory.py`/`.env.example`. Single-query-per-attempt
  and streaming were considered but not built — the deck's lab still runs the full clean+poisoned
  batch in one invocation; the reproducible defaults alone bring it to ~2–3 s/query local.
- **Retrieval-gating taught via the repo's OWN recorded output slide**, live retrieval-race demoted to
  an optional fast-finisher stretch — the recorded miss is guaranteed; a live miss at top-k=4 is not.
- **"Write your own payload → beat the naive scanner" is the core of the lab, bounded honestly** — the
  single highest credibility-building exercise; must be bounded so no one thinks that regex ships.
- **BYO endpoint + a sized shared llama-server fallback** — over one shared endpoint for all (latency
  cliff) or pure BYO (failed laptops unrecoverable).
- **Two levels done fully by everyone** (reproduce; write-your-own + beat-scanner) + optional stretch —
  over four half-absorbed levels.
- **Teach on the patched PoC, foreground its real defects as findings** — over silently patching
  (feels rigged later) or teaching on the unpatched upstream (404s at minute one). The fixes landed
  as PRs on `main` of `prompt-security/RAG_Poisoning_POC`; there is no separate workshop branch.

## Risk register (top items)
| Risk | Trigger | Blast radius | Instructor move |
|---|---|---|---|
| Inference latency | shared endpoint / cold start | 15–30 s "hangs", room stalls | single query, temp 0, max_tokens 128, warm-up curl, teach while it generates; "slow is queueing" |
| Model won't comply | too-small/too-aligned model | some laptops' L1 visibly flops | reframe AS the lesson (model-dependence ≠ control); project instructor's canonical result |
| Wifi client-isolation | guest AP isolates clients | shared-endpoint fallback dies | phone hotspot / tunnelled cloud box (tested beforehand); pre-recorded captures |
| Mass fallback saturates shared box | many local setups fail | thin iteration in Beat C | box sized `-np 12`; stagger halves; "do not re-run"; escalating-hint cards |
| Install fails in-room | someone did nothing / corporate-locked | one person stuck | 8-min gate + shared IP; USB sticks; pair 2-to-1 |
| Front-loaded talk loses room | 10-min teach block | disengagement before L1 | hard timer; the flat-string diagram is the only non-negotiable slide |
| Citation soup / a challenge | OWASP/ATLAS IDs, "first demonstration" claim | credibility dip | two anchors (Slack AI + LLM01/LLM09); pre-loaded honest reframe |

## Scaling to a large room
- **At 100+ participants, BYO local endpoint is the PRIMARY path** and any shared endpoint is only a
  failure-tail absorber. A per-person triage gate does not survive that headcount — replace it with a
  self-service preflight card, roaming TAs, neighbour-pairing, and a projected green/red counter.
  The 24h-ahead PREFLIGHT PASS roster becomes mandatory (see 02, "Scale note").
- **If laptops are locked-down corporate builds**, BYO stops being realistic and the shared endpoint
  moves back to the primary path. On open personal/dev machines the reverse holds, and a USB-stick
  fallback is a small-tail contingency rather than the default.

## Deck and asset decisions
- **The workshop deck stands alone.** It is the "lab"; a research-talk deck covering the same
  mechanism is a separate companion and the two are deliberately not merged.
- **Real assets over mocks:** the two asciinema recordings (`hidden_parrot_rec`, `ps_fuzz_rec`) back
  the canonical-run slide and the ps-fuzz bonus slide, replacing earlier mocked-terminal placeholders.
- **Palette = Prompt Security brand:** navy `#0b0c1b`, electric purple `#6100ff`, lime `#8fff08`,
  orange `#ffa33f`, Quicksand.

## Check these before you run it
1. **Room wifi** — models are pre-pulled at home, so in-room load is just the shared-box tail. Still
   test the network, and specifically test for AP/client isolation, which is the single most common
   way the shared-endpoint fallback dies.
2. **Audience mix** — hands-on engineers vs architects vs leadership tunes how much of the 14-minute
   mitigation segment goes to business impact vs technical control detail.
3. **Shared endpoint ownership** — decide who owns and sizes the failure-tail box before you commit
   to offering one.
