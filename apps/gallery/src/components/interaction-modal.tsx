import { controlDefaults, type InteractionDemoModule } from "@awesome/interactions/registry";
import { motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ControlsPanel } from "./controls-panel.tsx";
import { ReplayButton, useReplay } from "./replay-button.tsx";
import { SourceViewer } from "./source-viewer.tsx";
import { Tags } from "./tags.tsx";
import * as ui from "../styles/ui.css.ts";
import * as css from "./interaction-modal.css.ts";

interface InteractionModalProps {
  mod: InteractionDemoModule;
  onClose: () => void;
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export function InteractionModal({ mod, onClose }: InteractionModalProps) {
  const { meta, default: Demo } = mod;
  const closeRef = useRef<HTMLButtonElement>(null);
  const { replayKey, replay } = useReplay();
  const [values, setValues] = useState(() => controlDefaults(meta.controls));
  const replayable = meta.replayable !== false;
  // 한 번 재생되는 데모는 값이 바뀔 때 다시 재생해서 바로 차이를 보여준다
  const demoKey = replayable ? `${replayKey}:${JSON.stringify(values)}` : String(replayKey);
  const titleId = `modal-title-${meta.slug}`;

  // 스크롤 잠금 · Esc 닫기 · 포커스 이동/복원
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      prevFocus?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        className={css.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className={css.layer}>
        <motion.dialog
          open
          layoutId={`shell-${meta.slug}`}
          layoutCrossfade={false}
          className={css.dialog}
          style={{ borderRadius: 28 }}
          aria-modal="true"
          aria-labelledby={titleId}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <motion.div
            layoutId={`stage-${meta.slug}`}
            layoutCrossfade={false}
            className={css.modalStage}
            style={{ borderRadius: 20 }}
          >
            <motion.div layout="position" className={ui.demoFit}>
              {/* key 는 데모 props(숫자 전용) 와 섞이지 않도록 Fragment 에 둔다 */}
              <Fragment key={demoKey}>
                <Demo {...values} />
              </Fragment>
            </motion.div>
          </motion.div>

          <motion.div layout="position" className={css.body}>
            <motion.span className={css.category} {...fade}>
              {meta.category}
            </motion.span>
            <motion.h2
              layoutId={`title-${meta.slug}`}
              layoutCrossfade={false}
              id={titleId}
              className={css.title}
            >
              {meta.title}
            </motion.h2>
            <motion.p className={ui.muted} {...fade}>
              {meta.description}
            </motion.p>
            <motion.div {...fade}>
              <Tags tags={meta.tags} />
              <p className={css.source}>
                source: <code>packages/interactions/src/{meta.slug}/</code>
              </p>
            </motion.div>
            <motion.div className={css.tools} {...fade}>
              {meta.controls && (
                <ControlsPanel
                  controls={meta.controls}
                  values={values}
                  onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
                  onReset={() => setValues(controlDefaults(meta.controls))}
                />
              )}
              <SourceViewer slug={meta.slug} />
            </motion.div>
          </motion.div>

          <motion.button
            ref={closeRef}
            type="button"
            className={css.close}
            aria-label="닫기"
            onClick={onClose}
            {...fade}
          >
            ✕
          </motion.button>
          {replayable && (
            <motion.div className={css.replaySlot} {...fade}>
              <ReplayButton replayKey={replayKey} onReplay={replay} />
            </motion.div>
          )}
        </motion.dialog>
      </div>
    </>
  );
}
