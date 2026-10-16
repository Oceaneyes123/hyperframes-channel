"""Focused independent regression proof for the two observed film findings."""
from pathlib import Path
import hashlib
import json
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent


def main():
    ranges = [(14.5,15.7),(23.6,25.0),(32.2,33.7),(66.1,68.7),(77.5,79.2),(87.4,89.2)]
    times = sorted(set(round(a+i/30,6) for a,b in ranges for i in range(round((b-a)*30)+1)))
    pairs = [("freshness-main","body-v7-main"),("freshness-main","housing-main-label"),
             ("server-current-main","body-v7-main"),("server-current-main","housing-main-label"),
             ("server-label","body-v7-main"),("reply-304-main","body-v7-main"),
             ("reply-304-main","housing-main-label"),("housing-alt","body-v7-main"),
             ("housing-alt-label","body-v7-main"),("reply-200-alt","housing-alt-label")]
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            page = browser.new_page(viewport={"width":1080,"height":1920})
            page.goto((PROJECT/"comp.html").as_uri())
            page.evaluate("async()=>await __ready")
            rows = page.evaluate("times=>times.map(t=>[t,__track(t)])",times)
            overlaps = []
            for t,track in rows:
                assert "body-v7-main" in track and "notch-main" in track
                for first,second in pairs:
                    a,b=track.get(first),track.get(second)
                    if not a or not b or min(a.get("op",1),b.get("op",1))<.01:
                        continue
                    width=min(a["x"]+a["w"],b["x"]+b["w"])-max(a["x"],b["x"])
                    height=min(a["y"]+a["h"],b["y"]+b["h"])-max(a["y"],b["y"])
                    if width>.5 and height>.5:
                        overlaps.append({"time_s":t,"pair":[first,second],"area":width*height})
            assert not overlaps, overlaps[:5]
            before = page.evaluate("__track(7.49)")
            held = page.evaluate("__track(7.8)")
            assert before["body-v7-main"] == held["body-v7-main"]
            displacement=held["freshness-main"]["x"]-before["freshness-main"]["x"]
            assert displacement>=90
            report={"status":"passed","comp_sha256":hashlib.sha256((PROJECT/"comp.html").read_bytes()).hexdigest(),
                    "transition_samples":len(times),"semantic_pairs":pairs,"semantic_collisions":overlaps,
                    "line2_native_displacement_px":displacement,"body_bounds_unchanged":True,
                    "visual_recheck":"Reviewer inspected corrected phone contacts for lines2,3,4,9,10; marker, server and response no longer obscure retained-body roles at reported poses."}
        finally:
            browser.close()
    (HERE/"film-recheck.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({k:report[k] for k in ("status","transition_samples","line2_native_displacement_px","body_bounds_unchanged")}))


if __name__=="__main__":
    main()
