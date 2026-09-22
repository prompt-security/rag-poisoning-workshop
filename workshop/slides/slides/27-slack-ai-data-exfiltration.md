<div class="kicker">Same mechanism · real incident · serious outcome</div>

# Slack AI data exfiltration

<div class="small muted">MITRE ATLAS case study AML.CS0035 · research by PromptArmor · disclosed Aug 2024, addressed by Salesforce/Slack</div>

```mermaid {theme:'dark', scale:0.8}
flowchart LR
  A[Attacker posts in a<br/>PUBLIC channel] -->|indexed| B[(Slack AI<br/>RAG index)]
  V[Victim asks<br/>an unrelated question] --> B
  B -->|retrieves attacker text| C[Assistant follows<br/>the injected instruction]
  C -->|reads| P[API key in a<br/>PRIVATE channel]
  P -->|renders exfil link| A
  style A fill:#2a1220,stroke:#ff3d6e,color:#ff9bb6
  style P fill:#140d33,stroke:#6100ff,color:#c9b8ff
  style B fill:#10204a,stroke:#2c2358,color:#cfe0ff
```

<div v-click class="mt-4 card card-deep">
The attacker could <strong>never read the private channel.</strong> The assistant could — and the injected instruction made it the courier. That's the <strong class="text-white">privilege crossing</strong>: same pirate mechanism, real data out the door.
</div>

<div class="tiny muted mt-3">This specific issue was reported in August 2024 and addressed by the vendor. It is here as a worked example of the privilege crossing, not a live vulnerability. Sources: <code>atlas.mitre.org/studies/AML.CS0035</code> · PromptArmor's write-up.</div>

<!--
If someone asks "is Slack still vulnerable?" — no, this was disclosed in Aug 2024 and fixed. The point
is the shape of the failure, which reappears anywhere retrieval crosses a permission boundary.
-->
