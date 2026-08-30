#!/usr/bin/env bash
# Turn the asciinema casts in public/ into low-quality MP4s (+ poster PNGs) for the PPTX export.
# Requires: agg (asciinema gif generator), ffmpeg, python3.
# Usage: scripts/make-videos.sh <output_dir>
set -euo pipefail

OUT="${1:?usage: make-videos.sh <output_dir>}"
HERE="$(cd "$(dirname "$0")" && pwd)"
PUBLIC="$HERE/../public"
mkdir -p "$OUT"

# recording id : agg speed : agg idle cap
CASTS=(
  "hidden_parrot_rec:1.4:2"
  "ps_fuzz_rec:1.6:2"
)

for spec in "${CASTS[@]}"; do
  id="${spec%%:*}"; rest="${spec#*:}"; speed="${rest%%:*}"; idle="${rest##*:}"
  echo "▶ $id  (speed=$speed idle=$idle)"
  python3 "$HERE/cast_v3_to_v2.py" "$PUBLIC/$id" "$OUT/$id.v2.cast"
  agg --theme asciinema --font-size 18 --speed "$speed" --idle-time-limit "$idle" \
      "$OUT/$id.v2.cast" "$OUT/$id.gif"
  # low-quality, small, even dimensions, web-friendly
  ffmpeg -y -loglevel error -i "$OUT/$id.gif" -movflags +faststart -pix_fmt yuv420p \
      -vf "scale='min(960,trunc(iw/2)*2)':-2" -crf 32 "$OUT/$id.mp4"
  ffmpeg -y -loglevel error -i "$OUT/$id.mp4" -frames:v 1 -update 1 "$OUT/$id.poster.png"
  echo "  → $OUT/$id.mp4 ($(du -h "$OUT/$id.mp4" | cut -f1))"
done
echo "✓ videos ready in $OUT"
