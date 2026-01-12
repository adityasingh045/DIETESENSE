import { useEffect, useState } from "react";
import { Utensils, RotateCcw, Sparkles } from "lucide-react";
import WeatherWidget from "./WeatherWidget";
import MoodSelector from "./MoodSelector";
import { getWeatherData } from "../lib/weather";
import type { WeatherData } from "../lib/weather";
import type { OnboardingData } from "./Onboarding";
import { getFoodRecommendation } from "../utils/foodAI";

/* =========================
   CONSTANTS
========================= */
const DEFAULT_MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
  "beverages",
];

const ALL_ALLERGIES = ["Dairy", "Nuts", "Eggs", "Gluten", "Soy", "Seafood"];

/* =========================
   TYPES
========================= */
interface DashboardProps {
  preferences: OnboardingData;
}

interface AIRecipe {
  title: string;
  description: string;
  calories: string;
  nutrition: {
    protein: string;
    carbs: string;
    fats: string;
  };
}

/* =========================
   RECIPE CARD
========================= */
function AIRecipeCard({ recipe }: { recipe: AIRecipe }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5">
      <div className="h-40 rounded-xl bg-gradient-to-br from-orange-200 to-orange-100 mb-4 flex items-center justify-center text-4xl">
        🍽️
      </div>

      <h3 className="text-xl font-bold text-orange-600">
        {recipe.title}
      </h3>

      <p className="text-gray-600 mt-2">
        {recipe.description}
      </p>

      <span className="inline-block mt-3 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
        🔥 {recipe.calories}
      </span>

      <div className="flex flex-wrap gap-2 mt-4 text-xs">
        <span className="px-2 py-1 bg-green-100 rounded">
          Protein: {recipe.nutrition.protein}
        </span>
        <span className="px-2 py-1 bg-blue-100 rounded">
          Carbs: {recipe.nutrition.carbs}
        </span>
        <span className="px-2 py-1 bg-yellow-100 rounded">
          Fats: {recipe.nutrition.fats}
        </span>
      </div>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */
export default function Dashboard({ preferences }: DashboardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [activeMealType, setActiveMealType] = useState(
    preferences.mealTypes?.[0] || "breakfast"
  );
  const [activeAllergies, setActiveAllergies] = useState<string[]>(
    preferences.allergies || []
  );

  const [aiRecipes, setAiRecipes] = useState<AIRecipe[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    getWeatherData().then(setWeather);
  }, []);

  /* =========================
     AI CALL (FIXED)
  ========================= */
  async function runAIRecommendation() {
    if (!selectedMood) {
      alert("Please select a mood");
      return;
    }

    try {
      setAiLoading(true);

      const ai = await getFoodRecommendation({
        age: 24,
        mood: selectedMood,
        weather: weather?.condition || "clear",
        allergies: activeAllergies,
      });

      const recipe: AIRecipe = {
        title: ai.foodName,
        description: ai.why,
        calories: ai.calories,
        nutrition: {
          protein: ai.protein,
          carbs: ai.carbs,
          fats: ai.fats,
        },
      };

      setAiRecipes([recipe]);
    } catch (err) {
      console.error("AI error:", err);
      alert("AI service failed");
    } finally {
      setAiLoading(false);
    }
  }

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
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold text-orange-500">
                DietSense
              </h1>
              <p className="text-sm text-gray-600">
                Eat right, feel right
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
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ALLERGIES */}
        <div className="my-6 bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Allergies</h3>
          <div className="flex flex-wrap gap-3">
            {ALL_ALLERGIES.map((allergy) => {
              const active = activeAllergies.includes(allergy);
              return (
                <button
                  key={allergy}
                  onClick={() =>
                    setActiveAllergies(
                      active
                        ? activeAllergies.filter((a) => a !== allergy)
                        : [...activeAllergies, allergy]
                    )
                  }
                  className={`px-4 py-2 rounded-xl border font-semibold ${
                    active
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
        <div className="mb-8">
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </div>

        {/* AI BUTTON */}
        <button
          onClick={runAIRecommendation}
          disabled={aiLoading}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl shadow hover:bg-orange-600 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          {aiLoading ? "Thinking..." : "Get AI Recommendation"}
        </button>

        {/* AI RECIPE CARDS */}
        {aiRecipes.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecipes.map((recipe, index) => (
              <AIRecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
