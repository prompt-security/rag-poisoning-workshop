<div class="kicker">Lever 1 · get retrieved at all</div>

# Semantic width: sound like many questions

<div class="cols-2 mt-4">
<div>
<div class="small">A poisoned doc is useless if it's never in the top-k. Retrieval is <strong class="text-white">similarity search</strong> — your doc competes on how close its embedding sits to the <em>query's</em>. So you write it to sit near <strong>as many likely queries as possible.</strong></div>

<div class="card mt-3">
<div class="tag tag-poison mb-1">why the demo doc won</div>
<div class="small">The poison, <code>distributed_systems_advanced.md</code>, deliberately covers <strong class="text-white">three</strong> subtopics: <em>load balancing</em>, <em>consistent hashing</em>, <em>microservices</em>. Each is a separate retrieval magnet.</div>
</div>
</div>

<div>
<div class="term text-xs">
<span class="c-mut"># which queries pulled the poison, and at what rank</span>
<br/>"load balancing"      → rank <span class="c-poison">#1</span>
<br/>"consistent hashing"  → rank <span class="c-poison">#1</span>
<br/>"microservices"       → rank <span class="c-poison">#1</span>
<br/>"cloud computing"     → rank <span class="c-poison">#2</span> <span class="c-mut">(spillover)</span>
<br/>"machine learning"    → <span class="c-clean">not retrieved</span>
</div>
<div class="small muted mt-3">Three planted topics → four of five queries reached it. The one miss ("machine learning") is the topic the doc <strong class="text-white">didn't</strong> cover.</div>
</div>
</div>

<div v-click class="mt-4 card card-deep small">
<strong>The trade-off:</strong> wider = retrieved more often, but too wide (generic filler about "systems" and "data") dilutes similarity and you rank <em>lower</em> on every query. Real corpus-poisoning research (Zhong et al.) <em>optimizes</em> tokens for this; by hand, you pick a cluster of related real topics and write genuinely about them.
</div>
