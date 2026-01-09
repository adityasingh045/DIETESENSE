import { Search, Sparkles } from "lucide-react";
import heroImage from "../assets/hero.jpg";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 to-red-600 text-white relative overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-center px-30 py-6">
        <div className="text-5xl font-extrabold tracking-wide flex items-center gap-2">
          <Sparkles className="w-10 h-8" />
          DietSense
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center mt-20">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Eat Better. <br />
            Feel Better.
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-md">
            Balanced diets, smarter choices, and mood-based meals tailored just for you.
          </p>

          {/* SEARCH BAR (optional visual only) */}
          {/* <div className="mt-8">
            <div className="flex items-center bg-white text-gray-700 px-4 py-3 rounded-lg shadow">
              <Search className="mr-2 text-orange-500" />
              <input
                type="text"
                placeholder="Search meals, moods, ingredients..."
                className="outline-none w-full"
              />
            </div>
          </div> */}

          {/* CTA */}
          <button
            onClick={onStart}
            className="mt-8 bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition"
          >
            Start My Food Journey
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block relative">
          <img
            src={heroImage}
            alt="MoodMeal Hero"
            className="rounded-3xl shadow-2xl w-full object-cover"
          />

          {/* PREMIUM BADGE */}
          <div className="absolute top-6 left-6 bg-white text-orange-600 px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold shadow">
            <Sparkles className="w-4 h-4" />
            Premium
          </div>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="max-w-6xl mx-auto px-6 mt-20 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard title="MEAL PLANS" subtitle="Personalized nutrition" />
        <FeatureCard title="KITCHEN WITHOUT BORDERS" subtitle="Cooking in every language." />
        <FeatureCard title="MOOD BASED" subtitle="Food that fits your mood" />
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white text-gray-800 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
