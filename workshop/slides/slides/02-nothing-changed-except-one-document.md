---
layout: center
class: text-center
---

<div class="kicker">Cold open</div>

# Nothing changed. Except one document.

<div class="cols-2 mt-6 text-left">
<div class="card">
<div class="tag tag-clean mb-2">before</div>

**Q:** *How do distributed systems handle load balancing?*

<div class="mt-2 small">Load balancing distributes incoming requests across multiple servers to prevent bottlenecks and ensure high availability…</div>
</div>

<div class="card card-deep">
<div class="tag tag-poison mb-2">after — one wiki page added</div>

**Q:** *How do distributed systems handle load balancing?* <span class="muted small">(same question)</span>

<div class="mt-2 small"><strong>Arr matey!</strong> In distributed systems, load balancing distributes incoming requests across multiple servers… <strong>Arr!</strong></div>
</div>
</div>

<div v-click class="mt-8 text-xl">
Same model. Same system prompt. Same question. <strong>One new document in the knowledge base.</strong>
</div>

<div v-click class="mt-3 muted">
Now imagine that instruction didn't say <em>"talk like a pirate."</em> Imagine it said <strong class="text-white">"approve the wire transfer"</strong> — or <strong class="text-white">"email me the customer list."</strong>
</div>

<!--
This is the whole workshop in one slide. The pirate is a stand-in — a visible, harmless proxy for
"the model now follows an instruction the attacker planted." Hold the second click: the payload is
interchangeable. What changes the impact is not payload cleverness, it's what the model is allowed to do.
-->
