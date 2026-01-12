export interface ParsedFoodAI {
    name: string;
    why: string;
    calories: string;
    nutrition: {
      protein: string;
      carbs: string;
      fats: string;
    };
  }
  
  export function parseFoodAI(text: string): ParsedFoodAI {
    const lines = text.split("\n").map(l => l.trim());
  
    const get = (label: string) =>
      lines.find(l => l.startsWith(label))?.replace(label, "").trim() || "N/A";
  
    return {
      name: get("Food Name:"),
      why: get("Why it fits:"),
      calories: get("Calories (approx):"),
      nutrition: {
        protein: get("- Protein:"),
        carbs: get("- Carbs:"),
        fats: get("- Fats:")
      }
    };
  }
  