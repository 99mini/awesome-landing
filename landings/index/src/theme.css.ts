import { createGlobalTheme } from "@vanilla-extract/css";

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
