import { colorSchemes } from "@awesome/theme/color-schemes";
import { assignVars, createGlobalTheme } from "@vanilla-extract/css";

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

// 시스템이 라이트면 밝은 하늘 — 같은 초록 색조의 옅은 블룸, 진한 초록 버튼 (대비: 글자 16.5 · 흐린 글자 7.6 · 버튼 8.8)
colorSchemes(
  "dark",
  assignVars(au.color, {
    ground: "oklch(97% 0.012 165)",
    ink: "oklch(20% 0.03 175)",
    muted: "oklch(42% 0.035 170)",
    rule: "oklch(55% 0.03 170 / 0.45)",
    bloomA: "oklch(84% 0.13 150)",
    bloomB: "oklch(86% 0.09 168)",
    bloomC: "oklch(82% 0.07 178)",
    action: "oklch(38% 0.09 160)",
    actionInk: "oklch(97% 0.02 155)",
  }),
);
