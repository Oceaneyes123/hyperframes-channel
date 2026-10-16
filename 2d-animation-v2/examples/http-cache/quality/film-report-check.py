"""Verify the final supported-audit report without printing embedded images."""
from pathlib import Path
import hashlib
import json
from playwright.sync_api import sync_playwright

HERE=Path(__file__).resolve().parent
PROJECT=HERE.parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    raw=json.loads((PROJECT/"reviewer-film-evidence.json").read_text())
    for name,expected in raw["current_inputs"].items():
        assert sha(PROJECT/name)==expected,name
    assert raw["original_skill"]["execution_status"]=="partial"
    assert all(f["status"]=="closed" and f["recheck_evidence"] for f in raw["findings"])
    for finding in raw["findings"]:
        assert all((PROJECT/name).is_file() for name in finding["recheck_evidence"])
    timing=json.loads((HERE/"film-timing-check.json").read_text())
    assert sha(PROJECT/"audio/narration.wav")==timing["mix_sha256"]
    assert all(sha(PROJECT/passage["source"])==passage["sha256"] for passage in timing["passages"])
    assert not list(PROJECT.rglob("*.mp4"))
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        try:
            page=browser.new_page(viewport={"width":1180,"height":900})
            page.goto((HERE/"film-audit-2026-10-16.html").as_uri())
            page.wait_for_function("[...document.images].every(i=>i.complete&&i.naturalWidth>0)")
            assert page.locator("img").count()==20
            assert page.locator("tbody tr").count()==2
            assert "Original skill execution remains partial" in page.locator("body").inner_text()
            page.screenshot(path=str(HERE/"film-report-wide.png"))
            page.set_viewport_size({"width":390,"height":844})
            assert page.evaluate("document.documentElement.scrollWidth<=innerWidth")
            page.screenshot(path=str(HERE/"film-report-phone.png"))
        finally:
            browser.close()
    result={"status":"passed","current_source_hashes":True,"source_wavs_and_mix_unchanged":True,"closed_findings":2,
            "embedded_images_loaded":20,"phone_report_overflow":False,"mp4_files":0,"upstream_skill_status":"partial","human_audio_confirmation":"outstanding"}
    (HERE/"film-report-check.json").write_text(json.dumps(result,indent=2)+"\n")
    print(json.dumps(result))


if __name__=="__main__":
    main()
