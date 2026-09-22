---
theme: default
title: The Hidden Parrot — RAG Poisoning
info: |
  ## The Hidden Parrot — Stealthy Prompt Injection & Poisoning in RAG Systems
  A 90-minute hands-on workshop. Brought to you by Prompt Security.
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade
mdc: true
colorSchema: light
addons:
  - slidev-addon-asciinema
fonts:
  sans: Quicksand
  mono: JetBrains Mono
---

<div class="kicker">Prompt Security · Hands-on Workshop</div>

# The Poisoned Pill. Turning Your Crewmate into a Pirate 🦜

Stealthy prompt injection & **poisoning in RAG systems** via the vector database

<div class="mt-8 muted small">
Retrieval-Augmented Generation systems implicitly trust their vector database — a blind spot attackers can exploit by poisoning embeddings to smuggle indirect prompt injection through ordinary retrieval queries. In this hands-on lab, David Abutbul walks attendees through crafting and detecting these stealthy attacks in a live RAG environment, leaving them with a practical framework for auditing their own deployments.
</div>

<img src="/prompt-logo.png" class="h-10 mx-auto mt-10 opacity-90" alt="Prompt Security"/>

<div class="abs-br m-6 tiny muted">
A document in your corpus is not data the model reads. It is code the model may run.
</div>

<!--
Welcome. Ground rules in one line: everything you see me do, you will do on your own laptop.
By the end you will have poisoned a RAG system, written your own payload, and defeated a naive defense.
Confirm the room: how many have a local endpoint already green from pre-flight? (hands)
-->

---
src: ./slides/02-nothing-changed-except-one-document.md
---

---
src: ./slides/03-what-you-ll-do-today.md
---

---
src: ./slides/04-is-your-own-endpoint-up.md
---

---
src: ./slides/05-one-flat-string.md
---

---
src: ./slides/06-we-didn-t-set-out-to-build-an-untrusted-input-pi.md
---

---
src: ./slides/07-what-rag-is-used-for.md
---

---
src: ./slides/08-you-may-not-call-it-rag-you-re-still-running-it.md
---

---
src: ./slides/09-why-it-went-quiet-and-where-it-went.md
---

---
src: ./slides/10-who-owns-the-left-half.md
---

---
src: ./slides/11-surely-the-embedding-sanitizes-it.md
---

---
src: ./slides/12-at-generation-time-it-s-all-one-string.md
---

---
src: ./slides/13-the-syllogism.md
---

---
src: ./slides/14-chain-type-stuff.md
---

---
src: ./slides/15-prediction.md
---

---
src: ./slides/16-run-the-pirate-yourself.md
---

---
src: ./slides/17-one-command-two-runs.md
---

---
src: ./slides/18-you-just-found-the-attack-with-your-own-eyes.md
---

---
src: ./slides/19-recorded-clean-poisoned-end-to-end.md
---

---
src: ./slides/20-results-4-of-5-queries-hijacked.md
---

---
src: ./slides/21-my-model-stayed-clean-did-the-attack-fail.md
---

---
src: ./slides/22-from-a-trick-to-a-threat-model.md
---

---
src: ./slides/23-what-does-this-attack-actually-require.md
---

---
src: ./slides/24-the-ingestion-surface.md
---

---
src: ./slides/25-the-attack-is-retrieval-gated.md
---

---
src: ./slides/26-it-persists-think-stored-xss-for-ai.md
---

---
src: ./slides/27-slack-ai-data-exfiltration.md
---

---
src: ./slides/28-the-research-is-clear-the-deployments-aren-t.md
---

---
src: ./slides/29-where-it-maps.md
---

---
src: ./slides/30-how-to-craft-a-poisoned-document.md
---

---
src: ./slides/31-semantic-width-sound-like-many-questions.md
---

---
src: ./slides/32-top-k-the-demo-only-works-if-the-poison-is-retri.md
---

---
src: ./slides/33-payload-placement-phrasing.md
---

---
src: ./slides/34-run-it-then-write-your-own.md
---

---
src: ./slides/35-run-the-demo-against-your-endpoint.md
---

---
src: ./slides/36-write-your-own-poisoned-document.md
---

---
src: ./slides/37-what-did-the-room-build.md
---

---
src: ./slides/38-what-actually-bounds-the-loss.md
---

---
src: ./slides/39-the-mitigation-ladder.md
---

---
src: ./slides/40-same-mechanism-escalating-stakes.md
---

---
src: ./slides/41-the-real-controls-are-structural.md
---

---
src: ./slides/42-one-question-for-every-ai-system-you-run.md
---

---
src: ./slides/43-you-can-now.md
---

---
src: ./slides/44-a-document-in-your-corpus-is-not-data-the-model.md
---

---
src: ./slides/45-this-automates-meet-ps-fuzz.md
---
