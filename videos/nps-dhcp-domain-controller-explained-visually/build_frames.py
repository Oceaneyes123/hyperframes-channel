import json
from pathlib import Path

PROJECT = Path(__file__).parent
OUT = PROJECT / "compositions" / "frames"
ICON = "public/icons/"
OUT.mkdir(parents=True, exist_ok=True)

scenes = [
    ("How does a laptop reach the domain?", "Four services. Different jobs.", [("laptop.svg","WINDOWS LAPTOP","client"),("network-wired.svg","AP / SWITCH","infra"),("server.svg","DHCP","infra"),("globe.svg","DNS","dns"),("database.svg","DOMAIN CONTROLLER","dc"),("shield-halved.svg","NPS · IF REQUIRED","security")], "CONNECT → DISCOVER"),
    ("Network authentication", "Only when the network requires it", [("laptop.svg","SUPPLICANT","client"),("network-wired.svg","AUTHENTICATOR","infra"),("shield-halved.svg","NPS / RADIUS","security"),("server.svg","DHCP AFTER ACCESS","infra")], "802.1X · CONDITIONAL"),
    ("Client → AP / switch → NPS", "The middle device is the RADIUS client", [("laptop.svg","SUPPLICANT","client"),("wifi.svg","AP / SWITCH","external"),("shield-halved.svg","NPS · RADIUS SERVER","security")], "RADIUS REQUEST"),
    ("NPS makes the access decision", "Policy first · identity where configured", [("shield-halved.svg","NPS","security"),("user.svg","IDENTITY","ink"),("database.svg","ACTIVE DIRECTORY","dc"),("circle-check.svg","ACCESS-ACCEPT","success"),("circle-xmark.svg","ACCESS-REJECT","security")], "EVALUATE → DECIDE"),
    ("Without 802.1X", "NPS is not in every normal flow", [("laptop.svg","CLIENT","client"),("server.svg","DHCP","infra"),("globe.svg","DNS","dns"),("database.svg","DOMAIN CONTROLLER","dc")], "DHCP → DNS → DC"),
    ("Discover → Offer", "The client has no address yet", [("laptop.svg","NO IP","client"),("network-wired.svg","LOCAL NETWORK","infra"),("server.svg","DHCP SERVER","infra")], "DISCOVER · broadcast → OFFER"),
    ("Request → Acknowledge", "DORA completes the lease", [("laptop.svg","CLIENT","client"),("server.svg","DHCP SERVER","infra"),("circle-check.svg","ACKNOWLEDGE","success")], "D · O · R · A"),
    ("DHCP delivers the bundle", "IP · mask · gateway · DNS", [("laptop.svg","WINDOWS CLIENT","client"),("server.svg","DHCP LEASE","infra"),("globe.svg","DNS 10.10.1.10","dns")], "10.10.20.45  /  255.255.255.0  /  10.10.20.1"),
    ("Where is the domain?", "A directed DNS lookup", [("laptop.svg","CLIENT QUERY","client"),("globe.svg","CONFIGURED DNS","dns"),("database.svg","DC SERVICE","dc")], "corp.example · DNS QUERY"),
    ("SRV → Domain Controller", "DNS returns a service location", [("globe.svg","DNS","dns"),("server.svg","SRV RECORD","external"),("database.svg","DC FOUND","dc")], "_ldap._tcp.dc._msdcs.corp.example"),
    ("Domain authentication", "Reach the DC, then prove identity", [("laptop.svg","WINDOWS CLIENT","client"),("user.svg","USER / COMPUTER","ink"),("key.svg","KERBEROS","security"),("database.svg","AD DS","dc"),("circle-check.svg","IDENTITY VERIFIED","success")], "IDENTITY → AD DS"),
    ("Four jobs, four services", "Keep the responsibilities separate", [("server.svg","DHCP · NETWORK SETTINGS","infra"),("globe.svg","DNS · FIND DOMAIN","dns"),("shield-halved.svg","NPS · DECIDE ACCESS","security"),("database.svg","DC · IDENTITY + SERVICES","dc")], "WHO DOES WHAT?"),
    ("Complete enterprise flow", "NPS if required · then the normal path", [("laptop.svg","DEVICE","client"),("wifi.svg","802.1X / AP","external"),("shield-halved.svg","NPS","security"),("server.svg","DHCP","infra"),("globe.svg","DNS","dns"),("database.svg","DOMAIN CONTROLLER","dc"),("circle-check.svg","DOMAIN LOGIN","success")], "802.1X if required → ACCESS → DHCP → DNS → DC"),
    ("The division of labor", "NPS decides · DHCP configures · DNS finds · DC authenticates", [("shield-halved.svg","NPS DECIDES","security"),("server.svg","DHCP CONFIGURES","infra"),("globe.svg","DNS FINDS","dns"),("database.svg","DC AUTHENTICATES","dc")], "REMEMBER THIS FLOW"),
]

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

meta = json.loads((PROJECT / "audio_meta.json").read_text(encoding="utf-8"))
durations = {f"line-{v['frame']}": v["duration_s"] for v in meta["voices"]}

