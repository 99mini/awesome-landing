import { Reorder, useDragControls, useReducedMotion } from "motion/react";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../lib/cx.ts";
import { visuallyHidden } from "../lib/visually-hidden.css.ts";
import * as css from "./reorder-list.css.ts";

interface ReorderListProps<T extends string> {
  items: readonly T[];
  onReorder: (items: T[]) => void;
  /** 항목 내용 */
  renderItem: (item: T) => ReactNode;
  /** 스크린 리더가 읽을 항목 이름 */
  itemLabel?: (item: T) => string;
  className?: string;
  itemClassName?: string;
  handleClassName?: string;
}

const defaultLabel = (item: string) => item;

/**
 * 손잡이를 드래그해 순서를 바꾸는 목록 (Motion Reorder).
 * 드래그만으로는 키보드 사용자가 쓸 수 없으므로, 손잡이에 포커스를 두고 ↑/↓ 로도 옮길 수 있고
 * 바뀐 위치를 스크린 리더에 알린다.
 */
export function ReorderList<T extends string>({
  items,
  onReorder,
  renderItem,
  itemLabel = defaultLabel,
  className,
  itemClassName,
  handleClassName,
}: ReorderListProps<T>) {
  const [announcement, setAnnouncement] = useState("");

  function move(item: T, step: -1 | 1) {
    const from = items.indexOf(item);
    const to = from + step;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    next.splice(from, 1);
    next.splice(to, 0, item);
    onReorder(next);
    setAnnouncement(`${itemLabel(item)}, position ${to + 1} of ${items.length}`);
  }

  return (
    <>
      <Reorder.Group
        axis="y"
        values={[...items]}
        onReorder={onReorder}
        className={cx(css.list, className)}
      >
        {items.map((item) => (
          <Item
            key={item}
            item={item}
            label={itemLabel(item)}
            onMove={(step) => move(item, step)}
            className={itemClassName}
            handleClassName={handleClassName}
          >
            {renderItem(item)}
          </Item>
        ))}
      </Reorder.Group>
      <p className={visuallyHidden} aria-live="polite">
        {announcement}
      </p>
    </>
  );
}

function Item<T extends string>({
  item,
  label,
  onMove,
  className,
  handleClassName,
  children,
}: {
  item: T;
  label: string;
  onMove: (step: -1 | 1) => void;
  className?: string;
  handleClassName?: string;
  children: ReactNode;
}) {
  const controls = useDragControls();
  const reduce = useReducedMotion();

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      onMove(e.key === "ArrowUp" ? -1 : 1);
    }
  }

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className={cx(css.item, className)}
      layout="position"
      whileDrag={reduce ? undefined : { scale: 1.02 }}
    >
      <button
        type="button"
        className={cx(css.handle, handleClassName)}
        aria-label={`Reorder ${label}. Use arrow up and down.`}
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={onKeyDown}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden fill="currentColor">
          <circle cx="5.5" cy="4" r="1.25" />
          <circle cx="10.5" cy="4" r="1.25" />
          <circle cx="5.5" cy="8" r="1.25" />
          <circle cx="10.5" cy="8" r="1.25" />
          <circle cx="5.5" cy="12" r="1.25" />
          <circle cx="10.5" cy="12" r="1.25" />
        </svg>
      </button>
      {children}
    </Reorder.Item>
  );
}
