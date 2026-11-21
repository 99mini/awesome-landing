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
    const box = await card.locator("dialog").boundingBox();
    if (!box) throw new Error("card panel has no box");
    const onTop = await page.evaluate(
      ([x, y]) => (document.elementFromPoint(x!, y!)?.closest("article") ? "card" : "modal"),
      [box.x + box.width / 2, box.y + box.height / 2],
    );
    expect(onTop).toBe("modal");

    await page.keyboard.press("Escape");
    await expect(page).not.toHaveURL(/interaction=/);
  });
});
