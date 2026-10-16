"""Verify final report contents and source hashes without printing embedded media."""
from pathlib import Path
import hashlib
import json
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent


def main():
    evidence = json.loads((HERE.parent / "reviewer-evidence.json").read_text())
    for name, expected in evidence["inputs"].items():
        assert hashlib.sha256((HERE.parent / name).read_bytes()).hexdigest() == expected, name
    assert hashlib.sha256(Path(evidence["guard_source"]["path"]).read_bytes()).hexdigest() == evidence["guard_source"]["sha256"]
    assert all(f["status"] == "closed" for f in evidence["findings"])
    assert evidence["status"] == "partial" and evidence["full_film_audit"] == "blocked"
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            page = browser.new_page(viewport={"width": 1180, "height": 900})
            page.goto((HERE / "motion-audit-2026-10-15.html").as_uri())
            page.wait_for_function("[...document.images].every(i=>i.complete&&i.naturalWidth>0)")
            text = page.locator("body").inner_text()
            assert "Full-film audit blocked" in text and "accepted_NaN" not in text
            assert page.locator("tbody tr").count() == 2
            assert page.locator("img").count() == 13
            assert page.evaluate("document.getAnimations().length") == 0
            page.screenshot(path=str(HERE / "report-wide.png"))
            page.set_viewport_size({"width": 390, "height": 844})
            assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
            page.emulate_media(reduced_motion="reduce")
            page.screenshot(path=str(HERE / "report-phone.png"))
        finally:
            browser.close()
    result = {"source_hashes_current": True, "findings_closed": 2, "full_film_audit": "blocked", "report_status": "partial", "embedded_images_loaded": 13, "report_animations": 0}
    (HERE / "report-check.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result))


if __name__ == "__main__":
    main()
