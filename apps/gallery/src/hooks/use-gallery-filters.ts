import {
  interactions,
  type InteractionCategory,
  type InteractionDemoModule,
} from "@awesome/interactions/registry";
import { useSearchParams } from "react-router";

export const CATEGORIES = [
  ...new Set(interactions.map((m) => m.meta.category)),
].toSorted() as InteractionCategory[];

export const TAGS = [...new Set(interactions.flatMap((m) => m.meta.tags ?? []))].toSorted((a, b) =>
  a.localeCompare(b),
);

/** 태그·카테고리별 인터랙션 수 (전체 기준, 실제 값) */
export const tagCount = (tag: string) =>
  interactions.filter((m) => m.meta.tags?.includes(tag)).length;
export const categoryCount = (category: string) =>
  interactions.filter((m) => m.meta.category === category).length;

type FilterKey = "category" | "tag" | "q";

function matches(
  mod: InteractionDemoModule,
  category: string | null,
  tag: string | null,
  q: string,
) {
  const { meta } = mod;
  if (category && meta.category !== category) return false;
  if (tag && !meta.tags?.includes(tag)) return false;
  if (!q) return true;
  const haystack = [meta.title, meta.description, meta.slug, meta.category, ...(meta.tags ?? [])]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

/**
 * 카테고리·태그·검색어를 URL 쿼리(`?category=&tag=&q=`)로 관리한다.
 * `?interaction=` 과 함께 쓰이므로 다른 파라미터는 건드리지 않는다.
 * - 카테고리·태그 선택은 history 에 쌓여 뒤로가기로 되돌릴 수 있다.
 * - 검색어 입력은 글자마다 history 가 쌓이지 않도록 replace.
 */
export function useGalleryFilters() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const tag = params.get("tag");
  const q = params.get("q") ?? "";

  /** 여러 값을 한 번에 바꾼다 — 연속 setParams 는 서로를 덮어쓸 수 있어 한 번의 갱신으로 묶는다 */
  function update(changes: Partial<Record<FilterKey, string | null>>, replace = false) {
    setParams(
      (prev) => {
        for (const [key, value] of Object.entries(changes)) {
          if (value) prev.set(key, value);
          else prev.delete(key);
        }
        return prev;
      },
      { replace, preventScrollReset: true },
    );
  }

  function set(key: FilterKey, value: string | null, replace = false) {
    update({ [key]: value }, replace);
  }

  function clear() {
    setParams(
      (prev) => {
        prev.delete("category");
        prev.delete("tag");
        prev.delete("q");
        return prev;
      },
      { preventScrollReset: true },
    );
  }

  const filtered = interactions.filter((m) => matches(m, category, tag, q.trim()));
  const active = Boolean(category || tag || q);

  return { category, tag, q, filtered, active, set, update, clear };
}
