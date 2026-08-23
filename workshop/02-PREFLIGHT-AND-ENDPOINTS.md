# Pre-flight & Endpoint Setup — Participant Guide (staged for review)

> **Everything here happens BEFORE the room, on home wifi.** Nothing GB-scale downloads in-session.

## Participant pre-flight (do 24h+ ahead)

1. **Clone the workshop branch (NOT main):**
   ```bash
   git clone -b workshop <repo-url> && cd RAG_Poisoning_POC
   ```
   `main` lacks the OpenAI-compatible provider, `--show-prompt`, single-query mode, `defense_scan.py`
   and `ctf.py`, and its hardcoded model 404s every Ollama/LM Studio user at minute one.

2. **Install (no compiler needed):**
   ```bash
   uv venv --python=3.11 && uv pip install -r requirements.workshop.txt
   ```
   ~1–3 min, dominated by the ~480 MB torch download. **Do NOT use the default `requirements.txt`** —
   its `llama-cpp-python` line builds from source and hard-fails on any machine without cmake + Xcode
   CLT, even for people who only use a remote endpoint. `requirements.workshop.txt` drops it and adds
   `pip-system-certs` (fixes the Zscaler/corporate-proxy TLS failure — a no-op off-proxy).

3. **Pre-download the embedding model, ONLINE, on home wifi (mandatory):**
   ```bash
   ./setup.sh --no-local
   ```
   Fetches all-MiniLM-L6-v2 (~87 MB). Required for both clean and poisoned phases regardless of LLM.

4. **Pick and prepare ONE endpoint** (see matrix below). If bringing your own, pull ONE small chat
   model on home wifi. **Models ≤1.5B are BANNED** (40–60% compliance = flopped demo);
   **reasoning/thinking models are BANNED** (they narrate the injection and break the clean binary).

5. **Configure `.env`** from the matching template. **Base URL = BARE ORIGIN**: no `/v1` suffix
   (code appends it → `/v1/v1` → 404) and no trailing slash (→ `//v1` → 307).

6. **Run the self-check and report:**
   ```bash
   python ctf.py --check
   ```
   On success prints exactly:
   `PREFLIGHT PASS: harness ok | embeddings cached (dim 384) | endpoint <url> reachable | model fired: aye`
   On failure prints ONE reason + remedy, e.g. `FAIL: endpoint 404 — check base URL is a bare origin
   with no /v1 suffix`. **Paste the PASS line + your name + endpoint type into the shared thread ≥24h
   ahead** so the instructor sizes the shared endpoint and spots red laptops early.

---

## Endpoint matrix

### Recommended models (participant tier: 3B)
| Model | Size | Runtimes | Behavior |
|---|---|---|---|
| **qwen2.5:3b-instruct (Q4_K_M)** — TOP PICK | 1.93 GB | ollama, llama-server | 100% (5/5) with poison in context; 99/100 under 20-way concurrency |
| **llama3.2:3b-instruct-q4_K_M** — co-top | 2.02 GB | ollama | 100% (5/5); slightly more verbose |
| 7–8B instruct Q4_K_M (Qwen2.5-7B / Llama-3.1-8B) — SHOWPIECE (instructor only) | ~4.7 GB | any | 100%, most theatrical output |
| qwen2.5:1.5b-instruct — **DO NOT USE** | 0.99 GB | — | 40–60%, high variance |
| anything <1.5B, or reasoning/thinking models — **BANNED** | — | — | 0–30% / un-demoable |

**Minimum context: 2048 tokens** (≈500-token prompt + 256 completion, with headroom).

