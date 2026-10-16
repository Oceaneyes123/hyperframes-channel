"""Independent static preview evidence; no animation or approval is implied."""
from pathlib import Path
import hashlib
import json
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
SOURCE = PROJECT / "sketches/concepts.html"


def main():
    results = {"source_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(), "views": []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(SOURCE.as_uri())
            page.evaluate("() => document.fonts.ready")
            assert page.locator("svg.frame").count() == 3
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
            assert page.evaluate("document.getAnimations().length") == 0
            page.screenshot(path=str(HERE / "board-phone.png"), full_page=True)
            normal = page.screenshot(full_page=True)
            page.emulate_media(reduced_motion="reduce")
            assert page.screenshot(full_page=True) == normal
            results["reduced_motion_static_unchanged"] = True
            for label in ("a", "b", "c"):
                node = page.locator(f"#concept-{label} svg.frame")
                node.screenshot(path=str(HERE / f"{label}-phone.png"))
                results["views"].append({"concept": label, "frame_css_width": node.bounding_box()["width"],
                    "texts": node.evaluate("""svg => [...svg.querySelectorAll('text')].map(el => {
                        const b=el.getBoundingClientRect(), s=svg.getBoundingClientRect(), k=1080/s.width;
                        return {text:el.textContent, native:{x:(b.x-s.x)*k,y:(b.y-s.y)*k,
                            right:(b.right-s.x)*k,bottom:(b.bottom-s.y)*k},
                            phone_font_px:parseFloat(getComputedStyle(el).fontSize)/k};
                    })""")})
            page.emulate_media(reduced_motion="no-preference")
            page.set_viewport_size({"width": 1200, "height": 2100})
            page.add_style_tag(content="body{padding:0}header,footer,figcaption{display:none}main{display:block;margin:0;max-width:none}figure{display:none}svg.frame{width:1080px;height:1920px}")
            for label in ("a", "b", "c"):
                page.evaluate("label => document.querySelectorAll('figure').forEach(f=>f.style.display=f.id==='concept-'+label?'block':'none')", label)
                page.locator(f"#concept-{label} svg.frame").screenshot(path=str(HERE / f"{label}-native.png"))
            assert not errors, errors
            results["page_errors"] = errors
            results["animation_count"] = 0
        finally:
            browser.close()
    (HERE / "static-check.json").write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    outside = [{"concept": view["concept"], **text} for view in results["views"] for text in view["texts"]
               if text["native"]["x"] < 72 or text["native"]["right"] > 936
               or text["native"]["y"] < 180 or text["native"]["bottom"] > 1600]
    (HERE / "safe-area.json").write_text(json.dumps(outside, indent=2) + "\n", encoding="utf-8")
    print("Static assertions passed: 3 concepts; 350px phone and native 1080x1920 captures; no page errors/animation/overflow; reduced-motion unchanged.")
    print(f"Teaching text outside the production safe area: {len(outside)}")


if __name__ == "__main__":
    main()
