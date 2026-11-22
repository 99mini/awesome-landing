import { Link, Outlet } from "react-router";
import { GalleryPalette } from "./gallery-palette.tsx";
import * as css from "./layout.css.ts";

export function Layout() {
  return (
    <div className={css.shell}>
      <header className={css.header}>
        <Link to="/" className={css.logo}>
          awesome<span className={css.logoAccent}>/landing</span>
        </Link>
        <GalleryPalette />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
