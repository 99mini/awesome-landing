import "@awesome/theme/reset";
import { globalStyle } from "@vanilla-extract/css";
import { ix } from "./theme.css.ts";

globalStyle(":root", {
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

// 비활성 컨트롤 — 우선순위 0 이라 개별 스타일이 언제든 덮어쓸 수 있다
globalStyle(":where(button, input, select, textarea):disabled", {
  opacity: 0.45,
  cursor: "not-allowed",
});
