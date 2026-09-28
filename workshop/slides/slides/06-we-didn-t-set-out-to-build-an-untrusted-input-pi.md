<div class="kicker">Why RAG exists at all</div>

# We didn't set out to build an untrusted-input pipeline

<div class="cols-2 mt-6">
<div class="card">

## The problem
<div class="small mt-2">

- Model weights are **frozen** at training time
- Ask about *your* product, *last week's* ticket → it **confabulates**
- Retraining is slow and expensive

</div>
</div>

<div v-click class="card card-deep">

## The fix everyone shipped
<div class="small mt-2">

- Retrieve relevant documents at query time
- **Paste them into the prompt** as context
- The model answers grounded in *your* data

</div>
</div>
</div>

<div v-click class="mt-8 text-lg">
Nobody chose to wire untrusted documents into the instruction channel.
They chose to <strong>make the chatbot know things.</strong> That economic pressure is why the ingestion surface was never threat-modeled.
</div>

<!--
This reframes RAG as an accident of incentives, not negligence. It disarms the "so RAG is just broken?"
reaction and sets up that the vulnerability is structural, not a vendor bug.
-->
