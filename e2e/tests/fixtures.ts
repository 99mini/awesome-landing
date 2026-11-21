import { test as base, expect, type Page } from "@playwright/test";

/**
 * 모든 테스트에서 콘솔 에러·경고와 페이지 예외를 모아, 테스트가 끝날 때 하나라도 있으면 실패시킨다.
 * (지금까지의 회귀 대부분이 콘솔에 먼저 드러났다)
 */
export const test = base.extend<{ consoleProblems: string[] }>({
  consoleProblems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning")
          problems.push(`${m.type()}: ${m.text()}`);
      });
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
      await use(problems);
      expect(problems, "console errors or warnings").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const modal = (page: Page) => page.locator("dialog").first();

/** 첫 글자의 opacity — SplitText 가 다시 재생되면 잠깐 1 보다 작아진다 */
export const firstCharOpacity = (scope: ReturnType<Page["locator"]>) =>
  scope.evaluate((el) => {
    const char = el.querySelector("[data-char]");
    return char ? Number(getComputedStyle(char).opacity) : -1;
  });
