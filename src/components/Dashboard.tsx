import { useState, useEffect } from "react";
import { Utensils, RotateCcw } from "lucide-react";
import WeatherWidget from "./WeatherWidget";
import MoodSelector from "./MoodSelector";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";
import { supabase } from "../lib/supabase";
import { getWeatherData, getWeatherTag } from "../lib/weather";
import type { Recipe } from "../lib/database.types";
import type { WeatherData } from "../lib/weather";
import type { OnboardingData } from "./Onboarding";

const DEFAULT_MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks","beverages"];
const ALL_ALLERGIES = ["Dairy", "Nuts", "Eggs", "Gluten", "Soy", "Seafood"];

interface DashboardProps {
  preferences: OnboardingData;
}

export default function Dashboard({ preferences }: DashboardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     MEAL TYPE
  ========================= */
  const [activeMealType, setActiveMealType] = useState<string>(() => {
    return (
      localStorage.getItem("active_meal_type") ||
      preferences.mealTypes?.[0]?.toLowerCase() ||
      "dinner"
    );
  });

  useEffect(() => {
    localStorage.setItem("active_meal_type", activeMealType);
  }, [activeMealType]);

  /* =========================
     ALLERGIES
  ========================= */
  const [activeAllergies, setActiveAllergies] = useState<string[]>(() => {
    const stored = localStorage.getItem("active_allergies");
    return stored ? JSON.parse(stored) : preferences.allergies || [];
  });

  useEffect(() => {
    localStorage.setItem(
      "active_allergies",
      JSON.stringify(activeAllergies)
    );
  }, [activeAllergies]);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    async function init() {
      setLoading(true);

      const [{ data }, weatherData] = await Promise.all([
        supabase.from("recipes").select("*"),
        getWeatherData(),
      ]);

      setRecipes(data || []);
      setWeather(weatherData);
      setLoading(false);
    }

    init();
  }, []);

  /* =========================
     FILTER LOGIC (SAFE)
  ========================= */
  useEffect(() => {
    let filtered = [...recipes];

    /* ---- MEAL TYPE ---- */
    filtered = filtered.filter((r) => {
      if (!r.meal_type) return false;

      if (Array.isArray(r.meal_type)) {
        return r.meal_type
          .map((m) => String(m).toLowerCase())
          .includes(activeMealType.toLowerCase());
      }

      return (
        String(r.meal_type).toLowerCase() ===
        activeMealType.toLowerCase()
      );
    });

    /* ---- ALLERGIES ---- */
    if (activeAllergies.length) {
      const allergyLower = activeAllergies.map((a) => a.toLowerCase());

      filtered = filtered.filter((r) => {
        const recipeAllergens =
          r.allergens?.map((a) => a.toLowerCase()) || [];
        const recipeIngredients =
          r.ingredients?.map((i) => i.toLowerCase()) || [];

        const hasAllergy =
          recipeAllergens.some((a) => allergyLower.includes(a)) ||
          recipeIngredients.some((i) =>
            allergyLower.some((a) => i.includes(a))
          );

        return !hasAllergy;
      });
    }

    /* ---- AGE GROUP (FIXED) ---- */
    if (preferences.ageGroup) {
      const userAge = preferences.ageGroup.toLowerCase();

      filtered = filtered.filter((r) => {
        if (!r.age_group) return false;

        if (Array.isArray(r.age_group)) {
          return r.age_group
            .map((a) => String(a).toLowerCase())
            .includes(userAge);
        }

        return String(r.age_group).toLowerCase() === userAge;
      });
    }

    /* ---- MOOD ---- */
    if (selectedMood) {
      filtered = filtered.filter((r) =>
        r.mood_tags?.includes(selectedMood)
      );
    }

    /* ---- WEATHER ---- */
    if (weather?.condition) {
      const tag = getWeatherTag(weather.condition);
      const matches = filtered.filter((r) =>
        r.weather_tags?.includes(tag)
      );
      if (matches.length > 0) filtered = matches;
    }

    setFilteredRecipes(filtered);
  }, [
    recipes,
    activeMealType,
    activeAllergies,
    selectedMood,
    weather,
    preferences.ageGroup,
  ]);

  /* =========================
     RESET
  ========================= */
  function resetPreferences() {
    localStorage.clear();
    window.location.reload();
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-4xl font-bold text-orange-500">
                DietSense
              </h1>
              <p className="text-sm text-gray-600">
                Eat right, feel right..
              </p>
            </div>
          </div>

          <button
            onClick={resetPreferences}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {weather && <WeatherWidget weather={weather} />}

        {/* MEAL TYPE */}
        <div className="my-6 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Meal Type</h3>
            <select
              value={activeMealType}
              onChange={(e) => setActiveMealType(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            >
              {DEFAULT_MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ALLERGIES */}
        <div className="my-6 bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Allergies</h3>
          <div className="flex flex-wrap gap-3">
            {ALL_ALLERGIES.map((allergy) => {
              const isActive = activeAllergies.includes(allergy);
              return (
                <button
                  key={allergy}
                  onClick={() =>
                    setActiveAllergies(
                      isActive
                        ? activeAllergies.filter((a) => a !== allergy)
                        : [...activeAllergies, allergy]
                    )
                  }
                  className={`px-4 py-2 rounded-xl border font-semibold ${
                    isActive
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {allergy}
                </button>
              );
            })}
          </div>
        </div>

        {/* MOOD */}
        <div className="mb-10">
  <MoodSelector
    selectedMood={selectedMood}
    onMoodSelect={setSelectedMood}
  />
</div>  

        {/* RECIPES */}
        {loading ? (
          <div className="text-center py-12">Loading…</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            No recipes found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onViewRecipe={setSelectedRecipe}
              />
            ))}
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}
