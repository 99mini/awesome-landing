import * as css from "./Tags.css.ts";

export function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className={css.list}>
      {tags.map((t) => (
        <li key={t} className={css.tag}>
          {t}
        </li>
      ))}
    </ul>
  );
}
