// src/components/navigation/ThemeToggle.tsx

// src/components/navigation/ThemeToggle.tsx

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = localStorage.getItem("icon-toolkit-theme");

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const dark = theme === "dark";

  const toggleTheme = () => {
    const nextTheme: Theme = dark ? "light" : "dark";

    setTheme(nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark",
    );

    localStorage.setItem(
      "icon-toolkit-theme",
      nextTheme,
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--surface)]
        text-[var(--text-secondary)]
        transition-colors
        duration-200
        hover:border-[var(--border-strong)]
        hover:bg-[var(--surface-muted)]
        hover:text-[var(--text)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#6366F1]
        focus-visible:ring-offset-2
      "
    >
      {dark ? (
        <Sun
          size={17}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <Moon
          size={17}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </button>
  );
}