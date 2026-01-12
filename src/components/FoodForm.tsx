import { useState } from "react";
import { getFoodRecommendation } from "../utils/foodAI";

export default function FoodForm() {
  const [result, setResult] = useState<string>("");

  async function handleClick() {
    const response = await getFoodRecommendation({
      age: 24,
      mood: "stressed",
      weather: "rainy",
      allergies: ["peanuts"]
    });

    setResult(response);
  }

  return (
    <div>
      <button onClick={handleClick}>
        Get Food Recommendation
      </button>

      {result && (
        <pre>{result}</pre>
      )}
    </div>
  );
}
