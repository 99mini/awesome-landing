import "@awesome/theme/reset";
import { vars } from "@awesome/theme";
import { globalStyle } from "@vanilla-extract/css";

globalStyle("body", {
  background: "#000",
  color: vars.color.text,
});
