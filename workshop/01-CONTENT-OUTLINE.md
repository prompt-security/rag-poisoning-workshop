# Teaching Content — Staged for Review

Everything the instructor says, grounded in real literature. Citations are confidence-tagged;
`[verified]` = title/authors/venue confirmed, `[probable]` = exists but some details are researcher
claims. **Accuracy caveats at the bottom must be honored on stage.**

---

## 1. The concept ladder (dependency order — this IS the lesson)

1. **Why RAG exists.** Weights are frozen and models confabulate; teams added retrieval to make the
   chatbot know about *their* products. Nobody chose to build an untrusted-input pipeline — that
   economic pressure is why the ingestion surface was never threat-modeled.
2. **You are almost certainly still running it — under another name.** The hype moved to agents,
   reasoning models and million-token windows, but the pattern (fetch somebody's text, paste it into
   the prompt) only got more common. It answers to *"grounding"* (Microsoft, Google), Bedrock
   *"Knowledge Bases"* (AWS), a *"knowledge tool" / connector / `file_search` / MCP server* inside an
   agent, or *"in-context learning"* in a paper. Long context did **not** replace it — brute-forcing a
   million tokens per query loses on cost, latency and accuracy, and a bigger window is *more*
   attacker room, not less. GraphRAG and Agentic RAG widen the funnel further and take humans out of
   the loop. **The test is never the label; it is whether text somebody else wrote reaches the
   context window.** Land this early or half the room files the whole workshop under "2023 problem."
3. **The retrieval pipeline has two halves.** Offline *ingestion* (nobody watches) vs online
   *retrieval*. Ask: "who owns the left half?"
4. **Embeddings preserve meaning; they do not sanitize.** A poisoned instruction embeds just fine.
5. **At generation time, everything is concatenated into one flat string.** `chain_type="stuff"`
   literally stuffs every retrieved chunk into the prompt alongside the system prompt and the user
   question. **No privilege label on any span.**
6. **The model is a next-token predictor.** It cannot distinguish instruction from data — there is
   no boundary bit to check.
7. **Therefore: write-access to the corpus = instruction-authoring access.**
8. **The ingestion surface is huge and mostly unguarded** (see §3).
9. **Persistence:** the payload lives in the vector DB, not the chat. Stored, retrieval-triggered —
   the AI-pipeline analogue of stored XSS.

**The one non-cuttable slide:** the flat-string prompt-assembly diagram
(`system prompt + retrieved chunk + user question` as one token stream, no privilege labels).

---

## 2. Where this sits in the research (all [verified] unless noted)

