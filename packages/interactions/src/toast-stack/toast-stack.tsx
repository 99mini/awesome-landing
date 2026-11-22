import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../lib/cx.ts";
import * as css from "./toast-stack.css.ts";

// - 포인터·포커스가 머무는 동안 시간을 멈추는 감싸개는 조작 요소가 아니라 키보드 동작이 따로 없다
//   (포커스는 onFocus 로 같이 받는다).
// - 새 알림을 읽어 주는 영역: <ol> 에는 status 역할을 줄 수 없고 <output> 은 목록을 담지 못해 div 에 role 로 준다.
/* oxlint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/prefer-tag-over-role */

export interface Toast {
  id: string | number;
  title: ReactNode;
  body?: ReactNode;
}

interface ToastStackProps {
  toasts: Toast[];
  onDismiss: (id: Toast["id"]) => void;
  /** 저절로 사라지기까지(s). 0 이면 직접 닫을 때까지 남는다 */
  duration?: number;
  /** 한 번에 보이는 개수 — 넘치는 것은 앞의 것이 사라지면 차례로 나온다 */
  limit?: number;
  /** 알림 영역 이름 (스크린 리더) */
  label?: string;
  className?: string;
  toastClassName?: string;
}

/**
 * 쌓이고 사라지는 알림. 새 알림이 들어오거나 하나가 사라지면 나머지가 layout 애니메이션으로 자리를 옮긴다.
 * 포인터를 올리거나 포커스가 안에 있으면 사라지는 시간이 멈춘다 (읽는 도중 사라지지 않게).
 */
export function ToastStack({
  toasts,
  onDismiss,
  duration = 4,
  limit = 3,
  label = "Notifications",
  className,
  toastClassName,
}: ToastStackProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // 먼저 온 것부터 보여 주고, 넘치는 것은 자리가 날 때까지 기다린다 (타이머도 보일 때부터 간다)
  const visible = toasts.slice(0, limit);

  return (
    <section aria-label={label} className={cx(css.region, className)}>
      <div
        className={css.pause}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
      >
        <div role="status" aria-live="polite" aria-relevant="additions">
          <ol className={css.list}>
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((toast) => (
                <m.li
                  key={toast.id}
                  layout={reduce ? false : "position"}
                  className={cx(css.toast, toastClassName)}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    reduce ? { opacity: 0 } : { opacity: 0, x: 48, transition: { duration: 0.2 } }
                  }
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                  }
                >
                  <ToastTimer
                    id={toast.id}
                    duration={duration}
                    paused={hovered || focused}
                    onDismiss={onDismiss}
                  />
                  <div className={css.text}>
                    <span className={css.title}>{toast.title}</span>
                    {toast.body && <span className={css.body}>{toast.body}</span>}
                  </div>
                  <button
                    type="button"
                    className={css.dismiss}
                    aria-label="Dismiss"
                    onClick={() => onDismiss(toast.id)}
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" />
                    </svg>
                  </button>
                </m.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
      </div>
    </section>
  );
}

/** 남은 시간을 기억하며 멈췄다 이어 가는 타이머 (화면에는 아무것도 그리지 않는다) */
function ToastTimer({
  id,
  duration,
  paused,
  onDismiss,
}: {
  id: Toast["id"];
  duration: number;
  paused: boolean;
  onDismiss: (id: Toast["id"]) => void;
}) {
  const remaining = useRef(duration * 1000);
  const dismiss = useRef(onDismiss);
  useEffect(() => {
    dismiss.current = onDismiss;
  });

  useEffect(() => {
    remaining.current = duration * 1000;
  }, [duration]);

  useEffect(() => {
    if (paused || duration <= 0) return;
    const started = performance.now();
    const timer = setTimeout(() => dismiss.current(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= performance.now() - started;
    };
  }, [paused, duration, id]);

  return null;
}
