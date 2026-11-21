import type { Locator, Page } from "@playwright/test";
import { expect, modal, test } from "./fixtures.ts";

/** 요소 가운데를 잡고 dx, dy 만큼 끈다 (여러 단계로 움직여 실제 드래그처럼) */
async function drag(page: Page, target: Locator, dx: number, dy: number) {
  // 모달이 열리며 모핑하는 동안에는 위치가 움직인다 — 멈춘 뒤에 잡는다
  let box = (await target.boundingBox())!;
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(50);
    const next = (await target.boundingBox())!;
    if (next.x === box.x && next.y === box.y && next.width === box.width) break;
    box = next;
  }
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  // 한 프레임에 한 번씩 움직인다 — 한 번에 몰아 움직이면 드래그 라이브러리가 중간 위치를 못 본다
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(x + (dx * i) / 20, y + (dy * i) / 20);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
}

test.describe("gesture interactions", () => {
  test("reorder list: drag a handle, or use ↑/↓ on it", async ({ page }) => {
    await page.goto("/?interaction=reorder-list");
    // 모달의 태그 목록과 섞이지 않게 데모 목록으로 좁힌다
    const items = modal(page)
      .getByRole("list")
      .filter({ hasText: "Prototype" })
      .getByRole("listitem");
    await expect(items).toHaveText(["Design", "Prototype", "Test", "Ship"]);
    // 키보드 정지점은 손잡이뿐 — 항목 자체가 Tab 을 받으면 링 없는 빈 정지점이 생긴다
    await expect(items.first()).toHaveAttribute("tabindex", "-1");

    const handle = modal(page).getByRole("button", { name: /^Reorder Design/ });
    await drag(page, handle, 0, 110);
    await expect(items.first()).not.toHaveText("Design");

    // 키보드: 손잡이에서 ↑ — 바뀐 위치를 스크린 리더에 알린다
    await modal(page)
      .getByRole("button", { name: /^Reorder Ship/ })
      .focus();
    await page.keyboard.press("ArrowUp");
    await expect(items.nth(2)).toHaveText("Ship");
    await expect(modal(page).getByText(/^Ship, position 3 of 4$/)).toBeAttached();
    // ←/→ 가 아니므로 갤러리 모달은 그대로
    await expect(page).toHaveURL(/interaction=reorder-list/);
  });

  test("swipe cards: a short drag snaps back, a long one throws the card", async ({ page }) => {
    await page.goto("/?interaction=swipe-cards");
    const status = modal(page).locator("[aria-live]").last();
    await expect(status).toHaveText("4 cards left");
    const top = modal(page).getByText("Spring", { exact: true });

    await drag(page, top, 40, 0);
    await expect(status).toHaveText("4 cards left");

    await drag(page, top, 220, 0);
    await expect(status).toHaveText("Spring kept");
    await expect(modal(page).getByText("Spring", { exact: true })).toHaveCount(0);

    // 버튼으로도 같은 동작
    await modal(page).getByRole("button", { name: "Skip" }).click();
    await expect(status).toHaveText("Layout skipped");
  });

  test("accordion: one panel at a time with labelled regions", async ({ page }) => {
    await page.goto("/?interaction=accordion");
    const first = modal(page).getByRole("button", { name: "Why not animate height?" });
    const second = modal(page).getByRole("button", { name: "What does the keyboard get?" });
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(
      modal(page).getByRole("region", { name: "Why not animate height?" }),
    ).toBeVisible();
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });

  test("accordion: switching panels moves the rows below without a jump", async ({ page }) => {
    await page.goto("/?interaction=accordion");
    const dialog = modal(page);
    await dialog.getByRole("button", { name: "Why not animate height?" }).click();
    await expect(dialog.getByRole("region", { name: "Why not animate height?" })).toBeVisible();
    await page.waitForTimeout(600);
    // 세 번째 제목의 위치를 프레임마다 기록 — 닫히는 패널이 자리를 쥐고 있다가 놓으면 한 프레임에 튄다
    await page.evaluate(() => {
      const w = window as unknown as { ys: number[] };
      const third = [...document.querySelectorAll("dialog h3 button")][2]!;
      w.ys = [];
      const tick = () => {
        w.ys.push(third.getBoundingClientRect().top);
        if (w.ys.length < 50) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await dialog.getByRole("button", { name: "What does the keyboard get?" }).click();
    await page.waitForFunction(() => (window as unknown as { ys: number[] }).ys.length >= 50);
    const ys = await page.evaluate(() => (window as unknown as { ys: number[] }).ys);
    const steps = ys.slice(1).map((y, i) => Math.abs(y - ys[i]!));
    expect(Math.max(...steps)).toBeLessThan(12);
    await expect(dialog.getByRole("region", { name: "Why not animate height?" })).toHaveCount(0);
  });

  test("scroll highlight: words light up as the paragraph scrolls past", async ({ page }) => {
    await page.goto("/?interaction=scroll-highlight");
    const box = modal(page).locator("section[aria-label='Scroll highlight']");
    const last = box.locator("[data-word]").last();
    const opacity = () => last.evaluate((el) => Number(getComputedStyle(el).opacity));
    // 아직 지나가지 않은 단어는 기본 dim(0.5)
    await expect.poll(opacity).toBeCloseTo(0.5, 1);
    await box.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await expect.poll(opacity).toBe(1);
  });
});
