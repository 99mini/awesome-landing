import { useRef } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { ScrollHighlight } from "./scroll-highlight.tsx";

const TEXT =
  "Each word waits in the dark until the paragraph scrolls past it, then lights up and stays lit.";

export default function Demo({ dim }: ControlValues) {
  const scroller = useRef<HTMLElement>(null);

  return (
    <div className={css.root}>
      <p className={css.hint}>Scroll inside the box.</p>
      {/* 스크롤 상자는 키보드로도 움직일 수 있어야 한다 — Chrome 은 자동으로 주지만 다른 브라우저를 위해 명시 */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <section ref={scroller} className={css.scroller} tabIndex={0} aria-label="Scroll highlight">
        <div className={css.track}>
          <ScrollHighlight className={css.text} text={TEXT} dim={dim} container={scroller} />
        </div>
      </section>
    </div>
  );
}
