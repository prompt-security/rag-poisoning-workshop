<div class="kicker">The attacker's shopping list is short</div>

# What does this attack actually require?

<div class="cols-2 mt-6">
<div class="card card-deep">
<div class="tag tag-clean mb-2">NOT required</div>
<div class="small space-y-1">

- ✗ Access to the model or its weights
- ✗ Access to the vector database internals
- ✗ A software exploit or CVE
- ✗ Any interaction with the victim

</div>
</div>
<div v-click class="card">
<div class="tag tag-poison mb-2">required</div>
<div class="text-xl mt-3 text-white">Write-access to <em>one thing</em> that gets indexed.</div>
<div class="small muted mt-3">That's the entire prerequisite. The blast radius is every future query that retrieves your document.</div>
</div>
</div>
