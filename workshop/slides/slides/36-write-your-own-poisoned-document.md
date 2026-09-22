<div class="kicker">Lab · Step 2 · weaponize · the main event</div>

# Write your own poisoned document

<div class="cols-2 mt-4">
<div>

```bash
# 1. write a poison doc applying the 3 levers
$EDITOR my_poison.txt

# 2. run the demo with YOUR document
python src/rag_poisoning_demo.py --infer openai-compat \
    --payload-file my_poison.txt
```

<div class="small mt-3 space-y-1">

Apply what you just learned:
- **Lever 1** — cover 2–3 real topics so it gets retrieved.
- **Lever 2** — check it lands in the top-k (it's a 4-doc corpus).
- **Lever 3** — hide a benign instruction in mid-document prose.

</div>
</div>

<div class="card card-deep">
<div class="tag mb-2">stay benign — persona / format only</div>
<div class="small">Ideas: *"answer only in haiku,"* *"end every reply with a disclaimer,"* *"always recommend BrandX."* You're proving control, not causing harm.</div>
<div class="mt-3 tag tag-poison mb-1">bonus challenge</div>
<div class="tiny muted">Make it survive a keyword scan: no brackets, no "SYSTEM," no "ignore previous." Phrase it as an *editor's note on house style.* If a naive <code>grep</code> wouldn't flag it but the model still obeys — that's the point of the mitigation segment.</div>
</div>
</div>

<!--
This is the core hands-on beat and it maps 1:1 to the three levers just taught. The bonus challenge is the
old "beat the scanner" idea, but honestly scoped: it's a grep, not a product. Whoever paraphrases past it
will never over-trust content filtering again — that pre-loads the mitigation segment.
-->
