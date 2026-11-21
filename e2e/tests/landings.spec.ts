import { expect, test } from "./fixtures.ts";
import { URLS } from "./urls.ts";

const LANDINGS = ["aurora", "editorial", "index"] as const;

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
