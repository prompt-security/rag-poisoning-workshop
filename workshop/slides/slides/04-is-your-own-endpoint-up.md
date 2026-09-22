---
layout: center
---

<div class="kicker">Before we teach — 90 seconds</div>

# Is your own endpoint up?

<div class="muted small text-center mb-3">
Everyone runs a model <strong>locally, on their own machine</strong> — llama-server, Ollama, or LM Studio. No shared server; your laptop, your endpoint.
</div>

<div class="term text-left max-w-3xl mx-auto">
<span class="c-prompt">$</span> python test_setup.py --no-local   <span class="c-mut"># deps + cached embeddings</span>
<br/><span class="c-prompt">$</span> curl -s $OLLAMA_BASE_URL/v1/models   <span class="c-mut"># your local model is serving</span>
<br/><br/><span class="c-clean">✅ embeddings cached (dim 384)</span> <span class="c-mut">·</span> <span class="c-clean">✅ endpoint reachable</span>
</div>

<div class="cols-3 mt-4 text-left text-sm">
<div class="card"><div class="tag tag-clean mb-1">both pass</div><div class="small">You're ready. Nothing else to do.</div></div>
<div class="card"><div class="tag tag-warn mb-1">endpoint red</div><div class="small">Is your server running? Base URL a <strong>bare origin</strong> — no <code>/v1</code>, no trailing slash.</div></div>
<div class="card"><div class="tag mb-1">still stuck</div><div class="small">Flag a TA and pair with a neighbor while you fix it.</div></div>
</div>

<div class="mt-4 text-center tiny muted">
Pick a model that fits <em>your</em> machine: a <strong>~4B instruct</strong> (phi4-mini / phi3.5) is the sweet spot — big enough to follow injected instructions, small enough to be fast, context ≥ 2048 so the retrieved chunks aren't truncated. Under ~1.5B is too erratic; reasoning/"thinking" models break the demo.
</div>

<!--
No shared/instructor endpoint — every participant runs their own. The model-fit line is the guidance:
3B instruct, ctx >= 2048, avoid sub-1.5B and thinking models. Full recipes are on the endpoint cheat card.
Anyone still red pairs with a neighbor and uses the recorded run as reference; we move on at minute 8.
-->
