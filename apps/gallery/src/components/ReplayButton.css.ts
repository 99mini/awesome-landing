import { styleVariants } from "@vanilla-extract/css";
import { iconButton } from "../styles/ui.css.ts";

export const size = styleVariants({
  md: [iconButton],
  sm: [iconButton, { width: 32, height: 32 }],
});
