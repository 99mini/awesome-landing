import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./components/Layout.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { InteractionPage } from "./pages/InteractionPage.tsx";
import "./styles.css";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "interactions/:slug", element: <InteractionPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
