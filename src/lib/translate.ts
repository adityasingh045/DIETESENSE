const cache = new Map<string, string>();

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (!text || targetLang === "en") return text;

  const key = `${text}_${targetLang}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|${targetLang}`
    );

    const data = await res.json();
    const translated = data.responseData.translatedText || text;

    cache.set(key, translated);
    return translated;
  } catch {
    return text; // fallback
  }
}
