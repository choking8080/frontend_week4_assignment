import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getRecipes } from "../lib/api";
import type { Recipe } from "../lib/types";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";

const DEFAULT_LIMIT = 12;

export default function RecipesPage() {
  const [sp, setSp] = useSearchParams();

  const page = Number(sp.get("page") ?? "1");
  const q = sp.get("q") ?? "";
  const sortBy = sp.get("sortBy") || "";
  const order = (sp.get("order") as "asc" | "desc") || "asc";

  const [data, setData] = useState<{ recipes: Recipe[]; total: number }>({ recipes: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    getRecipes({
      page,
      limit: DEFAULT_LIMIT,
      q: q || undefined,
      sortBy: sortBy || undefined,
      order,
      signal: ac.signal,
    })
      .then((res) => setData({ recipes: res.recipes, total: res.total }))
      .catch((e) => {
        if ((e as any).name !== "AbortError") setError((e as any).message || "요청 실패");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [page, q, sortBy, order]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nextQ = String(fd.get("q") || "");
    setSp((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", "1");
      if (nextQ) p.set("q", nextQ);
      else p.delete("q");
      return p;
    }, { replace: true });
  };

  const onChangePage = (next: number) => {
    setSp((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(next));
      return p;
    }, { replace: true });
  };

  const onChangeSort = (field: string) => {
    setSp((prev) => {
      const p = new URLSearchParams(prev);
      if (p.get("sortBy") === field) {
        p.set("order", p.get("order") === "asc" ? "desc" : "asc");
      } else {
        p.set("sortBy", field);
        p.set("order", "asc");
      }
      p.set("page", "1");
      return p;
    }, { replace: true });
  };

  return (
    <section>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 16 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="레시피 검색 (예: pizza, chicken)"
          aria-label="search"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <button type="submit">검색</button>
      </form>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#6b7280" }}>정렬: </span>
        <button onClick={() => onChangeSort("name")}>이름</button>
        <button onClick={() => onChangeSort("rating")}>평점</button>
        <span style={{ color: "#6b7280" }}>
          {sortBy ? `${sortBy} · ${order.toUpperCase()}` : "기본"}
        </span>
      </div>

      {loading && <p>불러오는 중…</p>}
      {error && <p style={{ color: "crimson" }}>에러: {error}</p>}

      {!loading && !error && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {data.recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>

          <Pagination page={page} total={data.total} limit={DEFAULT_LIMIT} onChange={onChangePage} />
        </>
      )}
    </section>
  );
}
