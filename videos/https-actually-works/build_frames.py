from __future__ import annotations

import json
import argparse
import sys
from pathlib import Path


PROJECT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT.parents[1] / 'scripts'))
from motion_beats import load_beats
from motion_pilot import markup as motion_markup
META = json.loads((PROJECT / "audio_meta.json").read_text(encoding="utf-8"))

STYLE = """
*{box-sizing:border-box}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0B1020;color:#F5F7FF;font-family:var(--hf-display)}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 48%,rgba(49,82,146,.16),transparent 52%),linear-gradient(155deg,#0B1020,#0C1223 62%,#0B1020)}
.title{position:absolute;z-index:7;left:72px;top:178px;width:936px;color:#F5F7FF;font-size:66px;line-height:1.04;font-weight:800;letter-spacing:-1.5px}
.server{position:absolute;z-index:5;left:380px;top:285px;width:320px;height:320px;object-fit:contain}
.browser{position:absolute;z-index:5;left:380px;top:1200px;width:320px;height:320px;object-fit:contain}
.server-label,.browser-label{position:absolute;z-index:6;left:300px;width:480px;text-align:center;font:700 26px/1.15 monospace;letter-spacing:2px}
.server-label{top:607px;color:#A59FFF}.browser-label{top:1530px;color:#4DA3FF}
.route{position:absolute;z-index:1;left:536px;top:645px;width:8px;height:600px;border-radius:5px;background:#33415F}
.route-dash{position:absolute;z-index:2;left:532px;top:650px;width:16px;height:586px;background:repeating-linear-gradient(to bottom,#AAB5CC 0 12px,transparent 12px 28px);opacity:.45}
.tunnel{position:absolute;z-index:2;left:392px;top:665px;width:296px;height:565px;border:8px solid #4DD9E8;border-radius:148px;background:rgba(20,29,53,.82);opacity:0}
.object{position:absolute;z-index:4;object-fit:contain}
.key-icon{background:url('public/icons8/key.png') center/contain no-repeat}
.label{position:absolute;z-index:6;text-align:center;font:700 25px/1.15 monospace;letter-spacing:.4px}
.chip{position:absolute;z-index:6;display:flex;align-items:center;justify-content:center;min-height:62px;padding:12px 20px;border:2px solid #33415F;border-radius:16px;background:#141D35;color:#F5F7FF;font:700 25px/1.15 monospace;text-align:center;white-space:nowrap}
.chip.blue{border-color:#4DA3FF;color:#4DA3FF}.chip.purple{border-color:#7067E8;color:#C3BEFF}.chip.green{border-color:#63D69A;color:#63D69A}.chip.amber{border-color:#F5B94D;color:#F5B94D}.chip.red{border-color:#F06A5F;color:#F06A5F}
.packet{position:absolute;z-index:8;display:flex;align-items:center;justify-content:center;width:224px;height:80px;border:3px solid #4DD9E8;border-radius:18px;background:#141D35;color:#F5F7FF;font:700 23px/1.1 monospace;letter-spacing:.4px}
.dots{font-size:30px;letter-spacing:7px;color:#4DD9E8}
.connector{position:absolute;z-index:3;height:6px;border-radius:3px;background:#4DD9E8;transform-origin:left center}
.quiet{opacity:0}
"""


def image(name: str, cls: str, x: int, y: int, size: int, alt: str) -> str:
    return f'<img class="object {cls}" src="public/icons8/{name}.png" alt="{alt}" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px">'


def key_icon(cls: str, x: int, y: int, size: int, alt: str) -> str:
    return f'<div class="object key-icon {cls}" role="img" aria-label="{alt}" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px"></div>'


def chip(cls: str, x: int, y: int, width: int, label: str, extra: str = "") -> str:
    return f'<div class="chip {cls} {extra}" style="left:{x}px;top:{y}px;width:{width}px">{label}</div>'


