import type { InteractionDemoModule } from "@awesome/interactions/registry";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Tags } from "./Tags.tsx";

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
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="modal-layer">
        <motion.dialog
          open
          layoutId={`shell-${meta.slug}`}
          layoutCrossfade={false}
          className="modal"
          style={{ borderRadius: 28 }}
          aria-modal="true"
          aria-labelledby={titleId}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <motion.div
            layoutId={`stage-${meta.slug}`}
            layoutCrossfade={false}
            className="modal-stage"
            style={{ borderRadius: 20 }}
          >
            <motion.div layout="position" className="demo-fit">
              <Demo />
            </motion.div>
          </motion.div>

          <motion.div layout="position" className="modal-body">
            <motion.span className="badge" {...fade}>
              {meta.category}
            </motion.span>
            <motion.h2
              layoutId={`title-${meta.slug}`}
              layoutCrossfade={false}
              id={titleId}
              className="modal-title"
            >
              {meta.title}
            </motion.h2>
            <motion.p className="muted" {...fade}>
              {meta.description}
            </motion.p>
            <motion.div {...fade}>
              <Tags tags={meta.tags} />
              <p className="muted source">
                source: <code>packages/interactions/src/{meta.slug}/</code>
              </p>
            </motion.div>
          </motion.div>

          <motion.button
            ref={closeRef}
            type="button"
            className="modal-close"
            aria-label="닫기"
            onClick={onClose}
            {...fade}
          >
            ✕
          </motion.button>
        </motion.dialog>
      </div>
    </>
  );
}
