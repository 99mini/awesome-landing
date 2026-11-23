import { createGlobalTheme, createGlobalThemeContract } from "@vanilla-extract/css";

/**
 * 디자인 토큰 계약 — 갤러리와 데모의 모든 색·글꼴은 여기서 나온다 (Hallmark Floor 1).
 * CSS 변수 이름을 `--al-<path>` 로 고정해서, 외부(일반 CSS, Tailwind 등)에서도 덮어쓸 수 있게 한다.
 * 예) :root { --al-color-accent: hotpink; }
 */
export const vars = createGlobalThemeContract(
  {
    color: {
      bg: null,
      surface: null,
      surfaceRaised: null,
      border: null,
      text: null,
      muted: null,
      /** UI 강조 — 선택·상태·포커스에만 쓴다 */
      accent: null,
      accentInk: null,
      /** 데모가 도는 무대 (단색) */
      stage: null,
      /** 모달 뒤 배경 */
      overlay: null,
      /** 떠 있는 아이콘 버튼 배경 */
      scrim: null,
      /** 밝은 면과 그 위의 글자 (데모의 흰 버튼 등) */
      inverse: null,
      inverseInk: null,
      /** 데모 안의 강조와 두 번째 계열 (차트 등) — UI 강조와 분리 */
      signal: null,
      signalAlt: null,
      /** signal·signalAlt 색면 위의 글자 (다크: 어둡게, 라이트: 밝게 — signal 의 밝기가 테마마다 뒤집힌다) */
      signalInk: null,
      /** 한 색조 램프 (틸트 카드) */
      rampFrom: null,
      rampTo: null,
      rampInk: null,
      /** 7세그먼트 LCD */
      lcdGround: null,
      lcdEdge: null,
      lcdOn: null,
      /** 모핑 모달 데모의 세 면 */
      toneA: null,
      toneB: null,
      toneC: null,
    },
    /** 소스 보기 하이라이트 */
    code: {
      ground: null,
      lineNumber: null,
      class: null,
      identifier: null,
      sign: null,
      property: null,
      entity: null,
      jsx: null,
      string: null,
      keyword: null,
      comment: null,
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

/** 색이 아닌 토큰 — 라이트·다크가 같다 (modes.css.ts 도 이것을 쓴다) */
export const shape = {
  radius: {
    sm: "4px",
    md: "16px",
    lg: "20px",
    pill: "999px",
  },
  font: {
    body: '"Hanken Grotesk", ui-sans-serif, sans-serif',
  },
  ease: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};

// 중립색은 강조 색조(30, coral)로 아주 살짝 기울인다
createGlobalTheme(":root", vars, {
  color: {
    bg: "oklch(15% 0.008 30)",
    surface: "oklch(19.5% 0.009 30)",
    surfaceRaised: "oklch(24% 0.01 30)",
    border: "oklch(30% 0.012 30)",
    text: "oklch(96% 0.005 30)",
    muted: "oklch(72% 0.015 30)",
    accent: "oklch(74% 0.14 30)",
    accentInk: "oklch(20% 0.03 30)",
    stage: "oklch(17% 0.008 30)",
    overlay: "oklch(10% 0.01 30 / 0.72)",
    scrim: "oklch(10% 0.01 30 / 0.45)",
    inverse: "oklch(96% 0.006 30)",
    inverseInk: "oklch(18% 0.01 30)",
    signal: "oklch(84% 0.12 85)",
    signalAlt: "oklch(80% 0.1 180)",
    signalInk: "oklch(20% 0.03 85)",
    rampFrom: "oklch(74% 0.16 55)",
    rampTo: "oklch(64% 0.2 30)",
    rampInk: "oklch(22% 0.04 40)",
    lcdGround: "oklch(15% 0.02 150)",
    lcdEdge: "oklch(26% 0.03 150)",
    lcdOn: "oklch(88% 0.17 150)",
    toneA: "oklch(34% 0.06 262)",
    toneB: "oklch(34% 0.05 170)",
    toneC: "oklch(34% 0.05 60)",
  },
  code: {
    ground: "oklch(13% 0.008 30)",
    lineNumber: "oklch(42% 0.01 30)",
    class: "oklch(84% 0.09 230)",
    identifier: "oklch(92% 0.005 30)",
    sign: "oklch(66% 0.01 30)",
    property: "oklch(82% 0.08 250)",
    entity: "oklch(84% 0.1 180)",
    jsx: "oklch(82% 0.09 300)",
    string: "oklch(86% 0.13 150)",
    keyword: "oklch(80% 0.12 0)",
    comment: "oklch(55% 0.01 30)",
  },
  ...shape,
});
