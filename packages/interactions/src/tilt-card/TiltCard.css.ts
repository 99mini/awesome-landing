import { style } from "@vanilla-extract/css";

/** 원근 거리는 `--tilt-perspective` 로 덮어쓸 수 있다 */
export const viewport = style({
  perspective: "var(--tilt-perspective, 800px)",
});

export const card = style({
  transformStyle: "preserve-3d",
});
