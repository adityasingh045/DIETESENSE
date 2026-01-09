import { Home, Search, Languages, Moon, Sun } from "lucide-react";
import { useState } from "react";
import logo from "../assets/hero.jpg";

interface SideNavProps {
  active: "home" | "search" | "language";
  setActive: (page: "home" | "search" | "language") => void;
  toggleTheme: () => void;
  theme: "light" | "dark";
}

export default function SideNav({
  active,
  setActive,
  toggleTheme,
  theme,
}: SideNavProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-64"}
        transition-all duration-300
        bg-white dark:bg-gray-800
        shadow-xl flex flex-col
      `}
    >
      {/* LOGO */}
      <div
        className="h-20 flex items-center justify-center cursor-pointer border-b dark:border-gray-700"
        onClick={() => setCollapsed(!collapsed)}
        title="Toggle menu"
      >
        <img
          src={logo}
          alt="App Logo"
          className={`transition-all duration-300 ${
            collapsed ? "w-10" : "w-14"
          }`}
        />
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <NavItem
          icon={<Home />}
          label="Home"
          active={active === "home"}
          collapsed={collapsed}
          onClick={() => setActive("home")}
        />

        <NavItem
          icon={<Search />}
          label="Search"
          active={active === "search"}
          collapsed={collapsed}
          onClick={() => setActive("search")}
        />

        <NavItem
          icon={<Languages />}
          label="Language"
          active={active === "language"}
          collapsed={collapsed}
          onClick={() => setActive("language")}
        />
      </nav>

      {/* 🌙 APPEARANCE TOGGLE */}
      <div className="p-4 border-t dark:border-gray-700 flex justify-center">
        <button
          onClick={toggleTheme}
          className="
            relative w-14 h-8 rounded-full
            bg-gray-300 dark:bg-gray-700
            transition-colors duration-300
            flex items-center
          "
          title="Toggle theme"
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
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-3 py-3 rounded-xl transition
        ${
          active
            ? "bg-orange-500 text-white"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
    >
      {icon}
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  );
}
