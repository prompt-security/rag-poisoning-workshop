# Pre-flight & Endpoint Setup — Participant Guide

> **Everything here happens BEFORE the room, on home wifi.** Nothing GB-scale downloads in-session.

## Participant pre-flight (do 24h+ ahead)

1. **Clone `main`** — there is no separate workshop branch; all workshop-required fixes land on `main`:
   ```bash
   git clone https://github.com/prompt-security/RAG_Poisoning_POC.git && cd RAG_Poisoning_POC
   ```
   The two long-standing defects that made `main` unusable for anyone on Ollama, llama-server or LM
   Studio — no OpenAI-compatible provider at all, and `llm_factory.py` printing your configured model
   then ignoring it, hardcoding `llama3:8b-instruct-q5_0` — were fixed by
   prompt-security/RAG_Poisoning_POC#1, which also added `src/preflight.py`.
   **Before relying on this guide, confirm** prompt-security/RAG_Poisoning_POC#5 and #6 are merged too
   — a later, unrelated dependency bump (`langchain` 0.1.0→1.3.9) broke installability and the demo's
   own `RetrievalQA` import; #5/#6 are the fix. `git log` for those PR titles if unsure.

   > `--show-prompt` and `--payload-file` are real flags on `src/rag_poisoning_demo.py` as of
   > prompt-security/RAG_Poisoning_POC#7 — confirm that one's merged too. Single-query mode,
   > `defense_scan.py` and `ctf.py` were **dropped from scope** and stay dropped — the demo is the
   > repo's real `src/rag_poisoning_demo.py` with those two added flags. Don't reintroduce them.

