import { Link, Outlet } from "react-router";
import * as css from "./Layout.css.ts";

export function Layout() {
  return (
    <div className={css.shell}>
      <header className={css.header}>
        <Link to="/" className={css.logo}>
          awesome<span className={css.logoAccent}>/landing</span>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
