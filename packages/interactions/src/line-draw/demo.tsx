import type { ControlValues, InteractionMeta } from "../types.ts";
import { LineDraw } from "./LineDraw.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "line-draw",
  title: "Line Draw Chart",
  description: "화면에 들어오면 선이 왼쪽부터 그려지고 끝점이 튀어나오는 라인 차트",
  category: "scroll",
  tags: ["pathLength", "useInView", "SVG"],
  controls: {
    duration: { label: "Duration", min: 0.4, max: 5, step: 0.1, default: 2, unit: "s" },
    thickness: { label: "Thickness", min: 1, max: 6, step: 0.5, default: 2.5, unit: "px" },
  },
};

/** 매번 같은 모양이 나오도록 고정 시드로 만든 데이터 */
function series(seed: number, length: number, scale: number) {
  let s = seed;
  let y = 0.5;
  return Array.from({ length }, () => {
    s = (s * 9301 + 49297) % 233280;
    y = Math.min(1, Math.max(0, y + (s / 233280 - 0.45) * 0.35));
    return y * scale;
  });
}

const DATA = [series(7, 24, 100), series(42, 24, 70)];
const CLASSES = [css.series.primary, css.series.secondary];

export default function Demo({ duration, thickness }: ControlValues) {
  return (
    <LineDraw
      className={css.chart}
      series={DATA}
      duration={duration}
      thickness={thickness}
      lineClassName={(i) => CLASSES[i]}
    />
  );
}
