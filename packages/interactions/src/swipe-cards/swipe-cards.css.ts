import { style } from "@vanilla-extract/css";

export const stack = style({
  position: "relative",
  display: "grid",
});

/** 모든 카드를 같은 칸에 겹친다 */
export const card = style({
  gridArea: "1 / 1",
  cursor: "grab",
  touchAction: "pan-y",
  userSelect: "none",
  selectors: {
    "&:active": { cursor: "grabbing" },
  },
});
