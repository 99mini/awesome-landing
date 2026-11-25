import { MotionProvider } from "@99mini/interactions/motion";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>,
);
