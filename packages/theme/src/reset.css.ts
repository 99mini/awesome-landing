import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css.ts";

// 앱(갤러리·랜딩) 공통 최소 리셋. 배경/글자색 같은 앱별 스타일은 각 앱에서 정의한다.
globalStyle(":root", {
  colorScheme: "dark",
  fontFamily: vars.font.body,
});

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

globalStyle("body", {
  margin: 0,
});
