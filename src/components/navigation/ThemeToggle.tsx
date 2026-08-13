// src/components/navigation/ThemeToggle.tsx

// src/components/navigation/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "icon-toolkit-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem(STORAGE_KEY, theme);
  }, [isDark, theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        inline-flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--surface)]
        text-[var(--text-secondary)]
        transition-all
        duration-200
        hover:border-[var(--border-strong)]
        hover:bg-[var(--surface-muted)]
        hover:text-[var(--text)]
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#6366F1]
        focus-visible:ring-offset-2
      "
    >
      {isDark ? (
        <Sun size={17} strokeWidth={1.9} aria-hidden="true" />
      ) : (
        <Moon size={17} strokeWidth={1.9} aria-hidden="true" />
      )}
    </button>
  );
}