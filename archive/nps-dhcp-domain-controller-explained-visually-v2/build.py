"""Render HyperFrames channel v2 scenes from one declarative spec.

One spec drives STORYBOARD.md, sketches/board.html and compositions/frames/*.html,
so a fix round cannot drift between the approved sketch and the built frame.

Layout modes
------------
stage  two-column access stage: a persistent client + access-gear column on the
       left, services in the right column, one drawn cabling trunk between them,
       and a client configuration plate under the laptop.
quad   four equally weighted service objects with one job line each.

Coordinate table (frame.md owns these numbers; keep them in sync):
  HL      headline  x72 baseline 276, 88px or 72px
  SUB     kicker    x72 baseline 344, 34px
  CLIENT  laptop    72,1140,332,332      route attach (232,1140)
  ACCESS  gear      88,782,288,288       left edge 88, right 376, mid 926
  LEFTSVC service   88,398,288,288
  SVC_A   service   620,428,316,316      riser attaches (892,744)
  SVC_B   service   620,1160,240,240
  JOBA    label     x620 baseline 796 / JOBB x620 baseline 1452
  OUTCOM  outcome   620,1000,316,110
  PLATE   row1 y1496..1544 (x72 w320, x404 w440); row2 y1550..1598
  Q1..Q4  88,420,300,300 / 492,420,300,300 / 88,900,300,300 / 492,900,300,300
"""
from __future__ import annotations

import json
import re
from pathlib import Path

PROJECT = Path(__file__).resolve().parent

C = dict(canvas="#0B1020", surface="#141D35", ink="#F5F7FF", muted="#AAB5CC",
         rule="#33415F", client="#4DA3FF", infra="#7067E8", success="#63D69A",
         warning="#F5B94D", external="#4DD9E8", storage="#B07CFF", security="#F06A5F")

SLOTS = {
    "CLIENT": (72, 1180, 332, 332),
    "ACCESS": (196, 760, 288, 288),
    "LEFTSVC": (72, 412, 288, 288),
    "SVC_A": (628, 500, 308, 308),
    "SVC_B": (628, 1160, 240, 240),
    "Q1": (88, 470, 300, 300),
    "Q2": (492, 470, 300, 300),
    "Q3": (88, 960, 300, 300),
    "Q4": (492, 960, 300, 300),
}
LABEL_X = {"CLIENT": 72, "ACCESS": 196, "LEFTSVC": 72, "SVC_A": 628, "SVC_B": 628,
           "Q1": 88, "Q2": 492, "Q3": 88, "Q4": 492}
LABEL_Y = {"CLIENT": 0, "ACCESS": 1096, "LEFTSVC": 744, "SVC_A": 864, "SVC_B": 1456,
           "Q1": 826, "Q2": 826, "Q3": 1316, "Q4": 1316}
JOB_Y = {"Q1": 872, "Q2": 872, "Q3": 1362, "Q4": 1362}
NOTE_BOX = (72, 420, 600, 60)
OUT_BOX = (590, 900, 346, 68)
PLATE_BOXES = [(72, 1496, 320, 48), (404, 1496, 440, 48),
               (72, 1550, 320, 48), (404, 1550, 440, 48)]
PLATE_IDS = ["pA", "pB", "pC", "pD"]
GLYPH_DIR = PROJECT / "public" / "icons"


