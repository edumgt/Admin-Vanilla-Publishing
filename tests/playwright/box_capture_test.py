import os
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import expect, sync_playwright


ROOT_DIR = Path(__file__).resolve().parents[2]
VIDEO_FILE = ROOT_DIR / "1.mp4"
SCREENSHOT_FILE = ROOT_DIR / "DOCS" / "box-ai-playwright.png"
BASE_URL = os.environ.get("PLAYWRIGHT_BASE_URL", "http://static:4173")


def main() -> None:
    if not VIDEO_FILE.exists():
        raise FileNotFoundError(f"Test video not found: {VIDEO_FILE}")

    SCREENSHOT_FILE.parent.mkdir(parents=True, exist_ok=True)
    wait_for_static_server()

    with sync_playwright() as playwright:
        browser = playwright.firefox.launch()
        page = browser.new_page(viewport={"width": 1600, "height": 1600}, device_scale_factor=1)
        console_errors: list[str] = []
        page_errors: list[str] = []

        page.on("console", lambda message: console_errors.append(f"{message.type}: {message.text}") if message.type == "error" else None)
        page.on("pageerror", lambda error: page_errors.append(str(error)))

        try:
            page.goto(f"{BASE_URL}/box.html", wait_until="networkidle", timeout=60_000)
            page.locator("#fileInput").set_input_files(str(VIDEO_FILE))

            expect(page.locator("#analysisStatus")).to_have_text("분석 완료", timeout=90_000)
            expect(page.locator("#verdict")).to_have_text("AI 생성 가능성 높음", timeout=90_000)
            expect(page.locator("#aiProbability")).not_to_have_text("-", timeout=90_000)
            expect(page.locator("#indicatorList .indicator-tile")).to_have_count(7, timeout=90_000)

            page.locator("#content").screenshot(path=str(SCREENSHOT_FILE))
        except PlaywrightTimeoutError as exc:
            print(f"Result summary: {page.locator('#resultSummary').text_content()}")
            print(f"Verdict: {page.locator('#verdict').text_content()}")
            print(f"AI Probability: {page.locator('#aiProbability').text_content()}")
            print(f"Confidence: {page.locator('#confidence').text_content()}")
            print(f"Frame Average: {page.locator('#frameAverage').text_content()}")
            print(f"Temporal Delta: {page.locator('#temporalDelta').text_content()}")
            if console_errors:
                print("Console errors:")
                for entry in console_errors:
                    print(entry)
            if page_errors:
                print("Page errors:")
                for entry in page_errors:
                    print(entry)
            raise RuntimeError("Playwright test timed out while waiting for the AI analysis UI.") from exc
        except AssertionError:
            print(f"Result summary: {page.locator('#resultSummary').text_content()}")
            print(f"Verdict: {page.locator('#verdict').text_content()}")
            print(f"AI Probability: {page.locator('#aiProbability').text_content()}")
            print(f"Confidence: {page.locator('#confidence').text_content()}")
            print(f"Frame Average: {page.locator('#frameAverage').text_content()}")
            print(f"Temporal Delta: {page.locator('#temporalDelta').text_content()}")
            if console_errors:
                print("Console errors:")
                for entry in console_errors:
                    print(entry)
            if page_errors:
                print("Page errors:")
                for entry in page_errors:
                    print(entry)
            raise
        finally:
            browser.close()


def wait_for_static_server() -> None:
    last_error: Exception | None = None

    for _ in range(30):
        try:
            with urllib.request.urlopen(f"{BASE_URL}/box.html", timeout=2) as response:
                if response.status == 200:
                    return
        except Exception as exc:  # pragma: no cover
            last_error = exc
            time.sleep(1)

    raise RuntimeError("Static server did not become ready in time.") from last_error


if __name__ == "__main__":
    main()
