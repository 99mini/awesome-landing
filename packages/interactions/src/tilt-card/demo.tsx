import type { InteractionMeta } from "../types.ts";
import { TiltCard } from "./TiltCard.tsx";

export const meta: InteractionMeta = {
  slug: "tilt-card",
  title: "3D Tilt Card",
  description: "포인터 위치에 따라 기울어지는 원근 카드",
  category: "hover",
  tags: ["perspective", "useTransform"],
};

export default function Demo() {
  return (
    <TiltCard>
      <div
        style={{
          width: 280,
          height: 180,
          borderRadius: 20,
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          background: "linear-gradient(135deg, #6d5dfc, #e05cff)",
        }}
      >
        Hover me
      </div>
    </TiltCard>
  );
}
