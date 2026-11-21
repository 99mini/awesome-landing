import { interactions } from "@awesome/interactions/registry";
import {
  CATEGORIES,
  TAGS,
  categoryCount,
  tagCount,
  type useGalleryFilters,
} from "../hooks/use-gallery-filters.ts";
import * as css from "./gallery-filters.css.ts";
import { SearchCombobox } from "./search-combobox.tsx";
import { TagSelect, type SelectOption } from "./tag-select.tsx";

type Filters = ReturnType<typeof useGalleryFilters>;

const TAG_OPTIONS: SelectOption[] = [
  { value: null, label: "Any" },
  ...TAGS.map((t) => ({ value: t, label: t, meta: String(tagCount(t)) })),
];

interface GalleryFiltersProps {
  filters: Filters;
  /** 자동완성에서 인터랙션을 고르면 바로 연다 */
  onOpen: (slug: string) => void;
}

export function GalleryFilters({ filters, onOpen }: GalleryFiltersProps) {
  const { category, tag, q, filtered, active, set, update, clear } = filters;

  return (
    <search className={css.toolbar}>
      <SearchCombobox
        value={q}
        onChange={(next) => set("q", next || null, true)}
        onPick={(kind, value) => {
          if (kind === "interaction") onOpen(value);
          // 태그·카테고리를 고르면 그 필터로 바꾸고 검색어는 비운다 (한 번의 URL 갱신)
          else update({ [kind]: value, q: null });
        }}
      />

      <fieldset className={css.chips}>
        <legend className={css.visuallyHidden}>Category</legend>
        <button
          type="button"
          className={css.chip}
          aria-pressed={!category}
          onClick={() => set("category", null)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={css.chip}
            aria-pressed={category === c}
            onClick={() => set("category", category === c ? null : c)}
          >
            {c}
            <span className={css.count}>{categoryCount(c)}</span>
          </button>
        ))}
      </fieldset>

      <TagSelect
        label="Tag"
        value={tag}
        options={TAG_OPTIONS}
        onChange={(next) => set("tag", next)}
      />

      <span className={css.summary} aria-live="polite">
        {filtered.length} of {interactions.length}
      </span>
      {active && (
        <button type="button" className={css.clear} onClick={clear}>
          Clear filters
        </button>
      )}
    </search>
  );
}

export function EmptyResult({ onClear }: { onClear: () => void }) {
  return (
    <div className={css.empty}>
      <p>No interaction matches these filters.</p>
      <button type="button" className={css.clear} onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
