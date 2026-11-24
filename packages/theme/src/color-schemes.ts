import { globalStyle } from "@vanilla-extract/css";

type Scheme = "light" | "dark";
/** assignVars(...) 의 결과 — 반대 테마에서 바꿀 변수 값 */
type AssignedVars = Record<string, string>;

/**
 * 기본 테마 하나와 그 반대 테마를 붙인다 (.css.ts 안에서 부른다).
 * - 기본은 시스템 설정(prefers-color-scheme)을 따른다.
 * - <html data-theme="light|dark"> 로 고정하면 시스템 설정보다 우선한다 (토글·검사·스크린샷용).
 *
 * @param base 토큰 기본값이 어느 테마인지
 * @param other 반대 테마에서 바꿀 값 — `assignVars(contract, { ... })`
 */
export function colorSchemes(base: Scheme, other: AssignedVars) {
  const flipped: Scheme = base === "dark" ? "light" : "dark";
  globalStyle(":root", { colorScheme: base });
  // 시스템이 반대 테마이고, 기본 테마로 고정하지 않았을 때
  globalStyle(`:root:not([data-theme="${base}"])`, {
    "@media": {
      [`(prefers-color-scheme: ${flipped})`]: { vars: other, colorScheme: flipped },
    },
  });
  // 반대 테마로 고정했을 때 (시스템 설정과 상관없이)
  globalStyle(`:root[data-theme="${flipped}"]`, { vars: other, colorScheme: flipped });
}
