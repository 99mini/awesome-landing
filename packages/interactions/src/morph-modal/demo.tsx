import type { ControlValues, InteractionMeta } from "../types.ts";
import { MorphModal } from "./MorphModal.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "morph-modal",
  title: "Morph Modal",
  description: "카드가 그 자리에서 패널로 늘어나며 열리는 모달. Esc·배경 클릭으로 닫힘",
  category: "layout",
  tags: ["layoutId", "AnimatePresence", "dialog"],
  replayable: false,
  controls: {
    duration: { label: "Duration", min: 0.2, max: 1.2, step: 0.05, default: 0.5, unit: "s" },
    bounce: { label: "Bounce", min: 0, max: 0.5, step: 0.05, default: 0.15 },
  },
};

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
          className={`${css.tone[item.key]} ${css.card}`}
          panelClassName={`${css.tone[item.key]} ${css.panel}`}
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
