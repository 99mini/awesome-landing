import { assignInlineVars } from "@vanilla-extract/dynamic";
import { AnimatePresence, m, useReducedMotion, type PanInfo } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import * as css from "./photo-viewer.css.ts";
import { closedFrame, fit, openFrame, type Frame } from "./geometry.ts";
import { cx } from "../lib/cx.ts";
import { trapTab } from "../lib/focus-trap.ts";

export interface PhotoViewerItem {
  id: string;
  /** 스크린 리더가 읽는 사진 이름 */
  label: string;
  /** 목록에 보이는 칸 */
  thumbnail: ReactNode;
  /** 크게 볼 때의 내용 — 틀을 꽉 채운다 */
  content: ReactNode;
  /** 가로 ÷ 세로. 없으면 칸 안의 <img> 나 불러온 사진에서 읽는다 */
  aspect?: number;
}

export interface PhotoViewerLabels {
  close: string;
  previous: string;
  next: string;
  /** position 은 1부터 */
  position: (position: number, total: number) => string;
}

const LABELS: PhotoViewerLabels = {
  close: "Close",
  previous: "Previous photo",
  next: "Next photo",
  position: (position, total) => `${position} of ${total}`,
};

interface PhotoViewerProps {
  items: readonly PhotoViewerItem[];
  /** 아직 다 받지 않았을 때의 전체 장수 (기본은 items 의 길이) */
  total?: number;
  /** 마지막 사진에 닿았는데 total 이 더 많을 때 — 나머지를 받아 items 를 늘린다 */
  onReachEnd?: () => void;
  /** 커지고 넘어가는 시간(s) */
  duration?: number;
  /** 이 거리(px)를 넘게 밀거나 빠르게 밀면 넘어간다 */
  threshold?: number;
  /** 크게 볼 때의 모서리(px) */
  radius?: number;
  /** true: 가장 가까운 position 이 있는 조상 안에서 / false: 화면 전체 */
  contained?: boolean;
  labels?: Partial<PhotoViewerLabels>;
  /** 목록(<ul>) */
  className?: string;
  triggerClassName?: string;
  backdropClassName?: string;
  /** 닫기 · 이전 · 다음 버튼 */
  controlClassName?: string;
  counterClassName?: string;
}

interface Slide {
  direction: number;
  /** 한 장이 지나가는 거리(px) */
  span: number;
}

/** 넘길 때 — 동작 줄이기에서는 움직이지 않고 바로 바뀐다 */
const slide = (reduce: boolean) => ({
  enter: ({ direction, span }: Slide) => ({ x: reduce ? 0 : direction * span }),
  center: { x: 0 },
  exit: ({ direction, span }: Slide) => ({ x: reduce ? 0 : -direction * span }),
});

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || target.closest("input, textarea, select") !== null);

/**
 * 사진 묶음. 누른 칸이 그 자리에서 커지고, 닫지 않고 앞뒤 사진으로 넘긴다
 * (←/→ · Home/End · 버튼 · 좌우로 밀기). 닫으면 지금 보고 있는 사진의 칸으로 돌아간다.
 * 칸의 잘린 모양에서 시작해 원본 비율로 펼치므로(clip-path + 균일한 scale) 사진이 찌그러지지 않는다.
 */
