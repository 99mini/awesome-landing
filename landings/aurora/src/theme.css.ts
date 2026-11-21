import { createGlobalTheme } from "@vanilla-extract/css";

/**
 * Aurora 전용 토큰 — 색과 글꼴은 여기서만 정의한다 (Hallmark Floor 1).
 * 보라·분홍·시안 그라디언트(Hallmark 2a)를 버리고, 실제 오로라처럼 초록 한 가지 색조(145°~175°)로.
 */
export const au = createGlobalTheme(":root", {
  color: {
    ground: "oklch(14% 0.02 190)",
    ink: "oklch(96% 0.015 160)",
    muted: "oklch(74% 0.03 170)",
    rule: "oklch(40% 0.03 170 / 0.6)",
    bloomA: "oklch(72% 0.17 150)",
    bloomB: "oklch(66% 0.13 168)",
    bloomC: "oklch(58% 0.1 178)",
    action: "oklch(88% 0.12 152)",
    actionInk: "oklch(18% 0.03 170)",
  },
  font: {
    display: '"Avenir Next", "Segoe UI Variable Display", system-ui, sans-serif',
  },
});
