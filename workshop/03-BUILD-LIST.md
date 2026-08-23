# Build List — what must exist before the workshop

**No invented tooling.** The lab uses the repo's existing `src/rag_poisoning_demo.py` — one script that
builds a corpus and runs it with and without the poisoned document. The work below is **five small edits
to files that already exist**, plus install/infra. There is no `ctf.py`, no `defense_scan.py`, no levels,
no leaderboard.

## A. Code edits (workshop branch) — the 5 changes that unblock the lab

| # | File:line | Change | Why |
|---|-----------|--------|-----|
| 1 | `src/llm_factory.py:34` | `model=config.ollama_model` instead of hardcoded `"llama3:8b-instruct-q5_0"`; also add a generic **openai-compatible** provider reading `LLM_BASE_URL`/`LLM_MODEL`/`LLM_API_KEY` (key default `not-needed`) | Otherwise every Ollama/LM Studio/llama-server user 404s at query one |
| 2 | `src/rag_poisoning_demo.py:65` | add `openai` to `--infer` choices | Gives llama-server + LM Studio a path in (bring-your-own-endpoint) |
| 3 | `src/rag_poisoning_corpus.py:66` | `create_poisoned_document(payload=...)` + a `--payload-file FILE` flag on the entrypoint | Lets participants inject **their own** poison doc (Lab 2) |
| 4 | `src/attack_demo.py:23` | a `--query "..."` (single query) option instead of the fixed 5×2 = 10 | The recorded run was 26–90 s/query; 10 queries = 10 min of spinner |
| 5 | `src/attack_demo.py:49` | print `doc.page_content` for each source **and** the assembled prompt (`--show-prompt`) | The single most important thing to show — the injected line inside `{context}` |

Also (small, config-level, from the install recon):
- `src/config.py:36` — make `TRANSFORMERS_OFFLINE` opt-in (`os.getenv('TRANSFORMERS_OFFLINE','0')`) so a cold cache downloads instead of throwing a misleading offline error.
- Set `temperature=0` on every provider branch and default `max_tokens≈128` for reproducible, fast demos.
- Default `TOP_K_RETRIEVAL=4` (deterministic poison retrieval — see the "Top-k" slide).
- `requirements.workshop.txt` = `requirements.txt` minus `llama-cpp-python` (source build) plus `pip-system-certs` (Zscaler TLS fix).

*(Optional, ~20 lines, not required):* a throwaway `grep`/regex one-liner for the "beat a naive filter"
bonus in Lab 2. It's a teaching prop, not a tool to build — the deck already frames it as `grep`.

## B. Instructor infrastructure

- **Shared fallback llama-server** sized to the *failure tail* (not the full 100+): `-c 32768 -np 12 -cb
  -n 256 --host 0.0.0.0 --port 8080 -a local-model --jinja`. `-c` must be ≥ 2048×np. Pre-warm it. For a
  large tail, run 2–3 boxes split by `.env` IP. (See 02 §"Scale note".)
- **Test the room network** for AP/client isolation; pre-stand a phone hotspot / tunnelled cloud box.
- **Pre-pull models** on the instructor box: a participant-grade `qwen2.5:3b-instruct` and one 7–8B showpiece.
- Rehearse the full run end-to-end on the workshop branch.

## C. Assets

- **Slidev deck** — `slides/slides.md`, done (Parts 1–6, current PS brand). Fill in the workshop repo/branch
  URL on the closing slide.
- **Recorded demos** — reused from `abutbul/hidden_parrot`: `hidden_parrot_rec` (canonical run / fallback)
  and `ps_fuzz_rec` (bonus). Already wired into the deck via `slidev-addon-asciinema`.
- **Handouts (optional but high-value):** the endpoint cheat card (4 runtime recipes + `.env` + verify
  curl), the mitigation take-home 1-pager, the honest-homework caveat card.

---

### Suggested order
1. The 5 code edits + config tweaks + `requirements.workshop.txt` on the workshop branch; verify against a
   real 3B endpoint on this machine.
2. Confirm the deck's lab commands match the final flag names (adjust either side to agree).
3. Instructor infra + rehearsal close to the date.
