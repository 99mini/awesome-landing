import { createGlobalTheme, createGlobalThemeContract } from "@vanilla-extract/css";

/**
 * 디자인 토큰 계약.
 * CSS 변수 이름을 `--al-<path>` 로 고정해서, 외부(일반 CSS, Tailwind 등)에서도 덮어쓸 수 있게 한다.
 * 예) :root { --al-color-accent: hotpink; }
 */
export const vars = createGlobalThemeContract(
  {
    color: {
      bg: null,
      surface: null,
      border: null,
      text: null,
      muted: null,
      accent: null,
      /** 데모 스테이지 배경 그라디언트 */
      stageGlow: null,
      stageGlowStrong: null,
      stageBase: null,
      /** 모달 뒤 배경 */
      overlay: null,
      /** 떠 있는 아이콘 버튼 배경 */
      scrim: null,
    },
    radius: {
      sm: null,
      md: null,
      lg: null,
      pill: null,
    },
    font: {
      body: null,
    },
    ease: {
      out: null,
    },
  },
  (_value, path) => `al-${path.join("-")}`,
);

createGlobalTheme(":root", vars, {
  color: {
    bg: "#0b0b0f",
    surface: "#15151b",
    border: "#26262e",
    text: "#f4f4f6",
    muted: "#8b8b98",
    accent: "#8b7bff",
    stageGlow: "#1d1a33",
    stageGlowStrong: "#241f45",
    stageBase: "#101015",
    overlay: "rgb(5 5 10 / 0.72)",
    scrim: "rgb(0 0 0 / 0.4)",
  },
  radius: {
    sm: "4px",
    md: "16px",
    lg: "20px",
    pill: "999px",
  },
  font: {
    body: "Inter, system-ui, -apple-system, sans-serif",
  },
  ease: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
});
