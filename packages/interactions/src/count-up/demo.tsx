import type { ControlValues, InteractionMeta } from "../types.ts";
import { CountUp } from "./count-up.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "count-up",
  title: "Count Up",
  description: "화면에 들어오면 숫자가 목표값까지 부드럽게 올라간다",
  category: "scroll",
  tags: ["animate", "useTransform", "Intl"],
  controls: {
    to: { label: "Target", min: 100, max: 100000, step: 100, default: 12800 },
    duration: { label: "Duration", min: 0.3, max: 4, step: 0.1, default: 1.6, unit: "s" },
  },
};

export default function Demo({ to = 12800, duration }: ControlValues) {
  return (
    <div className={css.stat}>
      <CountUp className={css.number} to={to} duration={duration} />
      <span className={css.label}>interactions shipped</span>
    </div>
  );
}
