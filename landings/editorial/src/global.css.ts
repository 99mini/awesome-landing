import "@awesome/theme/reset";
import { globalStyle } from "@vanilla-extract/css";
import { ed } from "./theme.css.ts";

globalStyle("body", {
  background: ed.color.paper,
  color: ed.color.ink,
  fontFamily: ed.font.serif,
});

globalStyle("::selection", {
  background: ed.color.ink,
  color: ed.color.paper,
});

globalStyle("h1, h2", {
  overflowWrap: "break-word",
  minWidth: 0,
  textWrap: "balance",
});

globalStyle("p", {
  textWrap: "pretty",
});
