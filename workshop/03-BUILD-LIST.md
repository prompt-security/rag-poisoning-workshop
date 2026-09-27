# Build List — what must exist before the workshop

**No invented tooling.** The lab uses the repo's existing `src/rag_poisoning_demo.py` — one script that
builds a corpus and runs it with and without the poisoned document. The work below is **five small edits
to files that already exist**, plus install/infra. There is no `ctf.py`, no `defense_scan.py`, no levels,
no leaderboard.

## A. Code edits — the changes that unblock the lab

All land as PRs against `main` on `prompt-security/RAG_Poisoning_POC` — there is no separate workshop
branch (see [`02-PREFLIGHT-AND-ENDPOINTS.md`](02-PREFLIGHT-AND-ENDPOINTS.md)).

| # | File:line | Change | Status |
|---|-----------|--------|--------|
| 1 | `src/llm_factory.py:34` | `model=config.ollama_model` instead of hardcoded `"llama3:8b-instruct-q5_0"`; a generic **openai-compatible** provider reading `OPENAI_COMPAT_BASE_URL`/`OPENAI_COMPAT_MODEL` (no API key — every supported endpoint is unauthenticated) | **DONE** (RAG_Poisoning_POC#1) |
| 2 | `src/rag_poisoning_demo.py` | `openai-compat` added to `--infer` choices | **DONE** (RAG_Poisoning_POC#1) — the flag value is `openai-compat`, not `openai`; the deck was fixed to match (rag-poisoning-workshop#10) |
| 3 | `src/rag_poisoning_corpus.py:66` | `create_poisoned_document(payload=...)` + a `--payload-file FILE` flag on the entrypoint | **DONE** (RAG_Poisoning_POC#7) |
| 4 | `src/attack_demo.py` | a `--query "..."` (single query) option instead of the fixed 5×2 = 10 | **DROPPED** — the deck's actual lab commands never use it (only `--infer`, `--show-prompt`, `--payload-file`); reproducible defaults (item below) get local latency to ~2–3 s/query without it |
| 5 | `src/attack_demo.py` | print the assembled prompt (`--show-prompt`) | **DONE** (RAG_Poisoning_POC#7) |

Also (small, config-level, from the install recon):
- `src/config.py:36` — make `TRANSFORMERS_OFFLINE` opt-in. **DELIBERATELY NOT DONE** — judged a
  behavioral change not worth bundling into the preflight PR. `src/preflight.py` instead warns about
  the resulting cold-cache error, and `./setup.sh --no-local` pre-downloads the cache so it doesn't fire.
- Set `temperature=0` and `max_tokens=128` on the ollama/openai-compat provider branches. **DONE**
  (RAG_Poisoning_POC#8).
- Default `TOP_K_RETRIEVAL=4` in `.env.example` (deterministic poison retrieval — see the "Top-k"
  slide). **DONE** (RAG_Poisoning_POC#8).
- ~~`requirements.workshop.txt` = `requirements.txt` minus `llama-cpp-python` plus `pip-system-certs`
  (RAG_Poisoning_POC#10).~~ **SUPERSEDED** — it never landed on `main`; the install is now `uv` +
  `pyproject.toml` + `uv.lock`. `llama-cpp-python` (source build) became the optional `local` extra in
  RAG_Poisoning_POC#13, which `./setup.sh --no-local` skips — no compiler needed. No
  `pip-system-certs`: behind a TLS-inspecting corporate proxy, use
  `UV_SYSTEM_CERTS=1 ./setup.sh --no-local`.

*(Optional, ~20 lines, not required):* a throwaway `grep`/regex one-liner for the "beat a naive filter"
bonus in Lab 2. It's a teaching prop, not a tool to build — the deck already frames it as `grep`. Still
not built — no need to; participants write the payload, `grep` is illustrative only.

## B. Instructor infrastructure

Default run: **no shared endpoint** — red laptops pair with a green neighbour and follow the recorded
run (slide 19).

- *(Optional — not used by default.)* **Shared fallback llama-server**, only if a facilitator adds
  one, sized to the *failure tail*, not the whole room: `-c 32768 -np 12 -cb -n 256 --host 0.0.0.0
  --port 8080 -a local-model --jinja`. `-c` must be ≥ 2048×np. Pre-warm it. For a large tail, run
  2–3 boxes split by `.env` IP. (See 02 §"Shared-endpoint plan".)
- *(Only with a shared box.)* **Test the room network** for AP/client isolation; pre-stand a phone
  hotspot / tunnelled cloud box.
- **Pre-pull models** on the instructor box: a participant-grade `phi4-mini` and one larger showpiece (Phi-4 14B).
- Rehearse the full run end-to-end on `main` before the session.

## C. Assets

- **Slidev deck** — `slides/slides.md`, done (Parts 1–6, current PS brand).
- **Recorded demos** — `hidden_parrot_rec` (canonical run / fallback) and `ps_fuzz_rec` (bonus),
  already wired into the deck via `slidev-addon-asciinema`.
- **Handouts (optional but high-value):** the endpoint cheat card (4 runtime recipes + `.env` + verify
  curl), the mitigation take-home 1-pager, the honest-homework caveat card.

---

### Suggested order
1. ~~The code edits + config tweaks + the compiler-free `--no-local` install, verified against a real
   3B endpoint.~~ Done — see the Status column above (`requirements.workshop.txt` was superseded by
   the uv `local` extra, RAG_Poisoning_POC#13).
2. ~~Confirm the deck's lab commands match the final flag names.~~ Done (rag-poisoning-workshop#10
   fixed `--infer openai` → `--infer openai-compat`, the only mismatch found).
3. Instructor infra (no shared box by default) + a full rehearsal shortly before you run the session.
