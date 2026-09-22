<div class="kicker">Before you decide this doesn't apply to you</div>

# You may not call it RAG. You're still running it.

Is RAG dead? The **hype** is. The **data path** shipped everywhere.

<div class="small muted mt-1">The hype moved on to agents, reasoning models and million-token windows. The engineering pattern — fetch somebody's text, paste it into the prompt — is more common than it has ever been. It just answers to other names now.</div>

<div class="tiny mt-2 tbl-compact">

| Pattern | What it changes about retrieval | Where outside text gets in | Poisonable? |
|---|---|---|---|
| **RAG** | top-k nearest chunks, fetched per query, pasted into the prompt | the index you embedded | <span class="dont">YES</span> — one indexed doc |
| **Agentic search** | *the model* writes the queries, judges the hits, retries until satisfied | anything it can call: index, Drive, MCP, live web | <span class="dont">YES</span> — more fetches, and nobody reads the intermediate ones |
| **CAG** <span class="muted">cache-/context-augmented</span> | no retrieval step — the corpus is preloaded into the window / KV cache once | the curated corpus itself | <span class="dont">YES</span> — no top-k gate, so the poison is in *every* answer |
| **KAG** <span class="muted">knowledge-augmented</span> | entities and relations from a knowledge graph, reasoned over — not similarity | the extraction pipeline that turns documents into "facts" | <span class="dont">YES</span> — poison the source, poison the "fact" |

</div>

<div class="cols-3 mt-2">
<div class="card card-sm"><strong>"Grounding"</strong><div class="tiny muted mt-1">The enterprise word. Microsoft and Google sell retrieval as <em>grounding the model in your data</em>; AWS ships <strong>Bedrock Knowledge Bases</strong>. Nobody writes "RAG pipeline" in a design doc any more.</div></div>
<div class="card card-sm"><strong>"Knowledge tool" · "connector"</strong><div class="tiny muted mt-1">Inside an agent, retrieval isn't the architecture — it's <em>one tool among many</em>: <code>file_search</code>, a knowledge base, a Drive / Notion connector, an MCP server that hands back documents.</div></div>
<div class="card card-sm"><strong>"In-context learning"</strong><div class="tiny muted mt-1">The research framing: evidence arrives through the <strong>context window</strong>, not the weights. Papers fold retrieved passages into this term. Different vocabulary, identical data path.</div></div>
</div>

<div v-click class="mt-2 card card-deep" style="line-height:1.35;padding:.6rem .9rem">
<div class="tag mb-1">the only test that matters</div>
<div class="tiny">Ask it of any system, whatever the label: <strong class="text-white">does text somebody else wrote end up inside the model's context window?</strong> If yes, everything in the next 80 minutes applies to it. When a team tells you "we don't do RAG" — ask which of these names they use instead.</div>
</div>

<!--
This slide exists to kill the "RAG is a 2023 problem, we're doing agents now" objection before it forms.
Ask the room out loud: "who has the word GROUNDING or KNOWLEDGE BASE in a design doc this quarter?" —
more hands go up than for the word RAG. Land the click: the alias never changes the data path, so the
attack you are about to run is not scoped to systems that still use the old name.

The table's last column is the whole argument: it says YES four times. Read it down, not across —
the label changes what RETRIEVAL looks like, never whether somebody else's text reaches the window.
If asked about CAG: the papers say "cache-augmented" (preload the KV cache and skip retrieval);
teams in the wild say "context-augmented" for the same move. Either way there is no retrieval gate,
which makes it the WORST of the four for poisoning, not the safest.
-->
