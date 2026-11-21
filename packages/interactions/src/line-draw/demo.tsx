import type { ControlValues } from "../types.ts";
import { LineDraw } from "./line-draw.tsx";
import * as css from "./demo.css.ts";

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
