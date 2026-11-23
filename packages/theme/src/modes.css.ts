import { assignVars, globalStyle } from "@vanilla-extract/css";
import { shape, vars } from "./theme.css.ts";

/**
 * 라이트 테마 — 이 모듈을 import 한 앱만 켜진다 (갤러리·Storybook. 랜딩은 자기 테마를 쓴다).
 * - 기본은 시스템 설정(prefers-color-scheme)을 따른다.
 * - <html data-theme="light|dark"> 로 직접 고르면 시스템 설정보다 우선한다.
 * 다크 값은 theme.css.ts 의 :root 기본값. 여기서는 색만 바꾸고 모서리·글꼴은 그대로 둔다.
 */
const lightVars = assignVars(vars, {
  color: {
    bg: "oklch(98.5% 0.004 30)",
    surface: "oklch(96.5% 0.006 30)",
    surfaceRaised: "oklch(93.5% 0.008 30)",
    border: "oklch(87% 0.01 30)",
    text: "oklch(22% 0.012 30)",
    muted: "oklch(45% 0.016 30)",
    // 흰 바탕 위 포커스 링·선택 칩 — 밝은 코랄은 대비가 모자라 한 단계 진하게
    accent: "oklch(55% 0.17 30)",
    accentInk: "oklch(98.5% 0.006 30)",
    stage: "oklch(95% 0.006 30)",
    overlay: "oklch(25% 0.012 30 / 0.4)",
    scrim: "oklch(25% 0.012 30 / 0.22)",
    inverse: "oklch(22% 0.012 30)",
    inverseInk: "oklch(98% 0.005 30)",
    // signal 은 글자·선(텍스트 스크램블, 차트 선, 시계 초침)과 색면(태그·타일) 양쪽에 쓰인다.
    // 밝은 바탕 위 글자로 읽히도록 진한 호박색으로 내리고, 그 위의 글자(signalInk)는 밝게 뒤집는다
    // (바탕 대비 4.8:1, 흰 글자 대비 5.4:1)
    signal: "oklch(52% 0.12 75)",
    signalAlt: "oklch(50% 0.1 180)",
    signalInk: "oklch(98.5% 0.006 30)",
    rampFrom: "oklch(74% 0.16 55)",
    rampTo: "oklch(64% 0.2 30)",
    rampInk: "oklch(22% 0.04 40)",
    // LCD 는 기기 화면이라 라이트에서도 어둡게 둔다
    lcdGround: "oklch(15% 0.02 150)",
    lcdEdge: "oklch(26% 0.03 150)",
    lcdOn: "oklch(88% 0.17 150)",
    // 카드 색면 — 글자(text)가 어두워지므로 옅게
    toneA: "oklch(89% 0.045 262)",
    toneB: "oklch(90% 0.045 170)",
    toneC: "oklch(90% 0.045 60)",
  },
  code: {
    ground: "oklch(96.5% 0.005 30)",
    lineNumber: "oklch(50% 0.01 30)",
    class: "oklch(46% 0.13 230)",
    identifier: "oklch(24% 0.012 30)",
    sign: "oklch(42% 0.012 30)",
    property: "oklch(44% 0.13 255)",
    entity: "oklch(44% 0.1 180)",
    jsx: "oklch(46% 0.16 300)",
    string: "oklch(44% 0.12 150)",
    keyword: "oklch(48% 0.18 20)",
    comment: "oklch(48% 0.01 30)",
  },
  ...shape,
});

// 시스템이 라이트이고 다크를 직접 고르지 않았을 때
globalStyle(':root:not([data-theme="dark"])', {
  "@media": {
    "(prefers-color-scheme: light)": { vars: lightVars, colorScheme: "light" },
  },
});

// 라이트를 직접 골랐을 때 (시스템 설정과 상관없이)
globalStyle(':root[data-theme="light"]', { vars: lightVars, colorScheme: "light" });
