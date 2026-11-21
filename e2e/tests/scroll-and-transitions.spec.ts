import { expect, modal, test } from "./fixtures.ts";

test.describe("scroll-driven and view-transition demos", () => {
  test("sticky story swaps the pinned visual as steps pass the middle", async ({ page }) => {
    await page.goto("/?interaction=sticky-story");
    const box = modal(page).locator("section[aria-label='Sticky story']");
    const current = modal(page).locator("[aria-current=step] h3");
    for (const [top, title] of [
      [0, "Pin"],
      [240, "Track"],
      [480, "Swap"],
    ] as const) {
      await box.evaluate((el, y) => el.scrollTo(0, y), top);
      await expect(current).toHaveText(title);
    }
  });

  test("parallax: the front layer moves more than the back layer", async ({ page }) => {
    await page.goto("/?interaction=parallax");
    const box = modal(page).locator("section[aria-label='Parallax layers']");
    const ys = () =>
      box.evaluate((el) =>
        [...el.querySelectorAll(":scope > div > div")].map(
          (d) => new DOMMatrix(getComputedStyle(d).transform).m42,
        ),
      );
    await box.evaluate((el) => el.scrollTo(0, 0));
    await expect.poll(async () => (await ys())[2]).toBeGreaterThan(0);
    const top = await ys();
    await box.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await expect.poll(async () => (await ys())[2]).toBeLessThan(0);
    const bottom = await ys();
    const moved = top.map((y, i) => Math.abs(y - bottom[i]!));
    expect(moved[2]).toBeGreaterThan(moved[1]!);
    expect(moved[1]).toBeGreaterThan(moved[0]!);
  });

  test("view transition: one native call per change, unique names", async ({ page }) => {
    await page.goto("/?interaction=view-transition");
    await expect(modal(page)).toBeVisible();
    // 반환값이 함수가 되지 않도록 마지막 식을 undefined 로 둔다
    await page.evaluate(() => {
      const w = window as unknown as { vtCalls: number };
      w.vtCalls = 0;
      const original = document.startViewTransition.bind(document);
      document.startViewTransition = ((cb: () => void) => {
        w.vtCalls++;
        return original(cb);
      }) as typeof document.startViewTransition;
    });
    const names = await page.evaluate(() =>
      [...document.querySelectorAll("*")]
        .map((e) => getComputedStyle(e).viewTransitionName)
        .filter((n) => n && n !== "none"),
    );
    expect(new Set(names).size).toBe(names.length);

    await modal(page).getByRole("button", { name: "Show as list" }).click();
    await expect(modal(page).getByRole("button", { name: "Show as grid" })).toBeVisible();
    await modal(page).getByRole("button", { name: "Rotate" }).click();
    // production 빌드는 클래스 이름이 해시라 글자로 찾는다 — 회전하면 Four 가 맨 앞
    await expect(
      modal(page)
        .getByText(/^(One|Two|Three|Four)$/)
        .first(),
    ).toHaveText("Four");
    expect(await page.evaluate(() => (window as unknown as { vtCalls: number }).vtCalls)).toBe(2);
  });

  test("view transition is skipped under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?interaction=view-transition");
    await page.evaluate(() => {
      const w = window as unknown as { vtCalls: number };
      w.vtCalls = 0;
      const original = document.startViewTransition.bind(document);
      document.startViewTransition = ((cb: () => void) => {
        w.vtCalls++;
        return original(cb);
      }) as typeof document.startViewTransition;
    });
    await modal(page).getByRole("button", { name: "Show as list" }).click();
    await expect(modal(page).getByRole("button", { name: "Show as grid" })).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { vtCalls: number }).vtCalls)).toBe(0);
  });
});
