<div class="kicker">Before we teach — 90 seconds</div>

# Is your own endpoint up?

<div class="muted small text-center mb-3">
Everyone runs a model <strong>locally, on their own machine</strong> — llama-server, Ollama, or LM Studio. No shared server; your laptop, your endpoint.
</div>

<div class="term text-left max-w-3xl mx-auto">
<span class="c-prompt">$</span> source .venv/bin/activate   <span class="c-mut"># the venv setup.sh built</span>
<br/><span class="c-prompt">$</span> python3 src/preflight.py --one-line   <span class="c-mut"># deps + embeddings + your endpoint</span>
<br/><br/><span class="c-clean">PREFLIGHT PASS: … | endpoint … reachable | model fired: 'READY' | run: demo --infer …</span>
</div>

<div class="cols-3 mt-4 text-left text-sm">
<div class="card"><div class="tag tag-clean mb-1">PASS</div><div class="small">You're ready. Nothing else to do.</div></div>
<div class="card"><div class="tag tag-warn mb-1">endpoint red</div><div class="small">Is your server running? Base URL a <strong>bare origin</strong> — no <code>/v1</code>, no trailing slash. Re-run with <code>--provider openai-compat</code>, <code>ollama</code> or <code>lmstudio</code> for the exact fix.</div></div>
<div class="card"><div class="tag mb-1">still stuck</div><div class="small">Flag a TA and pair with a neighbor while you fix it.</div></div>
</div>

<div class="mt-4 text-center tiny muted">
Pick a model that fits <em>your</em> machine: a <strong>~4B instruct</strong> (phi4-mini / phi3.5) is the sweet spot — big enough to follow injected instructions, small enough to be fast, context ≥ 2048 so the retrieved chunks aren't truncated. Under ~1.5B is too erratic; reasoning/"thinking" models break the demo.
</div>

<!--
No shared/instructor endpoint and no shared fallback — every participant runs their own. The model-fit
line is the guidance: ~4B instruct (phi4-mini / phi3.5), ctx >= 2048, avoid sub-1.5B and thinking models. Full recipes are on
the endpoint cheat card. Preflight runs without the venv, but then reports a "Project dependencies" FAIL:
activate first. Anyone still red pairs with a green neighbor and follows the recorded run (slide 19); we
move on at minute 8.
-->
