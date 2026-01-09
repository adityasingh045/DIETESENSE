import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RecipeCard from "./RecipeCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setRecipes([]);
        return;
      }

      const { data } = await supabase
        .from("recipes")
        .select("*")
        .ilike("name", `%${query}%`);

      setRecipes(data || []);
    }

    search();
  }, [query]);

  return (
    <div>
      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-6">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} onViewRecipe={() => {}} />
        ))}
      </div>
    </div>
  );
}
