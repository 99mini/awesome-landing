import * as css from "./tags.css.ts";

export function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  // 카테고리와 태그가 같은 말일 수 있다 (예: layout) — 같은 키가 두 번 나오지 않게
  const unique = [...new Set(tags)];
  return (
    <ul className={css.list}>
      {unique.map((t) => (
        <li key={t} className={css.tag}>
          {t}
        </li>
      ))}
    </ul>
  );
}
