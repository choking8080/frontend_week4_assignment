import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 style={{ margin: 0 }}>🍳 Recipes</h1>
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
