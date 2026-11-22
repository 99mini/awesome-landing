import { expect, test } from "./fixtures.ts";

test.describe("morph modal inside the gallery", () => {
  test("opens in the card without opening the gallery modal and returns focus", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator("article", { hasText: "Morph Modal" });
    await card.scrollIntoViewIfNeeded();
    await card.locator("button[aria-haspopup]").nth(1).click();
    await expect(card.locator("dialog")).toHaveCount(1);
    await expect(page).not.toHaveURL(/interaction=/);
    await expect(page.locator(":focus")).toHaveText("Close");
    await page.keyboard.press("Escape");
    await expect(card.locator("dialog")).toHaveCount(0);
    await expect(page.locator(":focus")).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("Esc closes only the inner panel when nested in the gallery modal", async ({ page }) => {
    await page.goto("/?interaction=morph-modal");
    await page.locator("dialog button[aria-haspopup]").first().click();
    await expect(page.locator("dialog")).toHaveCount(2);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveCount(1);
    await expect(page).toHaveURL(/interaction=morph-modal/);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveCount(0);
  });

  test("a panel left open in a card stays under the gallery modal, which Esc still closes", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator("article", { hasText: "Morph Modal" });
    await card.scrollIntoViewIfNeeded();
    await card.locator("button[aria-haspopup]").nth(2).click();
    await expect(card.locator("dialog")).toHaveCount(1);
    await page
      .locator("article", { hasText: "Accordion" })
      .locator("[data-open-interaction]")
      .click();
    await expect(page).toHaveURL(/interaction=accordion/);
    await expect(page.locator(":focus")).not.toHaveText("Close");

    // 패널 자리의 맨 위 요소는 갤러리 모달이어야 한다 (카드 안의 z-index 가 새어 나오지 않음)
    // 패널 자리의 맨 위 요소는 갤러리 모달이어야 한다 (카드 안의 z-index 가 새어 나오지 않음).
    // 폰에서는 다른 카드로 스크롤하는 동안 이 카드가 화면 밖으로 나가 데모가 쉰다(패널도 사라진다) —
    // 그러면 덮을 것이 없다. 있는지 보고 재는 것을 한 번에 해야 그 사이에 사라지는 경우를 피한다
    const onTop = await card.evaluate((el) => {
      const panel = el.querySelector("dialog");
      if (!panel) return "no panel";
      const r = panel.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return hit?.closest("article") ? "card" : "modal";
    });
    expect(onTop).not.toBe("card");

    await page.keyboard.press("Escape");
    await expect(page).not.toHaveURL(/interaction=/);
  });
});
