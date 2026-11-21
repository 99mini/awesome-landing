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

// 비활성 컨트롤 — 우선순위 0 이라 개별 스타일이 언제든 덮어쓸 수 있다
globalStyle(":where(button, input, select, textarea):disabled", {
  opacity: 0.45,
  cursor: "not-allowed",
});
