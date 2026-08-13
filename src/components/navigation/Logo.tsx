// src/components/navigation/Logo.tsx

import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="IconToolkit home"
      className="
        group
        inline-flex
        shrink-0
        items-center
        gap-2.5
        rounded-lg
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#6366F1]
        focus-visible:ring-offset-2
      "
    >
      {/* Logo mark */}
      <span
        aria-hidden="true"
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-[10px]
          bg-[#6366F1]
          text-white
          shadow-[0_3px_12px_rgba(99,102,241,0.20)]
          transition-transform
          duration-200
          group-hover:scale-[1.03]
        "
      >
        <svg
          viewBox="0 0 24 24"
          width="19"
          height="19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 3.5h10v5H7a2.5 2.5 0 0 0 0 5h7a2.5 2.5 0 0 1 0 5H4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M14 8.5h3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span
        className="
          text-[17px]
          font-semibold
          leading-none
          tracking-[-0.025em]
          text-[var(--text)]
        "
      >
        Icon<span className="text-[#6366F1]">Toolkit</span>
      </span>
    </Link>
  );
}