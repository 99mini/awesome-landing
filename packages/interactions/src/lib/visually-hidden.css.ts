import { style } from "@vanilla-extract/css";

/** 화면에는 안 보이지만 스크린 리더는 읽는 텍스트 */
export const visuallyHidden = style({
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
  // 큰 제목 안에서도 숨긴 글이 한 줄로 길게 깔리지 않게 (스크린 리더는 글자 크기를 무시한다)
  fontSize: "1px",
});
