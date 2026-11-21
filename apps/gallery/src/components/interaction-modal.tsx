import { controlDefaults, type InteractionDemoModule } from "@awesome/interactions/registry";
import { m } from "motion/react";
import { Fragment, Suspense, lazy, useEffect, useRef, useState } from "react";
import { ControlsPanel } from "./controls-panel.tsx";
import { ReplayButton, useReplay } from "./replay-button.tsx";
import { Tags } from "./tags.tsx";
import * as ui from "../styles/ui.css.ts";
import * as css from "./interaction-modal.css.ts";

/** 소스 보기(하이라이터 포함)는 모달을 열 때만 받는다 */
const SourceViewer = lazy(() =>
  import("./source-viewer.tsx").then((mod) => ({ default: mod.SourceViewer })),
);

interface InteractionModalProps {
  mod: InteractionDemoModule;
  onClose: () => void;
  /** ←/→ 와 이전·다음 버튼. 목록이 하나뿐이면 넘기지 않는다 */
  onPrev?: () => void;
  onNext?: () => void;
  /**
   * 카드에서 열린 그대로면 true — 카드와 모달이 공유 레이아웃으로 모핑한다.
   * 모달 안에서 다른 인터랙션으로 넘어간 뒤에는 false: 엉뚱한 카드로 모핑하지 않고 페이드로 닫힌다.
   */
  morph: boolean;
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** 화살표 키가 입력·슬라이더 조작이면 넘기지 않는다 */
function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, [role=slider], [role=tablist]") !== null
  );
}

export function InteractionModal({ mod, onClose, onPrev, onNext, morph }: InteractionModalProps) {
  const { meta } = mod;
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `modal-title-${meta.slug}`;
  // 키보드 핸들러는 열릴 때 한 번만 등록하고, 최신 콜백은 ref 로 읽는다 (리렌더마다 포커스가 튀지 않게)
  const handlers = useRef({ onClose, onPrev, onNext });
  useEffect(() => {
    handlers.current = { onClose, onPrev, onNext };
  });

  // 스크롤 잠금 · Esc 닫기 · ←/→ 이동 · 포커스 이동/복원
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handlers.current.onClose();
      if (e.altKey || e.metaKey || e.ctrlKey || isEditable(e.target)) return;
      if (e.key === "ArrowLeft") handlers.current.onPrev?.();
      if (e.key === "ArrowRight") handlers.current.onNext?.();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      prevFocus?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <>
      <m.div
        className={css.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className={css.layer}>
        <m.dialog
          open
          layoutId={morph ? `shell-${meta.slug}` : undefined}
          layoutCrossfade={false}
          className={css.dialog}
          style={{ borderRadius: 28 }}
          aria-modal="true"
          aria-labelledby={titleId}
          exit={morph ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          {/* 인터랙션이 바뀌면 데모·조절기·소스 상태를 처음부터 */}
          <ModalContent key={meta.slug} mod={mod} morph={morph} titleId={titleId} />

          {(onPrev || onNext) && (
            <m.div className={css.pager} {...fade}>
              <button
                type="button"
                className={css.pagerButton}
                aria-label="이전 인터랙션"
                title="이전 (←)"
                onClick={onPrev}
              >
                <Chevron direction="left" />
              </button>
              <button
                type="button"
                className={css.pagerButton}
                aria-label="다음 인터랙션"
                title="다음 (→)"
                onClick={onNext}
              >
                <Chevron direction="right" />
              </button>
            </m.div>
          )}
          <m.button
            ref={closeRef}
            type="button"
            className={css.close}
            aria-label="닫기"
            onClick={onClose}
            {...fade}
          >
            ✕
          </m.button>
        </m.dialog>
      </div>
    </>
  );
}

function ModalContent({
  mod,
  morph,
  titleId,
}: {
  mod: InteractionDemoModule;
  morph: boolean;
  titleId: string;
}) {
  const { meta, default: Demo } = mod;
  const { replayKey, replay } = useReplay();
  const [values, setValues] = useState(() => controlDefaults(meta.controls));
  const replayable = meta.replayable !== false;
  // 한 번 재생되는 데모는 값이 바뀔 때 다시 재생해서 바로 차이를 보여준다
  const demoKey = replayable ? `${replayKey}:${JSON.stringify(values)}` : String(replayKey);
  // 넘겨서 들어온 내용은 모핑 대신 짧게 페이드인
  const enter = morph ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 } };

  return (
    <>
      <m.div
        layoutId={morph ? `stage-${meta.slug}` : undefined}
        layoutCrossfade={false}
        className={css.modalStage}
        style={{ borderRadius: 20 }}
        {...enter}
      >
        <m.div layout="position" className={ui.demoFit}>
          {/* key 는 데모 props(숫자 전용) 와 섞이지 않도록 Fragment 에 둔다 */}
          <Fragment key={demoKey}>
            <Suspense fallback={null}>
              <Demo {...values} />
            </Suspense>
          </Fragment>
        </m.div>
      </m.div>

      <m.div layout="position" className={css.body}>
        <m.h2
          layoutId={morph ? `title-${meta.slug}` : undefined}
          layoutCrossfade={false}
          id={titleId}
          className={css.title}
          {...enter}
        >
          {meta.title}
        </m.h2>
        <m.p className={ui.muted} {...fade}>
          {meta.description}
        </m.p>
        <m.div {...fade}>
          <Tags tags={[meta.category, ...(meta.tags ?? [])]} />
          <p className={css.source}>
            source: <code>packages/interactions/src/{meta.slug}/</code>
          </p>
        </m.div>
        <m.div className={css.tools} {...fade}>
          {meta.controls && (
            <ControlsPanel
              controls={meta.controls}
              values={values}
              onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
              onReset={() => setValues(controlDefaults(meta.controls))}
            />
          )}
          <Suspense fallback={<p className={ui.muted}>Loading source…</p>}>
            <SourceViewer slug={meta.slug} />
          </Suspense>
        </m.div>
      </m.div>

      {replayable && (
        <m.div className={css.replaySlot} {...fade}>
          <ReplayButton replayKey={replayKey} onReplay={replay} />
        </m.div>
      )}
    </>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
