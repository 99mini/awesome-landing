import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * 바깥 프로젝트처럼 쓴다 — vanilla-extract 플러그인 없이, 미리 빌드된 @awesome/interactions(dist)를 가져온다.
 * (source 조건을 넣지 않으므로 package.json exports 의 default → dist 로 풀린다)
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5400 },
});
