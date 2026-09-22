<div class="kicker">Where you'll actually meet this</div>

# What RAG is used for

<div class="cols-3 mt-5 text-sm">
<div class="card"><strong>Internal knowledge assistant</strong><div class="tiny muted mt-1">"What's our PTO policy?" over Confluence / Notion / SharePoint. The most common enterprise deployment.</div></div>
<div class="card"><strong>Customer support</strong><div class="tiny muted mt-1">Answer bot over help-center articles, past tickets, and product docs. Public-facing.</div></div>
<div class="card"><strong>Code assistant</strong><div class="tiny muted mt-1">Q&A over your repos, ADRs, runbooks. Retrieves internal code and design docs.</div></div>
<div class="card"><strong>Document Q&A</strong><div class="tiny muted mt-1">Contracts, policies, research, financial filings. Often user-uploaded PDFs.</div></div>
<div class="card"><strong>Sales & competitive intel</strong><div class="tiny muted mt-1">Battlecards, pricing, vendor comparisons. Feeds decisions that move money.</div></div>
<div class="card card-deep"><strong>Agents with tools</strong><div class="tiny muted mt-1">Everything above, <em>plus</em> the model can call APIs, send mail, file tickets. Where the stakes change.</div></div>
</div>

<div v-click class="mt-5 card">
<div class="tag mb-1">the pattern to notice</div>
<div class="small">Every one of these works by <strong class="text-white">taking documents someone else wrote and putting them in front of the model.</strong> The value of RAG <em>is</em> the ingestion of content you didn't author. That's also the whole attack surface.</div>
</div>

<!--
Ground it in deployments they recognize. The last card (agents) is the pivot: same mechanism, but the
consequence stops being "wrong text" and becomes "wrong action." Land the click: RAG's value proposition
and its attack surface are the same sentence.
-->
