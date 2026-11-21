import type { ControlValues, InteractionMeta } from "../types.ts";
import { AnalogClock } from "./analog-clock.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "analog-clock",
  title: "Analog Clock",
  description: "초침이 스프링으로 '틱' 하거나, 모든 바늘이 연속으로 흐르는 SVG 시계",
  category: "layout",
  tags: ["useAnimationFrame", "spring", "SVG"],
  replayable: false,
  controls: {
    smooth: { label: "Smooth", kind: "toggle", min: 0, max: 1, step: 1, default: 0 },
    secondHand: { label: "Second hand", kind: "toggle", min: 0, max: 1, step: 1, default: 1 },
    size: { label: "Size", min: 120, max: 320, step: 10, default: 200, unit: "px" },
  },
};

export default function Demo({ smooth, secondHand, size }: ControlValues) {
  return (
    <AnalogClock
      className={css.clock}
      smooth={smooth === 1}
      secondHand={secondHand !== 0}
      size={size}
    />
  );
}
