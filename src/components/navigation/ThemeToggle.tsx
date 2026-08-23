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

    document.documentElement.style.colorScheme = isDark ? "dark" : "light";

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
        group
        relative
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        overflow-hidden
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        text-[var(--text-secondary)]
        shadow-[var(--shadow-xs)]
        transition-all
        duration-200
        hover:border-[var(--border-brand)]
        hover:bg-[var(--surface-hover)]
        hover:text-[var(--brand)]
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]
      "
    >
      <span
        className="
          absolute
          inset-0
          bg-[var(--brand-gradient-soft)]
          opacity-0
          transition-opacity
          duration-200
          group-hover:opacity-100
        "
        aria-hidden="true"
      />

      <span
        className="
          relative
          z-10
          transition-transform
          duration-200
          group-hover:rotate-6
        "
      >
        {isDark ? (
          <Sun size={17} strokeWidth={1.9} aria-hidden="true" />
        ) : (
          <Moon size={17} strokeWidth={1.9} aria-hidden="true" />
        )}
      </span>

      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
}