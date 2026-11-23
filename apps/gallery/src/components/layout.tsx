import { Link, Outlet } from "react-router";
import { GalleryPalette } from "./gallery-palette.tsx";
import { ThemeToggle } from "./theme-toggle.tsx";
import * as css from "./layout.css.ts";

export function Layout() {
  return (
    <div className={css.shell}>
      <header className={css.header}>
        <Link to="/" className={css.logo}>
          awesome<span className={css.logoAccent}>/landing</span>
        </Link>
        <div className={css.tools}>
          <GalleryPalette />
          <ThemeToggle />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
