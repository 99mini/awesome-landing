import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { landingWatchPlugin } from "./vite/landing-watch-plugin.ts";
import { sourcePlugin } from "./vite/source-plugin.ts";

export default defineConfig({
  plugins: [sourcePlugin(), landingWatchPlugin(), react(), vanillaExtractPlugin()],
  server: { port: 5173 },
});
