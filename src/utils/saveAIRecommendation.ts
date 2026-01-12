import { supabase } from "../lib/supabase";
import type { ParsedFoodAI } from "./parseFoodAI";

interface SaveAIInput {
  sessionId: string;
  age: number;
  mood: string;
  weather: string;
  allergies: string[];
  ai: ParsedFoodAI;
}

export async function saveAIRecommendation({
  sessionId,
  age,
  mood,
  weather,
  allergies,
  ai,
}: SaveAIInput) {
  const { error } = await supabase
    .from("ai_food_recommendations")
    .insert({
      session_id: sessionId,
      age,
      mood,
      weather,
      allergies,
      food_name: ai.name,
      reason: ai.why,
      calories: ai.calories,
      nutrition: ai.nutrition,
    });

  if (error) {
    console.error("Failed to save AI recommendation:", error);
  }
}
