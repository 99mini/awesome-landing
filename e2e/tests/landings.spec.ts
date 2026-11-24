import { expect, test } from "./fixtures.ts";
import { URLS } from "./urls.ts";

const LANDINGS = ["aurora", "editorial", "index", "ochre"] as const;

for (const name of LANDINGS) {
  test.describe(`landing: ${name}`, () => {
    test("loads with its favicon and a headline", async ({ page }) => {
      const failed: string[] = [];
      page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
      await page.goto(URLS[name]);
      await expect(page.locator("h1")).toBeVisible();
      expect(failed).toEqual([]);
    });

    test("no horizontal scroll on a phone", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(URLS[name]);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false,
      );
    });

    test("every focusable element shows our focus ring", async ({ page }) => {
      await page.goto(URLS[name]);
      await expect(page.locator("h1")).toBeVisible();
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const ring = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          return getComputedStyle(el).outlineStyle;
        });
        if (ring === null) break;
        expect(ring, "browser default ring only").not.toBe("auto");
      }
    });
  });
}

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

test.describe("landing: ochre", () => {
  test("its counts come from the page, and its actions tell the truth", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(URLS.ochre);

    // 숫자는 비교 화면 두 글의 실제 단어 수
    const thread = await page
      .getByRole("figure", { name: "Team chat thread" })
      .locator("p")
      .allInnerTexts();
    // 이름(첫 줄)을 빼고 말한 내용만 센다
    const threadWords = thread.reduce((n, t) => n + words(t.split("\n").slice(1).join(" ")), 0);
    await page.getByText("Thread words").scrollIntoViewIfNeeded();
    await expect(page.locator("dd").first()).toContainText(String(threadWords));

    // 링크 복사는 실제로 복사한다
    await page.getByRole("button", { name: "Copy page link" }).click();
    await expect(page.getByRole("status")).toContainText("Link copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());

    // 가입은 예시 페이지라 아무것도 보내지 않았다고 알린다
    await page.getByRole("button", { name: "Request access" }).first().click();
    await expect(page.getByRole("status")).toContainText("Nothing was sent");
  });

  test("the story picture follows the step in the middle of the screen", async ({ page }) => {
    await page.goto(URLS.ochre);
    await page
      .getByRole("heading", { name: "Publish everywhere" })
      .evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(page.getByText("Email digest", { exact: true })).toBeVisible();
  });
});
