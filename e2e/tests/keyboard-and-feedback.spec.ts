import { expect, modal, test } from "./fixtures.ts";

test.describe("command palette", () => {
  test("filter, choose with ↓, run with Enter; focus goes back to the trigger", async ({
    page,
  }) => {
    await page.goto("/?interaction=command-palette");
    const stage = modal(page).locator("[data-demo-stage]");
    const trigger = stage.getByRole("button", { name: /open commands/i });
    await trigger.click();

    const input = stage.getByRole("combobox", { name: "Command palette" });
    await expect(input).toBeFocused();
    await input.pressSequentially("use");
    await expect(stage.getByRole("option")).toHaveText([/Use yellow/, /Use teal/]);
    await page.keyboard.press("ArrowDown");
    await expect(stage.getByRole("option", { name: /Use teal/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.keyboard.press("Enter");

    await expect(stage.getByRole("dialog")).toHaveCount(0);
    await expect(stage.getByText('Ran "Use teal"')).toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("Esc closes only the palette inside the gallery modal; ⌘K reopens it there", async ({
    page,
  }) => {
    await page.goto("/?interaction=command-palette");
    const stage = modal(page).locator("[data-demo-stage]");
    const trigger = stage.getByRole("button", { name: /open commands/i });
    await trigger.click();
    await expect(stage.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(stage.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(/interaction=command-palette/);
    await expect(trigger).toBeFocused();

    await page.keyboard.press("ControlOrMeta+k");
    await expect(stage.getByRole("combobox")).toBeFocused();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(page).not.toHaveURL(/interaction=/);
  });

  test("⌘K does nothing while focus is outside the demo (several palettes on one page)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("combobox", { name: "Command palette" })).toHaveCount(0);
  });
});

test.describe("toast stack", () => {
  test("shows the oldest first, the rest wait; dismissing lets the next one in", async ({
    page,
  }) => {
    await page.goto("/?interaction=toast-stack");
    // 저절로 사라지지 않게 해서 순서만 본다
    await modal(page).getByRole("slider", { name: "Auto dismiss" }).fill("0");
    const stage = modal(page).locator("[data-demo-stage]");
    const notify = stage.getByRole("button", { name: "Notify" });
    for (let i = 0; i < 4; i++) await notify.click();

    const toasts = stage.getByRole("listitem");
    await expect(toasts).toHaveCount(3);
    await expect(toasts.first()).toContainText("Draft saved");
    await expect(stage.getByText("1 more waiting")).toBeVisible();

    await toasts.first().getByRole("button", { name: "Dismiss" }).click();
    await expect(toasts).toHaveCount(3);
    await expect(toasts.last()).toContainText("Upload finished");
  });

  test("dismisses on its own, but not while the pointer rests on it", async ({ page }) => {
    await page.goto("/?interaction=toast-stack");
    await modal(page).getByRole("slider", { name: "Auto dismiss" }).fill("1");
    const stage = modal(page).locator("[data-demo-stage]");
    await stage.getByRole("button", { name: "Notify" }).click();
    const toast = stage.getByRole("listitem");
    await expect(toast).toHaveCount(1);

    await toast.hover();
    await page.waitForTimeout(1500);
    await expect(toast).toHaveCount(1);

    await page.mouse.move(0, 0);
    await expect(toast).toHaveCount(0, { timeout: 3000 });
  });
});

test("number ticker: screen readers get the whole number, not the rolling digits", async ({
  page,
}) => {
  await page.goto("/?interaction=number-ticker");
  const stage = modal(page).locator("[data-demo-stage]");
  await expect(stage.getByText("1,280", { exact: true })).toBeAttached();
  await stage.getByRole("button", { name: "Add 250" }).click();
  await expect(stage.getByText("1,530", { exact: true })).toBeAttached();
  // 기둥의 숫자들은 접근성 트리에 없다
  const snapshot = await stage.ariaSnapshot();
  expect(snapshot).toContain("1,530");
  expect(snapshot).not.toMatch(/0\s*1\s*2\s*3\s*4\s*5\s*6\s*7\s*8\s*9/);
});
