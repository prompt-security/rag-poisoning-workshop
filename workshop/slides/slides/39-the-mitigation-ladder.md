<div class="kicker">Rate every control: do it, or don't count it</div>

# The mitigation ladder

<div class="text-xs mt-1" style="line-height:1.25">

| Control | What it buys you | How the attacker routes around | Verdict |
|---|---|---|---|
| **Ingestion provenance / allowlisting** | Shrinks *who* can write to the corpus — the only control that reduces the attacker population | Protects only *future* writes; last year's corpus is unscanned | <span class="do">DO IT</span> |
| **Content sanitization** | Cheap first layer; catches lazy payloads | Paraphrase (you just did it); optimized payloads pass | <span class="dont">NEVER COUNT IT</span> |
| **Spotlighting / datamarking** | Signals the model to separate data from instruction | Probabilistic, *inside the same token stream*; frontier-model numbers, worse on small models | <span class="maybe">DON'T TRUST IT</span> |
| **Retrieval logging** | Tells you *who* got poisoned → incident response | Detection only, no prevention | <span class="do">DO IT (cheapest)</span> |
| **Permission-mirroring on retrieval** | Only retrieve what the *user* may read — fixes the Slack AI crossing | Doesn't stop same-tenant poisoning | <span class="do">DO IT</span> |
| **Least-privilege + human-in-the-loop on tools** | Bounds the *blast radius* — the only thing that limits loss | Doesn't stop the injection, only its consequence | <span class="do">THE BACKSTOP</span> |

</div>

<!--
The two-color verdict column is the takeaway. Content filtering is the one they just defeated — never let
it be reported green. The structural controls (who can write; what the model may do) are the real answer.
-->
