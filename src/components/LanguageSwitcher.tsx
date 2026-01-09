import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Language</h2>

      <div className="flex gap-4">
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-2 rounded ${
            language === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          English
        </button>

        <button
          onClick={() => setLanguage("hi")}
          className={`px-4 py-2 rounded ${
            language === "hi" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          हिन्दी
        </button>

        <button
          onClick={() => setLanguage("mr")}
          className={`px-4 py-2 rounded ${
            language === "mr" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          मराठी
        </button>
      </div>
    </div>
  );
}
