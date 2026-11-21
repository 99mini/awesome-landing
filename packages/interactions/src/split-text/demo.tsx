import type { InteractionMeta } from "../types.ts";
import { SplitText } from "./SplitText.tsx";

export const meta: InteractionMeta = {
  slug: "split-text",
  title: "Split Text Reveal",
  description: "글자 단위로 블러가 걷히며 등장하는 헤드라인",
  category: "text",
  tags: ["variants", "stagger"],
};

export default function Demo() {
  return (
    <h2 style={{ fontSize: "clamp(2rem, 6vw, 4rem)", margin: 0 }}>
      <SplitText text="Build something beautiful." />
    </h2>
  );
}
