import { colorSchemes } from "@awesome/theme/color-schemes";
import { assignVars, createGlobalTheme } from "@vanilla-extract/css";

/**
 * Editorial 전용 토큰 — 색과 글꼴은 전부 여기서만 정의한다 (Hallmark Floor 1).
 * 종이·잉크에 차가운 코발트 하나 (크림 + 세리프 + 테라코타 조합은 Hallmark 65 '생성된 룩').
 */
export const ed = createGlobalTheme(":root", {
  color: {
    paper: "oklch(95.5% 0.012 85)",
    ink: "oklch(20% 0.012 70)",
    muted: "oklch(46% 0.015 70)",
    rule: "oklch(20% 0.012 70 / 0.85)",
    accent: "oklch(45% 0.16 262)",
  },
  font: {
    serif: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
  },
});

// 시스템이 다크면 잉크색 지면에 밝은 활자, 코발트는 밝게 (대비: 글자 15.6 · 흐린 글자 7.7 · 강조 8.9)
colorSchemes(
  "light",
  assignVars(ed.color, {
    paper: "oklch(17% 0.01 70)",
    ink: "oklch(93% 0.012 85)",
    muted: "oklch(72% 0.015 80)",
    rule: "oklch(93% 0.012 85 / 0.8)",
    accent: "oklch(76% 0.11 262)",
  }),
);
