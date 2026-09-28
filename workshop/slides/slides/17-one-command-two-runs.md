<div class="kicker">Lab 1 — do this now</div>

# One command, two runs

<div class="cols-2">
<div>

```bash
source .venv/bin/activate   # once per terminal
# run the shipped demo against YOUR endpoint:
# builds corpus → clean run → poisoned run
python src/rag_poisoning_demo.py --infer openai-compat
# on Ollama: --infer ollama
```

<div class="mt-4 small space-y-2">

- It runs clean first, then poisoned — **watch the same question change.**
- **Check your prediction.** Did the poisoned run go pirate?
- ~0.3–2 s/query (Phi-4-mini, Apple Silicon). A slow start is loading, not a hang.

</div>
</div>

<div>
<div class="term">
<span class="c-prompt">$</span> python src/rag_poisoning_demo.py --infer openai-compat
<br/><span class="c-mut">PHASE 1 — clean corpus</span>
<br/>Q: load balancing → <span class="c-clean">✅ CLEAN</span>
<br/><span class="c-mut">PHASE 2 — poisoned corpus (+1 doc)</span>
<br/><span class="c-mut">sources: distributed_systems_advanced.md, …</span>
<br/>Q: load balancing → <span class="c-poison">🏴‍☠️ POISONED</span>
<br/><span class="c-poison">"Arr matey! Load balancing be spreadin' requests…"</span>
<div class="schematic-note">Expected output (schematic). The full recorded run is on the next slide.</div>
</div>
</div>
</div>

<!--
While their model generates, narrate the mechanism on the projector. The wait is filled with teaching,
not dead air. The program is the repo's real rag_poisoning_demo.py — no invented tooling.
-->
