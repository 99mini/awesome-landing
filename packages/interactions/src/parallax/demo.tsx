import { useRef } from "react";
import type { ControlValues, InteractionMeta } from "../types.ts";
import * as css from "./demo.css.ts";
import { Parallax } from "./parallax.tsx";

export const meta: InteractionMeta = {
  slug: "parallax",
  title: "Parallax Layers",
  description: "스크롤 진행도에 따라 층마다 다른 속도로 움직여 깊이를 만드는 패럴랙스",
  category: "scroll",
  tags: ["useScroll", "useTransform", "depth"],
  replayable: false,
  controls: {
    depth: { label: "Depth", min: 0, max: 2, step: 0.1, default: 1, unit: "×" },
    distance: { label: "Distance", min: 40, max: 240, step: 10, default: 120, unit: "px" },
  },
};

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
      {/* 포커스 가능한 자식이 없는 스크롤 상자는 브라우저가 키보드 포커스를 준다 */}
      <section ref={scroller} className={css.scroller} aria-label="Parallax layers">
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
