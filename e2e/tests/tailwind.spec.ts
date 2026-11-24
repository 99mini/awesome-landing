import { expect, test } from "./fixtures.ts";
import { URLS } from "./urls.ts";

/**
 * examples/tailwind — 미리 빌드된 패키지(dist)를 vanilla-extract 플러그인 없이 Tailwind v4 앱에서 쓴다.
 * 패키지 CSS 는 @layer awesome 안에 있고, 앱이 그것을 components 레이어로 가져온다 → className 의 유틸리티가 이긴다.
 */

test.beforeEach(async ({ page }) => {
  await page.goto(URLS.tailwind);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the package CSS sits inside a cascade layer", async ({ page }) => {
  const layered = await page.evaluate(() => {
    const names: string[] = [];
    const walk = (rules: CSSRuleList) => {
      for (const rule of rules) {
        if (rule instanceof CSSLayerBlockRule) {
          names.push(rule.name);
          walk(rule.cssRules);
        }
      }
    };
    for (const sheet of document.styleSheets) walk(sheet.cssRules);
    return names;
  });
  // components 안의 awesome (Tailwind 의 utilities 보다 앞)
  expect(layered).toContain("components");
  expect(layered).toContain("awesome");
});

test("Tailwind utilities override the package defaults", async ({ page }) => {
  // 팔레트 패널: 패키지 기본 폭 min(340px, 100%) ← w-[30rem]
  await page.getByRole("button", { name: "Open commands" }).click();
  const palette = page.getByRole("dialog", { name: "Command palette" });
  await expect(palette).toBeVisible();
  expect(await palette.evaluate((el) => getComputedStyle(el).width)).toBe("480px");
  await page.keyboard.press("Escape");

  // 비교 슬라이더: 패키지 기본 커서 ew-resize ← cursor-pointer
  const slider = page.getByRole("slider", { name: "Compare" });
  const cursor = await slider.evaluate(
    (el) => getComputedStyle(el.parentElement!.parentElement!).cursor,
  );
  expect(cursor).toBe("pointer");

  // 모핑 패널: 패키지 기본 폭 min(560px, 100%) ← w-[36rem]
  await page.getByRole("button", { name: "Open the details" }).click();
  const panel = page.getByRole("dialog", { name: "Details" });
  await expect(panel).toBeVisible();
  expect(await panel.evaluate((el) => getComputedStyle(el).width)).toBe("576px");
});

test("animations on the first screen run even though Motion features load later", async ({
  page,
}) => {
  // 숫자 기둥이 0 에서 제 숫자로 굴러가 있다 (1,200 → 첫 자리 1 은 -10%)
  const reel = page.locator("main p span[aria-hidden] > span").first().locator("> span");
  await expect(reel).toHaveAttribute("style", /translateY\(-10%\)/);
  // 선이 그려져 있다
  await expect
    .poll(() =>
      page
        .locator('svg[aria-label="Line chart"] path')
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
    )
    .toBe("1");
});

test("a full-screen morph modal behaves like a modal: portal, scroll lock, focus trap", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Photo" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Photo" });
  await expect(dialog).toBeVisible();

  // body 로 꺼내 열린다 (조상의 transform·overflow 에 갇히지 않게)
  expect(await dialog.evaluate((el) => el.closest("main") === null)).toBe(true);
  // 뒤 페이지가 스크롤되지 않는다
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
  // 닫기 버튼의 글자를 바꿀 수 있다
  const close = dialog.getByRole("button", { name: "Done" });
  await expect(close).toBeFocused();

  // Tab 이 패널 밖으로 나가지 않는다
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});
