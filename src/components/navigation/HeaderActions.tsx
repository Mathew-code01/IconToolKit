// src/components/navigation/HeaderActions.tsx

import { ArrowUpRight } from "lucide-react";
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
          inline-flex
          h-9
          items-center
          justify-center
          gap-1.5
          rounded-lg
          bg-[#6366F1]
          px-3.5
          text-sm
          font-semibold
          text-white
          shadow-[0_3px_10px_rgba(99,102,241,0.18)]
          transition-all
          duration-200
          hover:bg-[#4F46E5]
          hover:shadow-[0_5px_14px_rgba(99,102,241,0.25)]
          active:translate-y-px
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#6366F1]
          focus-visible:ring-offset-2
        "
      >
        Create icon
        <ArrowUpRight
          size={14}
          strokeWidth={2}
          className="
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