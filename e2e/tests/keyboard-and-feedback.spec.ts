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
  test("stacks newest in front like iOS; hover fans it out; older ones wait hidden", async ({
    page,
  }) => {
    await page.goto("/?interaction=toast-stack");
    // 저절로 사라지지 않게 해서 순서만 본다
    await modal(page).getByRole("slider", { name: "Auto dismiss" }).fill("0");
    const stage = modal(page).locator("[data-demo-stage]");
    const notify = stage.getByRole("button", { name: "Notify" });
    for (let i = 0; i < 4; i++) await notify.click();
    await page.mouse.move(0, 0);

    // 겹쳐 있을 때는 맨 앞(가장 새) 알림만 읽힌다 — 뒤 알림은 aria-hidden
    const toasts = stage.getByRole("listitem");
    await expect(toasts).toHaveCount(1);
    await expect(toasts.first()).toContainText("Upload finished");
    await expect(stage.getByText("1 older hidden")).toBeVisible();

    // 올리면 펼쳐져 셋이 새것부터 보인다
    await toasts.first().hover();
    await expect(toasts).toHaveCount(3);
    await expect(toasts).toContainText(["Upload finished", "Theme updated", "Link copied"]);

    // 하나를 닫으면 숨어 있던 가장 오래된 알림이 뒤에 나온다
    await toasts.first().getByRole("button", { name: "Dismiss" }).click();
    await expect(toasts).toContainText(["Theme updated", "Link copied", "Draft saved"]);
  });

  test("a dismissed toast slides out where it was, and the demo does not shift", async ({
    page,
  }) => {
    await page.goto("/?interaction=toast-stack");
    await modal(page).getByRole("slider", { name: "Auto dismiss" }).fill("0");
    const stage = modal(page).locator("[data-demo-stage]");
    for (let i = 0; i < 3; i++) await stage.getByRole("button", { name: "Notify" }).click();
    // 펼쳐 놓고 자리가 멈춘 뒤에 잰다
    await stage.getByRole("listitem").first().hover();
    await expect(stage.getByRole("listitem")).toHaveCount(3);
    await page.waitForTimeout(600);

    // 닫는 알림과 Notify 버튼의 위치를 프레임마다 기록 —
    // 사라지는 알림을 띄울 기준(position)이 없으면 목록 아래로 튀었다가 사라졌다
    await page.evaluate(() => {
      const w = window as unknown as { track: [number | null, number][] };
      const buttons = [...document.querySelectorAll("dialog [data-demo-stage] button")];
      const notify = buttons.find((b) => b.textContent === "Notify")!;
      const started = performance.now();
      w.track = [];
      const tick = () => {
        const li = [...document.querySelectorAll("dialog [data-demo-stage] li")].find((l) =>
          l.textContent?.includes("Theme updated"),
        );
        w.track.push([
          li ? li.getBoundingClientRect().top : null,
          notify.getBoundingClientRect().top,
        ]);
        if (performance.now() - started < 600) requestAnimationFrame(tick);
      };
      tick();
    });
    await stage
      .getByRole("listitem")
      .filter({ hasText: "Theme updated" })
      .getByRole("button", { name: "Dismiss" })
      .click();
    await expect(stage.getByRole("listitem")).toHaveCount(2);
    await page.waitForTimeout(700);
    const track = await page.evaluate(
      () => (window as unknown as { track: [number | null, number][] }).track,
    );
    const [start, notifyStart] = track[0]!;
    for (const [top, notify] of track) {
      if (top !== null) expect(Math.abs(top - start!)).toBeLessThan(4);
      expect(Math.abs(notify - notifyStart)).toBeLessThan(2);
    }
  });

  test("on a touch screen, tapping the stack fans it out and tapping outside folds it", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "터치 화면에서만 — 데스크톱은 hover 로 펼친다");
    await page.goto("/?interaction=toast-stack");
    await modal(page).getByRole("slider", { name: "Auto dismiss" }).fill("0");
    const stage = modal(page).locator("[data-demo-stage]");
    for (let i = 0; i < 3; i++) await stage.getByRole("button", { name: "Notify" }).tap();
    const toasts = stage.getByRole("listitem");
    await expect(toasts).toHaveCount(1);

    await toasts.first().getByText("Theme updated").tap();
    await expect(toasts).toHaveCount(3);
    await modal(page).getByRole("heading", { name: "Toast Stack" }).tap();
    await expect(toasts).toHaveCount(1);
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

test("number ticker: a new place grows in showing its own digit; the others slide aside", async ({
  page,
}) => {
  // Random 이 늘 54,321 을 내도록 (1,280 → 다섯 자리)
  await page.addInitScript(() => {
    Math.random = () => 0.54321;
  });
  await page.goto("/?interaction=number-ticker");
  const stage = modal(page).locator("[data-demo-stage]");
  await expect(stage.getByText("1,280", { exact: true })).toBeAttached();
  await page.waitForTimeout(1200);

  // 자리마다 기둥이 보여 주는 숫자와 일의 자리의 x 를 프레임마다 기록
  await page.evaluate(() => {
    const w = window as unknown as { frames: { lead: number | null; units: number }[] };
    const root = document.querySelector("dialog [data-demo-stage] [aria-hidden]")!;
    const started = performance.now();
    w.frames = [];
    // page.evaluate 안은 브라우저에서 따로 실행되어 바깥 함수를 쓸 수 없다
    // oxlint-disable-next-line unicorn/consistent-function-scoping
    const shown = (c: Element) =>
      Math.round(
        ((c.getBoundingClientRect().top - c.firstElementChild!.getBoundingClientRect().top) /
          c.getBoundingClientRect().height) *
          10,
      ) / 10;
    const tick = () => {
      const cols = [...root.children].filter((c) => c.firstElementChild?.children.length === 10);
      w.frames.push({
        lead: cols.length === 5 ? shown(cols[0]!) : null,
        units: cols.at(-1)!.getBoundingClientRect().left,
      });
      if (performance.now() - started < 900) requestAnimationFrame(tick);
    };
    tick();
  });
  await stage.getByRole("button", { name: "Random" }).click();
  await expect(stage.getByText("54,321", { exact: true })).toBeAttached();
  await page.waitForTimeout(1000);
  const frames = await page.evaluate(
    () => (window as unknown as { frames: { lead: number | null; units: number }[] }).frames,
  );

  // 새 만의 자리는 0 을 거치지 않고 처음부터 5
  const lead = frames.map((f) => f.lead).filter((v) => v !== null);
  expect(lead.length).toBeGreaterThan(0);
  expect(new Set(lead)).toEqual(new Set([5]));
  // 기존 자리는 한 프레임에 튀지 않고 미끄러진다
  const steps = frames.slice(1).map((f, i) => Math.abs(f.units - frames[i]!.units));
  expect(Math.max(...steps)).toBeLessThan(8);
});
