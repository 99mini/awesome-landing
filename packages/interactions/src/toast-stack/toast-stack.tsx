import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../lib/cx.ts";
import * as css from "./toast-stack.css.ts";

// - 포인터·포커스가 머무는 동안 펼치고 시간을 멈추는 감싸개는 조작 요소가 아니라 키보드 동작이 따로 없다
//   (포커스는 onFocus 로 같이 받는다).
// - 새 알림을 읽어 주는 영역: <ol> 에는 status 역할을 줄 수 없고 <output> 은 목록을 담지 못해 div 에 role 로 준다.
// - 탭해서 펼치기는 터치 화면을 위한 것 — 키보드는 포커스가 들어오면 이미 펼쳐진다.
/* oxlint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/prefer-tag-over-role, jsx-a11y/click-events-have-key-events */

export interface Toast {
  id: string | number;
  title: ReactNode;
  body?: ReactNode;
}

interface ToastStackProps {
  /** 들어온 순서대로 (마지막이 가장 새 알림) */
  toasts: Toast[];
  onDismiss: (id: Toast["id"]) => void;
  /** 저절로 사라지기까지(s). 0 이면 직접 닫을 때까지 남는다 */
  duration?: number;
  /** 한 번에 보이는 개수 — 더 오래된 것은 숨어 있다가 앞의 것이 사라지면 나온다 */
  limit?: number;
  /**
   * true: 새 알림이 맨 앞에 오고 오래된 것은 뒤로 작게 겹쳐 쌓인다 (iOS 알림처럼).
   *       포인터를 올리거나 포커스가 들어오면 목록으로 펼쳐진다.
   * false: 늘 목록으로 보인다.
   */
  collapse?: boolean;
  /** 알림 영역 이름 (스크린 리더) */
  label?: string;
  className?: string;
  toastClassName?: string;
}

/** 겹쳐 쌓일 때 뒤 알림이 아래로 비어져 나오는 길이(px)와 한 단계마다 작아지는 비율 */
const PEEK = 10;
const SHRINK = 0.05;

/**
 * 쌓이고 사라지는 알림. 겹친 더미 ↔ 펼친 목록 전환과, 들어오고 나갈 때 나머지가 자리를 옮기는 것은
 * 모두 layout 애니메이션(transform)이다.
 * 포인터나 포커스가 머무는 동안에는 펼쳐 두고 사라지는 시간도 멈춘다 (읽는 도중 사라지지 않게).
 */
export function ToastStack({
  toasts,
  onDismiss,
  duration = 4,
  limit = 3,
  collapse = true,
  label = "Notifications",
  className,
  toastClassName,
}: ToastStackProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // 터치 화면에는 hover 가 없다 — 더미를 탭하면 펼쳐 두고, 바깥을 탭하면 다시 접는다
  const [pinned, setPinned] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const engaged = hovered || focused || (pinned && toasts.length > 0);

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (!areaRef.current?.contains(e.target as Node)) setPinned(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [pinned]);
  const stacked = collapse && !engaged;
  // 새 알림이 앞(위)에 온다
  const visible = toasts.slice(-limit).toReversed();
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36 };
  // 나가는 알림이 닫힌 것인지(목록에서 빠짐), 새 알림에 밀려 숨는 것인지(목록에는 남음) — exit 이 고른다
  const remaining = new Set(toasts.map((t) => t.id));

  return (
    <section aria-label={label} className={cx(css.region, className)}>
      {/* 숨은 것까지 모든 알림의 시간을 센다 */}
      {toasts.map((toast) => (
        <ToastTimer
          key={toast.id}
          id={toast.id}
          duration={duration}
          paused={engaged}
          onDismiss={onDismiss}
        />
      ))}
      <div
        ref={areaRef}
        className={css.pause}
        onClick={(e) => {
          // 닫기 버튼을 누른 것은 닫기만 한다
          if (collapse && !(e.target as Element).closest("button")) setPinned(true);
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
      >
        <div role="status" aria-live="polite" aria-relevant="additions">
          <ol className={cx(css.list, stacked && css.stacked)} data-stacked={stacked || undefined}>
            <AnimatePresence initial={false} mode="popLayout" custom={remaining}>
              {visible.map((toast, depth) => (
                <m.li
                  key={toast.id}
                  layout={reduce ? false : "position"}
                  className={cx(css.toast, toastClassName)}
                  custom={remaining}
                  variants={{
                    // 닫힘: 옆으로 밀려 나간다. 밀려 숨음: 더미 뒤로 작아지며 가라앉는다
                    exit: (still: Set<Toast["id"]>) =>
                      reduce
                        ? { opacity: 0 }
                        : still.has(toast.id)
                          ? {
                              opacity: 0,
                              y: (stacked ? limit : 0) * PEEK,
                              scale: 1 - limit * SHRINK,
                              transition: { duration: 0.2 },
                            }
                          : { opacity: 0, x: 48, transition: { duration: 0.2 } },
                  }}
                  exit="exit"
                  // 위에서 내려오며 들어온다. 투명한 동안 뒤 알림이 비쳐 보이지 않게 불투명해지는 것은 빠르게
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.96 }}
                  // 겹쳤을 때: 뒤로 갈수록 아래로 조금 비어져 나오고 작아진다 (흐리게 하지 않는다 — 글이 읽혀야 한다)
                  animate={{
                    opacity: 1,
                    y: stacked ? depth * PEEK : 0,
                    scale: stacked ? 1 - depth * SHRINK : 1,
                    zIndex: visible.length - depth,
                  }}
                  transition={{ ...spring, opacity: { duration: reduce ? 0 : 0.12 } }}
                  // 뒤에 깔린 알림은 겹쳐 있는 동안 읽히지 않는다 — 펼치면 다시 보인다
                  aria-hidden={stacked && depth > 0 ? true : undefined}
                >
                  <div className={css.text}>
                    <span className={css.title}>{toast.title}</span>
                    {toast.body && <span className={css.body}>{toast.body}</span>}
                  </div>
                  <button
                    type="button"
                    className={css.dismiss}
                    aria-label="Dismiss"
                    // 겹쳐 있는 동안 뒤 알림의 버튼은 Tab 순서에서 뺀다 (앞 알림에 포커스가 가면 펼쳐진다)
                    tabIndex={stacked && depth > 0 ? -1 : undefined}
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
