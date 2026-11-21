import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import meta from "./landing.json" with { type: "json" };

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { port: meta.port, strictPort: true },
});
