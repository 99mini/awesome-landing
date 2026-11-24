import { colorSchemes } from "@awesome/theme/color-schemes";
import { assignVars, createGlobalTheme } from "@vanilla-extract/css";

/**
 * Ochre 전용 토큰 — 색과 글꼴은 여기서만 정의한다 (Hallmark Floor 1).
 * 모래색 지면에 숯색 활자, 강조는 오커 하나 (주요 버튼과 포커스에만).
 * 대비 (라이트 / 다크): 글자 15.6 / 15.6 · 흐린 글자 7.1 / 8.1 · 버튼 글자 5.8 / 9.6 · 포커스 링 5.4 / 9.8
 */
export const oc = createGlobalTheme(":root", {
  color: {
    ground: "oklch(95.5% 0.018 85)",
    surface: "oklch(98.5% 0.008 85)",
    ink: "oklch(21% 0.01 60)",
    muted: "oklch(43% 0.02 70)",
    border: "oklch(84% 0.02 80)",
    accent: "oklch(50% 0.11 68)",
    accentInk: "oklch(98% 0.01 85)",
    soft: "oklch(88% 0.07 80)",
  },
  font: {
    // 넓은 그로테스크 — 제목은 폭을 125% 로 넓혀 쓴다
    display: '"Archivo", "Helvetica Neue", Arial, sans-serif',
    body: '"Archivo", "Helvetica Neue", Arial, sans-serif',
  },
});

// 다크: 숯색 지면, 밝은 오커
colorSchemes(
  "light",
  assignVars(oc.color, {
    ground: "oklch(18.5% 0.008 60)",
    surface: "oklch(23% 0.01 60)",
    ink: "oklch(94% 0.014 85)",
    muted: "oklch(74% 0.02 80)",
    border: "oklch(32% 0.012 60)",
    accent: "oklch(80% 0.13 78)",
    accentInk: "oklch(20% 0.02 60)",
    soft: "oklch(34% 0.06 75)",
  }),
);
