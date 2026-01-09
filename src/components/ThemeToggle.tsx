import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-14 h-8 rounded-full
        bg-gray-300 dark:bg-gray-700
        transition-colors duration-300
        flex items-center
      "
    >
      {/* SLIDER */}
      <span
        className={`
          absolute left-1 top-1
          w-6 h-6 rounded-full
          bg-white dark:bg-gray-900
          shadow-md
          flex items-center justify-center
          transform transition-all duration-300
          ${theme === "dark" ? "translate-x-6" : "translate-x-0"}
        `}
      >
        {theme === "dark" ? (
          <Moon className="w-3.5 h-3.5 text-yellow-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-orange-500" />
        )}
      </span>
    </button>
  );
}
