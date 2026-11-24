import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defaultClientConditions, defineConfig } from "vite";
import { landingWatchPlugin } from "./vite/landing-watch-plugin.ts";
import { sourcePlugin } from "./vite/source-plugin.ts";

export default defineConfig({
  // 워크스페이스 패키지는 빌드 결과(dist)가 아니라 소스를 쓴다 (@awesome/interactions 의 exports 참고)
  resolve: { conditions: ["source", ...defaultClientConditions] },
  plugins: [sourcePlugin(), landingWatchPlugin(), react(), vanillaExtractPlugin()],
  server: { port: 5173 },
});
