import { readFileSync, readdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";

/**
 * 모든 인터랙션에 같은 순서를 돌린다 — 새 인터랙션을 추가하면 검사도 따라온다.
 * 카드에서 모달 열기 → 데모 안 첫 조작 요소에서 Enter (Morph 패널 같은 겹침 UI 를 연다)
 * → Tab 을 한 바퀴 넘게 → Esc 로 모두 닫기.
 * 그동안 포커스가 모달 밖으로 나가지 않고, 닫은 뒤에는 아무것도 남지 않으며
 * 포커스·스크롤·카드 위치가 연 그대로여야 한다.
 */

const SRC = new URL("../../packages/interactions/src/", import.meta.url);
const INTERACTIONS = readdirSync(SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => {
    try {
      const meta = readFileSync(new URL(`${d.name}/meta.ts`, SRC), "utf8");
      const title = meta.match(/title:\s*"([^"]+)"/)?.[1];
      return title ? [{ slug: d.name, title }] : [];
    } catch {
      return [];
    }
  });

const escape = (s: string) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 스크롤 위치와 카드들의 문서 기준 위치 */
const layout = (page: Page) =>
  page.evaluate(() => ({
    scrollY: Math.round(scrollY),
    cards: [...document.querySelectorAll("article")].map((a) =>
      Math.round(a.getBoundingClientRect().top + scrollY),
    ),
  }));

/** 카드 등장·모핑 애니메이션이 끝나 배치가 멈출 때까지 기다린 값 */
async function settledLayout(page: Page) {
  let last = await layout(page);
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(150);
    const next = await layout(page);
    if (JSON.stringify(next) === JSON.stringify(last)) return next;
    last = next;
  }
  throw new Error("layout kept moving");
}

test("sweep covers every interaction", () => {
  expect(INTERACTIONS.length).toBeGreaterThanOrEqual(19);
});

for (const { slug, title } of INTERACTIONS) {
  test(`modal sweep: ${slug}`, async ({ page }) => {
    await page.goto("/");
    const opener = page
      .locator("button[data-open-interaction]")
      .filter({ hasText: new RegExp(`^${escape(title)}$`) });
    await opener.scrollIntoViewIfNeeded();
    const before = await settledLayout(page);

    await opener.click();
    const dialog = page.locator("dialog").first();
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`interaction=${slug}`));

    // 포커스가 모달 밖으로 나간 횟수를 센다
    await page.evaluate(() => {
      const w = window as unknown as { escaped: string[] };
      w.escaped = [];
      document.addEventListener("focusin", (e) => {
        const el = e.target as Element;
        if (!el.closest("dialog")) w.escaped.push(el.outerHTML.slice(0, 60));
      });
    });

    const stage = dialog.locator("[data-demo-stage]");
    const control = stage
      .locator('button, a[href], input, select, textarea, [tabindex="0"]')
      .first();
    if ((await control.count()) > 0) {
      await control.focus();
      await page.keyboard.press("Enter");
    }
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    for (let i = 0; i < 3; i++) await page.keyboard.press("Shift+Tab");
    const escaped = await page.evaluate(() => (window as unknown as { escaped: string[] }).escaped);
    expect(escaped, "focus left the modal").toEqual([]);

    // 겹친 패널이 있으면 Esc 가 그것부터 닫는다 — 모달이 닫힐 때까지 (최대 3번)
    for (let i = 0; i < 3 && /interaction=/.test(page.url()); i++) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }
    await expect(page).not.toHaveURL(/interaction=/);
    await expect(page.locator("dialog")).toHaveCount(0);
    await expect(page.locator("[role=dialog], [aria-modal=true]")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    await expect(opener).toBeFocused();

    expect(await settledLayout(page)).toEqual(before);
  });
}

test.describe("dropdowns left open when a modal opens", () => {
  for (const [name, open] of [
    ["tag select", (page: Page) => page.getByRole("combobox", { name: /tag/i }).click()],
    [
      "search suggestions",
      async (page: Page) => {
        const box = page.getByRole("combobox", { name: /search/i });
        await box.click();
        await box.pressSequentially("s");
      },
    ],
  ] as const) {
    test(name, async ({ page }) => {
      await page.goto("/");
      await open(page);
      await expect(page.getByRole("listbox")).toHaveCount(1);
      const opener = page.locator("button[data-open-interaction]").first();
      await opener.click();
      await expect(page).toHaveURL(/interaction=/);
      await expect(page.getByRole("listbox")).toHaveCount(0);
      await page.keyboard.press("Escape");
      await expect(page).not.toHaveURL(/interaction=/);
      await expect(page.getByRole("listbox")).toHaveCount(0);
      await expect(opener).toBeFocused();
    });
  }
});
