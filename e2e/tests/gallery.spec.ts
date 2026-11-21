import { expect, modal, test } from "./fixtures.ts";

test.describe("gallery routing and modal", () => {
  test("lists every interaction and the count matches", async ({ page }) => {
    await page.goto("/");
    const summary = page.locator("search [aria-live]");
    await expect(summary).toHaveText(/^(\d+) of \1$/);
    const total = Number((await summary.textContent())!.split(" ")[0]);
    await expect(page.locator("article")).toHaveCount(total);
  });

  test("card opens the modal via ?interaction=, Esc and Back close it", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("article", { hasText: "Magnetic Button" })
      .locator("[data-open-interaction]")
      .click();
    await expect(page).toHaveURL(/interaction=magnetic-button/);
    await expect(modal(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveCount(0);
    await expect(page).not.toHaveURL(/interaction=/);

    await page
      .locator("article", { hasText: "Count Up" })
      .locator("[data-open-interaction]")
      .click();
    await expect(modal(page)).toBeVisible();
    await page.goBack();
    await expect(page.locator("dialog")).toHaveCount(0);
  });

  test("direct URL opens the modal and the close button returns to the gallery", async ({
    page,
  }) => {
    await page.goto("/?interaction=tilt-card");
    await expect(modal(page).locator("h2[id^=modal-title]")).toHaveText("3D Tilt Card");
    await page.getByRole("button", { name: "닫기" }).click();
    await expect(page.locator("dialog")).toHaveCount(0);
    await expect(page).not.toHaveURL(/interaction=/);
  });

  test("legacy /interactions/:slug redirects to the query URL", async ({ page }) => {
    await page.goto("/interactions/split-text");
    await expect(page).toHaveURL(/\?interaction=split-text/);
    await expect(modal(page).locator("h2[id^=modal-title]")).toHaveText("Split Text Reveal");
  });

  test("clicking a control inside a demo does not open the modal", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("article", { hasText: "Magnetic Button" });
    await card.getByRole("button", { name: "Get started" }).click();
    await expect(page).not.toHaveURL(/interaction=/);
  });

  test("← / → move through interactions inside the modal", async ({ page }) => {
    await page.goto("/?interaction=tilt-card");
    await expect(modal(page)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page).not.toHaveURL(/interaction=tilt-card/);
    await page.keyboard.press("ArrowLeft");
    await expect(page).toHaveURL(/interaction=tilt-card/);
    // 여러 번 넘겨도 Esc 한 번이면 갤러리로
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveCount(0);
  });

  test("lazy demos do not shift the layout on first load (CLS < 0.1)", async ({ page }) => {
    // 데모 코드를 늦게 받으므로, 카드가 하나씩 늘어나며 열이 흔들리지 않는지 본다
    await page.addInitScript(() => {
      const w = window as unknown as { cls: number };
      w.cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!entry.hadRecentInput) w.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/");
    await expect(page.locator("article").first()).toBeVisible();
    await page.waitForTimeout(1500);
    const cls = await page.evaluate(() => (window as unknown as { cls: number }).cls);
    expect(cls).toBeLessThan(0.1);
  });

  test("no horizontal scroll on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
  });
});
