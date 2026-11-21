import "@awesome/theme/reset";
import { globalStyle } from "@vanilla-extract/css";
import { ix } from "./theme.css.ts";

globalStyle(":root", {
  colorScheme: "light",
  fontSynthesis: "none",
});

globalStyle("body", {
  background: ix.color.ground,
  color: ix.color.ink,
  fontFamily: ix.font.body,
  fontSize: "1.0625rem",
  lineHeight: 1.55,
});

globalStyle("h1, h2, h3", {
  overflowWrap: "break-word",
  minWidth: 0,
  textWrap: "balance",
});

globalStyle("a", {
  color: "inherit",
});
