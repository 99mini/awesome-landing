import "@awesome/theme/reset";
import { vars } from "@awesome/theme";
import { globalStyle } from "@vanilla-extract/css";

// 데모는 갤러리의 어두운 무대를 기준으로 만들어졌다
globalStyle("body", {
  background: vars.color.stage,
  color: vars.color.text,
});
