import "@awesome/theme/reset";
import "@awesome/theme/modes";
import { vars } from "@awesome/theme";
import { globalStyle } from "@vanilla-extract/css";

// 데모는 갤러리의 무대 위에 놓인다 (다크·라이트 — 툴바의 Theme 또는 시스템 설정)
globalStyle("body", {
  background: vars.color.stage,
  color: vars.color.text,
});
