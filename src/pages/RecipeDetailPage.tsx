import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipe } from "../lib/api";
import type { Recipe } from "../lib/types";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    getRecipe(id, ac.signal)
      .then(setRecipe)
      .catch((e) => {
        if ((e as any).name !== "AbortError") setError((e as any).message || "요청 실패");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [id]);

  if (loading) return <p>불러오는 중…</p>;
  if (error) return <p style={{ color: "crimson" }}>에러: {error}</p>;
  if (!recipe) return <p>레시피가 없어요.</p>;

  const totalMin = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article style={{ marginTop: 16 }}>
      <Link to="..">← 목록으로</Link>
      <h2 style={{ margin: "12px 0" }}>{recipe.name}</h2>
      <img
        src={recipe.image}
        alt={recipe.name}
        style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 12 }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12, color: "#374151" }}>
        <span>⭐ {recipe.rating.toFixed(1)}</span>
        <span>⏱ {totalMin} min (prep {recipe.prepTimeMinutes} + cook {recipe.cookTimeMinutes})</span>
        <span>🧑‍🍳 {recipe.difficulty}</span>
        <span>🍽 {recipe.servings} servings</span>
        <span>🔥 {recipe.caloriesPerServing} kcal/serving</span>
        {recipe.cuisine && <span>🌏 {recipe.cuisine}</span>}
      </div>

      {recipe.tags && recipe.tags.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {recipe.tags.map((t) => (
            <span key={t} style={{ fontSize: 12, background: "#f3f4f6", padding: "2px 8px", borderRadius: 999 }}>
              #{t}
            </span>
          ))}
        </div>
      )}

      <section style={{ marginTop: 20 }}>
        <h3>재료</h3>
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>조리 순서</h3>
        <ol>
          {recipe.instructions.map((step, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{step}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}
