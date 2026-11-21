import type { InteractionMeta } from "../types.ts";
import { MagneticButton } from "./MagneticButton.tsx";

export const meta: InteractionMeta = {
  slug: "magnetic-button",
  title: "Magnetic Button",
  description: "커서에 끌려오는 듯한 스프링 기반 CTA 버튼",
  category: "cursor",
  tags: ["spring", "pointer"],
};

export default function Demo() {
  return (
    <MagneticButton
      style={{
        padding: "1rem 2.5rem",
        borderRadius: 999,
        border: "none",
        background: "#fff",
        color: "#000",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Get started
    </MagneticButton>
  );
}
