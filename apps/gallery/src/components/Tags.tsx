export function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="tags">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
