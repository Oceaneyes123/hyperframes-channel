from __future__ import annotations

import html
import json
from pathlib import Path


PROJECT = Path(__file__).resolve().parent
META = json.loads((PROJECT / "audio_meta.json").read_text(encoding="utf-8"))
TITLES = [
    "It joined. No IP.",
    "Without DHCP",
    "Meet the roles",
    "DISCOVER",
    "OFFER",
    "REQUEST",
    "ACKNOWLEDGE",
    "More than an address",
    "A lease has a timer",
    "Renew before expiry",
    "DORA",
]

STYLE = """
*,*:before,*:after{box-sizing:border-box}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0B1020;color:#F5F7FF;font-family:Arial,sans-serif}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse at 52% 46%,rgba(49,82,146,.18),transparent 48%),linear-gradient(155deg,#0B1020,#0C1223 62%,#0B1020)}
.headline{position:absolute;left:72px;top:190px;max-width:900px;font-size:82px;line-height:1.04;font-weight:750;letter-spacing:-2px;z-index:5}
.eyebrow{position:absolute;left:76px;top:310px;color:#AAB5CC;font:700 28px/1.2 monospace;letter-spacing:2px;z-index:5}
.client-icon{position:absolute;left:380px;top:350px;width:320px;height:270px;object-fit:contain;z-index:3}
.client-label{position:absolute;left:410px;top:628px;width:260px;text-align:center;color:#4DA3FF;font:700 26px/1.2 monospace;letter-spacing:2px;z-index:4}
.state{position:absolute;left:360px;top:674px;width:360px;min-height:68px;display:flex;align-items:center;justify-content:center;border:3px solid #F5B94D;border-radius:20px;background:#2B2730;color:#F5B94D;font:700 28px/1.15 monospace;white-space:nowrap;z-index:4}
.state-ip{border-color:#63D69A;background:#123B30;color:#63D69A}
.route{position:absolute;left:536px;top:775px;width:8px;height:520px;border-radius:5px;background:#33415F;z-index:1}
.route-success{position:absolute;left:536px;top:775px;width:8px;height:520px;border-radius:5px;background:#63D69A;opacity:0;z-index:2}
.route-success.connected{opacity:1}
.server-icon{position:absolute;left:415px;top:1290px;width:250px;height:234px;object-fit:contain;z-index:3}
.server-label{position:absolute;left:360px;top:1532px;width:360px;text-align:center;color:#A59FFF;font:700 27px/1.2 monospace;letter-spacing:2px;z-index:4}
.router-icon{position:absolute;left:755px;top:873px;width:170px;height:153px;object-fit:contain;z-index:3}
.router-label{position:absolute;left:728px;top:1038px;width:220px;text-align:center;color:#AAB5CC;font:700 22px/1.2 monospace;letter-spacing:1px;z-index:4}
.packet{position:absolute;left:522px;top:786px;width:36px;height:36px;border-radius:50%;background:#4DA3FF;border:4px solid #DCEEFF;box-shadow:0 0 24px rgba(77,163,255,.7);z-index:6}
.packet-server{background:#7067E8;border-color:#E7E4FF;box-shadow:0 0 24px rgba(112,103,232,.68)}
.packet-ack{background:#63D69A;border-color:#E4FFF1;box-shadow:0 0 24px rgba(99,214,154,.68)}
.packet-name{position:absolute;left:577px;top:786px;min-width:205px;padding:11px 15px;border-radius:14px;background:#141D35;border:2px solid #33415F;color:#F5F7FF;font:700 24px/1.15 monospace;z-index:6}
.offer-card{position:absolute;left:72px;top:805px;width:410px;padding:24px 20px 18px;border-radius:24px;background:#141D35;border:3px solid #F5B94D;z-index:4}
.offer-head{font:700 23px/1.2 monospace;color:#F5B94D;margin-bottom:19px;letter-spacing:.5px}
.config-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:58px;border-top:1px solid #33415F;font:600 24px/1.15 monospace;white-space:nowrap}
.config-key{color:#AAB5CC;font-size:21px}.config-value{color:#F5F7FF;font-size:23px}
.selected{position:absolute;left:80px;top:1210px;color:#63D69A;font:700 22px/1.2 monospace}
.broadcast{position:absolute;left:360px;top:842px;width:360px;height:360px;border:7px solid rgba(77,163,255,.68);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#4DA3FF;font:700 30px/1.2 monospace;z-index:2;opacity:.75}
.broadcast:before,.broadcast:after{content:"";position:absolute;border:6px solid rgba(77,163,255,.38);border-radius:50%;inset:-64px}
.broadcast:after{inset:-128px;border-color:rgba(77,163,255,.18)}
.stamp{position:absolute;left:362px;top:1170px;width:356px;text-align:center;color:#4DA3FF;font:700 24px/1.2 monospace;z-index:4}
.clock{position:absolute;left:370px;top:875px;width:300px;height:300px;border:10px solid #F5B94D;border-radius:50%;background:#141D35;display:flex;align-items:center;justify-content:center;z-index:4}
.clock-face{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#F5F7FF;font:700 52px/1 monospace}
.clock-hand{position:absolute;left:145px;top:58px;width:8px;height:94px;background:#F5B94D;border-radius:8px;transform-origin:bottom center}
.renew-clock{left:82px;top:950px;width:260px;height:260px}
.renew-clock .clock-hand{left:126px;top:44px;height:82px}
.clock-caption{position:absolute;left:280px;top:1190px;width:520px;text-align:center;color:#F5B94D;font:700 24px/1.2 monospace;letter-spacing:1px;z-index:5}
.renew-caption{left:72px;top:1220px;width:350px;font-size:19px}
.renew-note{position:absolute;left:72px;top:1260px;width:330px;color:#AAB5CC;font:600 18px/1.3 monospace;z-index:5}
.renew-success{position:absolute;left:72px;top:1340px;width:330px;color:#63D69A;font:700 24px/1.2 monospace;z-index:5}
.bundle-card{position:absolute;left:72px;top:825px;width:430px;padding:20px;border-radius:24px;background:#141D35;border:3px solid #4DA3FF;z-index:4}
.bundle-card .config-row{min-height:69px}.bundle-card .config-key{font-size:23px}.bundle-card .config-value{font-size:25px}
.meaning{position:absolute;left:72px;top:1245px;width:330px;color:#AAB5CC;font:600 22px/1.36 Arial,sans-serif;z-index:4}
.meaning-line{margin:0 0 10px}
.manual-card{position:absolute;left:105px;top:760px;width:870px;padding:24px 30px;background:#141D35;border:3px solid #33415F;border-radius:28px;z-index:4}
.manual-row{height:138px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #33415F;color:#AAB5CC;font:700 30px/1.2 monospace;letter-spacing:1px}
.manual-row:last-child{border-bottom:0}.manual-value{padding:16px 20px;border:2px solid #4DA3FF;border-radius:16px;background:#102947;color:#F5F7FF;font-size:26px}
.manual-optional{position:absolute;left:150px;top:1395px;width:780px;text-align:center;color:#AAB5CC;font:700 22px/1.2 monospace;letter-spacing:1px;z-index:4}
.renew-label{position:absolute;left:72px;top:1190px;width:410px;color:#AAB5CC;font:700 20px/1.2 monospace;z-index:4}
.recap-device{position:absolute;top:500px;object-fit:contain;z-index:3}.recap-laptop{left:115px;width:270px;height:240px}.recap-phone{left:440px;width:170px;height:240px}.recap-tablet{left:700px;width:230px;height:240px}
.recap-name{position:absolute;top:750px;width:270px;text-align:center;color:#4DA3FF;font:700 25px/1.2 monospace;z-index:4}.recap-a{left:115px}.recap-b{left:390px}.recap-c{left:675px}
.recap-ip{position:absolute;top:808px;width:270px;text-align:center;color:#63D69A;font:700 23px/1.2 monospace;z-index:4}.recap-ip-a{left:115px}.recap-ip-b{left:390px}.recap-ip-c{left:675px}
.recap-server{position:absolute;left:102px;top:1000px;width:190px;height:185px;object-fit:contain;z-index:3}.recap-router{position:absolute;left:760px;top:1025px;width:165px;height:145px;object-fit:contain;z-index:3}
.recap-lan{position:absolute;left:196px;top:945px;width:690px;height:8px;background:#33415F;border-radius:5px;z-index:1}
.recap-drop{position:absolute;top:735px;width:7px;height:210px;background:#33415F;border-radius:4px;z-index:1}
.recap-drop-a{left:247px}.recap-drop-b{left:521px}.recap-drop-c{left:806px}
.recap-dora{position:absolute;left:120px;top:1270px;width:840px;padding:30px 20px;border-radius:26px;background:#141D35;border:2px solid #33415F;text-align:center;color:#F5F7FF;font:700 30px/1.2 monospace;z-index:4;letter-spacing:1px;white-space:nowrap}
.recap-sub{position:absolute;left:120px;top:1370px;width:840px;text-align:center;color:#AAB5CC;font:600 23px/1.3 monospace;z-index:4}
.accent-blue{color:#4DA3FF}.accent-green{color:#63D69A}.accent-amber{color:#F5B94D}
"""


