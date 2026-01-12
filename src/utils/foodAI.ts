export async function getFoodRecommendation(payload: {
  age: number;
  mood: string;
  weather: string;
  allergies: string[];
}) {
  const response = await fetch("http://localhost:8080/completion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error:", errorText);
    throw new Error("AI request failed");
  }

  const data = await response.json();

  // Extract structured info from text
  const extract = (label: string) => {
    const match = data.text.match(new RegExp(`${label}:\\s*(.*)`));
    return match ? match[1].trim() : "N/A";
  };

  return {
    foodName: extract("Food Name"),
    why: extract("Why it fits"),
    calories: extract("Calories"),
    protein: extract("Protein"),
    carbs: extract("Carbs"),
    fats: extract("Fats"),
  };
}
