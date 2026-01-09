import {
  X,
  Clock,
  Users,
  Play,
  Pause,
  Square,
  Youtube,
} from "lucide-react";
import type { Recipe } from "../lib/database.types";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../lib/translate";

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

//voice
const getVoiceForLanguage = (lang: string) => {
  const voices = window.speechSynthesis.getVoices();

  const langMap: Record<string, string[]> = {
    en: ["en-IN", "en-US"],
    hi: ["hi-IN"],
    mr: ["mr-IN", "hi-IN"], 
  };

  const preferred = langMap[lang] || ["en-IN"];

  return (
    voices.find(v => preferred.some(p => v.lang.startsWith(p))) ||
    voices.find(v => v.lang.startsWith("en")) ||
    null
  );
};

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const { language } = useLanguage();
  const synth = window.speechSynthesis;

  /* =========================
     STATE
  ========================= */
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const [title, setTitle] = useState(recipe.name);
  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const stepIndexRef = useRef(0);

  /* =========================
     LOAD VOICES (CRITICAL)
  ========================= */
  useEffect(() => {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }, []);

  /* =========================
     TRANSLATION
  ========================= */
  useEffect(() => {
    let mounted = true;

    async function translateAll() {
      if (language === "en") {
        setTitle(recipe.name);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients || []);
        setSteps(recipe.recipe_steps || []);
        return;
      }

      const tTitle = await translateText(recipe.name, language);
      const tDesc = await translateText(recipe.description, language);

      const tIngredients = await Promise.all(
        (recipe.ingredients || []).map(i =>
          translateText(i, language)
        )
      );

      const tSteps = await Promise.all(
        (recipe.recipe_steps || []).map(s =>
          translateText(s, language)
        )
      );

      if (mounted) {
        setTitle(tTitle);
        setDescription(tDesc);
        setIngredients(tIngredients);
        setSteps(tSteps);
      }
    }

    translateAll();
    return () => {
      mounted = false;
    };
  }, [language, recipe]);

  /* =========================
     VOICE COOKING
  ========================= */
  const speakFrom = (index: number) => {
    if (!steps.length) return;

    const voice = getVoiceForLanguage(language);
    stepIndexRef.current = index;

    setIsSpeaking(true);
    setIsPaused(false);
    setCurrentStep(index);

    const utter = new SpeechSynthesisUtterance(
      `Step ${index + 1}, ${steps[index]}`
    );

    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    }

    utter.rate = 0.95;

    utter.onend = () => {
      if (synth.paused) return;

      const next = stepIndexRef.current + 1;
      if (next < steps.length) {
        speakFrom(next);
      } else {
        setIsSpeaking(false);
        setCurrentStep(null);
      }
    };

    synth.speak(utter);
  };

  const handlePlay = () => {
    synth.cancel();
    speakFrom(0);
  };

  const handlePause = () => {
    synth.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    synth.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentStep(null);
  };

  /* =========================
     LINKS
  ========================= */
  const openYouTube = () =>
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        recipe.name + " recipe"
      )}`,
      "_blank"
    );

  const openSwiggy = () =>
    window.open(
      `https://www.swiggy.com/search?query=${encodeURIComponent(
        recipe.name
      )}`,
      "_blank"
    );

  const openZomato = () =>
    window.open(
      `https://www.zomato.com/search?q=${encodeURIComponent(
        recipe.name
      )}`,
      "_blank"
    );

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* IMAGE */}
        <div className="relative h-64">
          <img
            src={recipe.image_url}
            alt={title}
            className="w-full h-full object-cover rounded-t-3xl"
          />

          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 flex gap-2">
            {(Array.isArray(recipe.meal_type) ? recipe.meal_type : [recipe.meal_type]).map((type, index) => (
             <span 
                key={index}
                className="bg-blue-600 text-white text-xs md:text-sm px-3 py-1 rounded-full capitalize shadow-md"
                 >
                {type}
              </span>
           ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-1">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>

          {/* META */}
          <div className="flex gap-6 text-gray-600 mb-6">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" />
              {recipe.prep_time} mins
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-orange-500" />
              {recipe.servings} servings
            </span>
          </div>

          {/* INGREDIENTS */}
          <section className="mb-6">
            <h3 className="font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1">
              {ingredients.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </section>

          {/* STEPS */}
          <section className="mb-6">
            <h3 className="font-semibold mb-2">Recipe</h3>
            <ol className="list-decimal list-inside space-y-2">
              {steps.map((step, i) => (
                <li
                  key={i}
                  className={
                    currentStep === i
                      ? "bg-yellow-100 p-2 rounded"
                      : ""
                  }
                >
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* 🎤 VOICE + YOUTUBE */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {!isSpeaking && (
              <button
                onClick={handlePlay}
                className="bg-green-500 text-white py-2 rounded-lg flex justify-center gap-2 text-sm"
              >
                <Play className="w-4 h-4" /> Listen
              </button>
            )}

            {isSpeaking && !isPaused && (
              <button
                onClick={handlePause}
                className="bg-yellow-500 text-white py-2 rounded-lg flex justify-center gap-2 text-sm"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            )}

            {isSpeaking && isPaused && (
              <button
                onClick={handleResume}
                className="bg-green-600 text-white py-2 rounded-lg flex justify-center gap-2 text-sm"
              >
                <Play className="w-4 h-4" /> Resume
              </button>
            )}

            {isSpeaking && (
              <button
                onClick={handleStop}
                className="bg-red-500 text-white py-2 rounded-lg flex justify-center gap-2 text-sm"
              >
                <Square className="w-4 h-4" /> Stop
              </button>
            )}

            <button
              onClick={openYouTube}
              className="bg-red-600 text-white py-2 rounded-lg flex justify-center gap-2 text-sm col-span-2"
            >
              <Youtube className="w-4 h-4" /> Watch on YouTube
            </button>
          </div>

          {/* ORDER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={openSwiggy}
              className="border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-semibold"
            >
              🍔 Order on Swiggy
            </button>
            <button
              onClick={openZomato}
              className="border-2 border-red-500 text-red-600 py-3 rounded-xl font-semibold"
            >
              🍕 Order on Zomato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
