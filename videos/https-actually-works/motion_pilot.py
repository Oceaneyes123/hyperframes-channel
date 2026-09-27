"""Three opt-in motion scenes; narration and the other five scenes stay intact."""
import json


STYLE = '''
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--hf-canvas);color:var(--hf-ink);font-family:var(--hf-display)}
.world{position:absolute;inset:0;width:1080px;height:1920px}
.device{position:absolute;width:320px;height:320px;object-fit:contain;left:380px}
.server{top:285px}.browser{top:1200px}
.endpoint{position:absolute;left:280px;width:520px;text-align:center;font:700 30px/1.2 var(--hf-mono)}
.server-name{top:607px;color:var(--hf-infrastructure)}.browser-name{top:1530px;color:var(--hf-client)}
.packet{display:flex;align-items:center;justify-content:center;border:3px solid var(--hf-client);border-radius:18px;background:var(--hf-surface);color:var(--hf-ink);font:700 26px/1.1 var(--hf-mono)}
.packet img{width:60px;height:60px;object-fit:contain;margin-left:10px}
.headline{position:absolute;left:72px;top:185px;width:864px;font-size:76px;line-height:1.06;font-weight:800}
.caption{position:absolute;text-align:center;color:var(--hf-ink);font:700 36px/1.2 var(--hf-mono)}
.art{position:absolute;object-fit:contain}
.status{position:absolute;left:360px;top:995px;width:470px;height:92px;border:3px solid var(--hf-client);background:var(--hf-surface);border-radius:14px;font:700 32px/1.2 var(--hf-mono)}
.shield{position:absolute;left:393px;top:665px;width:294px;height:535px;border:6px solid var(--hf-external);border-radius:145px;background:var(--hf-surface)}
.dots{color:var(--hf-external);letter-spacing:6px}
'''


