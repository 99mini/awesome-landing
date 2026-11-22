import { expect, firstCharOpacity, modal, test } from "./fixtures.ts";

test.describe("replay, source viewer and controls", () => {
  test("replay restarts the demo in the card without opening the modal", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("article", { hasText: "Split Text Reveal" });
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => firstCharOpacity(card)).toBe(1);
    await card.getByRole("button", { name: "인터랙션 다시 보기" }).click();
    // 바로 한 번 재면 부하가 있을 때 다시 재생되는 순간을 놓친다 — 다시 흐려질 때까지 기다린다
    await expect.poll(() => firstCharOpacity(card), { intervals: [16] }).toBeLessThan(1);
    await expect.poll(() => firstCharOpacity(card)).toBe(1);
    await expect(page).not.toHaveURL(/interaction=/);
  });

  test("continuously interactive demos have no replay button", async ({ page }) => {
    await page.goto("/");
    for (const title of ["3D Tilt Card", "Magnetic Button"]) {
      await expect(
        page
          .locator("article", { hasText: title })
          .getByRole("button", { name: "인터랙션 다시 보기" }),
      ).toHaveCount(0);
    }
  });

  test("source viewer shows each file and copies it", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/?interaction=tilt-card");
    const tabs = modal(page).getByRole("tab");
    await expect(tabs).toHaveText([
      "tilt-card.tsx",
      "tilt-card.css.ts",
      "demo.tsx",
      "demo.css.ts",
      "meta.ts",
    ]);
    await tabs.nth(1).click();
    await expect(modal(page).getByRole("tabpanel")).toContainText(
      'import { style } from "@vanilla-extract/css"',
    );
    await modal(page).getByRole("button", { name: "Copy" }).click();
    await expect(modal(page).getByRole("button", { name: "Copied!" })).toBeVisible();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain('import { style } from "@vanilla-extract/css"');
  });

  test("sliders change props and Reset restores them", async ({ page }) => {
    await page.goto("/?interaction=tilt-card");
    const output = modal(page).locator("output").first();
    await expect(output).toHaveText("12°");
    await modal(page).getByRole("slider").first().fill("30");
    await expect(output).toHaveText("30°");
    await modal(page).getByRole("button", { name: "Reset" }).click();
    await expect(output).toHaveText("12°");
  });

  test("changing a one-shot demo's control replays it", async ({ page }) => {
    await page.goto("/?interaction=split-text");
    const stage = modal(page);
    await expect.poll(() => firstCharOpacity(stage)).toBe(1);
    await stage.getByRole("slider").first().fill("0.1");
    expect(await firstCharOpacity(stage)).toBeLessThan(1);
  });
});
