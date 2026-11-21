import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

/** 갤러리 전반에서 재사용하는 작은 스타일 조각 */

export const muted = style({
  color: vars.color.muted,
});

export const focusRing = style({
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: 2,
    },
  },
});

/** 데모를 스테이지 중앙에 두는 래퍼 (카드·모달 공용) */
export const demoFit = style({
  display: "grid",
  placeItems: "center",
  width: "100%",
});

/** 데모 스테이지 공통 배경 */
export const stage = style({
  display: "grid",
  placeItems: "center",
  overflow: "hidden",
  // 데모 안의 z-index 가 카드 밖(갤러리 모달 등)과 겨루지 않게
  isolation: "isolate",
  background: vars.color.stage,
});

/** 원형 아이콘 버튼 (닫기·다시 보기) */
export const iconButton = style([
  focusRing,
  {
    display: "grid",
    placeItems: "center",
    width: 36,
    height: 36,
    padding: 0,
    border: `1px solid ${vars.color.border}`,
    borderRadius: "50%",
    background: vars.color.scrim,
    color: vars.color.text,
    cursor: "pointer",
    transition: "border-color 0.2s",
    selectors: {
      "&:hover": { borderColor: vars.color.accent },
    },
  },
]);
