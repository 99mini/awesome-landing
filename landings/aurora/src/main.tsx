import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { App } from "./app.tsx";
import "./global.css.ts";

// 스타일(.css.ts) 변경이 이 모듈까지 거슬러 올라와 다시 실행돼도 같은 root 를 쓴다
// (createRoot 를 같은 컨테이너에 두 번 부르면 React 가 경고하고 두 root 가 겹친다)
const root: Root = import.meta.hot?.data.root ?? createRoot(document.getElementById("root")!);
if (import.meta.hot) import.meta.hot.data.root = root;

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
