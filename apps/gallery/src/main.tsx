import { MotionProvider } from "@99mini/interactions/motion";
import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider, useParams } from "react-router";
import { Layout } from "./components/layout.tsx";
import { HomePage } from "./pages/home-page.tsx";
import "./styles/global.css.ts";

/** 예전 `/interactions/:slug` 링크 호환 → `/?interaction=:slug` */
function LegacyInteractionRedirect() {
  const { slug = "" } = useParams();
  return (
    <Navigate to={{ pathname: "/", search: `?interaction=${encodeURIComponent(slug)}` }} replace />
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "interactions/:slug", element: <LegacyInteractionRedirect /> },
    ],
  },
]);

// 스타일(.css.ts) 변경이 이 모듈까지 거슬러 올라와 다시 실행돼도 같은 root 를 쓴다
// (createRoot 를 같은 컨테이너에 두 번 부르면 React 가 경고하고 두 root 가 겹친다)
const root: Root = import.meta.hot?.data.root ?? createRoot(document.getElementById("root")!);
if (import.meta.hot) import.meta.hot.data.root = root;

root.render(
  <StrictMode>
    <MotionProvider>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </MotionProvider>
  </StrictMode>,
);
