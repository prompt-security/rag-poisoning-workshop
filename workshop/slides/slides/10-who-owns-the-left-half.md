<div class="kicker">The pipeline has two halves</div>

# Who owns the left half?

<div class="pipe mt-5">

<div class="pipe-half pipe-in">
<div class="pipe-hd">🗄️ Ingestion — offline, nobody is watching</div>
<div class="pnode">Documents<span>wiki · tickets · PDFs · crawl</span></div>
<div class="parr">▼</div>
<div class="pnode">Chunk + split</div>
<div class="parr">▼</div>
<div class="pnode">Embed</div>
<div class="parr">▼</div>
<div class="pnode pnode-db">Vector DB</div>
</div>

<div class="pipe-join"><span class="pj-arrow">➜</span><span class="pj-lab">same index</span></div>

<div class="pipe-half pipe-out">
<div class="pipe-hd">💬 Retrieval — online, per query</div>
<div class="pnode">User question</div>
<div class="parr">▼</div>
<div class="pnode">Embed query</div>
<div class="parr">▼</div>
<div class="pnode pnode-hit">Similarity search</div>
<div class="parr">▼</div>
<div class="pnode">Top-k chunks</div>
<div class="parr">▼</div>
<div class="pnode">Assemble prompt<span>system + chunks + question</span></div>
<div class="parr">▼</div>
<div class="pnode">LLM → answer</div>
</div>

</div>

<div class="cols-2 mt-4">
<div v-click="2" class="small"><strong class="text-white">The attacker lives in the left half.</strong> Whoever can write a document that gets indexed has reached into the prompt — asynchronously, before any victim ever types a question.</div>
<div v-click="1" class="small muted">Everyone secures the <strong class="text-white">right</strong> half — the chat box, the user's prompt, output filters.</div>
</div>

<!--
The left/right framing is the memory hook. Security teams instinctively guard the user-facing right half.
The whole attack is that the left half feeds the same prompt and nobody guards it.
-->
