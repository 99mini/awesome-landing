import "@awesome/theme/reset";
import { vars } from "@awesome/theme";
import { globalStyle } from "@vanilla-extract/css";

globalStyle(":root", {
  // 모달이 스크롤을 잠가도 레이아웃이 밀리지 않도록
  scrollbarGutter: "stable",
});

globalStyle("body", {
  background: vars.color.bg,
  color: vars.color.text,
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});