export function PhotoViewer({
  items,
  total = items.length,
  onReachEnd,
  duration = 0.4,
  threshold = 80,
  radius = 4,
  contained = false,
  labels,
  className,
  triggerClassName,
  backdropClassName,
  controlClassName,
  counterClassName,
}: PhotoViewerProps) {
  const text = { ...LABELS, ...labels };
  const reduce = useReducedMotion() ?? false;
  const [activeId, setActiveId] = useState<string | null>(null);
  /** 열 때 누른 사진과 그 칸의 모양 — 이 사진만 칸에서 커지며 나타난다 */
  const [opened, setOpened] = useState<{ id: string; from: Frame } | null>(null);
  /** 닫는 중이면 돌아갈 칸의 모양 */
  const [closing, setClosing] = useState<Frame | null>(null);
  const [move, setMove] = useState<Slide>({ direction: 1, span: 0 });
  /** 불러온 사진에서 읽은 비율 */
  const [loaded, setLoaded] = useState<Record<string, number>>({});

  const listRef = useRef<HTMLUListElement>(null);
  const layerRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const dragged = useRef(false);

  const index = items.findIndex((item) => item.id === activeId);
  const active = items[index];
  const shown = active !== undefined;
  const count = Math.max(total, items.length);

  const aspectOf = (item: PhotoViewerItem) => item.aspect ?? loaded[item.id] ?? 4 / 3;

  function remember(id: string, img: HTMLImageElement) {
    if (!img.naturalWidth) return;
    const aspect = img.naturalWidth / img.naturalHeight;
    setLoaded((prev) => (prev[id] === aspect ? prev : { ...prev, [id]: aspect }));
  }

  /** 보여 주기 직전의 비율 — 아직 모르면 이미 불러온 칸의 사진에서 읽는다 */
  function measureAspect(item: PhotoViewerItem) {
    const img = triggers.current.get(item.id)?.querySelector("img");
    if (item.aspect || loaded[item.id] || !img?.naturalWidth) return aspectOf(item);
    remember(item.id, img);
    return img.naturalWidth / img.naturalHeight;
  }

  /** 패널이 놓일 자리 — 화면 전체이거나, 목록의 position 조상 */
  function area() {
    const parent = contained ? listRef.current?.offsetParent : null;
    return parent?.getBoundingClientRect() ?? new DOMRect(0, 0, innerWidth, innerHeight);
  }

  /** 그 사진의 칸에 꼭 맞게 잘린 모양 */
  function frameAtTrigger(item: PhotoViewerItem) {
    const trigger = triggers.current.get(item.id);
    const frame = fit(area(), measureAspect(item));
    if (!trigger) return closedFrame(null, frame, radius);
    const corner = Number.parseFloat(getComputedStyle(trigger).borderTopLeftRadius) || 0;
    return closedFrame(trigger.getBoundingClientRect(), frame, corner);
  }

  function open(item: PhotoViewerItem) {
    setClosing(null);
    // 처음 여는 사진은 옆에서 밀려오지 않고 칸에서 커진다
    setMove({ direction: 1, span: 0 });
    setOpened({ id: item.id, from: frameAtTrigger(item) });
    setActiveId(item.id);
  }

  function close() {
    if (active && !closing) setClosing(frameAtTrigger(active));
  }

  function finish() {
    if (activeId) triggers.current.get(activeId)?.focus({ preventScroll: true });
    setActiveId(null);
    setOpened(null);
    setClosing(null);
  }

  function show(next: number) {
    const item = items[next];
    if (!item || closing || next === index) return;
    setMove({ direction: next > index ? 1 : -1, span: area().width });
    measureAspect(item);
    setOpened(null);
    setActiveId(item.id);
    // 보고 있는 사진의 칸이 화면 밖이면 데려온다 — 닫을 때 돌아갈 자리가 보이게
    const trigger = triggers.current.get(item.id);
    const box = trigger?.getBoundingClientRect();
    if (!contained && box && (box.top < 0 || box.bottom > innerHeight)) {
      trigger?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }

  // 리스너는 열고 닫을 때만 걸고, 최신 함수는 ref 로 읽는다
  const latest = useRef({
    close,
    show,
    finish,
    onReachEnd,
    index,
    activeId,
    last: items.length - 1,
  });
  useEffect(() => {
    latest.current = { close, show, finish, onReachEnd, index, activeId, last: items.length - 1 };
  });

  useEffect(() => {
    if (!shown) return;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      const layer = layerRef.current;
      // 포커스가 이 안에 없으면(위에 다른 모달) 그쪽의 키다
      if (!layer?.contains(document.activeElement)) return;
      if (e.key === "Tab") {
        if (!contained) trapTab(e, layer);
        return;
      }
      if (e.altKey || e.ctrlKey || e.metaKey || isEditable(e.target)) return;
      const now = latest.current;
      const actions: Record<string, () => void> = {
        Escape: now.close,
        ArrowLeft: () => now.show(now.index - 1),
        ArrowRight: () => now.show(now.index + 1),
        Home: () => now.show(0),
        End: () => now.show(now.last),
      };
      const action = actions[e.key];
      if (!action) return;
      e.preventDefault();
      // 바깥 모달(예: 갤러리)이 같은 키로 함께 닫히거나 넘어가지 않도록 캡처 단계에서 멈춘다
      e.stopImmediatePropagation();
      action();
    };
    window.addEventListener("keydown", onKey, { capture: true });

    const root = document.documentElement;
    const { overflow, scrollbarGutter } = root.style;
    if (!contained) {
      // 스크롤바가 사라져도 뒤 페이지가 옆으로 밀리지 않게 (돌아갈 칸의 자리가 어긋난다)
      if (innerWidth > root.clientWidth) root.style.scrollbarGutter = "stable";
      root.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey, { capture: true });
      if (contained) return;
      root.style.overflow = overflow;
      root.style.scrollbarGutter = scrollbarGutter;
    };
  }, [shown, contained, latest]);

  // 애니메이션 기능이 아직 없거나 끝 알림을 놓쳐도 닫히게
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => latest.current.finish(), (reduce ? 0 : duration * 1000) + 300);
    return () => clearTimeout(timer);
  }, [closing, duration, reduce, latest]);

  // 마지막 장에 닿으면 나머지를 청한다
  const atEnd = shown && index === items.length - 1 && total > items.length;
  useEffect(() => {
    if (atEnd) latest.current.onReachEnd?.();
  }, [atEnd, latest]);

  // 밀려나가는 중인 앞 사진은 예전 props 로 남아 있다 — 지금 사진의 조작만 받는다
  function onDragEnd(id: string, info: PanInfo) {
    const far = Math.abs(info.offset.x) > threshold;
    const fast = Math.abs(info.velocity.x) > 500 && Math.abs(info.offset.x) > 10;
    const now = latest.current;
    if ((far || fast) && id === now.activeId) now.show(now.index + (info.offset.x < 0 ? 1 : -1));
    // 끌고 놓을 때 따라오는 click 이 닫기로 읽히지 않게
    setTimeout(() => {
      dragged.current = false;
    });
  }

  function readAspect(id: string, e: SyntheticEvent) {
    if (e.target instanceof HTMLImageElement) remember(id, e.target);
  }

  const ease = [0.22, 1, 0.36, 1] as const;
  const transition = { duration: reduce ? 0 : duration, ease };
  const neighbours = [items[index - 1], items[index + 1]].filter((item) => item !== undefined);

  const layer = active && (
    <dialog
      ref={layerRef}
      open
      // 사진을 눌러도 포커스가 이 안에 남아 키보드가 이어지게
      tabIndex={-1}
      aria-modal={!contained}
      aria-label={active.label}
      className={contained ? css.layerContained : css.layerFixed}
      // 브라우저의 사진 끌기가 넘기기를 가로채지 않게
      onDragStartCapture={(e) => e.preventDefault()}
    >
      <m.div
        className={cx(css.backdrop, backdropClassName)}
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={transition}
      />

      <AnimatePresence custom={move}>
        <m.div
          key={active.id}
          className={css.slide}
          custom={move}
          variants={slide(reduce)}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          drag={items.length > 1 && !closing ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          // 더 갈 곳이 없는 쪽은 뻑뻑하게
          dragElastic={{ left: items[index + 1] ? 0.9 : 0.12, right: index > 0 ? 0.9 : 0.12 }}
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={(_, info) => onDragEnd(active.id, info)}
          // 사진 바깥을 누르면 닫는다 (키보드는 Esc 와 닫기 버튼)
          onClick={(e) => {
            const now = latest.current;
            if (e.target !== e.currentTarget || dragged.current) return;
            if (active.id === now.activeId) now.close();
          }}
        >
          <m.div
            className={css.frame}
            style={assignInlineVars({ [css.aspectVar]: String(aspectOf(active)) })}
            initial={opened?.id === active.id ? opened.from : false}
            animate={closing ?? openFrame(radius)}
            transition={transition}
            onAnimationComplete={() => {
              if (closing) finish();
            }}
            onLoadCapture={(e) => readAspect(active.id, e)}
          >
            {active.content}
          </m.div>
        </m.div>
      </AnimatePresence>

      {/* 앞뒤 사진을 미리 받아 둔다 */}
      <div hidden>
        {neighbours.map((item) => (
          <div key={item.id} onLoadCapture={(e) => readAspect(item.id, e)}>
            {item.content}
          </div>
        ))}
      </div>

      <m.div
        className={css.controls}
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={transition}
      >
        <button
          ref={closeRef}
          type="button"
          className={cx(css.control, css.close, controlClassName)}
          aria-label={text.close}
          onClick={close}
        >
          <Icon d="M4 4l8 8M12 4l-8 8" />
        </button>
        {count > 1 && (
          <>
            {/* 끝에서도 포커스를 잃지 않게 disabled 대신 aria-disabled */}
            <button
              type="button"
              className={cx(css.control, css.previous, controlClassName)}
              aria-label={text.previous}
              aria-disabled={index === 0}
              onClick={() => show(index - 1)}
            >
              <Icon d="M10 3L5 8l5 5" />
            </button>
            <button
              type="button"
              className={cx(css.control, css.next, controlClassName)}
              aria-label={text.next}
              aria-disabled={index === items.length - 1}
              onClick={() => show(index + 1)}
            >
              <Icon d="M6 3l5 5-5 5" />
            </button>
            <p className={cx(css.counter, counterClassName)} aria-live="polite">
              {text.position(index + 1, count)}
            </p>
          </>
        )}
      </m.div>
    </dialog>
  );

  return (
    <>
      <ul ref={listRef} className={cx(css.list, className)}>
        {items.map((item) => (
          <li key={item.id}>
            <button
              ref={(el) => {
                if (el) triggers.current.set(item.id, el);
                else triggers.current.delete(item.id);
              }}
              type="button"
              className={cx(css.trigger, triggerClassName)}
              aria-haspopup="dialog"
              aria-expanded={item.id === activeId}
              // 크게 보는 동안 그 칸은 비워 둔다 — 사진이 칸에서 나와 칸으로 돌아간다
              data-active={item.id === activeId || undefined}
              onClick={() => open(item)}
            >
              {item.thumbnail}
            </button>
          </li>
        ))}
      </ul>
      {layer && (contained ? layer : createPortal(layer, document.body))}
    </>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
