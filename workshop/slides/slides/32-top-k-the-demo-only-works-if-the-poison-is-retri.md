<div class="kicker">Lever 2 · be inside the window</div>

# Top-k: the demo only works if the poison is retrieved

<div class="cols-2 mt-4">
<div>
<div class="small">The retriever returns the <strong class="text-white">k</strong> nearest chunks. Only those reach the prompt. So the attack has two independent gates:</div>

<div class="card card-deep mt-3 small">
1. Does the poison rank in the top-k? &nbsp;<span class="muted">(Lever 1)</span><br/>
2. If yes → the instruction is in the prompt → the model tends to obey.
</div>
<div class="small mt-3">For a <strong>live demo</strong> you want gate 1 to be <strong class="text-white">reliable</strong>, so the room sees behavior change, not a coin-flip retrieval.</div>
</div>

<div>
<div class="term text-xs">
<span class="c-mut"># the repo shipped k=3 against a 4-doc corpus</span>
<br/>corpus = 3 benign + 1 poison = 4 docs
<br/>TOP_K_RETRIEVAL = 3
<br/><br/><span class="c-mut"># so 1 of 4 docs is dropped every query —</span>
<br/><span class="c-mut"># sometimes it's the poison → Q3 stayed clean</span>
<br/><br/><span class="c-clean"># workshop default: k = 4</span>
<br/><span class="c-clean"># poison always in-window → behavior isolates</span>
</div>
<div class="small muted mt-3">Tuning k for the demo isn't cheating — it's <strong class="text-white">controlling the variable.</strong> You're teaching instruction-following; you don't want a retrieval miss masquerading as "the model resisted."</div>
</div>
</div>

<div v-click class="mt-3 muted small text-center">
Teaching point for their own systems: <strong class="text-white">smaller k is not a security control.</strong> It only lowers the odds any single poison is retrieved; the attacker answers by planting more, or by writing wider.
</div>
