---
layout: center
---

<div class="kicker">The canonical run · projected reference</div>

# Recorded: clean → poisoned, end to end

<div class="muted small text-center mb-2">
Real capture from the PoC — five queries clean, then the same five against the poisoned corpus: <strong>4/5 go pirate.</strong> A reference for anyone whose local run is still coming up.
</div>

<RenderWhen context="print">

<div class="card" style="max-width:760px;margin:0.5rem auto 0;text-align:center">
<div class="tag mb-2">▶ recorded terminal session</div>
<div class="small">This capture plays in the <strong>Slidev</strong> deck and the <strong>PowerPoint (.pptx)</strong> export. A static PDF can't hold a video — open the <code>.pptx</code> or run the deck to watch the clean → poisoned run.</div>
</div>

<template #fallback>
<div class="asciinema-player-wrapper">
<Asciinema src="hidden_parrot_rec" :playerProps="{ autoPlay: true, loop: true, controls: true, speed: 1.4, rows: 18, cols: 111, fit: 'width', terminalFontSize: 'small', theme: 'asciinema', idleTimeLimit: 2 }" />
</div>
</template>

</RenderWhen>

<!--
Live view: asciinema plays with visible controls (speed 1.4, idle capped at 2s so the long inference
waits don't drag). PDF export (print context): a placeholder card. The PPTX build embeds a real MP4 here
(see .github/workflows/release.yml). Video slide id: hidden_parrot_rec.
-->
