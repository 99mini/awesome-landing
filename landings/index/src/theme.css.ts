import { colorSchemes } from "@awesome/theme/color-schemes";
import { assignVars, createGlobalTheme } from "@vanilla-extract/css";

/** Index 전용 토큰 — 색과 글꼴은 여기서만 (Hallmark Floor 1) */
export const ix = createGlobalTheme(":root", {
  color: {
    ground: "oklch(86% 0.075 352)",
    ink: "oklch(21% 0.045 350)",
    muted: "oklch(38% 0.05 350)",
    rule: "oklch(21% 0.045 350 / 0.35)",
    // 데모가 실제로 도는 무대 — 데모들은 어두운 배경 기준으로 만들어졌다
    stage: "oklch(19% 0.02 350)",
    stageInk: "oklch(95% 0.01 350)",
    stageMuted: "oklch(72% 0.03 350)",
    selected: "oklch(21% 0.045 350)",
    selectedInk: "oklch(90% 0.06 352)",
  },
  font: {
    display: '"Antonio", "Arial Narrow", sans-serif',
    body: '"Hanken Grotesk", ui-sans-serif, sans-serif',
    code: '"JetBrains Mono", ui-monospace, monospace',
  },
});

// 시스템이 다크면 짙은 자두색 지면, 고른 줄은 분홍 칩. 무대는 지면보다 더 어둡게 두어 구분한다
// (대비: 글자 13.4 · 흐린 글자 8.2 · 무대의 흐린 글자 8.0 · 고른 줄 11.4)
colorSchemes(
  "light",
  assignVars(ix.color, {
    ground: "oklch(24% 0.05 350)",
    ink: "oklch(93% 0.04 352)",
    muted: "oklch(78% 0.04 350)",
    rule: "oklch(93% 0.04 352 / 0.3)",
    stage: "oklch(13% 0.015 350)",
    stageInk: "oklch(95% 0.01 350)",
    stageMuted: "oklch(72% 0.03 350)",
    selected: "oklch(86% 0.075 352)",
    selectedInk: "oklch(21% 0.045 350)",
  }),
);
