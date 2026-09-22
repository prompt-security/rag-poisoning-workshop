<div class="kicker">This is not a chat bug</div>

# It persists. Think stored XSS, for AI.

<div class="cols-2 mt-6">
<div class="card">
<div class="tag tag-warn mb-2">chat-level injection</div>
<div class="small space-y-1">

- Lives in one conversation
- Gone when the session ends
- Affects one user, once

</div>
</div>
<div class="card card-deep">
<div class="tag tag-poison mb-2">corpus poisoning</div>
<div class="small space-y-1">

- Lives in the **vector store**, not the chat
- Survives session resets, **model swaps, prompt rewrites**
- Serves **every future query** that retrieves it — many users, unbounded duration
- Can be **latent / date-gated**; takedown ≠ remediation

</div>
</div>
</div>

<div v-click class="mt-6 text-center text-lg">
One write. N victims. Until someone <strong class="text-white">evicts the embedding.</strong>
</div>
