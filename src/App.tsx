import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import Onboarding, { OnboardingData } from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import SideNav from "./components/SideNav";
import SearchPage from "./components/SearchPage";
import LanguageSwitcher from "./components/LanguageSwitcher"; // ✅ FIX
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { supabase } from "./lib/supabase";

type AppStage = "hero" | "onboarding" | "app";
type Page = "home" | "search" | "language";

function AppContent() {
  const [appStage, setAppStage] = useState<AppStage>("hero");
  const [preferences, setPreferences] = useState<OnboardingData | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [activePage, setActivePage] = useState<Page>("home");

  const { theme, toggleTheme } = useTheme();

  // INIT SESSION
  useEffect(() => {
    initSession();
  }, []);

  async function initSession() {
    let storedSessionId = localStorage.getItem("moodmeal_session");

    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      localStorage.setItem("moodmeal_session", storedSessionId);
    }

    setSessionId(storedSessionId);

    const { data } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("session_id", storedSessionId)
      .maybeSingle();

    if (data) {
      const restoredPreferences: OnboardingData = {
        ageGroup: data.age_group,
        mealTypes: data.preferred_meal_types,
        allergies: data.allergies,
      };

      setPreferences(restoredPreferences);
      setAppStage("app");
    }
  }

  async function handleOnboardingComplete(data: OnboardingData) {
    await supabase.from("user_preferences").upsert(
      {
        session_id: sessionId,
        age_group: data.ageGroup,
        preferred_meal_types: data.mealTypes,
        allergies: data.allergies,
      },
      { onConflict: "session_id" }
    );

    setPreferences(data);
    setAppStage("app");
  }

  // ===== RENDER =====
  if (appStage === "hero") {
    return <Hero onStart={() => setAppStage("onboarding")} />;
  }

  if (appStage === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SIDE NAV */}
      <SideNav
        active={activePage}
        setActive={setActivePage}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {activePage === "home" && preferences && (
          <Dashboard preferences={preferences} />
        )}

        {activePage === "search" && <SearchPage />}

        {activePage === "language" && <LanguageSwitcher />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
