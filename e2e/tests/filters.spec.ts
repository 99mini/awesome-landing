import { expect, modal, test } from "./fixtures.ts";

const search = (page: import("@playwright/test").Page) =>
  page.getByRole("combobox", { name: "Search interactions" });

test.describe("filters, tag dropdown and autocomplete search", () => {
  test("typing fast keeps every character (regression)", async ({ page }) => {
    await page.goto("/");
    await search(page).click();
    await page.keyboard.type("spr", { delay: 0 });
    await expect(search(page)).toHaveValue("spr");
    await expect(page).toHaveURL(/q=spr/);
    // 지우고 바로 다시 치기
    for (const word of ["morph", "line", "seven"]) {
      await search(page).fill("");
      await page.keyboard.type(word, { delay: 0 });
    }
    await expect(search(page)).toHaveValue("seven");
    await expect(page).toHaveURL(/q=seven/);
  });

  test("suggestions are grouped and nothing is auto-selected", async ({ page }) => {
    await page.goto("/");
    await search(page).click();
    // "scroll" 은 인터랙션(Scroll Reveal), 태그(useScroll), 카테고리(scroll) 셋 다에 걸린다
    await page.keyboard.type("scroll");
    const list = page.getByRole("listbox", { name: "Suggestions" });
    await expect(list.getByRole("group")).toHaveCount(3);
    await expect(search(page)).not.toHaveAttribute("aria-activedescendant", /.+/);
  });

  test("picking an interaction opens it, picking a tag filters and clears the query", async ({
    page,
  }) => {
    await page.goto("/");
    await search(page).click();
    await page.keyboard.type("tilt");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/interaction=tilt-card/);
    // 모달이 열리며 포커스를 가져간 뒤에 Esc (그 전에는 키 처리가 아직 붙지 않았다)
    await expect(page.locator("dialog :focus")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveCount(0);

    await search(page).fill("");
    await page.keyboard.type("stag");
    await page
      .getByRole("listbox", { name: "Suggestions" })
      .getByRole("option", { name: /^stagger/ })
      .click();
    await expect(page).toHaveURL(/tag=stagger/);
    await expect(page).not.toHaveURL(/q=/);
    await expect(search(page)).toHaveValue("");
    await expect(page.locator("button[role=combobox]")).toHaveAttribute(
      "aria-label",
      "Tag: stagger",
    );
  });

  test("Esc closes the list first, then clears the query", async ({ page }) => {
    await page.goto("/");
    await search(page).click();
    await page.keyboard.type("tilt");
    await expect(page.getByRole("listbox", { name: "Suggestions" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(search(page)).toHaveValue("tilt");
    await page.keyboard.press("Escape");
    await expect(search(page)).toHaveValue("");
  });

  test("tag dropdown: keyboard, typeahead, outside click", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator("button[role=combobox]");
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    const list = page.getByRole("listbox", { name: "Tag" });
    await expect(list).toBeVisible();
    await page.keyboard.type("st");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/tag=stagger/);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.mouse.click(1300, 120);
    await expect(page.getByRole("listbox")).toHaveCount(0);

    await trigger.click();
    await page.getByRole("option", { name: "Any" }).click();
    await expect(page).not.toHaveURL(/tag=/);
  });

  test("category chip filters and Back restores", async ({ page }) => {
    await page.goto("/");
    // 데모를 늦게 받으므로 카드가 처음 그려질 때까지 기다린 뒤 조작한다
    await expect(page.locator("article").first()).toBeVisible();
    const all = await page.locator("article").count();
    await page.getByRole("button", { name: /^text/ }).click();
    await expect(page).toHaveURL(/category=text/);
    await expect(page.locator("article")).not.toHaveCount(all);
    await expect(page.locator("article")).not.toHaveCount(0);
    await page.goBack();
    await expect(page).not.toHaveURL(/category=/);
  });

  test("modal arrows stay inside the filtered list", async ({ page }) => {
    await page.goto("/?category=cursor&interaction=cursor-follower");
    await expect(modal(page)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/interaction=magnetic-button/);
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/interaction=cursor-follower/);
  });
});
