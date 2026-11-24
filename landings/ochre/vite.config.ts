import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import meta from "./landing.json" with { type: "json" };

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  base: "./",
  server: { port: meta.port, strictPort: true },
});
