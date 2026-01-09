export function translateText(
    text: string,
    lang: "en" | "hi" | "mr"
  ) {
    if (lang === "en") return text;
  
    const dictionary: any = {
      hi: {
        Ingredients: "सामग्री",
        Recipe: "विधि",
        "Cook This Recipe 👩‍🍳": "यह रेसिपी बनाएं 👩‍🍳",
        "Order Nearby on Swiggy": "Swiggy से ऑर्डर करें",
        "Order Nearby on Zomato": "Zomato से ऑर्डर करें",
      },
      mr: {
        Ingredients: "साहित्य",
        Recipe: "कृती",
        "Cook This Recipe 👩‍🍳": "ही रेसिपी बनवा 👩‍🍳",
        "Order Nearby on Swiggy": "Swiggy वर ऑर्डर करा",
        "Order Nearby on Zomato": "Zomato वर ऑर्डर करा",
      },
    };
  
    return dictionary[lang]?.[text] || text;
  }
  