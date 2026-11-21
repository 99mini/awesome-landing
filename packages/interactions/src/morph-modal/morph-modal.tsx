import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import * as css from "./morph-modal.css.ts";

interface MorphModalProps {
  /** 닫혀 있을 때 보이는 카드 내용 */
  preview: ReactNode;
  /** 열렸을 때 패널 내용 */
  children: ReactNode;
  /** 다이얼로그 이름 (스크린 리더) */
  label: string;
  /** 모핑 시간(s) */
  duration?: number;
  /** 스프링 탄성 0 ~ 1 */
  bounce?: number;
  /**
   * true: 가장 가까운 position 이 있는 조상 안에서 열린다 (데모·카드 그리드 안)
   * false: 화면 전체를 덮는다
   */
  contained?: boolean;
  className?: string;
  panelClassName?: string;
}

/** 카드가 그 자리에서 패널로 늘어나며 열리는 모달 (shared layout) */
export function MorphModal({
  preview,
  children,
  label,
  duration = 0.5,
  bounce = 0.15,
  contained = false,
  className,
  panelClassName,
}: MorphModalProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, visualDuration: duration, bounce };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    // 캡처 단계에서 먼저 받아 멈춘다 — 바깥 모달(예: 갤러리)이 같은 Esc 로 함께 닫히지 않도록
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      setOpen(false);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [open]);

  function close() {
    setOpen(false);
  }

  // 카드는 패널이 완전히 사라진 뒤에 다시 보이므로, 포커스도 그때 돌려준다
  function restoreFocus() {
    triggerRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        layoutId={`${id}-shell`}
        layoutCrossfade={false}
        transition={transition}
        className={className ? `${css.trigger} ${className}` : css.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <motion.span layout="position" className={css.content}>
          {preview}
        </motion.span>
      </motion.button>

      <AnimatePresence onExitComplete={restoreFocus}>
        {open && (
          <motion.div
            className={contained ? css.layerContained : css.layerFixed}
            // 닫히는 동안에는 뒤의 카드를 바로 누를 수 있게
            exit={{ pointerEvents: "none" }}
          >
            <motion.div
              className={css.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              onClick={close}
            />
            <motion.dialog
              open
              aria-modal={!contained}
              aria-label={label}
              layoutId={`${id}-shell`}
              layoutCrossfade={false}
              transition={transition}
              className={panelClassName ? `${css.panel} ${panelClassName}` : css.panel}
            >
              <motion.div
                layout="position"
                className={css.content}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: reduce ? 0 : duration * 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
              >
                {children}
              </motion.div>
              <button ref={closeRef} type="button" className={css.close} onClick={close}>
                Close
              </button>
            </motion.dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
