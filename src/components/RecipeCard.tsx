import { Link } from "react-router-dom";
import type { Recipe } from "../lib/types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        background: "white",
      }}
    >
      <Link to={`/recipes/${recipe.id}`} style={{ color: "inherit", textDecoration: "none" }}>
        <img
          src={recipe.image}
          alt={recipe.name}
          style={{ width: "100%", height: 160, objectFit: "cover" }}
          loading="lazy"
        />
        <div style={{ padding: 12 }}>
          <h3 style={{ margin: "0 0 6px" }}>{recipe.name}</h3>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            ⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min · ⭐ {recipe.rating.toFixed(1)}
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(recipe.tags ?? []).slice(0, 3).map((t) => (
              <span key={t} style={{ fontSize: 12, background: "#f3f4f6", padding: "2px 8px", borderRadius: 999 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