for index, (title, subtitle, nodes, message) in enumerate(scenes, 1):
    sid = f"line-{index}"
    duration = durations[sid]
    n = len(nodes)
    cols = 2 if n > 4 else n
    node_html = "".join(
        f'<div id="{sid}-node-{i}" class="node {color}"><img src="{ICON}{icon}" alt=""><div class="node-label">{esc(label)}</div></div>'
        for i, (icon, label, color) in enumerate(nodes)
    )
    value = esc(message)
    html = f'''<template>
<style>
@import url("channel/styles.css");
#{sid}{{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0B1020;color:#F5F7FF;font-family:Arial,sans-serif}}
#{sid}-bg{{position:absolute;inset:0;background:linear-gradient(180deg,#0B1020,#101932 72%,#0B1020)}}
#{sid}-title{{position:absolute;left:72px;top:190px;width:880px;font-size:76px;line-height:1.05;font-weight:700;letter-spacing:-.02em}}
#{sid}-subtitle{{position:absolute;left:76px;top:390px;width:860px;color:#AAB5CC;font-size:34px;line-height:1.2}}
#{sid}-route{{position:absolute;left:96px;top:575px;width:888px;display:grid;grid-template-columns:repeat({cols},1fr);gap:48px 28px;align-items:center;justify-items:center}}
#{sid}-route:before{{content:"";position:absolute;left:50%;top:8%;bottom:8%;width:4px;background:#33415F;z-index:0}}
#{sid}-node-0,#{sid}-node-1,#{sid}-node-2,#{sid}-node-3,#{sid}-node-4,#{sid}-node-5,#{sid}-node-6{{position:relative;z-index:1}}
.node{{width:100%;max-width:240px;min-height:246px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:#141D35;border:2px solid #33415F;border-radius:24px;padding:18px;text-align:center}}
.node img{{width:148px;height:148px;object-fit:contain;filter:none}}.node-label{{font-size:27px;line-height:1.05;font-weight:700;max-width:220px}}.client{{border-color:#4DA3FF}}.client .node-label{{color:#4DA3FF}}.infra{{border-color:#7067E8}}.infra .node-label{{color:#7067E8}}.dns{{border-color:#4DD9E8}}.dns .node-label{{color:#4DD9E8}}.dc{{border-color:#B07CFF}}.dc .node-label{{color:#B07CFF}}.security{{border-color:#F06A5F}}.security .node-label{{color:#F06A5F}}.success{{border-color:#63D69A}}.success .node-label{{color:#63D69A}}.external{{border-color:#4DD9E8}}.external .node-label{{color:#4DD9E8}}.ink .node-label{{color:#F5F7FF}}
#{sid}-route.compact .node{{min-height:190px;padding:12px;gap:10px}}#{sid}-route.compact .node img{{width:110px;height:110px}}#{sid}-route.compact .node-label{{font-size:22px}}
#{sid}-route.compact{{top:500px}}
#{sid}-message{{position:absolute;left:72px;bottom:350px;width:864px;min-height:98px;padding:24px;border:2px solid #33415F;border-radius:18px;text-align:center;color:#F5F7FF;font:34px/1.15 'Courier New',monospace;background:#141D35}}
#{sid}-packet{{position:absolute;left:526px;top:560px;width:28px;height:28px;border-radius:50%;background:#63D69A;box-shadow:0 0 22px #63D69A;z-index:2}}
</style>
<div id="{sid}" data-composition-id="{sid}" data-width="1080" data-height="1920" data-duration="{duration}">
  <div id="{sid}-bg" class="clip" data-start="0" data-duration="{duration}" data-track-index="0"></div>
  <div id="{sid}-title">{esc(title)}</div>
  <div id="{sid}-subtitle">{esc(subtitle)}</div>
  <div id="{sid}-route" class="{'compact' if n >= 7 else ''}">{node_html}</div>
  <div id="{sid}-message">{value}</div>
  <div id="{sid}-packet"></div>
</div>
<script>
const tl=gsap.timeline({{paused:true}});window.__timelines["{sid}"]=tl;
const D={duration}; const t=f=>Math.min(D-.05,Math.max(0,f*D));
tl.fromTo("#{sid}-title",{{opacity:0,y:24}},{{opacity:1,y:0,duration:.45,ease:"power3.out"}},t(.02))
  .fromTo("#{sid}-subtitle",{{opacity:0,y:18}},{{opacity:1,y:0,duration:.35,ease:"power3.out"}},t(.10))
  .fromTo("#{sid}-node-0,#{sid}-node-1,#{sid}-node-2,#{sid}-node-3,#{sid}-node-4,#{sid}-node-5,#{sid}-node-6",{{opacity:0,scale:.86}},{{opacity:1,scale:1,duration:.5,ease:"back.out(1.5)",stagger:.08}},t(.18))
  .fromTo("#{sid}-packet",{{y:0,opacity:0}},{{y:640,opacity:1,duration:Math.max(1.2,D*.28),ease:"power2.inOut"}},t(.34))
  .fromTo("#{sid}-message",{{opacity:0,y:20}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},t(.62));
</script>
</template>\n'''
    (OUT / f"{sid}.html").write_text(html, encoding="utf-8")

# One cheap structural self-check for the generated source.
assert len(list(OUT.glob("line-*.html"))) == len(scenes)
assert all((OUT / f"line-{i}.html").read_text(encoding="utf-8").count(f'data-composition-id="line-{i}"') == 1 for i in range(1, len(scenes)+1))
