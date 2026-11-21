import type { ControlValues } from "../types.ts";
import { Accordion } from "./accordion.tsx";
import * as css from "./demo.css.ts";

const ITEMS = [
  {
    id: "layout",
    title: "Why not animate height?",
    content:
      "Height changes force layout on every frame. Here the box resizes at once and the rows below slide with transforms.",
  },
  {
    id: "focus",
    title: "What does the keyboard get?",
    content: "Each title is a real button with aria-expanded, and its panel is a labelled region.",
  },
  {
    id: "motion",
    title: "What about reduced motion?",
    content: "Panels open instantly and nothing slides.",
  },
];

export default function Demo({ duration, multiple }: ControlValues) {
  return (
    <Accordion
      className={css.root}
      itemClassName={css.item}
      triggerClassName={css.trigger}
      panelClassName={css.panel}
      items={ITEMS}
      duration={duration}
      multiple={multiple === 1}
    />
  );
}
