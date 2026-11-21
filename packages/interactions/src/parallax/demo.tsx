import { useRef } from "react";
import type { ControlValues } from "../types.ts";
import * as css from "./demo.css.ts";
import { Parallax } from "./parallax.tsx";

/** 뒤 → 앞으로 갈수록 빠르다 — 라벨의 배율은 실제 speed 값이다 */
const LAYERS = [
  { key: "back", name: "Back", speed: 0.2 },
  { key: "mid", name: "Middle", speed: 0.5 },
  { key: "front", name: "Front", speed: 0.9 },
] as const;

export default function Demo({ depth = 1, distance }: ControlValues) {
  const scroller = useRef<HTMLElement>(null);

  return (
    <div className={css.root}>
      <p className={css.hint}>Scroll inside the box.</p>
      {/* 스크롤 상자는 키보드로도 움직일 수 있어야 한다 — Chrome 은 자동으로 주지만 다른 브라우저를 위해 명시 */}
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <section ref={scroller} className={css.scroller} tabIndex={0} aria-label="Parallax layers">
        <div className={css.scene}>
          {LAYERS.map((l) => (
            <Parallax key={l.key} container={scroller} speed={l.speed * depth} distance={distance}>
              <div className={`${css.layer} ${css.depth[l.key]}`}>
                <span>
                  {l.name}
                  <span className={css.speed}>{(l.speed * depth).toFixed(2)}×</span>
                </span>
              </div>
            </Parallax>
          ))}
        </div>
      </section>
    </div>
  );
}