def el(tag: str, cls: str, body: str = "", attrs: str = "") -> str:
    return f'<{tag} class="{cls}" {attrs}>{body}</{tag}>'


def config_rows(lease: bool = True) -> str:
    rows = [
        ("IP", "192.168.1.25"),
        ("SUBNET", "255.255.255.0"),
        ("GATEWAY", "192.168.1.1"),
        ("DNS", "192.168.1.1"),
    ]
    if lease:
        rows.append(("LEASE", "24 HOURS"))
    return "".join(
        f'<div class="config-row"><span class="config-key">{k}</span><span class="config-value">{v}</span></div>'
        for k, v in rows
    )


def common_devices(state_ip: bool = False, show_route: bool = True) -> str:
    route_class = "route-success connected" if state_ip else "route-success"
    route = (el("div", "route") + el("div", route_class)) if show_route else ""
    state = (
        el("div", "state state-ip", "192.168.1.25 &#10003;")
        if state_ip
        else el("div", "state state-noip", "NO IP")
    )
    return (
        route
        + '<img class="client-icon" src="public/icons/laptop.png" alt="Laptop client">'
        + el("div", "client-label", "CLIENT")
        + state
        + '<img class="router-icon" src="public/icons/router.png" alt="Router gateway">'
        + el("div", "router-label", "GATEWAY")
        + '<img class="server-icon" src="public/icons8/server.svg" alt="DHCP server">'
        + el("div", "server-label", "DHCP SERVER")
    )


