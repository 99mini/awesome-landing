import { createGlobalTheme } from "@vanilla-extract/css";

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