2. **Install and pre-download the embedding model, ONLINE, on home wifi (mandatory), in one step:**
   ```bash
   ./setup.sh --no-local
   ```
   `--no-local` selects `requirements.workshop.txt` automatically (as of
   prompt-security/RAG_Poisoning_POC#10) — no compiler needed, no manual requirements-file juggling.
   **Do NOT run a bare `uv pip install -r requirements.txt` yourself first** — its `llama-cpp-python`
   line builds from source and hard-fails on any machine without cmake + Xcode CLT, even for people
   who only use a remote endpoint. ~1–3 min, dominated by the ~480 MB torch download, then fetches
   all-MiniLM-L6-v2 (~87 MB) — required for both clean and poisoned phases regardless of LLM.

3. **Pick and prepare ONE endpoint** (see matrix below). If bringing your own, pull ONE small chat
   model on home wifi. **Models ≤1.5B are BANNED** (40–60% compliance = flopped demo);
   **reasoning/thinking models are BANNED** (they narrate the injection and break the clean binary).

4. **Configure `.env`** from the matching template. **Base URL = BARE ORIGIN**: no `/v1` suffix
   (code appends it → `/v1/v1` → 404) and no trailing slash (→ `//v1` → 307).

5. **Run the self-check and report:**
   ```bash
   python3 src/preflight.py --one-line
   ```
   On success prints exactly one pasteable line:
   `PREFLIGHT PASS: python 3.11.9 | deps ok | embeddings cached (dim 384) | endpoint http://localhost:8080 reachable | model fired: 'READY'`
   On failure prints ONE reason + remedy:
   `PREFLIGHT FAIL: ollama daemon not reachable -- ollama serve`

   **Send the PASS line + your name + endpoint type to the instructor ≥24h ahead** (whatever channel
   they nominate) so they can size the shared endpoint and spot red laptops early.

   For the full diagnostic instead of one line, drop `--one-line`. Useful extras:
   ```bash
   python3 src/preflight.py                      # every check, with the fix command for each
   python3 src/preflight.py --provider ollama    # just your endpoint
   python3 src/preflight.py --deep               # also probe for SILENT prompt truncation
   python3 src/preflight.py --install ollama     # print (or --run) the install commands
   python3 src/preflight.py --download phi-4-mini
   python3 src/preflight.py --write-env ollama --model phi-4-mini
   ```
   `preflight.py` is stdlib-only and needs no venv, so it still reports usefully when step 2 failed.
   `--deep` is worth running once: it puts a codeword at the head of a long prompt and asks for it
   back, which catches engines that silently trim an overflowing prompt — the failure mode that
   breaks this demo with no error message at all.

---

## Endpoint matrix

### Recommended models (participant tier: ~4B)

All picks are **Microsoft Phi**: MIT-licensed, published by a US company, and — the practical part —
**ungated**. No HuggingFace account, no token, no gated-repo licence click-through, which is what
usually strands a participant 24h before the room. Verified with an unauthenticated request: both
GGUFs return HTTP `200`.

| Model | Size | Runtimes | Behavior |
|---|---|---|---|
| **`phi4-mini` (Phi-4-mini-instruct Q4_K_M)** — TOP PICK | 2.32 GB | ollama, llama-server, LM Studio | **100% (5/5)** at top-k=4; 1.4–3.7 s/query warm on llama-server |
| **`phi3.5` (Phi-3.5-mini-instruct Q4_K_M)** — co-top | 2.23 GB | ollama, llama-server, LM Studio | 4/4 compliance whenever the poison was retrieved; 11–20 s/query in-process via llama-cpp-python |
| Phi-4 (14B) Q4_K_M — SHOWPIECE (instructor only) | ~9 GB | any | most theatrical output; **not yet measured here** |
| any instruct model ≤1.5B — **DO NOT USE** | — | — | 40–60%, high variance between runs |
| reasoning/"thinking" models — **BANNED** | — | — | narrate the injection and break the clean binary |

**Minimum context: 2048 tokens** (≈500-token prompt + 256 completion, with headroom).

> **Measured, and worth being precise about.** At the workshop default **top-k=4**, Phi-4-mini was
> poisoned on **5/5** queries. At top-k=3 it drops to 4/5 — but the one clean answer is a **retrieval
> miss**, not the model resisting: the poisoned `distributed_systems_advanced.md` simply isn't in that
> query's retrieved set. Compliance was 4/4 every time the poison was actually retrieved. This is the
> best teaching moment in the whole demo; don't let it read as "the model defended itself".
>
> Concurrency under many participants has **not** been re-measured on Phi — the 20-way figure in the
> shared-endpoint section below was taken on a different model. Re-measure before relying on it.

### Runtimes
| Runtime | Install | Serve | `.env` base URL | Key gotcha |
|---|---|---|---|---|
| **llama-server** (llama.cpp) — RECOMMENDED, most forgiving | `brew install llama.cpp` / `winget install llama.cpp` | `llama-server -hf bartowski/microsoft_Phi-4-mini-instruct-GGUF:Q4_K_M -c 4096 -np 1 -cb --host 127.0.0.1 --port 8080 -a local-model --jinja` | `http://localhost:8080` | Ignores model field, needs no key, fails LOUDLY (HTTP 400) on context overflow — best for a live room |
| **Ollama** — most familiar | `brew install ollama` / `winget install Ollama.Ollama`; `ollama pull phi4-mini` | (daemon) | `http://localhost:11434` + `OLLAMA_MODEL=phi4-mini` | **Truncates SILENTLY** on small context — set `OLLAMA_CONTEXT_LENGTH=4096`, `OLLAMA_KEEP_ALIVE=60m`; check `ollama ps` CONTEXT |
| **LM Studio** — GUI | `lms get phi-4-mini-instruct` | `lms server start --port 1234`; `lms load phi-4-mini-instruct --context-length 4096 --parallel 1 --ttl 3600` | `http://localhost:1234` | Server OFF by default; models JIT-load (25 s+ stall) — set `--ttl`; parallel=1, never use as the shared box |
| **Shared instructor endpoint** — zero local model | (nothing) | (instructor runs it) | `http://<INSTRUCTOR_IP>:8080` + `OLLAMA_MODEL=local-model` | 15–30 s/query = queueing, not a hang |

**Verify curl (run once as warm-up):**
```bash
curl -s http://localhost:8080/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"model":"local-model","messages":[{"role":"user","content":"say aye"}],"max_tokens":8}'
```

---

## Demo failure modes to pre-empt (measured)
- **Retrieval miss masquerading as model failure** — top-k=3 vs 4-doc corpus; workshop default is
  **top-k=4** to make retrieval deterministic (keep k=3 only if deliberately teaching retrieval ranking).
- **Too-aligned / reasoning model refuses or narrates** — breaks the clean binary; BANNED.
- **Detector false positive on "ye"** — `\bye\b` matches "ye olde"; check response text.
- **Cold start looks like a hang** — 16.8 s cold vs 0.2 s warm (Ollama); 25.9 s to load an 8B (LM
  Studio). Everyone runs the warm-up curl; set keep-alive/ttl.

## Scale note — large rooms (100+), open personal machines
At this scale **BYO local endpoint is the PRIMARY path, not the fallback** — you cannot funnel that
many people through one shared box. Everyone runs their own 3B locally (open machines make this easy).
The shared endpoint shrinks to a **failure-tail** absorber (target ≤10–15% who fail local setup). This
makes two things non-negotiable:
- **The 24h-ahead PREFLIGHT PASS roster is mandatory**, not nice-to-have — it's the only way to know the
  BYO success rate before the room fills and to size the failure tail.
- **A per-person triage gate at minute 0 does not scale.** Replace it with: a self-service
  troubleshooting card, 4–6 roaming TAs, neighbour-pairing by default, and a big projected
  green/red counter. Accept that a fraction will watch rather than run — the show-and-tell scales
  fine, and the pre-recorded captures cover anyone who can't run live.

## Shared-endpoint plan (the failure-tail fallback — instructor)
Goal: any failed laptop changes ONE `.env` line and runs within 60 s, repo unpatched. **Size the box
to the expected failure tail (e.g. ~15 concurrent for a 100-person room), NOT to the full headcount.**
If the tail is larger, run 2–3 shared boxes and split by `.env` IP, or use a bigger cloud instance.
**Use llama-server, NOT Ollama/LM Studio** — it ignores the OpenAI `model` field (verified: a request
for a wrong name returned 200), so every `.env` just works. One command:
```bash
llama-server -m ~/models/Phi-4-mini-instruct.Q4_K_M.gguf \
  -c 32768 -np 12 -cb -n 256 --host 0.0.0.0 --port 8080 -a local-model --jinja --threads-http 16
```
- `-np 12` = 12 concurrent slots (measured: 20 participants × 10 queries ≈ 3.3 min, 0 errors).
- `-c 32768` MUST be ≥ 2048 × np — **llama.cpp DIVIDES `-c` by `-np`** (verified: `-c 4096 -np 20`
  gave 256 tok/slot and the demo died with HTTP 400). 32768/12 ≈ 2730/slot.
- Pre-warm it. Size `-np` to the confirmed PASS-roster headcount.
- **Test the room wifi for AP/client isolation beforehand**; pre-stand a phone hotspot AND a tunnelled
  cloud box (tailscale funnel / cloudflared) as backup — client-isolated wifi is the #1 way this dies.

## The unprepared participant
Someone who did nothing cannot be installed in-room (torch + a 2 GB pull over venue wifi eats the
session). The shared-endpoint path needs only clone + venv + MiniLM cache (no model, no local server),
so most are recoverable in the 8-min gate by switching `.env` to the shared IP (~5–10 min incl. torch).
For truly-nothing or corporate-locked laptops: keep **3–4 USB sticks** pre-staged with a built venv +
persisted Chroma DB + MiniLM cache, and pair the rest 2-to-1 with a green neighbor.
