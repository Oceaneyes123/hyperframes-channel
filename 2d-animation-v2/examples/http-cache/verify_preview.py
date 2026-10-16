"""Check this trial's full native timeline, portrait captures and player behavior."""
import hashlib
import json
from pathlib import Path
import time
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent


def main():
    timeline = json.loads((ROOT / "motion_beats.json").read_text())
    out = ROOT / "animator-captures"
    out.mkdir(exist_ok=True)
    results = {"comp_sha256": hashlib.sha256((ROOT / "comp.html").read_bytes()).hexdigest(),
               "samples": [], "page_errors": [], "external_requests": []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1080, "height": 1920})
        page.on("pageerror", lambda e: results["page_errors"].append(str(e)))
        page.on("request", lambda r: results["external_requests"].append(r.url) if not r.url.startswith((ROOT.as_uri(), "data:", "blob:")) else None)
        page.goto((ROOT / "comp.html").as_uri())
        page.evaluate("window.__ready")
        results["timeline"] = page.evaluate("""() => {
            const violations=[], collisions=[], N=Math.ceil(__meta.dur*30);
            const separatePairs=[
                ['freshness-main','body-v7-main'],['freshness-main','housing-main-label'],
                ['server-current-main','body-v7-main'],['server-current-main','housing-main-label'],
                ['server-label','body-v7-main'],['reply-304-main','body-v7-main'],
                ['reply-304-main','housing-main-label'],['housing-alt','body-v7-main'],
                ['housing-alt-label','body-v7-main'],['reply-200-alt','housing-alt-label']
            ];
            let previous='',still=0,longest=0,run=0;
            for(let frame=0;frame<N;frame++){
                const t=frame/30;__seek(t);const boxes=__track(t),signature=JSON.stringify(boxes);
                if(signature===previous){still++;run++;longest=Math.max(longest,run);}else run=0;
                previous=signature;
                for(const [id,b] of Object.entries(boxes))if(b.op>.1&&(b.x<71.9||b.y<179.9||b.x+b.w>936.1||b.y+b.h>1600.1)){
                    if(violations.length<40)violations.push({t,id,box:b});
                }
                for(const [left,right] of separatePairs){
                    const a=boxes[left],b=boxes[right];
                    if(a?.op>.05&&b?.op>.05&&Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>.5&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>.5){
                        if(collisions.length<40)collisions.push({t,left,right,a,b});
                    }
                }
            }
            return {frames:N,safe_area_violations:violations,semantic_collisions:collisions,
                collision_pairs:separatePairs,
                allowed_overlap:'Containing housings/body/notch/labels, server/current validator/request, and local-display source-to-view transfer are intentional; not a global no-overlap rule.',
                tracked_still_fraction:still/N,longest_tracked_rest_s:longest/30};
        }""")
        results['line2_separation'] = page.evaluate("""() => {
            __seek(E.l2_freshness);const before=__track(E.l2_freshness);
            __seek(E.l2_freshness+.18);const after=__track(E.l2_freshness+.18);
            return {cue_s:E.l2_freshness,tab_displacement_px:after['freshness-main'].x-before['freshness-main'].x,
                phone_displacement_px:(after['freshness-main'].x-before['freshness-main'].x)*358/1080,
                body_before:before['body-v7-main'],body_after:after['body-v7-main']};
        }""")
        assert results['line2_separation']['tab_displacement_px'] >= 90
        assert results['line2_separation']['body_before'] == results['line2_separation']['body_after']
        for index, line in enumerate(timeline["narration"], 1):
            cues = [cue["time_s"] for cue in line["cues"]]
            samples = [line["start_s"] + .05, cues[len(cues)//2] + .25,
                       line["start_s"] + line["duration_s"] - .15]
            tiles = []
            for phase, moment in zip(("before", "action", "result"), samples):
                page.evaluate("t => __seek(t)", moment)
                path = out / f"line-{index:02d}-{phase}.png"
                page.locator("#film").screenshot(path=str(path))
                image = Image.open(path).convert("RGB").resize((270, 480))
                tiles.append(image)
                results["samples"].append({"line": index, "phase": phase, "time_s": moment,
                                           "path": path.relative_to(ROOT).as_posix()})
            contact = Image.new("RGB", (810, 510), "#16334a")
            for column, tile in enumerate(tiles):
                contact.paste(tile, (column*270, 30))
            ImageDraw.Draw(contact).text((10, 9), f"Line {index}: before / action / result (measured cue times)", fill="white")
            contact.save(out / f"line-{index:02d}-contact.png")
        results["deterministic_seeks"] = []
        for target in (0, 3.7, timeline["events"]["l5_send"]+.45,
                       timeline["events"]["l8_status200"]+1.2, timeline["duration_s"]-.1):
            page.evaluate("t => __seek(t)", target)
            before = page.locator("#film").screenshot()
            for moment in (timeline["duration_s"]-.05, .1, 47.7, target):
                page.evaluate("t => __seek(t)", moment)
            assert page.locator("#film").screenshot() == before, target
            results["deterministic_seeks"].append(target)
        assert page.evaluate("document.querySelector('#voice').paused"), "A pure seek started narration"
        page.goto((ROOT / "comp.html").as_uri()+"?preview")
        page.evaluate("window.__ready")
        page.locator("#play").click()
        page.wait_for_timeout(1400)
        running = page.evaluate("({paused:voice.paused,audio_s:voice.currentTime,visual_s:T,playing:document.querySelectorAll('audio').length})")
        assert not running["paused"] and running["audio_s"] > .5
        assert abs(running["audio_s"]-running["visual_s"]) < .08, running
        page.locator("#play").click()
        frozen = page.evaluate("voice.currentTime")
        page.wait_for_timeout(250)
        assert abs(page.evaluate("voice.currentTime")-frozen) < .02
        page.locator("#seek").fill("63.5")
        page.wait_for_timeout(120)
        assert abs(page.evaluate("voice.currentTime")-63.5) < .05
        assert abs(page.evaluate("T")-63.5) < .05
        page.locator("#restart").click()
        assert page.evaluate("voice.paused && voice.currentTime===0 && T===0")
        page.locator("#reduced").check()
        page.evaluate("__seek(39.5)")
        reduced_export = page.locator("#film").screenshot()
        page.locator("#reduced").uncheck()
        page.evaluate("__seek(39.5)")
        assert page.locator("#film").screenshot() == reduced_export, "Preview preference changed export"
        page.locator("body").click(position={"x":10,"y":10})
        page.keyboard.press("ArrowRight")
        assert 4.9 <= page.evaluate("voice.currentTime") <= 5.1
        page.keyboard.press("Home")
        assert page.evaluate("voice.currentTime===0")
        results["player"] = {"running_sample": running,"pause": "PASS", "seek": "PASS",
                             "restart": "PASS", "keyboard": "PASS", "reduced_motion_export_isolation": "PASS",
                             "audible_listening": "Not performed; media API playback and clock synchronization only"}
        page.set_viewport_size({"width":390,"height":844})
        for line in (1,3,5,6,7,8,9,10):
            record=timeline["narration"][line-1]
            moment=record["start_s"]+record["duration_s"]-.15
            page.evaluate("t => __seek(t)",moment)
            page.locator("#film").screenshot(path=str(out/f"line-{line:02d}-phone.png"))
        for moment in (7.627,15.162,24.389,77.734,88.076):
            page.evaluate("t => __seek(t)",moment)
            page.locator("#film").screenshot(path=str(out/f"revision-{moment:.3f}-phone.png"))
        browser.close()
    (ROOT / "tool-evidence/preview-check.json").write_text(json.dumps(results, indent=2)+"\n",encoding="utf-8")
    assert not results["page_errors"], results["page_errors"]
    assert not results["external_requests"], results["external_requests"]
    assert not results["timeline"]["safe_area_violations"], results["timeline"]["safe_area_violations"]
    assert not results["timeline"]["semantic_collisions"], results["timeline"]["semantic_collisions"]
    print(json.dumps({"timeline":results["timeline"],"deterministic_targets":len(results["deterministic_seeks"]),
                      "captures":len(results["samples"]),"player":results["player"]},indent=2))


if __name__ == "__main__":
    main()
