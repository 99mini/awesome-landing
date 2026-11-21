import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sourcePlugin } from "./vite/source-plugin.ts";

export default defineConfig({
  plugins: [sourcePlugin(), react(), vanillaExtractPlugin()],
  server: { port: 5173 },
});
