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
});
