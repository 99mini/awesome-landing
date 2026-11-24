import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";
import { URLS } from "./urls.ts";

/**
 * 갤러리와 랜딩 화면의 접근성 (데모는 Storybook 이 스토리마다 axe 로 본다).
 * 대비는 테마마다 따로 깨질 수 있어 다크·라이트를 모두 돈다.
 */

async function audit(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  // 실패하면 어떤 규칙·요소인지 바로 보이게
  expect(
    violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
  ).toEqual([]);
}

/** 등장 애니메이션·지연 로드가 끝난 뒤 (흐린 중간 상태로 대비를 재지 않게) */
async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
}

for (const scheme of ["dark", "light"] as const) {
  test.describe(`${scheme} theme`, () => {
    test.use({ colorScheme: scheme });

    test("first screen", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("article").first()).toBeVisible();
      await settle(page);
      await audit(page);
    });

    test("interaction modal with controls and source", async ({ page }) => {
      await page.goto("/?interaction=accordion");
      await expect(page.locator("dialog :focus")).toHaveCount(1);
      await settle(page);
      await audit(page);
    });

    test("search palette", async ({ page }) => {
      await page.goto("/");
      await settle(page);
      await page.getByRole("button", { name: /^Search/ }).click();
      await expect(page.getByRole("combobox", { name: "Search the gallery" })).toBeFocused();
      await page.waitForTimeout(400);
      await audit(page);
    });
  });
}

// 랜딩도 시스템 테마를 따른다 — 각 랜딩의 기본 테마와 반대 테마를 모두 본다
for (const scheme of ["dark", "light"] as const) {
  test.describe(`landings, ${scheme} system theme`, () => {
    test.use({ colorScheme: scheme });
    for (const name of ["aurora", "editorial", "index", "ochre"] as const) {
      test(name, async ({ page }) => {
        await page.goto(URLS[name]);
        await expect(page.locator("h1")).toBeVisible();
        // 아래 섹션의 등장 애니메이션까지 끝나게 한 번 훑는다
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
            scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          scrollTo(0, 0);
        });
        await settle(page);
        await audit(page);
      });
    }
  });
}
