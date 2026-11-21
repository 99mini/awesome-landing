import { expect, test } from "./fixtures.ts";

test("offscreen cards pause their demo and keep their height", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("article");
  const last = cards.last();
  // 맨 아래 카드는 처음에 화면 밖 — 데모가 내려가 있다
  await expect(last.locator("[data-demo-paused]")).toHaveCount(1);
  const first = cards.first();
  const before = (await first.boundingBox())!.height;

  await last.scrollIntoViewIfNeeded();
  await expect(last.locator("[data-demo-paused]")).toHaveCount(0);
  await expect(first.locator("[data-demo-paused]")).toHaveCount(1);
  // 내려간 동안에도 높이는 그대로라 masonry 가 다시 섞이지 않는다
  expect((await first.boundingBox())!.height).toBeCloseTo(before, 0);
});
