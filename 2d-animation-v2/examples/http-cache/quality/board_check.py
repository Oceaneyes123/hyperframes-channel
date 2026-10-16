"""Capture every selected static teaching pose independently; no motion claims."""
from pathlib import Path
import hashlib
import json
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent / "sketches/board.html"


def main():
    results = {"source_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(), "poses": []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(SOURCE.as_uri())
            page.evaluate("() => document.fonts.ready")
            assert page.locator("section").count() == 10
            assert page.locator("svg.frame").count() == 30
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
            assert page.evaluate("document.getAnimations().length") == 0
            for frame in page.locator("svg.frame").all():
                pose_id = frame.evaluate("svg=>svg.parentElement.id")
                frame.screenshot(path=str(HERE / f"{pose_id}-phone.png"))
                results["poses"].append(frame.evaluate("""svg => {
                    const s=svg.getBoundingClientRect(), k=1080/s.width;
                    const bounds=el=>{const b=el.getBoundingClientRect();return {
                        x:(b.x-s.x)*k,y:(b.y-s.y)*k,right:(b.right-s.x)*k,bottom:(b.bottom-s.y)*k};};
                    return {id:svg.parentElement.id,scenario:svg.dataset.scenario,width:s.width,
                        title:svg.getAttribute('aria-label'),caption:svg.parentElement.querySelector('figcaption').textContent,
                        texts:[...svg.querySelectorAll('text')].map(el=>({text:el.textContent,native:bounds(el),phone_font_px:parseFloat(getComputedStyle(el).fontSize)/k})),
                        essential:[...svg.querySelectorAll('[data-essential]')].map(el=>({object:el.dataset.object||el.tagName,native:bounds(el)}))};
                }"""))
            page.emulate_media(reduced_motion="reduce")
            assert page.evaluate("document.getAnimations().length") == 0
            results["reduced_motion_static"] = True
            page.set_viewport_size({"width": 1180, "height": 1000})
            page.add_style_tag(content=".poses{grid-template-columns:repeat(3,350px);gap:20px}.frame{width:350px}section{max-width:1090px}")
            for i in range(1, 11):
                page.locator(f"#line-{i}").screenshot(path=str(HERE / f"line-{i:02d}-phone-contact.png"))
            page.set_viewport_size({"width": 1200, "height": 2100})
            page.add_style_tag(content="body{padding:0}header,h2,footer,figcaption{display:none}section{margin:0;max-width:none}.poses{display:block}figure{display:none}svg.frame{width:1080px;height:1920px}")
            for frame in page.locator("svg.frame").all():
                pose_id = frame.evaluate("svg=>svg.parentElement.id")
                page.evaluate("id => {document.querySelectorAll('figure').forEach(f=>f.style.display=f.id===id?'block':'none');scrollTo(0,0)}", pose_id)
                assert frame.bounding_box() == {"x": 0, "y": 0, "width": 1080, "height": 1920}
                page.screenshot(path=str(HERE / f"{pose_id}-native.png"), clip={"x": 0, "y": 0, "width": 1080, "height": 1920})
            assert not errors, errors
            results["page_errors"] = errors
        finally:
            browser.close()
    violations = []
    for pose in results["poses"]:
        for item in pose["texts"] + pose["essential"]:
            b = item["native"]
            if b["x"] < 71.9 or b["y"] < 179.9 or b["right"] > 936.1 or b["bottom"] > 1600.1:
                violations.append({"pose": pose["id"], **item})
    results["safe_area_violations"] = violations
    (HERE / "board-check.json").write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    print(f"30 static poses captured independently at phone/native dimensions. Safe-area violations: {len(violations)}; page errors: 0.")


if __name__ == "__main__":
    main()