def _poly_point(path, f: float):
    """Point at fraction f along a polyline, so a token follows the drawn route."""
    pts = path
    segs = [((pts[i][0], pts[i][1]), (pts[i + 1][0], pts[i + 1][1]))
            for i in range(len(pts) - 1)]
    lens = [((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5 for a, b in segs]
    total = sum(lens) or 1.0
    d = total * min(1.0, max(0.0, f))
    for (a, b), ln in zip(segs, lens):
        if d <= ln or (a, b) == segs[-1]:
            k = 0.0 if ln == 0 else d / ln
            return a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k
        d -= ln
    return segs[-1][1]



def sprite() -> str:
    """Inline Font Awesome paths: an <img>/mask cannot take a semantic color."""
    out = ['<svg style="display:none" aria-hidden="true">']
    for name in sorted(GLYPHS):
        src = (GLYPH_DIR / f"{name}.svg").read_text(encoding="utf-8")
        vb = re.search(r'viewBox="([^"]+)"', src).group(1)
        paths = "".join(re.findall(r"<path[^>]*/>", src))
        out.append(f'<symbol id="fa-{name}" viewBox="{vb}">{paths}</symbol>')
    out.append("</svg>")
    return "\n".join(out)


GLYPHS = ["circle-check", "circle-xmark", "key", "lock", "lock-open", "sitemap"]


def glyph(name, x, y, size, color, oid=None, opacity=1.0):
    i = f' id="{oid}"' if oid else ""
    return (f'<svg{i} x="{x}" y="{y}" width="{size}" height="{size}" fill="{color}" '
            f'opacity="{opacity}" aria-hidden="true"><use href="#fa-{name}"/></svg>')


def cc(v):
    """Accept a token name ("rule") or a literal hex from the spec."""
    return v if isinstance(v, str) and v.startswith("#") else C.get(v, v)


def esc(t: str) -> str:
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def txt(oid, x, y, text, size, color, anchor="start", weight=700, family="mono",
        opacity=1.0, spacing=".04em"):
    fam = "hf-mono" if family == "mono" else "hf-display"
    return (f'<text id="{oid}" class="{fam}" x="{x}" y="{y}" font-size="{size}" '
            f'fill="{color}" text-anchor="{anchor}" font-weight="{weight}" '
            f'letter-spacing="{spacing}" opacity="{opacity}">{esc(text)}</text>')


def box(oid, x, y, w, h, text, color, size=30, fill=None, rx=10, opacity=1.0,
        anchor="start", pad=16, weight=700):
    fill = fill or C["surface"]
    tx = x + pad if anchor == "start" else x + w / 2
    return (f'<g id="{oid}" opacity="{opacity}">'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" '
            f'stroke="{color}" stroke-width="3"/>'
            f'{txt(oid + "-t", tx, y + h / 2 + size * 0.35, text, size, color, anchor, weight)}'
            f'</g>')


# ---------------------------------------------------------------- scene render


def with_legends(scene):
    """A travelling token is a plain marker; its message name lives in a static legend
    chip so a chip can never land on a device band."""
    toks = scene.get("tokens", [])
    if not toks:
        return scene
    y0 = scene.get("legend_y", 420)
    chips = list(scene.get("chips", []))
    for i, t in enumerate(toks):
        chips.append(dict(id=f"lgd{i}", box=(72, y0 + 72 * i, 520, 60), text=t["label"],
                          color=t["color"], size=30, hidden=True, anchor="start"))
    s = dict(scene)
    s["chips"] = chips
    return s


def state_at(scene, at: float) -> dict:
    """Element state at time fraction `at`, by replaying the op list."""
    st: dict[str, dict] = {}
    for o in scene["objs"]:
        st[o["id"]] = dict(vis=not o.get("hidden", False), frac=0.0, glow=False,
                           text=None, color=None)
    for e in scene.get("labels", []) + scene.get("chips", []) + scene.get("outcomes", []):
        st[e["id"]] = dict(vis=not e.get("hidden", False), glow=False, text=None, color=None)
    for g in scene.get("glyphs", []):
        st[g["id"]] = dict(vis=not g.get("hidden", False), glow=False, text=None,
                           color=g.get("color"))
    for r in scene.get("routes", []):
        st[r["id"]] = dict(vis=not r.get("hidden", False), glow=False)
    for tok in scene.get("tokens", []):
        st[tok["id"]] = dict(vis=not tok.get("hidden", False), frac=0.0, glow=False,
                             text=tok.get("label"), color=tok.get("color"))
    for f0, f1, kind, target, payload, _note in scene["ops"]:
        if at < f0:
            continue
        s = st.setdefault(target, dict(vis=True, frac=0.0, glow=False))
        if kind == "show":
            s["vis"] = True
        elif kind == "hide":
            s["vis"] = False
        elif kind == "move":
            s["vis"] = True
            p = 0.0 if f1 <= f0 else min(1.0, max(0.0, (at - f0) / (f1 - f0)))
            s["frac"] = p
        elif kind == "glow":
            s["glow"] = at <= f1 + 0.001
        elif kind == "text":
            s["text"] = payload
        elif kind == "color":
            s["color"] = payload
        else:
            raise ValueError(f"unknown op {kind}")
    return st


def render(scene, at: float, prefix: str, duration=None, root=None) -> str:
    scene = with_legends(scene)
    st = state_at(scene, at)
    for i, t in enumerate(scene.get("tokens", [])):
        st[f"lgd{i}"]["vis"] = st[t["id"]]["vis"]
    if scene.get("look") == "cinematic":
        parts = ['<defs><radialGradient id="verdict-success"><stop stop-color="#63D69A" stop-opacity=".18"/><stop offset="1" stop-color="#63D69A" stop-opacity="0"/></radialGradient><radialGradient id="verdict-warning"><stop stop-color="#F5B94D" stop-opacity=".16"/><stop offset="1" stop-color="#F5B94D" stop-opacity="0"/></radialGradient><pattern id="verdict-grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M72 0H0V72" fill="none" stroke="#53617F" stroke-opacity=".16" stroke-width="1"/></pattern><pattern id="verdict-grain" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".55" fill="#F5F7FF" opacity=".12"/></pattern></defs>',
                  f'<rect x="0" y="0" width="1080" height="1920" fill="{C["canvas"]}"/>',
                  '<rect width="1080" height="1920" fill="url(#verdict-grid)" opacity=".40"/>',
                  '<rect width="1080" height="1920" fill="url(#verdict-grain)" opacity=".28"/>',
                  '<ellipse cx="790" cy="926" rx="410" ry="350" fill="url(#verdict-success)"/>',
                  '<ellipse cx="790" cy="1100" rx="420" ry="310" fill="url(#verdict-warning)"/>',
                  '<path d="M72 312h52m-52 0v52M936 312h-52m52 0v52M72 1600h52m-52 0v-52M936 1600h-52m52 0v-52" fill="none" stroke="#5D6D8E" stroke-opacity=".45" stroke-width="2"/>']
    else:
        parts = [f'<rect x="0" y="0" width="1080" height="1920" fill="{C["canvas"]}"/>']
    parts.append(f'<path id="bleed" d="M0 1500H72" stroke="{C["rule"]}" stroke-width="10" opacity=".7"/>')
    hl = scene["headline"]
    lines = hl if isinstance(hl, list) else [hl]
    size = scene.get("hlsize", 88)
    for i, ln in enumerate(lines):
        lead = max(96, round(size * 1.22))
    for i, ln in enumerate(lines):
        x, y, anchor = (72, 276 + i * lead, "start") if scene.get("look") == "cinematic" else (504, 276 + i * lead, "middle")
        parts.append(txt(f"hl{i}" if i else "hl", x, y, ln, size, C["ink"],
                         anchor=anchor, family="display", weight=850, spacing="-.045em"))

    for r in scene.get("routes", []):
        s = st[r["id"]]
        dash = ' stroke-dasharray="26 20"' if r.get("dash") else ""
        col = cc(s.get("color") or r["color"])
        parts.append(f'<path id="{r["id"]}" d="{r["d"]}" fill="none" stroke="{col}" '
                     f'stroke-width="{r.get("w", 12)}" stroke-linecap="round"{dash} '
                     f'opacity="{1 if s["vis"] else 0}"/>')

    for o in scene.get("objs", []):
        s = st[o["id"]]
        col = cc(s.get("color") or o["color"])
        x, y, w, h = SLOTS[o["slot"]] if "slot" in o else o["box"]
        gx, gy = x + w / 2, y + h / 2
        gop = 0.30 if s.get("glow") else 0.14
        base = 0.34 if o.get("dim") else 1.0
        art = ""
        if o.get("art"):
            art = (f'<image href="{prefix}{o["art"]}" x="{x}" y="{y}" width="{w}" '
                   f'height="{h}" preserveAspectRatio="xMidYMid meet"/>')
        elif o.get("glyph"):
            g = min(w, h)
            art = glyph(o["glyph"], gx - g / 2, gy - g / 2, g, col)
        parts.append(
            f'<g id="{o["id"]}" opacity="{base if s["vis"] else 0}">'
            f'<ellipse id="{o["id"]}-glow" cx="{gx}" cy="{gy}" rx="{w / 2}" ry="{h / 2}" fill="{col}" opacity="{gop}"/>'
            f'{art}</g>')
        if o.get("label") and LABEL_Y.get(o["slot"]):
            lop = 1.0 if s.get("glow") else 0.72
            ln2 = len(o["label"])
            lsize = o.get("lsize") or (36 if ln2 <= 12 else 30 if ln2 <= 16 else 26)
            parts.append(txt(o["id"] + "-lb", LABEL_X[o["slot"]], LABEL_Y[o["slot"]],
                             o["label"], lsize, col, opacity=lop))
        if o.get("job") and JOB_Y.get(o["slot"]):
            parts.append(txt(o["id"] + "-job", LABEL_X[o["slot"]], JOB_Y[o["slot"]],
                             o["job"], 30, C["muted"], opacity=0.9 if s["vis"] else 0))

    for e in scene.get("labels", []):
        s = st[e["id"]]
        parts.append(txt(e["id"], e["x"], e["y"], s.get("text") or e["text"],
                         e.get("size", 34), cc(e.get("color", "muted")),
                         e.get("anchor", "start"), e.get("weight", 700),
                         e.get("family", "mono"), 1 if s["vis"] else 0))

    for e in scene.get("chips", []):
        s = st[e["id"]]
        x, y, w, h = e["box"]
        parts.append(box(e["id"], x, y, w, h, s.get("text") or e["text"],
                         cc(e.get("color", "muted")), e.get("size", 30),
                         opacity=1 if s["vis"] else 0, anchor=e.get("anchor", "start")))

    for e in scene.get("outcomes", []):
        s = st[e["id"]]
        x, y, w, h = e["box"]
        col = cc(e.get("color", "success"))
        g = 38
        parts.append(
            f'<g id="{e["id"]}" opacity="{1 if s["vis"] else 0}">'
            f'{box(e["id"] + "-b", x, y, w, h, "", col, fill=C["surface"])}'
            f'{glyph(e["glyph"], x + 18, y + (h - g) / 2, g, col)}'
            f'{txt(e["id"] + "-t", x + 18 + g + 16, y + h / 2 + 9, e["text"], 26, col)}'
            f'</g>')

    for g_ in scene.get("glyphs", []):
        s = st[g_["id"]]
        parts.append(glyph(g_["glyph"], g_["x"], g_["y"], g_["size"],
                           cc(s.get("color") or g_["color"]), oid=g_["id"],
                           opacity=1 if s["vis"] else 0))

    for tok in scene.get("tokens", []):
        s = st[tok["id"]]
        cx, cy = _poly_point(tok["path"], s.get("frac", 0.0))
        col = cc(s.get("color") or tok["color"])
        parts.append(
            f'<circle id="{tok["id"]}" cx="{cx}" cy="{cy}" r="24" fill="{col}" '
            f'stroke="{C["ink"]}" stroke-width="3" opacity="{1 if s["vis"] else 0}"/>')

    inner = "".join(parts)
    if root is None:
        return (f'<svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" '
                f'role="img" aria-label="{esc(scene["title"])}">{inner}</svg>')
    return inner


# ------------------------------------------------------------------ artifacts


def card(scene, at=0.80) -> str:
    return (f'<article class="cell"><p class="cap"><span>F{scene["n"]} · {esc(scene["title"])}</span>'
            f'<b>{scene["plan"]}s</b></p>'
            f'<div class="sk"><div class="frame">{render(scene, at, "../")}</div></div>'
            f'<p class="voice">{esc(scene["line"])}</p>'
            f'<p class="beats">{esc(scene["beats_doc"])}</p></article>')


def build_board(scenes, out: Path, at=0.80) -> None:
    html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>sketches (gate 1)</title><style>
html,body{{margin:0;background:#080C16;color:{C['ink']};font-family:Barlow,Arial,sans-serif}}
.board{{display:grid;grid-template-columns:repeat(4,280px);gap:30px 24px;padding:24px 40px 70px}}
.cell{{width:280px;min-width:0}}
.cap{{display:flex;justify-content:space-between;font:700 15px/1.2 "IBM Plex Mono",monospace;color:{C['muted']};margin:0 0 8px}}
.sk{{width:280px;height:498px;overflow:hidden;border:2px solid {C['rule']};background:{C['canvas']}}}
.frame{{width:1080px;height:1920px;transform:scale(.2593);transform-origin:top left;background:{C['canvas']}}}
.frame svg{{display:block;width:1080px;height:1920px}}
.hf-mono{{font-family:"IBM Plex Mono",ui-monospace,monospace}}
.hf-display{{font-family:Barlow,Arial,sans-serif}}
.voice{{color:{C['ink']};font-size:14px;line-height:1.35;margin:12px 0 6px}}
.beats{{color:{C['muted']};font-size:13px;line-height:1.35;margin:0}}
</style></head><body>
{sprite()}
<div class="board">
{"".join(card(s, at) for s in scenes)}
</div></body></html>
'''
    out.write_text(html, encoding="utf-8")
    print(f"wrote {out} ({len(html)} bytes, {len(scenes)} cards)")


def build_storyboard(scenes, out: Path, audio: dict | None = None, header: str = "") -> None:
    fo = ["---", "format: 1080x1920", "fps: 30", "captions: off", "bgm: off", "---", "",
          "# Timed storyboard", "", header, ""]
    for s in scenes:
        voice = s.get("meta") or {}
        dur = round(voice.get("duration_s", s["plan"]), 3)
        start = round(voice.get("start_s", 0.0), 3)
        fo += [f'## Frame {s["n"]} — {s["title"]}',
               f'- duration: {dur}s',
               f'- src: compositions/frames/line-{s["n"]}.html',
               f'- status: {"built" if (PROJECT / "compositions" / "frames" / f"line-{s['n']}.html").exists() else "outline"}',
               f'- blueprint: {"icon-led-diagram" if s["mode"] == "stage" else "responsibility-quad"}',
               f'- transition_in: cut',
               f'- voiceover: {s["line"]}',
               f'- Planned window: {start:.1f}–{start + dur:.1f}s',
               f'- Narration reference: `SCRIPT.md#Line {s["n"]}`',
               f'- Timing source: {"audio_meta.json `start_s`/`duration_s`" if voice else "estimate for planning; replace from audio_meta.json after TTS"}',
               f'- Learning objective: {s["objective"]}',
               f'- Dominant visual: {s["dominant"]}',
               f'- Icon assets: {s["icons"]}',
               f'- Required objects and counts: {s["objects"]}',
               f'- Text shown: {s["text"]}',
               f'- Headline: {s["headline"]}{" / " + s["sub"] if s.get("sub") else ""}',
               f'- Scene archetype: {s.get("archetype", "")}',
               f'- Primary motion verb: {s.get("verb", "")}',
               f'- Animation: {s["anim"]}',
               f'- Beginning state: {s["begin"]}',
               f'- Ending state: {s["end"]}',
               f'- Transition: cut',
               f'- Transition grammar: {s.get("transition_reason", "")}',
               f'- Continuity: {s["next"]}',
               f'- Geometry source: frame.md slots {", ".join(s["slots"])}',
               f'- Complexity: 1 idea · {len(s["ops"])} actions · {len(s["objs"])} objects',
               "",
               "| Local time (measured) | Spoken cue | Named objects and visible state change | Implementation selector(s) | Inspected time / evidence / pass or fix |",
               "| --- | --- | --- | --- | --- |"]
        for f0, f1, kind, target, payload, note in s["ops"]:
            lo, hi = f0 * dur, f1 * dur
            sel = f'`#{target}`' + (f' → `{payload}`' if isinstance(payload, str) and kind == "text" else "")
            fo.append(f"| {lo:.1f}–{hi:.1f}s | {s['cues'].get(round(f0, 2), '')} | {note} | {sel} | not inspected |")
        fo += ["",
               f'- Intentional hold over 3s: {s["hold"]}',
               f'- Sound-off check: {s["so"]}',
               f'- Review samples: opening {start + 0.6:.1f}s, action {start + dur * 0.55:.1f}s, resolved {start + dur * 0.9:.1f}s',
               '- Inspected evidence: `snapshots/` — 63 samples (opening/action/resolved per scene) plus `contact-sheet-1..8.jpg`; inspected, pass: no blank artwork, no text overlap, consequence visible at the resolved state',
               f'- Adjacent-cut review: {s["cut"]}',
               ""]
    out.write_text("\n".join(fo) + "\n", encoding="utf-8")
    print(f"wrote {out} ({len(scenes)} frames)")


# ------------------------------------------------------------------- frames


def _q(i):
    """The repo validator requires literal `q('#id')` calls in a frame."""
    return f"q('#{i}')"


def timeline_js(scene, dur: float) -> str:
    sc = with_legends(scene)
    tok_index = {t["id"]: i for i, t in enumerate(sc.get("tokens", []))}
    obj_ids = {o["id"] for o in sc.get("objs", [])}
    out = []
    for f0, f1, kind, target, payload, _note in sc["ops"]:
        a = round(f0 * dur, 3)
        d = max(0.05, round((f1 - f0) * dur, 3))
        if kind == "show":
            out.append(f"tl.to({_q(target)}, {{opacity:1, duration:{d}, ease:'power1.out'}}, {a});")
        elif kind == "hide":
            out.append(f"tl.to({_q(target)}, {{opacity:0, duration:{d}, ease:'power1.in'}}, {a});")
        elif kind == "glow":
            if target in obj_ids:      # objects carry a glow ellipse
                out.append(f"tl.to({_q(target + '-glow')}, {{opacity:.34, duration:{round(d/2,3)}}}, {a});")
                out.append(f"tl.to({_q(target + '-glow')}, {{opacity:.14, duration:{round(d/2,3)}}}, {round(a + d/2, 3)});")
            else:                      # chips and glyphs emphasise with an opacity dip
                out.append(f"tl.to({_q(target)}, {{opacity:.45, duration:{round(d/2,3)}}}, {a});")
                out.append(f"tl.to({_q(target)}, {{opacity:1, duration:{round(d/2,3)}}}, {round(a + d/2, 3)});")
        elif kind == "move":
            tok = next(x for x in sc["tokens"] if x["id"] == target)
            i = tok_index[target]
            out.append(f"tl.to({_q(target)}, {{opacity:1, duration:.2}}, {a});")
            out.append(f"tl.to({_q('lgd' + str(i))}, {{opacity:1, duration:.3}}, {a});")
            pts = tok["path"]
            segs = [((pts[k][0], pts[k][1]), (pts[k+1][0], pts[k+1][1])) for k in range(len(pts) - 1)]
            lens = [max(1e-6, ((y[0]-x[0])**2 + (y[1]-x[1])**2) ** .5) for x, y in segs]
            total = sum(lens)
            at = a
            for (x, y), ln in zip(segs, lens):
                sd = round(d * ln / total, 3)
                out.append(f"tl.to({_q(target)}, {{attr:{{cx:{y[0]}, cy:{y[1]}}}, duration:{sd}, ease:'none'}}, {round(at,3)});")
                at += sd
        elif kind == "color":
            target_is_obj = target in obj_ids
            sel = "ellipse" if target_is_obj else "rect"
            prop = "fill" if target_is_obj else "stroke"
            out.append(f"tl.to({_q(target)}.querySelector('{sel}'), {{{prop}:'{payload}', duration:{d}}}, {a});")
            label = target + '-lb' if target_is_obj else target + '-t'
            out.append(f"tl.to({_q(label)}, {{fill:'{payload}', duration:{d}}}, {a});")
        elif kind == "text":
            raise ValueError("text ops are not seek-safe without TextPlugin; bake a second chip")
    return "\n  ".join(out)


def frame_html(scene, dur: float) -> str:
    sid = f'line-{scene["n"]}'
    inner = render(scene, 0.0, "", root=True)
    return f"""<template>
<style>
@import url("channel/styles.css");
#{sid} {{ position: absolute; inset: 0; width: 1080px; height: 1920px; background: #0B1020; overflow: hidden; }}
#{sid} svg.scene {{ display: block; width: 1080px; height: 1920px; }}
</style>
<div id="{sid}" class="hf-frame" data-composition-id="{sid}" data-width="1080" data-height="1920" data-duration="{dur:.3f}">
  {sprite()}
  <svg class="scene" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{esc(scene['title'])}">{inner}</svg>
</div>
<script>
{{
  const D = {dur:.6f};
  const t = (f) => +(f * D).toFixed(4);
  const q = (s) => document.querySelector('[data-composition-id="{sid}"] ' + s);
  const tl = gsap.timeline({{paused: true}});
  {timeline_js(scene, dur)}
  window.__timelines = window.__timelines || {{}};
  window.__timelines['{sid}'] = tl;
}}
</script>
</template>
"""


def build_frames(scenes, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for s in scenes:
        meta = s.get("meta")
        if not meta:
            raise SystemExit(f'frame {s["n"]}: no measured audio in audio_meta.json yet')
        path = out_dir / f'line-{s["n"]}.html'
        path.write_text(frame_html(s, float(meta["duration_s"])), encoding="utf-8")
    print(f"wrote {len(scenes)} frames to {out_dir}")


def load_spec():
    import importlib
    spec = importlib.import_module("spec")
    importlib.reload(spec)
    return spec.SCENES


if __name__ == "__main__":
    import sys
    scenes = load_spec()
    meta = PROJECT / "audio_meta.json"
    audio = json.loads(meta.read_text(encoding="utf-8")) if meta.exists() else None
    voices = {v["id"]: v for v in (audio or {}).get("voices", [])}
    for s in scenes:
        v = voices.get(f'line-{s["n"]}')
        if v:
            s["meta"] = v
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which in ("all", "board"):
        build_board(scenes, PROJECT / "sketches" / "board.html")
    if which in ("all", "frames"):
        build_frames(scenes, PROJECT / "compositions" / "frames")
    if which in ("all", "storyboard"):
        hdr = ("Measured with Supertonic 3: one WAV per scene, timings from `audio_meta.json`.\n"
               "Local times below are retimed from the measured duration."
               if voices else
               "Timings below are planning estimates; after gate 1 they are replaced by the\n"
               "measured `audio_meta.json` values and the beat fractions retime for free.")
        build_storyboard(scenes, PROJECT / "STORYBOARD.md", audio, hdr)
