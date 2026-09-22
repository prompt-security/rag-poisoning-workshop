<div class="kicker">Lab · Step 1 · reproduce</div>

# Run the demo against your endpoint

<div class="cols-2 mt-4">
<div>

```bash
# the shipped clean-vs-poisoned demo,
# pointed at YOUR endpoint
python src/rag_poisoning_demo.py --infer openai-compat

# see the assembled prompt + retrieved chunks
python src/rag_poisoning_demo.py --infer openai-compat \
    --show-prompt
```

<div class="small mt-4 space-y-1">

- Watch it build the corpus, run clean, then run poisoned.
- `--show-prompt` prints the prompt with the injected line **inside** `{context}` — the thing you learned to look for.
- ~2–3 s/query local, 15–30 s shared.

</div>
</div>

<div class="card card-deep">
<div class="tag mb-2">what the program does</div>
<div class="small">It's not a framework — it's <strong class="text-white">one script</strong>: build a 3-doc corpus, embed it, run your queries; then add <em>one</em> poisoned doc and run the same queries again. The whole attack is the diff between those two runs.</div>
<div class="tiny muted mt-3">Endpoint set once in <code>.env</code> (bare origin, no <code>/v1</code>). Small models vary — if yours won't comply, try a ~4B instruct (phi4-mini / phi3.5) or nudge your phrasing.</div>
</div>
</div>
