import { Fragment } from "react";
import type { ControlValues } from "../types.ts";
import { Marquee } from "./marquee.tsx";
import * as css from "./demo.css.ts";

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
