#!/usr/bin/env python3
"""
Convert an asciicast v3 recording to v2 so tools like `agg` (which expect v2) can read it.

v3 → v2 differences handled:
  - header: {"version":3,"term":{"cols":C,"rows":R,...}}  →  {"version":2,"width":C,"height":R,...}
  - event timestamps: v3 are INTERVALS (relative to previous event); v2 are ABSOLUTE (since start).

Usage: cast_v3_to_v2.py input_v3.cast output_v2.cast
"""
import json, sys

def main():
    src, dst = sys.argv[1], sys.argv[2]
    with open(src) as f:
        lines = [ln for ln in f.read().splitlines() if ln.strip()]

    header = json.loads(lines[0])
    if header.get("version") == 2:
        # already v2 — copy through
        with open(dst, "w") as o:
            o.write("\n".join(lines) + "\n")
        return

    term = header.get("term", {})
    out_header = {"version": 2}
    if "cols" in term or "width" in header:
        out_header["width"] = term.get("cols", header.get("width"))
    if "rows" in term or "height" in header:
        out_header["height"] = term.get("rows", header.get("height"))
    for k in ("timestamp", "idle_time_limit", "env", "title"):
        if k in header:
            out_header[k] = header[k]
    # carry the terminal theme if present (agg can use it)
    if "theme" in term:
        out_header["theme"] = term["theme"]

    out = [json.dumps(out_header)]
    t = 0.0
    for ln in lines[1:]:
        ev = json.loads(ln)
        # v3 event: [interval, code, data]
        interval, code, data = ev[0], ev[1], ev[2]
        t += float(interval)
        out.append(json.dumps([round(t, 6), code, data]))

    with open(dst, "w") as o:
        o.write("\n".join(out) + "\n")

if __name__ == "__main__":
    main()
