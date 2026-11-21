import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import { useState, type ReactNode } from "react";
import { cx } from "../lib/cx.ts";
import * as css from "./swipe-cards.css.ts";

export type SwipeDirection = "left" | "right";

interface SwipeCardsProps<T> {
  /** 위에서부터의 카드 — 첫 항목이 맨 위 */
  cards: readonly T[];
  getKey: (card: T) => string;
  renderCard: (card: T) => ReactNode;
  /** 맨 위 카드를 던졌을 때 */
  onSwipe: (card: T, direction: SwipeDirection) => void;
  /**
   * 카드가 날아갈 방향. 드래그로 던지면 스스로 알지만, 버튼처럼 바깥에서 카드를 뺄 때는
   * 그 방향을 여기로 알려준다.
   */
  direction?: SwipeDirection;
  /** 이 거리(px)를 넘기거나 빠르게 던지면 날아간다 */
  threshold?: number;
  /** 끌 때 기울어지는 최대 각도(deg) */
  tilt?: number;
  className?: string;
  cardClassName?: string;
}

/**
 * 좌우로 던지는 카드 스택. 기준을 넘지 않으면 제자리로 돌아온다.
 * 드래그를 못 쓰는 사용자를 위해 같은 동작을 버튼으로도 제공해야 한다 (데모 참고).
 */
export function SwipeCards<T>({
  cards,
  getKey,
  renderCard,
  onSwipe,
  threshold = 100,
  tilt = 12,
  direction,
  className,
  cardClassName,
}: SwipeCardsProps<T>) {
  const visible = cards.slice(0, 3);
  const [dragged, setDragged] = useState<SwipeDirection>("right");
  const exitTo = direction ?? dragged;

  return (
    <div className={cx(css.stack, className)}>
      <AnimatePresence initial={false} custom={exitTo}>
        {visible
          .map((card, depth) => (
            <Card
              key={getKey(card)}
              depth={depth}
              threshold={threshold}
              tilt={tilt}
              className={cardClassName}
              onSwipe={(to) => {
                setDragged(to);
                onSwipe(card, to);
              }}
            >
              {renderCard(card)}
            </Card>
          ))
          .toReversed()}
      </AnimatePresence>
    </div>
  );
}

function Card({
  depth,
  threshold,
  tilt,
  className,
  onSwipe,
  children,
}: {
  depth: number;
  threshold: number;
  tilt: number;
  className?: string;
  onSwipe: (direction: SwipeDirection) => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-tilt, 0, tilt]);
  const top = depth === 0;

  function onDragEnd(_: unknown, info: PanInfo) {
    const far = Math.abs(info.offset.x) > threshold;
    const fast = Math.abs(info.velocity.x) > 600;
    if (far || fast) onSwipe(info.offset.x > 0 ? "right" : "left");
  }

  return (
    <motion.div
      className={cx(css.card, className)}
      style={{ x, rotate: reduce ? 0 : rotate, zIndex: 10 - depth }}
      drag={top ? "x" : false}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      initial={false}
      animate={{ scale: 1 - depth * 0.05, y: depth * 12, opacity: depth > 1 ? 0.6 : 1 }}
      // 날아가는 방향은 AnimatePresence 의 custom 으로 받는다 (드래그든 버튼이든)
      variants={{
        exit: (to: SwipeDirection) => ({
          x: reduce ? 0 : to === "right" ? 400 : -400,
          opacity: 0,
          transition: { duration: reduce ? 0 : 0.3 },
        }),
      }}
      exit="exit"
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
    >
      {children}
    </motion.div>
  );
}
