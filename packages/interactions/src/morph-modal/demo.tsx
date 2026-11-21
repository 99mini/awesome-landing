import type { ControlValues } from "../types.ts";
import { MorphModal } from "./morph-modal.tsx";
import * as css from "./demo.css.ts";
import { cx } from "../lib/cx.ts";

const ITEMS = [
  {
    key: "spring",
    title: "Spring",
    body: "The panel grows on a spring. Duration sets how long it takes to look settled; bounce sets how far it overshoots.",
  },
  {
    key: "layout",
    title: "Layout",
    body: "Card and panel share one layoutId, so Motion animates between their boxes instead of fading one out and the other in.",
  },
  {
    key: "focus",
    title: "Focus",
    body: "Opening moves focus to Close. Escape or a click outside closes the panel and puts focus back on the card.",
  },
] as const;

export default function Demo({ duration, bounce }: ControlValues) {
  return (
    <div className={css.area}>
      {ITEMS.map((item) => (
        <MorphModal
          key={item.key}
          contained
          label={item.title}
          duration={duration}
          bounce={bounce}
          className={cx(css.tone[item.key], css.card)}
          panelClassName={cx(css.tone[item.key], css.panel)}
          preview={
            <>
              <span className={css.cardTitle}>{item.title}</span>
              <span className={css.cardHint}>Open</span>
            </>
          }
        >
          <h3 className={css.panelTitle}>{item.title}</h3>
          <p className={css.panelBody}>{item.body}</p>
        </MorphModal>
      ))}
    </div>
  );
}