def scene_markup(index: int, duration: float) -> tuple[str, str]:
    title = html.escape(TITLES[index - 1])
    kind = index
    if kind == 1:
        content = (
            '<div class="eyebrow">NEW ON WI-FI</div>'
            '<div class="l1-waves" style="position:absolute;left:250px;top:520px;width:580px;height:580px;border:8px solid #4DA3FF;border-radius:50%;opacity:.45"></div>'
            '<img class="client-icon" src="public/icons/laptop.png" alt="Laptop joining Wi-Fi">'
            '<div class="state state-noip l1-noip">NO IP</div>'
            '<div class="stamp l1-question">WHAT SETTINGS DOES IT NEED?</div>'
        )
        motion = """
tl.fromTo(q('.l1-waves'),{scale:.72,opacity:.18},{scale:1,opacity:.52,duration:D*.42,ease:'power2.out'},D*.08);
tl.fromTo(q('.l1-noip'),{scale:.88},{scale:1,duration:.42,ease:'back.out(1.4)'},D*.37);
tl.fromTo(q('.l1-question'),{opacity:0,y:18},{opacity:1,y:0,duration:.45,ease:'power2.out'},D*.58);
"""
    elif kind == 2:
        fields = "".join(
            f'<div class="manual-row"><span>{label}</span><span class="manual-value">{value}</span></div>'
            for label, value in [
                ("IP ADDRESS", "192.168.1.25"),
                ("SUBNET MASK", "255.255.255.0"),
                ("GATEWAY", "192.168.1.1"),
                ("DNS SERVER", "192.168.1.1"),
            ]
        )
        content = (
            '<img class="client-icon" src="public/icons/laptop.png" alt="Laptop client">'
            + el("div", "client-label", "CONFIGURE BY HAND")
            + f'<div class="manual-card">{fields}</div>'
            + '<div class="manual-optional">DHCP OPTIONAL &middot; MANUAL SETUP IS POSSIBLE</div>'
        )
        motion = """
qa('.manual-row').forEach((row,i)=>tl.fromTo(row,{opacity:.35},{opacity:1,duration:.35},D*(.12+i*.16)));
qa('.manual-value').forEach((row,i)=>tl.fromTo(row,{opacity:0,x:-16},{opacity:1,x:0,duration:.38,ease:'power2.out'},D*(.2+i*.16)));
tl.fromTo(q('.manual-optional'),{opacity:0,y:12},{opacity:1,y:0,duration:.4},D*.72);
"""
    elif kind == 3:
        content = common_devices(show_route=True) + '<div class="stamp role-stamp">CLIENT  &rarr;  DHCP SERVER</div>'
        motion = """
tl.fromTo(q('.route'),{scaleY:.12,transformOrigin:'top center'},{scaleY:1,duration:D*.42,ease:'power2.out'},D*.08);
tl.fromTo(q('.role-stamp'),{opacity:0,y:18},{opacity:1,y:0,duration:.45,ease:'power2.out'},D*.48);
"""
    elif kind == 4:
        content = common_devices() + '<div class="broadcast discover-rings">BROADCAST</div><div class="packet discover-packet"></div><div class="stamp discover-ask">WHO HAS DHCP?</div>'
        motion = """
tl.fromTo(q('.discover-packet'),{y:0,scale:.8},{y:420,duration:D*.54,ease:'power1.inOut'},D*.08);
tl.fromTo(q('.discover-rings'),{scale:.34,opacity:.05},{scale:1,opacity:.8,duration:D*.5,ease:'power2.out'},D*.4);
tl.fromTo(q('.discover-ask'),{opacity:0,y:14},{opacity:1,y:0,duration:.38},D*.52);
tl.fromTo(q('.server-icon'),{scale:1},{scale:1.06,duration:.34,yoyo:true,repeat:1,ease:'power1.inOut'},D*.78);
"""
    elif kind == 5:
        content = common_devices() + f'<div class="offer-card offer-values"><div class="offer-head offer-pending">OFFER &middot; NOT CONFIRMED</div>{config_rows()}</div><div class="packet packet-server offer-packet"></div><div class="packet-name offer-name">OFFER</div>'
        motion = """
tl.fromTo(q('.offer-packet'),{y:420},{y:0,duration:D*.22,ease:'power1.inOut'},D*.08);
tl.fromTo(q('.offer-name'),{y:420,opacity:0},{y:0,opacity:1,duration:D*.22,ease:'power1.inOut'},D*.08);
tl.fromTo(q('.offer-values'),{opacity:.35,x:-18},{opacity:1,x:0,duration:.48,ease:'power2.out'},D*.18);
tl.fromTo(qa('.offer-values .config-row'),{opacity:.4,y:10},{opacity:1,y:0,duration:.32,stagger:D*.012,ease:'power2.out'},D*.24);
"""
    elif kind == 6:
        content = common_devices() + f'<div class="offer-card request-offer"><div class="offer-head">OFFER &middot; SELECTED</div>{config_rows()}</div><div class="selected request-selected">CLIENT CHOOSES .25</div><div class="packet request-packet"></div><div class="packet-name request-name">REQUEST</div>'
        motion = """
tl.fromTo(q('.request-selected'),{opacity:0,x:-12},{opacity:1,x:0,duration:.38},D*.12);
tl.fromTo(q('.request-packet'),{y:0},{y:420,duration:D*.58,ease:'power1.inOut'},D*.22);
tl.fromTo(q('.request-name'),{y:0,opacity:0},{y:420,opacity:1,duration:D*.58,ease:'power1.inOut'},D*.22);
"""
    elif kind == 7:
        content = common_devices() + f'<div class="offer-card ack-offer"><div class="offer-head ack-pending">REQUESTED &middot; WAITING FOR ACK</div><div class="offer-head ack-confirmed">ACK &middot; CONFIGURATION CONFIRMED</div>{config_rows()}</div><div class="packet packet-ack ack-packet"></div><div class="packet-name ack-name">ACK</div><div class="state state-ip ack-ip" data-layout-allow-overlap>192.168.1.25 &#10003;</div>'
        motion = """
tl.set(q('.ack-ip'),{opacity:0,scale:.85});
tl.set(q('.ack-confirmed'),{opacity:0});
tl.fromTo(q('.ack-packet'),{y:420},{y:0,duration:D*.42,ease:'power1.inOut'},D*.12);
tl.fromTo(q('.ack-name'),{y:420,opacity:0},{y:0,opacity:1,duration:D*.42,ease:'power1.inOut'},D*.12);
tl.to(q('.state-noip'),{opacity:0,scale:.82,duration:.28,ease:'power2.in'},D*.62)
  .to(q('.ack-ip'),{opacity:1,scale:1,duration:.42,ease:'back.out(1.35)'},D*.68)
  .to(q('.ack-pending'),{opacity:0,duration:.22},D*.7)
  .to(q('.ack-confirmed'),{opacity:1,duration:.3},D*.72);
tl.to(q('.route-success'),{opacity:1,duration:.55},D*.68);
"""
    elif kind == 8:
        content = common_devices(state_ip=True) + f'<div class="bundle-card bundle-values">{config_rows()}</div><div class="meaning"><div class="meaning-line">SUBNET &middot; local network</div><div class="meaning-line">GATEWAY &middot; other networks</div><div class="meaning-line">DNS &middot; names to addresses</div></div>'
        motion = """
tl.fromTo(qa('.bundle-values .config-row'),{opacity:.35,x:-14},{opacity:1,x:0,duration:.35,stagger:D*.055,ease:'power2.out'},D*.12);
tl.fromTo(q('.meaning'),{opacity:0,y:20},{opacity:1,y:0,duration:.45,ease:'power2.out'},D*.56);
"""
    elif kind == 9:
        content = common_devices(state_ip=True) + '<div class="clock lease-clock"><div class="clock-face lease-face">24h<div class="clock-hand lease-hand"></div></div></div><div class="clock-caption lease-caption">LEASE &middot; EXAMPLE DURATION</div>'
        motion = """
tl.fromTo(q('.lease-hand'),{rotation:0},{rotation:115,duration:D*.65,ease:'power1.inOut'},D*.1);
tl.fromTo(q('.lease-clock'),{scale:.95},{scale:1,duration:.45,ease:'power2.out'},D*.08);
tl.fromTo(q('.lease-caption'),{opacity:0,y:12},{opacity:1,y:0,duration:.4},D*.62);
"""
    elif kind == 10:
        content = common_devices(state_ip=True) + '<div class="clock renew-clock"><div class="clock-face renew-face">24h<div class="clock-hand renew-hand"></div></div></div><div class="clock-caption renew-caption">BEFORE EXPIRY &middot; RENEW</div><div class="packet renew-request"></div><div class="packet-name renew-request-name">REQUEST</div><div class="packet packet-ack renew-ack"></div><div class="packet-name renew-ack-name">ACK</div><div class="renew-note">SAME ADDRESS CAN CONTINUE &middot; NOT GUARANTEED NEXT TIME</div><div class="renew-success">LEASE EXTENDED</div>'
        motion = """
tl.set([q('.renew-request'),q('.renew-request-name'),q('.renew-ack'),q('.renew-ack-name')],{opacity:0});
tl.fromTo(q('.renew-hand'),{rotation:65},{rotation:120,duration:D*.68,ease:'power1.inOut'},D*.05);
tl.fromTo(q('.renew-request'),{y:0,opacity:0},{y:420,opacity:1,duration:D*.24,ease:'power1.inOut'},D*.15);
tl.fromTo(q('.renew-request-name'),{y:0,opacity:0},{y:420,opacity:1,duration:D*.24,ease:'power1.inOut'},D*.15);
tl.fromTo(q('.renew-ack'),{y:420,opacity:0},{y:0,opacity:1,duration:D*.24,ease:'power1.inOut'},D*.48);
tl.fromTo(q('.renew-ack-name'),{y:420,opacity:0},{y:0,opacity:1,duration:D*.24,ease:'power1.inOut'},D*.48);
tl.to(q('.renew-hand'),{rotation:0,duration:D*.1,ease:'power2.out'},D*.76);
tl.fromTo(q('.renew-caption'),{opacity:0,y:12},{opacity:1,y:0,duration:.4},D*.13);
tl.fromTo(q('.renew-note'),{opacity:0,y:14},{opacity:1,y:0,duration:.45},D*.74);
tl.fromTo(q('.renew-success'),{opacity:0,y:12},{opacity:1,y:0,duration:.4},D*.76);
"""
    else:
        content = (
            '<div class="recap-lan"></div><div class="recap-drop recap-drop-a"></div><div class="recap-drop recap-drop-b"></div><div class="recap-drop recap-drop-c"></div>'
            '<img class="recap-device recap-laptop" src="public/icons/laptop.png" alt="Laptop">'
            '<img class="recap-device recap-phone" src="public/icons8/phone.svg" alt="Phone">'
            '<img class="recap-device recap-tablet" src="public/icons8/tablet.svg" alt="Tablet">'
            '<div class="recap-name recap-a">LAPTOP</div><div class="recap-name recap-b">PHONE</div><div class="recap-name recap-c">TABLET</div>'
            '<div class="recap-ip recap-ip-a">EXAMPLE .25</div><div class="recap-ip recap-ip-b">EXAMPLE .26</div><div class="recap-ip recap-ip-c">EXAMPLE .27</div>'
            '<img class="recap-server" src="public/icons8/server.svg" alt="DHCP server">'
            '<img class="recap-router" src="public/icons/router.png" alt="Router gateway">'
            '<div class="recap-dora">DISCOVER → OFFER → REQUEST → ACK</div>'
            '<div class="recap-sub">DHCP AUTOMATICALLY CONFIGURES DEVICES AS THEY JOIN</div>'
        )
        motion = """
tl.fromTo(qa('.recap-ip'),{opacity:0,y:18},{opacity:1,y:0,duration:.45,stagger:D*.1,ease:'power2.out'},D*.28);
tl.fromTo(q('.recap-dora'),{opacity:0,y:20},{opacity:1,y:0,duration:.55,ease:'power2.out'},D*.56);
tl.fromTo(q('.recap-sub'),{opacity:0},{opacity:1,duration:.5},D*.82);
"""

    markup = f"""
<template><style>@import url("channel/styles.css");{STYLE}</style>
<div id="root" data-composition-id="line-{kind}" data-width="1080" data-height="1920" data-duration="{duration:.6f}">
<div id="scene-background" class="bg clip" data-start="0" data-duration="{duration:.6f}" data-track-index="0"></div>
<div class="headline">{title}</div>
{content}
<script>
const root=document.currentScript.parentElement;
const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s));
const D={duration:.6f};
const tl=gsap.timeline({{paused:true}});
{motion.replace('D*', 'D*')}
window.__timelines['line-{kind}']=tl;
</script>
</div></template>
"""
    return markup, motion


def main() -> None:
    frames = PROJECT / "compositions" / "frames"
    frames.mkdir(parents=True, exist_ok=True)
    for scene in META["scenes"]:
        index = int(scene["index"])
        duration = float(scene["duration_s"])
        markup, _ = scene_markup(index, duration)
        (PROJECT / scene["src"]).write_text(markup, encoding="utf-8")
    print(f"Wrote {len(META['scenes'])} seekable scene compositions from measured audio metadata ({META['timeline_duration_s']:.3f}s).")


if __name__ == "__main__":
    main()
