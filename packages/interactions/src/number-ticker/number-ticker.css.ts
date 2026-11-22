import { style } from "@vanilla-extract/css";

/** 구조만. 글꼴·크기·색은 className 으로 */
// 한 칸의 높이. 글자 모양이 1em 보다 위아래로 조금 커서, 딱 1em 이면 굴러가는 동안 옆 숫자가 비친다
const cell = "1.2em";

export const root = style({
  position: "relative",
  display: "inline-block",
  lineHeight: cell,
  fontVariantNumeric: "tabular-nums",
});

export const digits = style({
  // popLayout 이 사라지는 자리를 absolute 로 띄울 기준
  position: "relative",
  display: "inline-flex",
});

/** 한 자리 높이만 보이는 창 */
export const column = style({
  display: "inline-block",
  height: cell,
  overflow: "hidden",
  // 위아래 끝을 흐리게 — 굴러가는 동안 들어오고 나가는 숫자가 칼로 자른 듯 보이지 않게
  maskImage: "linear-gradient(transparent, currentColor 22%, currentColor 78%, transparent)",
});

/** 0~9 를 세로로 쌓은 기둥 — 10칸이라 한 칸이 높이의 10% */
export const reel = style({
  display: "flex",
  flexDirection: "column",
});

export const digit = style({
  display: "block",
  height: cell,
  textAlign: "center",
});

export const symbol = style({
  display: "inline-block",
});
