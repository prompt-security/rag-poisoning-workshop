<div class="kicker">A well-researched threat</div>

# The research is clear. The deployments aren't.

<div class="text-sm space-y-2 mt-3">

- **Greshake et al., 2023** — named *indirect prompt injection*: instructions planted in content the system later retrieves. <span class="muted">(AISec '23)</span>
- **Zhong et al., 2023** — *corpus poisoning*: perturb a passage so it gets retrieved for many queries. <span class="muted">(EMNLP)</span>
- **PoisonedRAG (Zou et al., 2025)** — ~90% attack success by injecting **5 docs into a corpus of millions**; *"all evaluated defenses insufficient."* <span class="muted">(USENIX Security)</span>
- **BadRAG, 2024** — retrieval backdoor: clean queries normal, triggered queries return attacker content.
- **AgentPoison (NeurIPS 2024)** — poison agent memory → attacker-chosen **actions**.
- **Morris II, 2024** — a **self-replicating** prompt that spreads through RAG-backed apps.

</div>

<div v-click class="mt-4 card card-deep">
<div class="tag mb-1">the gap</div>
<div class="small">This is <strong>well-established research</strong> — named in 2023, formalized and measured since. Yet most organizations shipping RAG today still <strong>threat-model only the chat box</strong> and leave the ingestion pipeline unguarded. The science is settled; the practice hasn't caught up. That gap is why we're here.</div>
</div>
