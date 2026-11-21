/* Hallmark · checked: 2026-11-21 · genre: modern-minimal · scope: app
 * floor: 0 FAIL · fixed: 2a, 24b, 26a, 26b, 29, 39b, 40, 48, 54, 67 · structural: none printed
 * built: the project · redesign: polish · v2.0.0 */
/* Hallmark · waive 72 · the marquee track runs past its card by design and the card clips it · the Infinite Marquee demo shows content scrolling under its own edge */

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

// 비활성 컨트롤 — 우선순위 0 이라 개별 스타일이 언제든 덮어쓸 수 있다
globalStyle(":where(button, input, select, textarea):disabled", {
  opacity: 0.45,
  cursor: "not-allowed",
});
