import { expect, test } from "./fixtures.ts";

test.describe("photo viewer", () => {
  test("moves with keys and returns to the cell of the photo last shown", async ({ page }) => {
    await page.goto("/?interaction=photo-viewer");
    const gallery = page.locator("dialog").first();
    await gallery.getByRole("button", { name: "Forest" }).click();
    const viewer = page.getByRole("dialog", { name: "Forest", exact: true });
    await expect(viewer).toBeVisible();
    await expect(viewer.getByText("2 of 6")).toBeVisible();

    // ←/→ 는 갤러리 모달이 아니라 사진을 넘긴다
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("dialog", { name: "Sea", exact: true })).toBeVisible();
    await expect(page).toHaveURL(/interaction=photo-viewer/);

    // 사진을 눌러도 키보드가 이어진다 (다 넘어간 뒤에)
    await page.waitForTimeout(700);
    const box = (await page.getByRole("dialog", { name: "Sea", exact: true }).boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.keyboard.press("End");
    await expect(page.getByRole("dialog", { name: "Cliff", exact: true })).toBeVisible();

    // Esc 는 안쪽만 닫고, 마지막에 본 사진의 칸에 포커스를 준다
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveCount(1);
    await expect(page.locator(":focus")).toHaveText("Cliff");
    await expect(page).toHaveURL(/interaction=photo-viewer/);
  });

  test("swipes past the threshold, stays put below it, and does not close on release", async ({
    page,
  }) => {
    await page.goto("/?interaction=photo-viewer");
    await page.locator("dialog").first().getByRole("button", { name: "Dusk" }).click();
    const viewer = (name: string) => page.getByRole("dialog", { name, exact: true });
    await expect(viewer("Dusk")).toBeVisible();
    await expect(viewer("Dusk").getByText("1 of 6")).toBeVisible();

    const box = (await viewer("Dusk").boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const drag = async (dx: number) => {
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      // 천천히 — 빠르게 밀기가 아니라 거리로 판정되게
      for (let i = 1; i <= 8; i++) {
        await page.mouse.move(cx + (dx * i) / 8, cy);
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(150);
      await page.mouse.up();
    };

    await drag(-40);
    await page.waitForTimeout(200);
    await expect(viewer("Dusk")).toBeVisible();
    await drag(-140);
    await expect(viewer("Forest")).toBeVisible();
    await page.waitForTimeout(600);
    await drag(140);
    await expect(viewer("Dusk")).toBeVisible();
  });

  test("the photo lands exactly on its cell when closing", async ({ page }) => {
    await page.goto("/?interaction=photo-viewer");
    const cell = page.locator("dialog").first().getByRole("button", { name: "Field" });
    const viewer = page.getByRole("dialog", { name: "Field", exact: true });

    // 느린 환경에서는 끝나기 직전 프레임이 빠질 수 있다 — 그때는 다시 열고 닫는다
    await expect(async () => {
      await cell.click();
      await expect(viewer).toBeVisible();
      await page.waitForTimeout(700);
      // 닫기를 누른 뒤 사라지기 직전 프레임에서, 사진과 칸이 얼마나 어긋났는지
      const gap = await page.evaluate(async () => {
        const dialog = document.querySelector<HTMLElement>("dialog[aria-label='Field']")!;
        const frame = dialog.querySelector<HTMLElement>("[style*='clip-path']")!;
        const trigger = document.querySelector<HTMLElement>("button[aria-expanded='true']")!;
        dialog.querySelector<HTMLButtonElement>("button[aria-label='Close']")!.click();
        let last = Number.POSITIVE_INFINITY;
        while (frame.isConnected) {
          const [a, b] = [frame.getBoundingClientRect(), trigger.getBoundingClientRect()];
          // Field 는 1:1 이라 잘리는 부분 없이 칸과 같은 상자가 된다
          last = Math.max(
            Math.abs(a.x - b.x),
            Math.abs(a.y - b.y),
            Math.abs(a.width - b.width),
            Math.abs(a.height - b.height),
          );
          await new Promise(requestAnimationFrame);
        }
        return last;
      });
      expect(gap).toBeLessThan(2);
    }).toPass({ timeout: 15_000 });
    await expect(page.locator(":focus")).toHaveText("Field");
  });
});
