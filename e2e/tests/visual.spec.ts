import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";
import { URLS } from "./urls.ts";

/**
 * 화면 회귀. 기준 이미지는 CI 의 Playwright 컨테이너에서만 만든다 —
 * PR 에 `update-snapshots` 라벨을 붙이면 CI 가 새로 찍어 그 브랜치에 커밋한다.
 * 시간에 따라 바뀌는 것(아날로그 시계, 7세그먼트 시각)은 가린다.
 */

const timeDependent = (page: Page) => [
  page.locator('svg[aria-label="Analog clock"]'),
  page.getByRole("img", { name: /^\d\d:\d\d:\d\d$/ }),
];

/** 웹폰트와 지연 로드된 데모가 자리잡을 때까지 */
async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
}

test.describe("gallery", () => {
  test("first screen", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("article").first()).toBeVisible();
    await settle(page);
    await expect(page).toHaveScreenshot("gallery-home.png", { mask: timeDependent(page) });
  });

  for (const slug of ["accordion", "swipe-cards", "reorder-list"] as const) {
    test(`modal: ${slug}`, async ({ page }) => {
      await page.goto(`/?interaction=${slug}`);
      await expect(page.locator("dialog").first()).toBeVisible();
      if (slug === "accordion") {
        await page.getByRole("button", { name: "Why not animate height?" }).click();
      }
      await settle(page);
      await expect(page).toHaveScreenshot(`gallery-modal-${slug}.png`, {
        mask: timeDependent(page),
      });
    });
  }
});

for (const name of ["aurora", "editorial", "index"] as const) {
  test.describe(`landing: ${name}`, () => {
    test("desktop first screen", async ({ page }) => {
      await page.goto(URLS[name]);
      await expect(page.locator("h1")).toBeVisible();
      await settle(page);
      await expect(page).toHaveScreenshot(`${name}-desktop.png`, { mask: timeDependent(page) });
    });

    test("phone first screen", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(URLS[name]);
      await expect(page.locator("h1")).toBeVisible();
      await settle(page);
      await expect(page).toHaveScreenshot(`${name}-phone.png`, { mask: timeDependent(page) });
    });
  });
}
