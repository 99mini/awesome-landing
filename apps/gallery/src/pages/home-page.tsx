import { findInteraction, interactions } from "@99mini/interactions/registry";
import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
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
  // 주소로 바로 열 때도 모달이 카드보다 나중에 마운트되도록 masonry 가 처음 그려질 때까지 기다린다.
  // (Motion 은 같은 layoutId 중 나중에 마운트된 쪽을 주인으로 삼아, 늦게 뜬 카드가 모달을 가려 버린다)
  const [masonryReady, setMasonryReady] = useState(false);
  const markReady = useCallback(() => setMasonryReady(true), []);
  // URL 에서 파생되는 상태 — 렌더 중에 맞춘다 (열림/닫힘이 URL 로만 결정되도록)
  if (selected && !session) setSession({ opened: selected.meta.slug, navigated: false });
  if (!selected && session) setSession(null);

  // 이동 범위: 지금 걸러진 목록 (현재 인터랙션이 그 안에 없으면 전체)
  const list = selected && filters.filtered.includes(selected) ? filters.filtered : interactions;
  // 마지막으로 이동시킨 인터랙션 — URL 이 바뀐 뒤 화면이 다시 그려지기 전에 키를 또 누르면
  // 렌더 시점의 위치로 계산해 엉뚱한 곳(옛 위치의 이웃)으로 가므로, 이동할 때 바로 기록한다.
  const current = useRef(slug);
  // 다른 곳에서 온 URL 변화(뒤로가기, 카드 클릭)는 렌더 뒤에 맞춘다
  useLayoutEffect(() => {
    current.current = slug;
  }, [slug]);
  function go(step: number) {
    const at = list.findIndex((it) => it.meta.slug === current.current);
    if (at < 0) return;
    // 양 끝에서는 반대쪽으로 순환한다
    const next = list[(at + step + list.length) % list.length];
    if (!next || next.meta.slug === current.current) return;
    current.current = next.meta.slug;
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
            <m.a
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
            </m.a>
          ))}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Interactions</h2>
        <GalleryFilters filters={filters} onOpen={open} />
        <LayoutGroup>
          {filters.filtered.length > 0 ? (
            <InteractionMasonry items={filters.filtered} onOpen={open} onReady={markReady} />
          ) : (
            <EmptyResult onClear={filters.clear} />
          )}
          <AnimatePresence>
            {selected && session && (masonryReady || filters.filtered.length === 0) && (
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