def markup(index: int, duration: float) -> tuple[str, str]:
    title = [
        "WHO'S AT THE OTHER END?", "A TWO-WAY HELLO", "MEET THE CERTIFICATE",
        "CHECK THE ID", "HERE'S THE TWIST", "SECRETS STAY LOCAL",
        "HTTP INSIDE TLS", "WHAT THE LOCK MEANS",
    ][index - 1]
    tunnel = '<div class="tunnel" id="tunnel"></div>' if index >= 7 else ""
    shared = (
        '<div class="bg"></div><div class="route"></div><div class="route-dash"></div>'
        + tunnel
        + image("server", "server", 380, 285, 320, "Website server")
        + '<div class="server-label">WEBSITE</div>'
        + image("laptop", "browser", 380, 1200, 320, "Browser laptop")
        + '<div class="browser-label">YOUR BROWSER</div>'
    )

    if index == 1:
        content = (
            image("lock", "hook-lock", 445, 715, 190, "HTTPS lock")
            + chip("green", 354, 920, 372, "HTTPS", "hook-https")
            + chip("amber", 355, 1030, 370, "PASSWORD · HELD BACK", "hook-password")
            + '<div class="label hook-question" style="left:175px;top:1108px;width:730px;color:#F5F7FF;font-size:30px">WHAT DID IT CHECK?</div>'
        )
        motion = """
tl.fromTo(q('.hook-lock'),{scale:.7,opacity:0},{scale:1,opacity:1,duration:.45,ease:'power3.out'},.08);
tl.fromTo(q('.hook-https'),{y:20,opacity:0},{y:0,opacity:1,duration:.38,ease:'power2.out'},.48);
tl.fromTo(q('.hook-password'),{y:18,opacity:0},{y:0,opacity:1,duration:.4,ease:'power2.out'},D*.42);
tl.fromTo(q('.hook-question'),{opacity:0,y:16},{opacity:1,y:0,duration:.42,ease:'power2.out'},D*.7);
"""
    elif index == 2:
        content = (
            chip("blue", 410, 700, 260, "CLIENT HELLO", "client-hello")
            + chip("purple", 410, 1080, 260, "SERVER HELLO", "server-hello")
            + key_icon("share-client", 248, 815, 120, "Browser key share")
            + key_icon("share-server", 712, 815, 120, "Server key share")
            + chip("blue", 142, 940, 260, "KEY SHARE", "client-share-label")
            + chip("purple", 678, 940, 260, "KEY SHARE", "server-share-label")
            + image("handshake", "handshake", 460, 815, 160, "TLS handshake")
            + '<div class="label tls-label" style="left:340px;top:1002px;width:400px;color:#4DD9E8">TLS HANDSHAKE</div>'
        )
        motion = """
tl.fromTo(q('.client-hello'),{y:350},{y:0,duration:D*.18,ease:'power1.inOut'},.04);
tl.fromTo(q('.share-client'),{y:320,opacity:0},{y:0,opacity:1,duration:D*.22,ease:'power1.inOut'},D*.18);
tl.fromTo(q('.share-server'),{y:-280,opacity:0},{y:0,opacity:1,duration:D*.22,ease:'power1.inOut'},D*.43);
tl.fromTo(q('.server-hello'),{y:-350,opacity:0},{y:0,opacity:1,duration:D*.25,ease:'power1.inOut'},D*.48);
tl.fromTo(q('.client-share-label'),{opacity:0},{opacity:1,duration:.32},D*.68);
tl.fromTo(q('.server-share-label'),{opacity:0},{opacity:1,duration:.32},D*.68);
tl.fromTo(q('.handshake'),{scale:.75,opacity:0},{scale:1,opacity:1,duration:.42,ease:'power3.out'},D*.77);
tl.fromTo(q('.tls-label'),{opacity:0,y:12},{opacity:1,y:0,duration:.36},D*.84);
"""
    elif index == 3:
        content = (
            image("certificate", "certificate", 450, 760, 180, "Server certificate")
            + chip("green", 300, 958, 480, "example.com", "domain")
            + key_icon("public-key", 484, 1042, 112, "Certificate public key")
            + '<div class="label public-key-label" style="left:340px;top:1150px;width:400px;color:#A59FFF">PUBLIC KEY</div>'
            + '<div class="label cert-arrival" style="left:300px;top:700px;width:480px;color:#4DD9E8">THE SITE&#39;S ID CARD</div>'
        )
        motion = """
tl.fromTo(q('.certificate'),{y:-110,scale:.8},{y:0,scale:1,duration:D*.26,ease:'power2.out'},.05);
tl.fromTo(q('.cert-arrival'),{opacity:0,y:18},{opacity:1,y:0,duration:.38},D*.25);
tl.fromTo(q('.domain'),{opacity:0,y:14},{opacity:1,y:0,duration:.4},D*.52);
tl.fromTo(q('.public-key'),{scale:.65,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power3.out'},D*.69);
tl.fromTo(q('.public-key-label'),{opacity:0},{opacity:1,duration:.32},D*.8);
"""
    elif index == 4:
        content = (
            image("certificate", "checked-cert", 120, 755, 200, "Certificate being checked")
            + image("verified-account", "trust", 760, 760, 170, "Trusted certificate authority")
            + key_icon("signature-key", 445, 1010, 130, "Server signature proof")
            + chip("blue", 335, 730, 400, "NAME MATCH", "check-name")
            + chip("green", 335, 830, 400, "VALID", "check-valid")
            + chip("green", 335, 930, 400, "TRUSTED AUTHORITY", "check-issuer")
            + chip("green", 340, 1150, 400, "SIGNATURE OK", "check-signature")
        )
        motion = """
tl.fromTo(q('.checked-cert'),{x:-110,opacity:0},{x:0,opacity:1,duration:.48,ease:'power2.out'},.1);
tl.fromTo(q('.trust'),{scale:.65,opacity:0},{scale:1,opacity:1,duration:.42,ease:'power3.out'},D*.2);
tl.fromTo(q('.check-name'),{x:-18,opacity:0},{x:0,opacity:1,duration:.28},.04);
tl.fromTo(q('.check-valid'),{x:-18,opacity:0},{x:0,opacity:1,duration:.32},D*.32);
tl.fromTo(q('.check-issuer'),{x:-18,opacity:0},{x:0,opacity:1,duration:.32},D*.52);
tl.fromTo(q('.signature-key'),{y:115,opacity:0},{y:0,opacity:1,duration:.42,ease:'power2.out'},D*.7);
tl.fromTo(q('.check-signature'),{scale:.9,opacity:0},{scale:1,opacity:1,duration:.38},D*.83);
"""
    elif index == 5:
        content = (
            image("certificate", "twist-cert", 145, 790, 190, "Certificate proving site identity")
            + key_icon("twist-key", 215, 985, 105, "Certificate public key")
            + chip("green", 92, 1110, 300, "PROVES IDENTITY", "identity-chip")
            + '<div class="connector key-path" style="left:330px;top:1010px;width:200px;background:#F06A5F"></div>'
            + '<div class="stop-mark" style="position:absolute;z-index:7;left:490px;top:975px;width:72px;height:72px;border:6px solid #F06A5F;border-radius:50%;color:#F06A5F;font:700 52px/58px var(--hf-display);text-align:center">×</div>'
            + '<div class="packet clear-packet" style="left:590px;top:950px">HTTP REQUEST</div>'
            + chip("amber", 615, 1060, 315, "NOT EVERY REQUEST", "not-data-key")
        )
        motion = """
tl.fromTo(q('.twist-cert'),{x:-100,opacity:0},{x:0,opacity:1,duration:.45,ease:'power2.out'},.1);
tl.fromTo(q('.twist-key'),{scale:.7,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power3.out'},D*.22);
tl.fromTo(q('.identity-chip'),{opacity:0,y:12},{opacity:1,y:0,duration:.38},D*.32);
tl.fromTo(q('.clear-packet'),{x:-330,opacity:0},{x:0,opacity:1,duration:D*.28,ease:'power1.inOut'},D*.48);
tl.fromTo(q('.key-path'),{scaleX:0},{scaleX:1,duration:.34,ease:'power2.out'},D*.55);
tl.fromTo(q('.stop-mark'),{scale:.6,opacity:0},{scale:1,opacity:1,duration:.36,ease:'power3.out'},D*.68);
tl.fromTo(q('.not-data-key'),{opacity:0,y:12},{opacity:1,y:0,duration:.38},D*.76);
"""
    elif index == 6:
        content = (
            key_icon("share-left", 190, 760, 125, "Client key share")
            + key_icon("share-right", 765, 760, 125, "Server key share")
            + chip("blue", 93, 892, 310, "KEY SHARE", "share-left-label")
            + chip("purple", 677, 892, 310, "KEY SHARE", "share-right-label")
            + key_icon("traffic-left", 180, 990, 125, "Browser-local traffic key")
            + key_icon("traffic-right", 775, 990, 125, "Server-local traffic key")
            + chip("green", 75, 1125, 340, "TRAFFIC KEY · LOCAL", "traffic-left-label")
            + chip("green", 665, 1125, 340, "TRAFFIC KEY · LOCAL", "traffic-right-label")
            + '<div class="connector share-arrow-left" style="left:315px;top:825px;width:450px"></div>'
            + '<div class="label arrow-head" style="left:390px;top:790px;width:300px;color:#4DD9E8">SHARES CROSS</div>'
        )
        motion = """
tl.fromTo(q('.share-left'),{x:-130,opacity:0},{x:0,opacity:1,duration:D*.2,ease:'power1.inOut'},.1);
tl.fromTo(q('.share-right'),{x:130,opacity:0},{x:0,opacity:1,duration:D*.2,ease:'power1.inOut'},D*.18);
tl.fromTo(q('.share-left-label'),{opacity:0},{opacity:1,duration:.32},D*.3);
tl.fromTo(q('.share-right-label'),{opacity:0},{opacity:1,duration:.32},D*.3);
tl.fromTo(q('.share-arrow-left'),{scaleX:0},{scaleX:1,duration:.48,ease:'power2.out'},D*.38);
tl.fromTo(q('.traffic-left'),{scale:.65,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power3.out'},D*.55);
tl.fromTo(q('.traffic-right'),{scale:.65,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power3.out'},D*.63);
tl.fromTo(q('.traffic-left-label'),{opacity:0,y:12},{opacity:1,y:0,duration:.36},D*.69);
tl.fromTo(q('.traffic-right-label'),{opacity:0,y:12},{opacity:1,y:0,duration:.36},D*.75);
"""
    elif index == 7:
        content = (
            '<div class="packet outgoing" style="left:428px;top:1070px"><span>HTTP REQUEST</span></div>'
            + '<div class="packet protected-request" style="left:428px;top:1070px"><span class="dots">••••••</span></div>'
            + '<div class="packet protected-response" style="left:428px;top:760px"><span class="dots">••••••</span></div>'
            + chip("purple", 428, 650, 224, "HTTP RESPONSE", "reply-label")
            + image("lock", "tunnel-lock", 468, 905, 144, "TLS protection")
        )
        motion = """
tl.fromTo(q('#tunnel'),{scaleY:.12,opacity:0,transformOrigin:'center center'},{scaleY:1,opacity:1,duration:.6,ease:'power2.out'},.08);
tl.fromTo(q('.tunnel-lock'),{scale:.7,opacity:0},{scale:1,opacity:1,duration:.42,ease:'power3.out'},D*.17);
tl.fromTo(q('.outgoing'),{y:35},{y:0,duration:.3},.06);
tl.fromTo(q('.protected-request'),{y:0,opacity:0},{y:-365,opacity:1,duration:D*.3,ease:'power1.inOut'},D*.3);
tl.to([q('.outgoing'),q('.protected-request')],{opacity:0,duration:.22},D*.61);
tl.fromTo(q('.reply-label'),{opacity:0,y:-10},{opacity:1,y:0,duration:.34},D*.66);
tl.fromTo(q('.protected-response'),{y:0,opacity:0},{y:390,opacity:1,duration:D*.28,ease:'power1.inOut'},D*.68);
"""
    else:
        content = (
            image("user", "observer", 780, 745, 145, "Person observing network traffic")
            + '<div class="label observer-label" style="left:710px;top:900px;width:220px;color:#AAB5CC">OBSERVER</div>'
            + '<div class="packet visible-traffic" style="left:428px;top:740px"><span class="dots">••••••</span></div>'
            + chip("amber", 122, 900, 300, "TRAFFIC VISIBLE", "traffic-visible")
            + chip("green", 410, 1008, 260, "CONTENTS HIDDEN", "contents-hidden")
            + image("lock", "final-lock", 460, 835, 160, "HTTPS connection lock")
            + chip("green", 314, 1082, 452, "example.com · DOMAIN CHECKED", "domain-proof")
            + '<div class="label final-caveat" style="left:180px;top:1154px;width:720px;padding:2px 6px;background:#0B1020;color:#F5B94D;font-size:26px">SITE SAFETY: NOT CHECKED</div>'
        )
        motion = """
tl.fromTo(q('.observer'),{x:90},{x:0,duration:.48,ease:'power2.out'},.04);
tl.fromTo(q('.observer-label'),{opacity:0},{opacity:1,duration:.3},D*.22);
tl.fromTo(q('.traffic-visible'),{x:-20,opacity:0},{x:0,opacity:1,duration:.36},D*.23);
tl.fromTo(q('.contents-hidden'),{scale:.9,opacity:0},{scale:1,opacity:1,duration:.4,ease:'power2.out'},D*.38);
tl.fromTo(q('.final-lock'),{scale:.65,opacity:0},{scale:1,opacity:1,duration:.42,ease:'power3.out'},D*.61);
tl.fromTo(q('.domain-proof'),{opacity:0,y:14},{opacity:1,y:0,duration:.38},D*.73);
tl.fromTo(q('.final-caveat'),{opacity:0,y:12},{opacity:1,y:0,duration:.38},D*.86);
"""

    document = f'''<!doctype html><html><head><meta charset="utf-8"><title>HTTPS scene {index}</title></head><body><template>
<style>@import url("channel/styles.css");{STYLE}</style>
<div id="root" data-composition-id="line-{index}" data-width="1080" data-height="1920" data-duration="{duration:.6f}">
{shared}<div class="title">{title}</div>{content}
</div>
<script>
const root=document.currentScript.parentElement;
const q=s=>root.querySelector(s);
const D={duration:.6f};
const tl=gsap.timeline({{paused:true}});
{motion}
window.__timelines=window.__timelines||{{}};
window.__timelines['line-{index}']=tl;
</script>
</template></body></html>'''
    return document, title


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--motion-pilot', action='store_true', help='Regenerate only scenes 2, 4, 7 using measured cues')
    args = parser.parse_args()
    config = json.loads((PROJECT / 'channel.json').read_text())
    beats = load_beats(PROJECT) if config.get('motion_version') else {}
    scenes = META["scenes"]
    assert len(scenes) == 8 and [s["id"] for s in scenes] == [f"line-{i}" for i in range(1, 9)]
    for scene in scenes:
        index = int(scene['index'])
        if args.motion_pilot and index not in (2, 4, 7):
            continue
        if index in (2, 4, 7) and config.get('motion_version'):
            source, _ = motion_markup(index, float(scene['duration_s']), beats[scene['id']])
        else:
            source, _ = markup(index, float(scene["duration_s"]))
        target = PROJECT / scene["src"]
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(source, encoding="utf-8")
    if config.get('motion_version'):
        assertions = []
        for index, target, result, cue in [(2, '.hello .hf-payload', '.handshake', 'handshake'), (4, '.certificate', '.proof', 'key'), (7, '.request .hf-payload', '.symmetric', 'symmetric')]:
            scene = scenes[index - 1]
            prefix = f'[data-composition-id="{scene["id"]}"] '
            assertions.extend([
                {'kind': 'staysInFrame', 'selector': prefix + target},
                {'kind': 'appearsBy', 'selector': prefix + result, 'bySec': scene['start_s'] + beats[scene['id']][cue] + .55},
            ])
        (PROJECT / 'index.motion.json').write_text(json.dumps({'duration': META['timeline_duration_s'], 'assertions': assertions}, indent=2) + '\n')
    print(f"Wrote {3 if args.motion_pilot else len(scenes)} seekable scenes; narration remains {META['timeline_duration_s']:.3f}s.")


if __name__ == "__main__":
    main()
