import "@awesome/theme/reset";
import { globalStyle } from "@vanilla-extract/css";
import { au } from "./theme.css.ts";

globalStyle("body", {
  background: au.color.ground,
  color: au.color.ink,
  fontFamily: au.font.display,
});

globalStyle("h1, h2", {
  overflowWrap: "break-word",
  minWidth: 0,
  textWrap: "balance",
});
