import { findInteraction } from "@awesome/interactions/registry";
import { Link, useParams } from "react-router";

export function InteractionPage() {
  const { slug = "" } = useParams();
  const mod = findInteraction(slug);

  if (!mod) {
    return (
      <p>
        없는 인터랙션입니다. <Link to="/">목록으로</Link>
      </p>
    );
  }

  const { meta, default: Demo } = mod;

  return (
    <article className="section">
      <Link to="/" className="back">
        ← All
      </Link>
      <h2>{meta.title}</h2>
      <p className="muted">{meta.description}</p>
      <div className="stage">
        <Demo />
      </div>
      <p className="muted">
        source: <code>packages/interactions/src/{meta.slug}/</code>
      </p>
    </article>
  );
}
