#!/usr/bin/env python3
"""
Embed MP4 videos into specific slides of a Slidev-exported PPTX.

Slidev exports each slide as a full-bleed image, so its recording slides are blank
(the asciinema player is a live-only web component). This overlays a real, playable
MP4 movie object on the placeholder area of those slides.

Usage:
  embed_pptx_videos.py deck.pptx  17:hidden_parrot.mp4:hidden_parrot.png  43:ps_fuzz.mp4:ps_fuzz.png

Each SPEC is  <1-based-slide-number>:<mp4-path>:<poster-image-path>
The movie is placed centered, sized to sit over the placeholder card.
"""
import sys
from pptx import Presentation
from pptx.util import Emu
from copy import deepcopy
from lxml import etree

def add_autoplay(movie_shape, slide):
    """Best-effort: mark the embedded media to auto-play on slide entry."""
    try:
        # find the media's shape id
        sp = movie_shape._element
        nvPr = sp.find('.//{http://schemas.openxmlformats.org/presentationml/2006/main}nvPr')
        # The timing autoplay node is complex; PowerPoint plays click-to-start by default.
        # We leave click-to-start (reliable across versions) rather than emit fragile timing XML.
    except Exception:
        pass

def main():
    pptx_path = sys.argv[1]
    specs = []
    for arg in sys.argv[2:]:
        num, mp4, poster = arg.split(':', 2)
        specs.append((int(num), mp4, poster))

    prs = Presentation(pptx_path)
    sw, sh = prs.slide_width, prs.slide_height
    n_slides = len(prs.slides.__iter__.__self__._sldIdLst)  # count
    slides = list(prs.slides)

    # placement: centered box over the placeholder area
    box_w = int(sw * 0.60)
    box_h = int(sh * 0.46)
    left = int((sw - box_w) / 2)
    top = int(sh * 0.34)

    for num, mp4, poster in specs:
        idx = num - 1
        if idx < 0 or idx >= len(slides):
            print(f"  ! slide {num} out of range (deck has {len(slides)} slides) — skipping", file=sys.stderr)
            continue
        slide = slides[idx]
        slide.shapes.add_movie(
            mp4, left, top, box_w, box_h,
            poster_frame_image=poster, mime_type='video/mp4',
        )
        print(f"  embedded {mp4} on slide {num}")

    prs.save(pptx_path)
    print(f"  saved {pptx_path}")

if __name__ == '__main__':
    main()
