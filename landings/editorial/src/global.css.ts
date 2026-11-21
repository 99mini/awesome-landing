import "@awesome/theme/reset";
import { globalStyle } from "@vanilla-extract/css";
import { palette, serif } from "./App.css.ts";

globalStyle(":root", {
  colorScheme: "light",
});

globalStyle("body", {
  background: palette.paper,
  color: palette.ink,
  fontFamily: serif,
});

globalStyle("::selection", {
  background: palette.ink,
  color: palette.paper,
});
