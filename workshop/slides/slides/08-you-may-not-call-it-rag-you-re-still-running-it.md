<div class="kicker">Before you decide this doesn't apply to you</div>

# You may not call it RAG. You're still running it.

<div class="small muted mt-1">The hype moved on to agents, reasoning models and million-token windows. The engineering pattern — fetch somebody's text, paste it into the prompt — is more common than it has ever been. It just answers to other names now.</div>

<div class="cols-3 mt-4 text-sm">
<div class="card"><strong>"Grounding"</strong><div class="tiny muted mt-1">The enterprise word. Microsoft and Google both sell retrieval as <em>grounding the model in your data</em>; AWS ships it as Bedrock <strong>Knowledge Bases</strong>. Nobody writes "we built a RAG pipeline" in a design doc any more.</div></div>
<div class="card"><strong>"Knowledge tool" · "connector"</strong><div class="tiny muted mt-1">Inside an agent, retrieval isn't the architecture — it's <em>one tool among many</em>: <code>file_search</code>, a knowledge base, a Drive / Notion / Confluence connector, an MCP server that hands back documents.</div></div>
<div class="card"><strong>"In-context learning"</strong><div class="tiny muted mt-1">The research framing: the evidence arrives through the <strong>context window</strong>, not the weights. Papers routinely fold retrieved passages into this term. Different vocabulary, identical data path.</div></div>
</div>

<div v-click class="mt-4 card card-deep">
<div class="tag mb-1">the only test that matters</div>
<div class="small">Ask it of any system, whatever the label: <strong class="text-white">does text somebody else wrote end up inside the model's context window?</strong> If yes, everything in the next 80 minutes applies to it. When a team tells you "we don't do RAG" — ask which of these names they use instead.</div>
</div>

<!--
This slide exists to kill the "RAG is a 2023 problem, we're doing agents now" objection before it forms.
Ask the room out loud: "who has the word GROUNDING or KNOWLEDGE BASE in a design doc this quarter?" —
more hands go up than for the word RAG. Land the click: the alias never changes the data path, so the
attack you are about to run is not scoped to systems that still use the old name.
-->
