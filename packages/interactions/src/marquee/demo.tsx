import { Fragment } from "react";
import type { ControlValues, InteractionMeta } from "../types.ts";
import { Marquee } from "./marquee.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "marquee",
  title: "Infinite Marquee",
  description: "끊김 없이 흐르는 띠. hover 시 일시정지",
  category: "layout",
  tags: ["keyframes", "mask-image"],
  replayable: false,
  controls: {
    duration: { label: "Loop", min: 4, max: 40, step: 1, default: 16, unit: "s" },
  },
};

const WORDS = ["React", "Motion", "Vanilla Extract", "Vite", "TypeScript"];

export default function Demo({ duration }: ControlValues) {
  return (
    <Marquee className={css.marquee} duration={duration}>
      {WORDS.map((word) => (
        <Fragment key={word}>
          <span className={css.item}>{word}</span>
          <span className={css.dot} aria-hidden>
            ✦
          </span>
        </Fragment>
      ))}
    </Marquee>
  );
}
