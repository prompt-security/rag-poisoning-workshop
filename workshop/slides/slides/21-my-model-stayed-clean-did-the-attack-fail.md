<div class="kicker">When it doesn't fire — that's data too</div>

# "My model stayed clean. Did the attack fail?"

<div class="cols-2 mt-6">
<div class="card">
<div class="tag tag-warn mb-2">maybe the model is small</div>
<div class="small">Sub-2B and heavily-quantized models follow instructions erratically. <strong>Attack success is model-dependent</strong> — which is itself an argument against trusting any one model's "resistance" as a control.</div>
</div>
<div class="card">
<div class="tag mb-2">maybe the poison wasn't retrieved</div>
<div class="small">No poisoned chunk in the top-k → no compromise. The attack is <strong class="text-white">retrieval-gated.</strong> Hold that thought — it's the next section, and it's the key to detection.</div>
</div>
</div>

<div v-click class="mt-6 muted text-center">
Either way: the recorded run (slide 19) is the reference. The lesson survives a flaky model.
</div>
