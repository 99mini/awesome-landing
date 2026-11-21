import { interactions } from "@awesome/interactions/registry";
import { CATEGORIES, TAGS, type useGalleryFilters } from "../hooks/use-gallery-filters.ts";
import * as css from "./gallery-filters.css.ts";

type Filters = ReturnType<typeof useGalleryFilters>;

const countBy = (category: string) =>
  interactions.filter((m) => m.meta.category === category).length;

export function GalleryFilters({ filters }: { filters: Filters }) {
  const { category, tag, q, filtered, active, set, clear } = filters;

  return (
    <search className={css.toolbar}>
      <label>
        <span className={css.visuallyHidden}>Search interactions</span>
        <input
          type="search"
          className={css.search}
          placeholder="Search interactions"
          value={q}
          onChange={(e) => set("q", e.currentTarget.value, true)}
        />
      </label>

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
            <span className={css.count}>{countBy(c)}</span>
          </button>
        ))}
      </fieldset>

      <label>
        <span className={css.visuallyHidden}>Tag</span>
        <select
          className={css.select}
          value={tag ?? ""}
          onChange={(e) => set("tag", e.currentTarget.value || null)}
        >
          <option value="">Any tag</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

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
