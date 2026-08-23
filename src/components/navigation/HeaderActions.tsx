// src/components/navigation/HeaderActions.tsx

import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

export default function HeaderActions() {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <ThemeToggle />

      <Link
        to="/generator"
        className="
          group
          relative
          inline-flex
          h-10
          items-center
          justify-center
          gap-2
          overflow-hidden
          rounded-xl
          bg-[var(--brand-gradient)]
          px-4
          text-[13px]
          font-bold
          text-white
          shadow-[var(--shadow-brand)]
          transition-all
          duration-200
          hover:-translate-y-px
          hover:shadow-[0_10px_28px_rgba(79,70,229,0.30)]
          active:translate-y-0
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--brand)]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[var(--background)]
        "
      >
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            bg-white/10
            opacity-0
            transition-opacity
            duration-200
            group-hover:opacity-100
          "
          aria-hidden="true"
        />

        <Sparkles
          size={14}
          strokeWidth={2}
          className="relative"
          aria-hidden="true"
        />

        <span className="relative">Create icon</span>

        <ArrowUpRight
          size={14}
          strokeWidth={2}
          className="
            relative
            transition-transform
            duration-200
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
          "
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}