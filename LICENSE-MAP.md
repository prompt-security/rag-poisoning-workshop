# Which license covers what

This repository is **dual-licensed**. The split follows the nature of the material: the workshop is
mostly teaching content, with a small amount of build tooling around it.

| Material | License | Full text |
|---|---|---|
| **Content** — slides, workshop docs, recordings | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [`LICENSE-CONTENT`](LICENSE-CONTENT) |
| **Code** — build scripts, CI workflows, styles, config | [AGPL-3.0-only](https://www.gnu.org/licenses/agpl-3.0.html) | [`LICENSE`](LICENSE) |

## Content — CC BY-SA 4.0

Everything you would present, read, or adapt as teaching material:

```
workshop/*.md                        the run-of-show, content outline, preflight guide,
                                     build list, decisions/risks
workshop/README.md
workshop/slides/slides.md            deck headmatter + slide includes
workshop/slides/slides/*.md          the 45 individual slides
workshop/slides/README.md
workshop/slides/public/*_rec         the two asciinema recordings
README.md, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, LICENSE-MAP.md
```

**What this means for you:** run the workshop, translate it, remix it, present it commercially — all
fine. You must (a) give attribution, and (b) release your adapted version under CC BY-SA 4.0 too.

## Code — AGPL-3.0-only

Everything that exists to build, export or publish the deck:

```
.github/workflows/*.yml              Pages, release and PR-validation pipelines
workshop/slides/scripts/*            make-videos.sh, split-slides.mjs,
                                     find-video-slides.mjs, cast_v3_to_v2.py,
                                     embed_pptx_videos.py
workshop/slides/styles/index.css     theme and layout
workshop/slides/package.json         build configuration
workshop/slides/package-lock.json
.gitignore
```

## Not covered by either grant

Prompt Security names, logos and brand assets — `workshop/slides/public/prompt-logo.png` and
`workshop/slides/public/prompt-icon.svg`, and the brand palette in `styles/index.css`. These are
trademarks. You may redistribute the deck unmodified, but do not use the marks to imply endorsement
of or affiliation with a derivative work. If you adapt the deck, swap in your own branding.

Third-party material (fonts, the asciinema-player stylesheet, cited research) keeps its own terms —
see [`NOTICE`](NOTICE).

## If a file isn't listed

Treat a Markdown file as **content** and anything executable or build-related as **code**. If it is
genuinely ambiguous, open an issue and we will clarify it here.

## Attribution

```
"The Poisoned Pill — Turning Your Crewmate into a Pirate" by SentinelOne,
licensed under CC BY-SA 4.0.
https://github.com/prompt-security/rag-poisoning-workshop
```
