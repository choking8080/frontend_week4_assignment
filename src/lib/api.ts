import type { Recipe, RecipeListResponse } from "./types";

const BASE = "https://dummyjson.com";

type ListParams = {
  page: number;      // 1-base
  limit: number;
  q?: string;
  sortBy?: string;   // e.g. "name", "rating"
  order?: "asc" | "desc";
  tag?: string;
  mealType?: string; // e.g. "snack"
  signal?: AbortSignal;
};

export async function getRecipes(params: ListParams): Promise<RecipeListResponse> {
  const { page, limit, q, sortBy, order, tag, mealType, signal } = params;
  const skip = (page - 1) * limit;

  let url: string;
  const qp: string[] = [];

  if (q && q.trim()) {
    url = `${BASE}/recipes/search`;
    qp.push(`q=${encodeURIComponent(q.trim())}`);
    qp.push(`limit=${limit}`);
    qp.push(`skip=${skip}`);
  } else if (tag) {
    url = `${BASE}/recipes/tag/${encodeURIComponent(tag)}`;
    qp.push(`limit=${limit}`);
    qp.push(`skip=${skip}`);
  } else if (mealType) {
    url = `${BASE}/recipes/meal-type/${encodeURIComponent(mealType)}`;
    qp.push(`limit=${limit}`);
    qp.push(`skip=${skip}`);
  } else {
    url = `${BASE}/recipes`;
    qp.push(`limit=${limit}`);
    qp.push(`skip=${skip}`);
  }

  if (sortBy) qp.push(`sortBy=${encodeURIComponent(sortBy)}`);
  if (order) qp.push(`order=${order}`);

  const res = await fetch(`${url}?${qp.join("&")}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as RecipeListResponse;
}

export async function getRecipe(id: string, signal?: AbortSignal): Promise<Recipe> {
  const res = await fetch(`${BASE}/recipes/${id}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Recipe;
}
