import { CommandPalette, type Command } from "@awesome/interactions";
import { interactions } from "@awesome/interactions/registry";
import { startTransition } from "react";
import { useSearchParams } from "react-router";
import { CATEGORIES, categoryCount } from "../hooks/use-gallery-filters.ts";
import { Search } from "./icons.tsx";
import * as css from "./gallery-palette.css.ts";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

/** 인터랙션 열기 + 분류 필터. 자체 Command Palette 를 갤러리에 그대로 쓴다 */
const COMMANDS: Command[] = [
  ...interactions.map(({ meta }) => ({
    id: `open-${meta.slug}`,
    label: meta.title,
    hint: meta.category,
    keywords: [meta.slug, ...(meta.tags ?? [])],
    group: "Interactions",
  })),
  ...CATEGORIES.map((category) => ({
    id: `category-${category}`,
    label: `Show ${category} only`,
    hint: String(categoryCount(category)),
    keywords: ["filter", "category"],
    group: "Filters",
  })),
  { id: "clear", label: "Clear filters", keywords: ["reset", "all"], group: "Filters" },
];

export function GalleryPalette() {
  const [params, setParams] = useSearchParams();
  // 모달이 열려 있는 동안에는 ⌘K 를 받지 않는다 — 모달이 포커스를 가두고 있어 그 위에 띄울 수 없다
  const modalOpen = params.has("interaction");

  function run(command: Command) {
    startTransition(() => {
      setParams(
        (prev) => {
          if (command.id.startsWith("open-")) {
            prev.set("interaction", command.id.slice("open-".length));
          } else if (command.id.startsWith("category-")) {
            prev.set("category", command.id.slice("category-".length));
          } else {
            prev.delete("category");
            prev.delete("tag");
            prev.delete("q");
          }
          return prev;
        },
        // 열린 모달은 닫기 = 뒤로가기 (카드에서 연 것과 같게)
        command.id.startsWith("open-")
          ? { state: { openedInGallery: true }, preventScrollReset: true }
          : { replace: true, preventScrollReset: true },
      );
    });
  }

  return (
    <CommandPalette
      commands={COMMANDS}
      onRun={run}
      contained={false}
      hotkey={modalOpen ? false : "global"}
      label="Search the gallery"
      placeholder="Search interactions and filters"
      className={css.root}
      panelClassName={css.panel}
      trigger={
        <span className={css.trigger}>
          <Search className={css.icon} />
          Search
          <kbd className={css.kbd}>{isMac ? "⌘K" : "Ctrl K"}</kbd>
        </span>
      }
    />
  );
}
