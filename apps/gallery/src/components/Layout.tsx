import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="shell">
      <header className="header">
        <Link to="/" className="logo">
          awesome<span>/landing</span>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
