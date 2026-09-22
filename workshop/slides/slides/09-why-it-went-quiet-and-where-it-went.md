<div class="kicker">It didn't die — it moved down the stack and grew</div>

# Why it went quiet, and where it went

<div class="cols-2 mt-4 text-sm">

<div class="card">
<div class="tag mb-1">"long context killed RAG"</div>
<div class="tiny">It didn't. Million-token windows made "just paste the whole corpus" thinkable, but brute-forcing a million tokens per query is slow and expensive — retrieving the right 50k still wins on cost, latency <em>and</em> accuracy. And a bigger window is <strong>more</strong> attacker room, not less: more chunks admitted, more places to bury a payload.</div>
</div>

<div class="card">
<div class="tag mb-1">it became infrastructure</div>
<div class="tiny">In 2023, shipping RAG was a project you'd blog about. Now it's a checkbox in your vector DB, your LLM platform, your orchestration framework — turned on by default, by someone who never wrote a threat model for it.</div>
</div>

<div class="card">
<div class="tag mb-1">GraphRAG</div>
<div class="tiny">Knowledge graph <em>plus</em> vector search, so the system follows <strong>relationships</strong> between concepts instead of keyword similarity alone. Security effect: a poisoned node inherits the graph's edges — it can be pulled into answers it could never have matched on similarity.</div>
</div>

<div class="card card-deep">
<div class="tag mb-1">Agentic RAG</div>
<div class="tiny">The model writes its own search queries, judges whether what came back is good enough, and rewrites and retries when it isn't. More retrieval attempts per question, all chosen by the model — and <strong class="text-white">nobody reads the intermediate queries.</strong></div>
</div>

</div>

<div v-click class="mt-4 small">
Notice the direction of travel: each of these <strong>widens</strong> the funnel of outside text reaching the prompt and <strong>removes</strong> a human from the loop. The naive pipeline you'll attack in ten minutes is the <em>easy</em> case.
</div>

<!--
First to cut if Part 1 runs long — the alias slide before it is the load-bearing one of the pair.
If you keep it, the payoff is the closing line: participants attack the simplest possible pipeline
today, and every "modern" variant back at the office has a LARGER surface than the lab, not a smaller one.
-->
