import { vars } from "@awesome/theme";
import { style } from "@vanilla-extract/css";

export const card = style({
  display: "grid",
  placeItems: "center",
  width: 280,
  height: 180,
  borderRadius: vars.radius.lg,
  fontWeight: 700,
  // 주황 램프 위에서 4.5:1 이상 — 흰 글자는 3.2:1 로 부족하다
  color: vars.color.rampInk,
  // 보라→분홍 그라디언트는 Hallmark 2a — 한 색조(주황) 안의 램프로
  background: `linear-gradient(135deg, ${vars.color.rampFrom}, ${vars.color.rampTo})`,
});
