import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import * as css from "./morph-modal.css.ts";
import { cx } from "../lib/cx.ts";
import { trapTab } from "../lib/focus-trap.ts";

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
  /** 패널 뒤를 덮는 막 — 전체 화면이면 body 아래에 그려지므로 색은 이것으로 준다 */
  backdropClassName?: string;
  /** 닫기 버튼 글자 (스크린 리더도 이것을 읽는다) */
  closeLabel?: string;
  closeClassName?: string;
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
  backdropClassName,
  closeLabel = "Close",
  closeClassName,
}: MorphModalProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, visualDuration: duration, bounce };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      // 포커스가 이 패널 밖(예: 그 위에 열린 다른 모달)에 있으면 그쪽의 키다 — 가로채지 않는다
      const layer = layerRef.current;
      if (!layer?.contains(document.activeElement)) return;
      // 화면 전체를 덮을 때는 Tab 이 패널 안에서만 돈다
      if (e.key === "Tab" && !contained) return trapTab(e, layer);
      // 캡처 단계에서 먼저 받아 멈춘다 — 바깥 모달(예: 갤러리)이 같은 Esc 로 함께 닫히지 않도록
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      setOpen(false);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    // 화면 전체를 덮을 때는 뒤 페이지가 스크롤되지 않게
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    if (!contained) root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, { capture: true });
      if (!contained) root.style.overflow = prevOverflow;
    };
  }, [open, contained]);

  function close() {
    setOpen(false);
  }
  const portal = (node: ReactNode) =>
    contained || typeof document === "undefined" ? node : createPortal(node, document.body);

  // 카드는 패널이 완전히 사라진 뒤에 다시 보이므로, 포커스도 그때 돌려준다
  function restoreFocus() {
    triggerRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <m.button
        ref={triggerRef}
        type="button"
        layoutId={`${id}-shell`}
        layoutCrossfade={false}
        transition={transition}
        className={cx(css.trigger, className)}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <m.span layout="position" className={css.content}>
          {preview}
        </m.span>
      </m.button>

      {/* 화면 전체를 덮을 때는 body 로 꺼낸다 — 조상의 transform·overflow·z-index 에 갇히지 않게.
          (서버 렌더에는 document 가 없고 닫혀 있으므로 꺼낼 것도 없다) */}
      {portal(
        <AnimatePresence onExitComplete={restoreFocus}>
          {open && (
            <m.div
              ref={layerRef}
              className={contained ? css.layerContained : css.layerFixed}
              // 닫히는 동안에는 뒤의 카드를 바로 누를 수 있게
              exit={{ pointerEvents: "none" }}
            >
              <m.div
                className={cx(css.backdrop, backdropClassName)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                onClick={close}
              />
              <m.dialog
                open
                aria-modal={!contained}
                aria-label={label}
                layoutId={`${id}-shell`}
                layoutCrossfade={false}
                transition={transition}
                className={cx(css.panel, panelClassName)}
              >
                <m.div
                  layout="position"
                  className={css.content}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: reduce ? 0 : duration * 0.4 } }}
                  exit={{ opacity: 0, transition: { duration: 0.08 } }}
                >
                  {children}
                </m.div>
                <button
                  ref={closeRef}
                  type="button"
                  className={cx(css.close, closeClassName)}
                  onClick={close}
                >
                  {closeLabel}
                </button>
              </m.dialog>
            </m.div>
          )}
        </AnimatePresence>,
      )}
    </>
  );
}
