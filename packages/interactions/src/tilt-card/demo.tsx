import type { InteractionMeta } from "../types.ts";
import { TiltCard } from "./TiltCard.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "tilt-card",
  title: "3D Tilt Card",
  description: "포인터 위치에 따라 기울어지는 원근 카드",
  category: "hover",
  tags: ["perspective", "useTransform"],
  replayable: false,
};

export default function Demo() {
  return (
    <TiltCard>
      <div className={css.card}>Hover me</div>
    </TiltCard>
  );
}