### Runtimes
| Runtime | Install | Serve | `.env` base URL | Key gotcha |
|---|---|---|---|---|
| **llama-server** (llama.cpp) — RECOMMENDED, most forgiving | `brew install llama.cpp` / `winget install llama.cpp` | `llama-server -hf Qwen/Qwen2.5-3B-Instruct-GGUF:Q4_K_M -c 4096 -np 1 -cb --host 127.0.0.1 --port 8080 -a local-model --jinja` | `http://localhost:8080` | Ignores model field, needs no key, fails LOUDLY (HTTP 400) on context overflow — best for a live room |
| **Ollama** — most familiar | `brew install ollama` / `winget install Ollama.Ollama`; `ollama pull qwen2.5:3b-instruct` | (daemon) | `http://localhost:11434` + `OLLAMA_MODEL=qwen2.5:3b-instruct` | **Truncates SILENTLY** on small context — set `OLLAMA_CONTEXT_LENGTH=4096`, `OLLAMA_KEEP_ALIVE=60m`; check `ollama ps` CONTEXT |
| **LM Studio** — GUI | `lms get qwen2.5-3b-instruct` | `lms server start --port 1234`; `lms load qwen2.5-3b-instruct --context-length 4096 --parallel 1 --ttl 3600` | `http://localhost:1234` | Server OFF by default; models JIT-load (25 s+ stall) — set `--ttl`; parallel=1, never use as the shared box |
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

## Scale note — 100+ participants, open personal machines
At this scale **BYO local endpoint is the PRIMARY path, not the fallback** — you cannot funnel 100+
people through one shared box. Everyone runs their own 3B locally (open machines make this easy). The
shared endpoint shrinks to a **failure-tail** absorber (target ≤10–15% who fail local setup). This
makes two things non-negotiable:
- **The 24h-ahead PREFLIGHT PASS roster is mandatory**, not nice-to-have — it's the only way to know the
  BYO success rate before the room fills and to size the failure tail.
- **The minute-0 individual triage gate does not scale to 100+.** Replace it with: self-service
  troubleshooting card, 4–6 roaming TAs, neighbor-pairing by default, and a big projected
  green/red counter. Accept that a fraction will watch rather than run — the leaderboard and
  show-and-tell scale fine, and the pre-recorded captures cover anyone who can't run live.

## Shared-endpoint plan (the failure-tail fallback — instructor)
Goal: any failed laptop changes ONE `.env` line and runs within 60 s, repo unpatched. **Size the box
to the expected failure tail (e.g. ~15 concurrent for a 100-person room), NOT to the full headcount.**
If the tail is larger, run 2–3 shared boxes and split by `.env` IP, or use a bigger cloud instance.
**Use llama-server, NOT Ollama/LM Studio** — it ignores the OpenAI `model` field (verified: a request
for a wrong name returned 200), so every `.env` just works. One command:
```bash
llama-server -m ~/models/qwen2.5-3b-instruct-q4_k_m.gguf \
  -c 32768 -np 12 -cb -n 256 --host 0.0.0.0 --port 8080 -a local-model --jinja --threads-http 16
```
- `-np 12` = 12 concurrent slots (measured: 20 participants × 10 queries ≈ 3.3 min, 0 errors).
- `-c 32768` MUST be ≥ 2048 × np — **llama.cpp DIVIDES `-c` by `-np`** (verified: `-c 4096 -np 20`
  gave 256 tok/slot and the demo died with HTTP 400). 32768/12 ≈ 2730/slot.
- Pre-warm it. Size `-np` to the confirmed PASS-roster headcount.
- **Test the room wifi for AP/client isolation beforehand**; pre-stand a phone hotspot AND a tunnelled
  cloud box (tailscale funnel / cloudflared) as backup — client-isolated wifi is the #1 way this dies.

## The unprepared participant
Someone who did nothing cannot be installed in-room (torch + a 2 GB pull over conference wifi eats the
session). The shared-endpoint path needs only clone + venv + MiniLM cache (no model, no local server),
so most are recoverable in the 8-min gate by switching `.env` to the shared IP (~5–10 min incl. torch).
For truly-nothing or corporate-locked laptops: keep **3–4 USB sticks** pre-staged with a built venv +
persisted Chroma DB + MiniLM cache, and pair the rest 2-to-1 with a green neighbor.
