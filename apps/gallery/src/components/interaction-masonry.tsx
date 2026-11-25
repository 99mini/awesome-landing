import { controlDefaults, type InteractionDemoModule } from "@99mini/interactions/registry";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m } from "motion/react";
import { Suspense, useEffect, useRef } from "react";
import { useLastHeight, useVisibility } from "../hooks/use-visibility.ts";
import { ReplayButton, useReplay } from "./replay-button.tsx";
import { Tags } from "./tags.tsx";
import * as ui from "../styles/ui.css.ts";
import * as css from "./interaction-masonry.css.ts";

interface InteractionMasonryProps {
  items: InteractionDemoModule[];
  onOpen: (slug: string) => void;
  /** 카드들이 처음 화면에 그려진 뒤 한 번 불린다 */
  onReady?: () => void;
}

/** Suspense 가 풀려 카드가 실제로 그려진 뒤에만 실행된다 */
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => onReady?.(), [onReady]);
  return null;
}

export function InteractionMasonry({ items, onOpen, onReady }: InteractionMasonryProps) {
  return (
    // 처음에는 화면 근처 데모들이 모두 준비된 뒤 한 번에 그린다 — 카드마다 따로 늘어나며 열이 흔들리지 않게.
    // 그 뒤에 보이게 되는 카드는 transition 이라 이 fallback 으로 돌아오지 않는다.
    <Suspense fallback={null}>
      <Ready onReady={onReady} />
      <div className={css.masonry}>
        {items.map((mod, i) => (
          <m.div
            key={mod.meta.slug}
            className={css.item}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PreviewCard mod={mod} onOpen={onOpen} />
          </m.div>
        ))}
      </div>
    </Suspense>
  );
}

function PreviewCard({
  mod,
  onOpen,
}: {
  mod: InteractionDemoModule;
  onOpen: (slug: string) => void;
}) {
  const { meta, default: Demo } = mod;
  const { replayKey, replay } = useReplay();
  const stageRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  // 화면 밖 카드의 데모는 내려서 rAF·타이머·애니메이션을 멈춘다 (모달의 데모는 항상 돈다)
  const paused = useVisibility(stageRef) === false;
  // 내리기 직전 높이를 그대로 둔다 — 카드 높이가 변하면 masonry 열이 다시 섞인다
  const lastHeight = useLastHeight(demoRef, paused);

  return (
    // 카드 어디를 눌러도 열린다. 키보드는 제목 버튼(Enter/Space)의 click 이 카드로 버블링된다
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <m.article
      layoutId={`shell-${meta.slug}`}
      layoutCrossfade={false}
      className={css.card}
      style={{ borderRadius: 20 }}
      onClick={(e) => {
        // 데모 안의 버튼·링크·입력·다이얼로그를 조작한 클릭은 모달을 열지 않는다 (제목 버튼은 예외)
        const target = e.target as Element;
        const control = target.closest("button, a, input, select, textarea, dialog");
        if (control && !control.hasAttribute("data-open-interaction")) return;
        onOpen(meta.slug);
      }}
    >
      <m.div
        ref={stageRef}
        layoutId={`stage-${meta.slug}`}
        layoutCrossfade={false}
        className={css.cardStage}
        style={{ borderRadius: 14 }}
        data-demo-paused={paused || undefined}
      >
        <m.div
          ref={demoRef}
          layout="position"
          className={paused && lastHeight !== null ? `${ui.demoFit} ${css.paused}` : ui.demoFit}
          style={
            paused && lastHeight !== null
              ? assignInlineVars({ [css.pausedHeight]: `${lastHeight}px` })
              : undefined
          }
        >
          {/* 데모 코드는 카드가 화면 근처에 처음 올 때 받는다 (Suspense 는 masonry 전체에 하나) */}
          {!paused && <Demo key={replayKey} {...controlDefaults(meta.controls)} />}
        </m.div>
        {meta.replayable !== false && (
          <div className={css.replaySlot}>
            <ReplayButton replayKey={replayKey} onReplay={replay} size="sm" />
          </div>
        )}
      </m.div>
      <m.footer layout="position" className={css.footer}>
        <button type="button" className={css.openButton} data-open-interaction>
          <m.span layoutId={`title-${meta.slug}`} layoutCrossfade={false} className={css.title}>
            {meta.title}
          </m.span>
        </button>
        <Tags tags={[meta.category, ...(meta.tags ?? [])]} />
      </m.footer>
    </m.article>
  );
}
