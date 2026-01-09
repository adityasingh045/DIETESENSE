import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Recipe } from "../lib/database.types";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../lib/translate";

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function RecipeCard({
  recipe,
  onViewRecipe,
}: RecipeCardProps) {
  const { language } = useLanguage();

  const [name, setName] = useState(recipe.name);
  const [description, setDescription] = useState(recipe.description);

  // 🌍 Auto-translate on language change
  useEffect(() => {
    let isMounted = true;

    async function translate() {
      if (language === "en") {
        setName(recipe.name);
        setDescription(recipe.description);
        return;
      }

      const translatedName = await translateText(recipe.name, language);
      const translatedDesc = await translateText(
        recipe.description,
        language
      );

      if (isMounted) {
        setName(translatedName);
        setDescription(translatedDesc);
      }
    }

    translate();
    return () => {
      isMounted = false;
    };
  }, [language, recipe]);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-48">
        <img
          src={recipe.image_url || FALLBACK_IMAGE}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay (old premium UI) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Meal type badge */}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full capitalize shadow">
          {recipe.meal_type}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* META */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.prep_time} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings} servings
          </span>
        </div>

        {/* NUTRITION */}
        <div className="grid grid-cols-3 text-center mb-4">
          <div>
            <p className="text-orange-600 font-bold">
              {recipe.calories}
            </p>
            <p className="text-xs text-gray-500">Calories</p>
          </div>
          <div>
            <p className="text-red-600 font-bold">
              {recipe.protein}g
            </p>
            <p className="text-xs text-gray-500">Protein</p>
          </div>
          <div>
            <p className="text-green-600 font-bold">
              {recipe.carbs}g
            </p>
            <p className="text-xs text-gray-500">Carbs</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onViewRecipe(recipe)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          View Full Recipe →
        </button>
      </div>
    </div>
  );
}
