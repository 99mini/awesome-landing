import { findInteraction, interactions } from "@awesome/interactions/registry";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { InteractionMasonry } from "../components/InteractionMasonry.tsx";
import { InteractionModal } from "../components/InteractionModal.tsx";
import { Tags } from "../components/Tags.tsx";
import { useSelectedInteraction } from "../hooks/useSelectedInteraction.ts";
import { landings } from "../landings.ts";
import * as css from "./HomePage.css.ts";

export function HomePage() {
  const { slug, open, close } = useSelectedInteraction();
  const selected = slug ? findInteraction(slug) : undefined;

  return (
    <>
      <section className={css.section}>
        <h2 className={css.sectionTitle}>Landings</h2>
        <div className={css.grid}>
          {landings.map((l, i) => (
            <motion.a
              key={l.name}
              className={css.landingCard}
              href={`http://localhost:${l.port}`}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className={css.landingTitle}>{l.title}</h3>
              <p className={css.landingText}>{l.description}</p>
              <Tags tags={l.tags} />
            </motion.a>
          ))}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Interactions</h2>
        <LayoutGroup>
          <InteractionMasonry items={interactions} onOpen={open} />
          <AnimatePresence>
            {selected && (
              <InteractionModal key={selected.meta.slug} mod={selected} onClose={close} />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </section>
    </>
  );
}
