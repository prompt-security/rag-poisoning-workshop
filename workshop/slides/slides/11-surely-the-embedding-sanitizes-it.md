<div class="kicker">A common hope, and why it's false</div>

# "Surely the embedding sanitizes it?"

<div class="cols-2 mt-6">
<div class="card">
<div class="tag tag-clean mb-2">what embeddings do</div>
<div class="small">

Map text → a vector that **preserves meaning**, so similar text lands nearby. That's the entire job.

</div>
</div>
<div class="card">
<div class="tag tag-poison mb-2">what embeddings do NOT do</div>
<div class="small">

Judge intent. Strip instructions. Flag "this paragraph is telling the model what to do." A poisoned instruction embeds **just as faithfully** as a benign fact.

</div>
</div>
</div>

<div v-click class="mt-8 card card-deep">
The vector store is a <strong>high-fidelity copier</strong>, not a filter. Whatever you put in comes back out — meaning intact — when a query lands near it.
</div>
