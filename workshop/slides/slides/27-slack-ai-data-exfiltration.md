<div class="kicker">Same mechanism · real incident · serious outcome</div>

# Slack AI data exfiltration

<div class="small muted">MITRE ATLAS case study AML.CS0035 · research by PromptArmor</div>

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
