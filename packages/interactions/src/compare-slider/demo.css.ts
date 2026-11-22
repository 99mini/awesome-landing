import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const slider = style({
  width: "min(100%, 340px)",
  borderRadius: vars.radius.lg,
  // 나누는 선의 색
  color: vars.color.inverse,
});

export const handle = style({
  border: 0,
  background: vars.color.inverse,
  color: vars.color.inverseInk,
});

export const screen = style({
  display: "grid",
  alignContent: "start",
  gap: 12,
  height: 210,
  padding: 16,
});

export const tag = style({
  padding: "2px 12px",
  borderRadius: vars.radius.pill,
  fontSize: "0.8rem",
});

export const hero = style({
  height: 64,
  borderRadius: vars.radius.md,
});

export const heading = style({
  fontSize: "1.1rem",
  fontWeight: 700,
});

export const line = style({
  height: 8,
  borderRadius: vars.radius.pill,
});

export const short = style({
  width: "60%",
});

/** 밑그림: 회색 선과 테두리만 */
export const sketch = {
  screen: style({ background: vars.color.surface }),
  // 앞 화면은 선 왼쪽에 보이므로 표시도 왼쪽에
  tag: style({
    justifySelf: "start",
    border: `1px solid ${vars.color.border}`,
    color: vars.color.muted,
  }),
  hero: style({ border: `1px dashed ${vars.color.muted}` }),
  heading: style({ color: vars.color.muted, fontWeight: 400 }),
  line: style({ background: vars.color.border }),
};

/** 완성: 색과 대비를 입힌 같은 화면 */
export const finished = {
  screen: style({ background: vars.color.toneA }),
  tag: style({ justifySelf: "end", background: vars.color.signal, color: vars.color.inverseInk }),
  hero: style({
    background: `linear-gradient(135deg, ${vars.color.rampFrom}, ${vars.color.rampTo})`,
  }),
  heading: style({ color: vars.color.text }),
  line: style({ background: vars.color.muted }),
};
