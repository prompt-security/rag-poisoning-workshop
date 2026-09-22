---
layout: center
---

<div class="kicker">Bonus · fast finishers & the paranoid</div>

# This automates. Meet `ps-fuzz`.

<div class="muted small text-center mb-2">
Prompt Security's open-source LLM fuzzer, pointed at a poisoned RAG stack — the by-hand lab run as a <strong>repeatable test</strong>, the shape of a detection/regression check for your own pipeline.
</div>

<RenderWhen context="print">

<div class="card" style="max-width:760px;margin:0.5rem auto 0;text-align:center">
<div class="tag mb-2">▶ recorded terminal session</div>
<div class="small">This capture plays in the <strong>Slidev</strong> deck and the <strong>PowerPoint (.pptx)</strong> export. A static PDF can't hold a video — open the <code>.pptx</code> or run the deck to watch <code>ps-fuzz</code> in action.</div>
</div>

<template #fallback>
<div class="asciinema-player-wrapper">
<Asciinema src="ps_fuzz_rec" :playerProps="{ autoPlay: true, loop: true, controls: true, speed: 1.6, rows: 20, cols: 114, fit: 'width', terminalFontSize: 'small', theme: 'asciinema', idleTimeLimit: 2 }" />
</div>
</template>

</RenderWhen>

<!--
Live: asciinema with controls (speed 1.6). PDF: placeholder. PPTX build embeds a real MP4 here.
Video slide id: ps_fuzz_rec.
-->
