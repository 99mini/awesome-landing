import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * 빌드된 CSS 를 `@layer <name>` 으로 감싼다.
 * 레이어 밖의 CSS 는 레이어 안의 CSS 를 언제나 이긴다 — 그래서 쓰는 쪽의 클래스(일반 CSS·Tailwind 등)가
 * 우선순위와 상관없이 이 패키지의 구조 스타일을 덮어쓸 수 있다.
 * (Tailwind v4 는 `@import "@awesome/interactions/style.css" layer(components);` 로 utilities 보다 앞에 둔다)
 */
function cssLayer(name: string): Plugin {
  return {
    name: "awesome:css-layer",
    // Vite 는 CSS 파일을 자기 generateBundle 에서 만든다 — 파일이 써진 뒤에 감싼다
    writeBundle(options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "asset" || !file.fileName.endsWith(".css")) continue;
        const path = join(options.dir ?? "dist", file.fileName);
        writeFileSync(path, `@layer ${name} {\n${readFileSync(path, "utf8")}\n}\n`);
      }
    },
  };
}

/**
 * 패키지 빌드 — 쓰는 쪽은 vanilla-extract 플러그인 없이 JS 와 CSS 파일 하나만 가져다 쓴다.
 * 이 저장소의 앱은 `source` 조건으로 소스를 그대로 쓴다 (package.json exports 참고).
 */
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), cssLayer("awesome")],
  build: {
    lib: {
      entry: { index: "src/index.ts", motion: "src/motion/motion-provider.tsx" },
      formats: ["es"],
      cssFileName: "style",
    },
    cssCodeSplit: false,
    sourcemap: true,
    rolldownOptions: {
      // 쓰는 쪽이 가진 것은 묶지 않는다
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^motion($|\/)/, /^@vanilla-extract\/dynamic/],
    },
  },
});