def markup(index, duration, cues):
    if index not in (2, 4, 7):
        raise ValueError('Motion pilot scenes: 2, 4, 7')
    sid = f'line-{index}'
    endpoints = '''<img class="device server" src="public/icons8/server.png" alt="Website server">
<div class="endpoint server-name">WEBSITE</div>
<img class="device browser" src="public/icons8/laptop.png" alt="Browser laptop">
<div class="endpoint browser-name">YOUR BROWSER</div>'''
    route = '<svg class="hf-routes" viewBox="0 0 1080 1920"><path class="hf-route route" d="M540 1170 L540 690"/><path class="hf-route hf-route-active pulse" d="M540 1170 L540 690"/></svg>'
    if index == 2:
        title = 'A TWO-WAY HELLO'
        content = route + endpoints + '''
<div class="hf-mover hello"><div class="hf-payload packet"><span class="hf-state-content client">CLIENT HELLO</span><span class="hf-state-content reply">SERVER HELLO</span></div></div>
<div class="hf-mover share"><img class="art" src="public/icons8/key.png" alt="Public key share traveling with the hello" style="left:125px;top:-52px;width:104px;height:104px"></div>
<img class="art handshake" src="public/icons8/handshake.png" alt="Two-way TLS handshake" style="left:380px;top:765px;width:320px;height:320px">
<div class="caption share-label" style="left:645px;top:920px;width:280px">KEY SHARE</div>
<div class="caption handshake-label" style="left:210px;top:1110px;width:660px">TLS HANDSHAKE</div>'''
        setup = '''
const outbound=M.travel(c.hello-.6,c.piece+.35), inbound=M.travel(c.back-.55,c.handshake-.4,1,0);
const progress=t=>t<c.back-.55?outbound(t):inbound(t);
const packet=M.path(q('.route'),progress,{stretch:.025});
const packetState=M.state({width:224,borderRadius:18,borderColor:'#4DA3FF'},[[c.piece,{width:248,borderRadius:24}],[c.back-.8,{borderColor:'#7067E8'}]]);
const flash=M.edges(0,[[c.hello-.6,1],[c.back-.55,0]]);
'''
        draw = '''
const visible=M.visibility(t,null,c.handshake-.15,.3);
M.apply(q('.hello'),{...packet(t),opacity:visible.opacity});
M.apply(q('.packet'),packetState(t));
const contents=M.swap(t,c.back-.85);
M.apply(q('.client'),contents.old); M.apply(q('.reply'),contents.next);
M.apply(q('.share'),{...packet(t),opacity:M.visibility(t,c.piece-.25,c.handshake-.15,.3).opacity});
M.apply(q('.share-label'),M.visibility(t,c.piece-.2,c.back-.85,.25));
M.apply(q('.handshake'),M.visibility(t,c.handshake-.1,null,.5));
M.apply(q('.handshake-label'),M.visibility(t,c.handshake+.1,null,.35));
const e=flash(t);M.routeReveal(q('.pulse'),e.start,e.end);
'''
    elif index == 4:
        title = 'CHECK THE ID'
        # Start at the preceding scene's certificate location, then promote it to hero.
        content = endpoints + '''
<img class="art certificate" src="public/icons8/certificate.png" alt="The same server certificate being checked" style="left:450px;top:760px;width:180px;height:180px">
<div class="status"><span class="hf-state-content name">NAME MATCH</span><span class="hf-state-content valid">VALID</span><span class="hf-state-content issuer">TRUSTED AUTHORITY</span><span class="hf-state-content proof">SIGNATURE OK</span></div>
<svg class="hf-routes" viewBox="0 0 1080 1920"><path class="hf-route trust-route" d="M800 815 Q800 870 720 870 L625 870"/></svg>
<img class="art authority" src="public/icons8/verified-account.png" alt="Trusted certificate authority" style="left:730px;top:650px;width:160px;height:160px">
<img class="art proof-key" src="public/icons8/key.png" alt="Server proves possession of its private key; the key stays at the server" style="left:710px;top:385px;width:120px;height:120px">
<div class="caption proof-label" style="left:700px;top:520px;width:220px;font-size:26px">PROOF</div>'''
        setup = '''
const cert=M.state({x:0,y:0,scale:1},[[.3,{x:-125,y:-25,scale:1.65},'SLOW',1.4],[c.key-.7,{x:-300,y:35,scale:1.055},'SLOW',.8]]);
const focus=M.state({x:540,y:960,scale:1},[[c.name-.5,{x:530,y:930,scale:1.035},'CAMERA',1.6],[c.proves,{x:540,y:960,scale:1},'CAMERA',1.6]]);
const cam=M.camera(focus);
const status=M.state({borderColor:'#4DA3FF'},[[c.valid,{borderColor:'#63D69A'}],[c.trusted,{borderColor:'#63D69A'}]]);
'''
        draw = '''
M.apply(q('.world'),cam(t));
M.apply(q('.certificate'),{...cert(t),scale:cert(t).scale*M.impact(t,c.trusted)});
M.apply(q('.status'),{...status(t),opacity:M.visibility(t,c.name-.25,null).opacity});
const first=M.swap(t,c.valid), second=M.swap(t,c.trusted), third=M.swap(t,c.key);
M.apply(q('.name'),first.old);
M.apply(q('.valid'),t<c.trusted?first.next:second.old);
M.apply(q('.issuer'),t<c.key?{...second.next,opacity:t<c.valid?0:second.next.opacity}:third.old);
M.apply(q('.proof'),third.next);
M.apply(q('.authority'),M.visibility(t,c.authority-.3,null,.4));
q('.trust-route').setAttribute('d',`M800 815 Q800 870 720 870 L${540+cert(t).x+90*cert(t).scale+24} 870`);
M.routeReveal(q('.trust-route'),0,M.smooth((t-c.authority)/.65));
M.apply(q('.proof-key'),M.visibility(t,c.proves,null,.4));
M.apply(q('.proof-label'),M.visibility(t,c.proves+.2,null,.4));
'''
    else:
        title = 'HTTP INSIDE TLS'
        content = '<div class="shield"></div>' + route + endpoints + '''
<div class="hf-mover request"><div class="hf-payload packet"><span class="hf-state-content clear">HTTP REQUEST</span><span class="hf-state-content cipher dots">••••••</span><span class="hf-state-content response">HTTP RESPONSE</span></div></div>
<img class="art lock" src="public/icons8/lock.png" alt="TLS protection" style="left:730px;top:805px;width:180px;height:180px">
<div class="caption tls-label" style="left:690px;top:1000px;width:220px">TLS</div>
<div class="caption symmetric" style="left:170px;top:1090px;width:740px">SYMMETRIC ENCRYPTION</div>'''
        setup = '''
const out=M.travel(c.requests+.25,c.tls), back=M.travel(c.encrypts+.4,c.key,1,0);
const position=t=>t<c.encrypts+.4?out(t):back(t);
const packet=M.path(q('.route'),position,{stretch:.025});
const shell=M.state({borderColor:'#4DA3FF',borderRadius:18},[[c.requests-.5,{borderColor:'#4DD9E8',borderRadius:28}],[c.tls,{borderColor:'#7067E8'}],[c.encrypts,{borderColor:'#4DD9E8'}]]);
const focus=M.state({x:540,y:960,scale:1},[[c.requests,{x:540,y:930,scale:1.02},'CAMERA',1.5],[c.key,{x:540,y:960,scale:1},'CAMERA',1.3]]);
const cam=M.camera(focus);
'''
        draw = '''
M.apply(q('.world'),cam(t));
M.apply(q('.shield'),M.visibility(t,0,null,.5));
M.apply(q('.request'),{...packet(t),scaleY:packet(t).scaleY*M.impact(t,c.tls)});
M.apply(q('.packet'),shell(t));
const encrypt=M.swap(t,c.requests-.5), decrypt=M.swap(t,c.tls), reply=M.swap(t,c.encrypts);
M.apply(q('.clear'),encrypt.old);
M.apply(q('.cipher'),t<c.tls?encrypt.next:t<c.encrypts?decrypt.old:reply.next);
M.apply(q('.response'),t<c.encrypts?decrypt.next:reply.old);
M.apply(q('.lock'),M.visibility(t,c.tls-.35,null,.4));
M.apply(q('.tls-label'),M.visibility(t,c.tls-.1,null,.35));
M.apply(q('.symmetric'),M.visibility(t,c.symmetric,null,.45));
M.routeReveal(q('.pulse'),Math.max(0,position(t)-.1),position(t));
'''
    content = content.replace(endpoints, '')
    return f'''<template>
<style>@import url("channel/styles.css");@import url("channel/motion.css");{STYLE}</style>
<div id="root" data-composition-id="{sid}" data-width="1080" data-height="1920" data-duration="{duration:.6f}">
{endpoints}<div class="world hf-world" data-layout-allow-overflow>{content}</div><div class="headline">{title}</div>
</div>
<script>
const root=document.querySelector('[data-composition-id="{sid}"]');
const q=s=>{{const el=root.querySelector(s);if(!el)throw new Error(s);return el;}};
const M=ChannelMotion,D={duration:.6f},c={json.dumps(cues)};
const tl=gsap.timeline({{paused:true}});
{setup}
M.mount(tl,D,t=>{{{draw}}});
window.__timelines=window.__timelines||{{}};
window.__timelines['{sid}']=tl;
</script></template>''', title
