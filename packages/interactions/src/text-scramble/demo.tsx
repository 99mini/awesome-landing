import type { ControlValues, InteractionMeta } from "../types.ts";
import { TextScramble } from "./TextScramble.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "text-scramble",
  title: "Text Scramble",
  description: "무작위 글리프가 왼쪽부터 원래 글자로 풀리는 디코딩 효과",
  category: "text",
  tags: ["requestAnimationFrame", "useInView"],
  controls: {
    duration: { label: "Duration", min: 0.3, max: 3, step: 0.1, default: 1.2, unit: "s" },
  },
};

export default function Demo({ duration }: ControlValues) {
  return (
    <p className={css.text}>
      <TextScramble text="DECODING THE FUTURE" duration={duration} />
    </p>
  );
}