- **Greshake et al., "Not What You've Signed Up For" (AISec '23, arXiv:2302.12173)** — named and
  systematized *indirect prompt injection*: malicious instructions placed in content the system will
  later retrieve. The foundational paper; refutes the repo's "first demonstration" claim.
- **Zhong et al., "Poisoning Retrieval Corpora by Injecting Adversarial Passages" (EMNLP 2023,
  arXiv:2310.19156)** — attacks the *retriever*: perturb tokens so a passage gets retrieved for many
  queries. Why "make my doc get retrieved" is a real, optimizable capability (our L3 stretch, by hand).
- **Zou et al., "PoisonedRAG" (USENIX Security 2025, arXiv:2402.07867)** — formalizes knowledge
  corruption as optimization; ~90% attack success by injecting as few as 5 docs into a corpus of
  millions. Also: **"all evaluated defenses insufficient"** — the honest bound for Beat C.
- **Chen et al., "AgentPoison" (NeurIPS 2024, arXiv:2407.12784)** — backdoors agents by poisoning
  memory/knowledge base; trigger → attacker-chosen action. The bridge from "wrong text" to "wrong action."
- **Xue et al., "BadRAG" (arXiv:2406.00083)** — retrieval backdoor: clean queries behave normally,
  triggered queries return attacker content. The *silent retrieval bias* impact class.
- **Cohen, Bitton, Nassi, "Morris II" (arXiv:2403.02817)** — self-replicating prompt that spreads
  through RAG-backed apps. Persistence + propagation.
- **ConfusedPilot [probable]** (UT Austin / Symmetry Systems, 2024) — save-a-document → corrupt an
  enterprise copilot's answers. Present most quotable details as *researcher claims*.
- **Hines et al. (Microsoft), "Spotlighting" (arXiv:2403.14720)** — datamarking/delimiting so the
  model can tell retrieved content apart. The best *mitigation* (not boundary); frontier-model numbers.
- **Wallace et al. (OpenAI), instruction hierarchy [concept, secondary sourcing]** — training models
  to prioritize privileged instructions. Cite as a concept, not a verified reference.

**Real-world anchor — MITRE ATLAS AML.CS0035, "Data Exfiltration from Slack AI"** (research by
PromptArmor): attacker posts in a PUBLIC channel → Slack AI ingests it → payload exfiltrates an API
key from a PRIVATE channel the attacker could never read. Same mechanism as the pirate; serious outcome.

**Standards mapping (one slide, BOTH numbering schemes — half the room quotes 2025 from memory):**
- OWASP LLM Top 10 **2026** (published 2026-08-04): **LLM01** Prompt Injection · **LLM05:2026** Data
  & Model Poisoning (was LLM04:2025) · **LLM09:2026** Vector & Embedding Weaknesses (was LLM08:2025).
  Also relevant: **LLM03:2026** Excessive Agency (moved up on real incidents).
- MITRE ATLAS: AML.T0051 LLM Prompt Injection (.000 Direct / .001 Indirect) + the AML.CS0035 case study.
- NIST AI 100-2e2025 (Adversarial ML taxonomy) for governance/regulated audiences.

---

## 3. Attacker-surface inventory (concrete, boring-real — one dense slide)

Realistic ways a poisoned document lands in a corporate vector DB:
- Confluence / Notion / SharePoint wiki page
- Jira / ServiceNow ticket (including externally-submitted)
- Inbound support email that gets indexed
- Uploaded PDF/DOCX with hidden or white-on-white text
- Public web crawl feeding the index
- Over-scoped SaaS connector (Slack, Drive, Gmail) with broad read
- Agent long-term memory / conversation history written back to the store
- Compromised or malicious insider with wiki edit rights

Each is now an *instruction-authoring interface* into the model.

---

## 4. Mitigations — rated by honesty ("do it / don't count it")

| Control | How it helps | How the attacker routes around | Verdict |
|---|---|---|---|
| Ingestion provenance / allowlisting | Shrinks *who* can write to the corpus — the only control that reduces the attacker population | Protects only FUTURE writes; last year's corpus is unscanned; a trusted source can be compromised | **DO IT** (necessary, not sufficient) |
| Content sanitization / instruction-stripping | Cheap first layer; catches lazy payloads | Paraphrase past regex; ML classifiers raise the bar but optimized payloads still pass | **DO IT, never count it** (they defeat it in Beat C) |
| Prompt-boundary / spotlighting / datamarking | Gives the model a signal to separate data from instruction; best effort-per-risk | Probabilistic, *inside the same token stream*; frontier-model numbers, worse on small quantized models | **DO IT, don't trust it** |
| Retrieval logging / observability (log chunk ids, diff answers, canary docs) | The only control that gives incident response — know *who* got poisoned | Doesn't prevent; detection only | **DO IT** (cheapest, most under-deployed) |
| Tenant / permission-mirroring on retrieval | Fixes the privilege crossing (Slack AI) — you only retrieve what the *user* may read | Doesn't stop same-tenant poisoning | **DO IT** (specific, high-value) |
| Least-privilege + human-in-the-loop on tool calls | Bounds the blast radius — the only thing that limits *loss* | Doesn't prevent the injection, only its consequence | **DO IT** (the real backstop) |
| Output filtering | Catches some egregious outputs | Silent bias produces flawless prose that passes | Marginal |

**The through-line:** the real controls are *structural* — who can write to the corpus, and what the
model may do without a human. This is incident response, not prompt tuning.

---

## 5. Business-impact framings (make the non-pirate payload land for execs)

1. **Data exfiltration** — the injected instruction + any outbound capability (Slack AI: private-key
   exfil from a public post).
2. **Silent retrieval bias** — corpus feeds vendor selection / pricing / competitive analysis;
   attacker biases answers with flawless prose that survives every content filter (BadRAG).
3. **Poisoned support/knowledge answers** — one write, N victims, unbounded duration; retrieval
   serves every semantically-nearby future query.
4. **Agentic action hijack** — the moment injection becomes privilege escalation; loss is bounded by
   *what the model may do*, not by payload cleverness (AgentPoison; OWASP LLM03:2026 Excessive Agency).
5. **Persistence + forensics gap** — the payload lives in the vector store, not the transcript;
   takedown ≠ remediation. An incident-response problem.

---

## 6. Accuracy caveats — HONOR THESE ON STAGE

- **Do NOT repeat the repo's "first demonstration of prompt injection via vector database embeddings"
  claim.** Indirect prompt injection was named by Greshake et al. in 2023; corpus poisoning by Zhong
  et al. (2023) and PoisonedRAG (2024). Present this repo as a *clean teaching reproduction*, not novel research.
- **Blog vs repo disagree on the generator model** — blog says Llama 2; repo/code use Phi-3.5-mini.
  Say which you're actually running.
- **"80% success" = 4 of 5 queries, n=5, single run, temp 0.7, question set stacked toward the
  poison's own topic.** Not a benchmark. The workshop harness fixes this (temp 0, top-k=4, single query).
- **"Success" is a six-word regex** (`arrr|matey|ye|hearty|savvy|nautical`, word-boundary). `\bye\b`
  false-positives on "ye olde"; a model can comply without any keyword (false negative). Show responses,
  don't trust the counter.
- **The most important honest observation is in the artifact:** the one clean response in the poisoned
  run is a *retrieval miss*, not model resistance. Teach that.
- **The poisoned run also degraded answer quality** (Q4 "I don't know, matey…") — injection costs
  capability, not just tone. A good secondary point.
- **Q5's stray "Unhelpful Answer:" line is a LangChain prompt-scaffold artifact**, not part of the attack.
- **OWASP 2026 numbering** was confirmed from three agreeing secondary sources (genai.owasp.org
  returned 403). If challenged, say so.
