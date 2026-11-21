import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider, useParams } from "react-router";
import { Layout } from "./components/Layout.tsx";
import { HomePage } from "./pages/HomePage.tsx";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
);
