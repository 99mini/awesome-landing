import type { InteractionMeta } from "../types.ts";
import { MagneticButton } from "./MagneticButton.tsx";
import * as css from "./demo.css.ts";

export const meta: InteractionMeta = {
  slug: "magnetic-button",
  title: "Magnetic Button",
  description: "커서에 끌려오는 듯한 스프링 기반 CTA 버튼",
  category: "cursor",
  tags: ["spring", "pointer"],
  replayable: false,
};

export default function Demo() {
  return <MagneticButton className={css.button}>Get started</MagneticButton>;
}
