import { useState } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { SwipeCards, type SwipeDirection } from "./swipe-cards.tsx";

const CARDS = [
  { id: "one", title: "Spring", tone: "toneA" },
  { id: "two", title: "Layout", tone: "toneB" },
  { id: "three", title: "Gesture", tone: "toneC" },
  { id: "four", title: "Scroll", tone: "raised" },
] as const;

type CardData = (typeof CARDS)[number];

export default function Demo({ threshold, tilt }: ControlValues) {
  const [cards, setCards] = useState<CardData[]>([...CARDS]);
  const [last, setLast] = useState("");
  const [direction, setDirection] = useState<SwipeDirection>("right");

  function swipe(card: CardData, to: SwipeDirection) {
    setDirection(to);
    setCards((all) => all.filter((c) => c.id !== card.id));
    setLast(`${card.title} ${to === "right" ? "kept" : "skipped"}`);
  }
  const top = cards[0];

  return (
    <div className={css.root}>
      <SwipeCards
        className={css.stack}
        cards={cards}
        getKey={(c) => c.id}
        threshold={threshold}
        direction={direction}
        tilt={tilt}
        onSwipe={swipe}
        renderCard={(c) => (
          <div className={`${css.card} ${css.tone[c.tone]}`}>
            <span className={css.cardTitle}>{c.title}</span>
            <span className={css.cardHint}>Drag left or right</span>
          </div>
        )}
      />
      {/* 드래그를 못 쓰는 사용자를 위한 같은 동작 */}
      <div className={css.actions}>
        {top ? (
          <>
            <button type="button" className={css.button} onClick={() => swipe(top, "left")}>
              Skip
            </button>
            <button type="button" className={css.button} onClick={() => swipe(top, "right")}>
              Keep
            </button>
          </>
        ) : (
          <button
            type="button"
            className={css.button}
            onClick={() => {
              setCards([...CARDS]);
              setLast("");
            }}
          >
            Start over
          </button>
        )}
      </div>
      <p className={css.status} aria-live="polite">
        {last || `${cards.length} cards left`}
      </p>
    </div>
  );
}
