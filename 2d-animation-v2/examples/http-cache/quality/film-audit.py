"""Independent browser evidence for the approved preview; never encodes video."""
from pathlib import Path
import hashlib
import json
import sys
import time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def state(page):
    return page.evaluate("""() => ({visual:T,audio:voice.currentTime,paused:voice.paused,ended:voice.ended,
        ready:voice.readyState,muted:voice.muted,volume:voice.volume,rate:voice.playbackRate,
        media:[...document.querySelectorAll('audio,video')].map(x=>({src:x.currentSrc,paused:x.paused})),
        reduced:reduced.checked})""")


def setup(browser, preview=False, reduced="no-preference"):
    page = browser.new_page(viewport={"width": 390 if preview else 1080, "height": 844 if preview else 1920}, reduced_motion=reduced)
    events = {"page_errors": [], "console_errors": [], "requests": []}
    page.on("pageerror", lambda error: events["page_errors"].append(str(error)))
    page.on("console", lambda message: events["console_errors"].append(message.text) if message.type == "error" else None)
    page.on("request", lambda request: events["requests"].append(request.url))
    page.goto((PROJECT / "comp.html").as_uri() + ("?preview" if preview else ""))
    page.evaluate("async()=>await __ready")
    return page, events


def capture(browser, beats):
    page, events = setup(browser)
    duration = beats["duration_s"]
    report = {"comp_sha256": sha(PROJECT / "comp.html"), "metadata": page.evaluate("__meta"), "captures": [], "determinism": [], "unsafe": []}
    action_keys = ["l1_expired", "l2_freshness", "l3_reuse", "l4_stale", "l5_send", "l6_compare", "l7_status304", "l8_status200", "l9_rules", "l10_reuse"]
    offsets = [.12, .12, .4, .18, .55, .25, .7, 1.25, .12, .45]
    samples = []
    for i, (line, key, offset) in enumerate(zip(beats["narration"], action_keys, offsets), 1):
        samples.extend([(i, "before", line["start_s"] + .05), (i, "action", beats["events"][key] + offset),
                        (i, "result", line["start_s"] + line["duration_s"] - .3)])
    for line, phase, moment in samples:
        page.evaluate("t=>__seek(t)", moment)
        path = HERE / f"film-line-{line:02d}-{phase}-native.png"
        page.locator("#film").screenshot(path=str(path))
        report["captures"].append({"line": line, "phase": phase, "time_s": moment, "native": path.name,
                                   "track": page.evaluate("t=>__track(t)", moment)})
    for moment in [0, 7.63, 23.7, 39.6, 57.4, 71.32, 94.5, duration]:
        page.evaluate("t=>__seek(t)", moment)
        before = page.locator("#film").screenshot()
        for other in [duration, 0, 44.5, moment]:
            page.evaluate("t=>__seek(t)", other)
        after = page.locator("#film").screenshot()
        assert before == after, ("Non-deterministic seek", moment)
        assert all(x["paused"] for x in state(page)["media"]), "Seek started media"
        report["determinism"].append(moment)
    moments = sorted(set([i / 6 for i in range(int(duration * 6) + 1)] + [0, duration, 4.06, 6.67, 31, 32.31] +
                         [max(0, min(duration, n["start_s"] + delta)) for n in beats["narration"] for delta in [-1 / 30, 0, 1 / 30]]))
    tracks = page.evaluate("times=>times.map(t=>[t,__track(t)])", moments)
    for moment, boxes in tracks:
        for name, box in boxes.items():
            if box.get("op", 1) < .01:
                continue
            if not (box["x"] >= 71.5 and box["y"] >= 179.5 and box["x"] + box["w"] <= 936.5 and box["y"] + box["h"] <= 1600.5):
                report["unsafe"].append({"time_s": moment, "id": name, "box": box})
    report["sampled_bounds_times"] = len(moments)
    # Capture the approved separation gesture at phone size, including its peak.
    phone, phone_events = setup(browser, True)
    assert phone.evaluate("document.documentElement.scrollWidth<=innerWidth")
    for item in report["captures"]:
        phone.evaluate("t=>__seek(t)", item["time_s"])
        name = item["native"].replace("native", "phone")
        phone.locator("#film").screenshot(path=str(HERE / name))
        item["phone"] = name
    for label, moment in [("l2-before", 7.45), ("l2-peak", 7.67), ("l2-after", 7.92), ("long-rest", 52)]:
        phone.evaluate("t=>__seek(t)", moment)
        phone.locator("#film").screenshot(path=str(HERE / f"film-{label}-phone.png"))
    report["phone_canvas_box"] = phone.locator("#film").bounding_box()
    for line in range(1, 11):
        items = [x for x in report["captures"] if x["line"] == line]
        images = [Image.open(HERE / x["phone"]).convert("RGB") for x in items]
        w, h = images[0].size
        sheet = Image.new("RGB", (w * 3 + 40, h + 40), "#e9eaf0")
        draw = ImageDraw.Draw(sheet)
        for j, (im, item) in enumerate(zip(images, items)):
            sheet.paste(im, (j * (w + 20), 40))
            draw.text((j * (w + 20) + 5, 8), f"{item['phase']} {item['time_s']:.3f}s", fill="#16334a")
        sheet.save(HERE / f"film-line-{line:02d}-phone-contact.png")
    # Keyboard, pause, seek, restart and reduced-motion preview controls.
    phone.locator("body").click(position={"x": 3, "y": 3})
    phone.keyboard.press("Space")
    phone.wait_for_timeout(700)
    playing = state(phone)
    assert not playing["paused"] and playing["audio"] > 0
    phone.keyboard.press("Space")
    phone.wait_for_timeout(150)
    paused = state(phone)
    phone.wait_for_timeout(300)
    assert state(phone)["audio"] == paused["audio"] and paused["paused"]
    phone.keyboard.press("ArrowRight")
    phone.wait_for_timeout(150)
    assert abs(state(phone)["audio"] - paused["audio"] - 5) < .05
    phone.keyboard.press("Home")
    assert state(phone)["audio"] == 0 and state(phone)["paused"]
    phone.locator("#seek").fill("56.8")
    phone.locator("#seek").dispatch_event("input")
    phone.wait_for_timeout(100)
    assert abs(state(phone)["visual"] - 56.8) < .05
    phone.locator("#reduced").check()
    assert state(phone)["reduced"]
    # Export's pure __seek is invariant under preview reduced-motion preference.
    page.evaluate("__seek(7.67)")
    standard = page.locator("#film").screenshot()
    page.emulate_media(reduced_motion="reduce")
    page.evaluate("__seek(7.67)")
    assert page.locator("#film").screenshot() == standard
    reduced_page, reduced_events = setup(browser, True, "reduce")
    assert state(reduced_page)["reduced"]
    report["controls"] = {"keyboard_play_pause_seek_home": "passed", "slider_seek": "passed", "reduced_motion_default_and_toggle": "passed", "export_seek_unchanged_by_preference": "passed", "playing_state": playing, "paused_state": paused}
    report["browser_events"] = {"native": events, "phone": phone_events, "reduced": reduced_events}
    (HERE / "film-capture-check.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    assert not events["page_errors"] + phone_events["page_errors"] + reduced_events["page_errors"]
    print(f"Capture complete:30 phone/native poses;{len(moments)} bounds samples;unsafe={len(report['unsafe'])};8 deterministic targets;controls passed.", flush=True)


def playback(browser, muted):
    source_hash = sha(PROJECT / "comp.html")
    assert source_hash == json.loads((HERE / "film-capture-check.json").read_text())["comp_sha256"], "Composition changed after capture review"
    page, events = setup(browser, True)
    page.evaluate("muted=>voice.muted=muted", muted)
    page.evaluate("""() => {window.__auditFrameTimes=[];const collect=now=>{
        window.__auditFrameTimes.push(now);requestAnimationFrame(collect)};requestAnimationFrame(collect)}""")
    page.locator("#play").click()
    began = time.monotonic()
    samples = []
    frames = []
    last_frame = -1
    last_progress = -1
    while True:
        sample = state(page)
        sample["wall_s"] = time.monotonic() - began
        sample["sync_error_s"] = abs(sample["visual"] - sample["audio"])
        samples.append(sample)
        if not muted and int(sample["audio"]) != last_frame:
            last_frame = int(sample["audio"])
            frame_path = HERE / f"film-realtime-{last_frame:03d}-phone.png"
            page.locator("#film").screenshot(path=str(frame_path))
            frames.append({"time_s": state(page)["audio"], "path": frame_path.name})
        group = int(sample["wall_s"] / 10)
        if group != last_progress:
            print(f"{'Muted' if muted else 'Sound-enabled API-state'} playback:audio={sample['audio']:.2f}s/visual={sample['visual']:.2f}s/wall={sample['wall_s']:.2f}s", flush=True)
            last_progress = group
        if sample["ended"]:
            break
        assert sample["wall_s"] < 125, "Realtime playback did not finish"
        page.wait_for_timeout(500)
    duration = page.evaluate("__meta.dur")
    assert samples[-1]["audio"] >= duration - .05
    assert 95 < samples[-1]["wall_s"] < 120
    assert max(x["sync_error_s"] for x in samples) < .15
    assert all(x["rate"] == 1 for x in samples)
    assert all(sum(not media["paused"] for media in x["media"]) <= 1 for x in samples)
    assert not events["page_errors"]
    assert sha(PROJECT / "comp.html") == source_hash, "Composition changed during playback"
    raf = page.evaluate("__auditFrameTimes")
    intervals = sorted(b-a for a,b in zip(raf,raf[1:]))
    report = {"comp_sha256": source_hash, "muted": muted,
              "scope": "Complete realtime browser playback and audio API state. This is not audible listening.",
              "max_sync_error_s": max(x["sync_error_s"] for x in samples), "samples": samples, "browser_events": events,
              "frames": frames, "raf_intervals_ms": {"count": len(intervals), "median": intervals[len(intervals)//2], "p95": intervals[int(len(intervals)*.95)], "maximum": max(intervals)}}
    for group in range(10):
        items = [x for x in frames if group*10 <= x["time_s"] < (group+1)*10]
        if not items:
            continue
        images = [Image.open(HERE / x["path"]).convert("RGB") for x in items]
        w, h = images[0].size
        sheet = Image.new("RGB", ((w+10)*5-10, (h+30)*2), "#e9eaf0")
        draw = ImageDraw.Draw(sheet)
        for j,(image,item) in enumerate(zip(images, items)):
            x,y=(j%5)*(w+10),(j//5)*(h+30)
            sheet.paste(image,(x,y+30));draw.text((x+5,y+7),f"{item['time_s']:.2f}s",fill="#16334a")
        sheet.save(HERE/f"film-realtime-{group:02d}-contact.png")
    path = HERE / ("film-playback-muted.json" if muted else "film-playback-audio-state.json")
    path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    page.close()
    print(f"Full playback passed;muted={muted};samples={len(samples)};max_sync_error={report['max_sync_error_s']:.4f}s.", flush=True)


def main():
    beats = json.loads((PROJECT / "motion_beats.json").read_text())
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            if len(sys.argv) == 1 or sys.argv[1] == "capture":
                capture(browser, beats)
            elif sys.argv[1] == "playback":
                playback(browser, False)
                playback(browser, True)
            else:
                raise ValueError("Use capture or playback")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
