import { interactions } from "@awesome/interactions/registry";
import { motion } from "motion/react";
import { Link } from "react-router";
import { landings } from "../landings.ts";

export function HomePage() {
  return (
    <>
      <section className="section">
        <h2>Landings</h2>
        <div className="grid">
          {landings.map((l, i) => (
            <motion.a
              key={l.name}
              className="card"
              href={`http://localhost:${l.port}`}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h3>{l.title}</h3>
              <p>{l.description}</p>
              <Tags tags={l.tags} />
            </motion.a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Interactions</h2>
        <div className="grid">
          {interactions.map(({ meta }, i) => (
            <motion.div
              key={meta.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link className="card" to={`/interactions/${meta.slug}`}>
                <span className="badge">{meta.category}</span>
                <h3>{meta.title}</h3>
                <p>{meta.description}</p>
                <Tags tags={meta.tags} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="tags">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
