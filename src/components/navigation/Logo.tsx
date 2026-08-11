// src/components/navigation/Logo.tsx

import type { AnchorHTMLAttributes } from "react";

interface LogoProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  showTagline?: boolean;
}

export default function Logo({
  showTagline = false,
  className = "",
  ...props
}: LogoProps) {
  return (
    <a
      href="/"
      aria-label="IconToolkit home"
      className={`inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="
          flex h-8 w-8
          items-center justify-center
          rounded-lg
          bg-[#6366F1]
          text-white
          shadow-[0_2px_8px_rgba(99,102,241,0.2)]
        "
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
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

      <span className="flex flex-col">
        <span
          className="
            text-[17px]
            font-semibold
            leading-none
            tracking-[-0.02em]
            text-[var(--text)]
          "
        >
          Icon<span className="text-[#6366F1]">Toolkit</span>
        </span>

        {showTagline && (
          <span className="mt-1 text-[10px] font-medium text-[var(--text-muted)]">
            Icon creation toolkit
          </span>
        )}
      </span>
    </a>
  );
}