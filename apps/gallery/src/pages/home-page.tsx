import { findInteraction, interactions } from "@awesome/interactions/registry";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { EmptyResult, GalleryFilters } from "../components/gallery-filters.tsx";
import { InteractionMasonry } from "../components/interaction-masonry.tsx";
import { InteractionModal } from "../components/interaction-modal.tsx";
import { Tags } from "../components/tags.tsx";
import { useGalleryFilters } from "../hooks/use-gallery-filters.ts";
import { useSelectedInteraction } from "../hooks/use-selected-interaction.ts";
import { landings } from "../landings.ts";
import * as css from "./home-page.css.ts";

interface ModalSession {
  /** 모달을 연 인터랙션 — 이동해도 모달은 이 key 로 계속 떠 있다 */
  opened: string;
  /** ←/→ 로 다른 인터랙션으로 넘어갔는지 */
  navigated: boolean;
}

export function HomePage() {
  const { slug, open, close, replace } = useSelectedInteraction();
  const filters = useGalleryFilters();
  const selected = slug ? findInteraction(slug) : undefined;

  const [session, setSession] = useState<ModalSession | null>(null);
  // URL 에서 파생되는 상태 — 렌더 중에 맞춘다 (열림/닫힘이 URL 로만 결정되도록)
  if (selected && !session) setSession({ opened: selected.meta.slug, navigated: false });
  if (!selected && session) setSession(null);

  // 이동 범위: 지금 걸러진 목록 (현재 인터랙션이 그 안에 없으면 전체)
  const list = selected && filters.filtered.includes(selected) ? filters.filtered : interactions;
  const index = selected ? list.indexOf(selected) : -1;
  function go(step: number) {
    // 양 끝에서는 반대쪽으로 순환한다
    const next = list[(index + step + list.length) % list.length];
    if (!next || next === selected) return;
    setSession((s) => (s ? { ...s, navigated: true } : s));
    replace(next.meta.slug);
  }
  const canPage = list.length > 1;

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
        <GalleryFilters filters={filters} onOpen={open} />
        <LayoutGroup>
          {filters.filtered.length > 0 ? (
            <InteractionMasonry items={filters.filtered} onOpen={open} />
          ) : (
            <EmptyResult onClear={filters.clear} />
          )}
          <AnimatePresence>
            {selected && session && (
              <InteractionModal
                key={session.opened}
                mod={selected}
                morph={!session.navigated}
                onClose={close}
                onPrev={canPage ? () => go(-1) : undefined}
                onNext={canPage ? () => go(1) : undefined}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </section>
    </>
  );
}
