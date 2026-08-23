// src/components/navigation/Logo.tsx

import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="IconToolkit home"
      className="
        group
        inline-flex
        items-center
        gap-3
        rounded-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]
      "
    >
      {/* Brand mark */}
      <span
        className="
          relative
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-[11px]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          shadow-[var(--shadow-sm)]
          transition-all
          duration-200
          group-hover:-translate-y-px
          group-hover:border-[var(--border-brand)]
          group-hover:shadow-[var(--shadow-brand)]
        "
      >
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[var(--brand-gradient-soft)]
          "
          aria-hidden="true"
        />

        <img
          src={logo}
          alt=""
          width={40}
          height={40}
          className="
            relative
            z-10
            h-8
            w-8
            object-contain
          "
        />
      </span>

      {/* Wordmark */}
      <span
        className="
          hidden
          leading-none
          sm:block
        "
      >
        <span
          className="
            block
            text-[17px]
            font-bold
            tracking-[-0.035em]
            text-[var(--text)]
          "
        >
          Icon<span className="itk-gradient-text">Toolkit</span>
        </span>

        <span
          className="
            mt-1
            block
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[var(--text-subtle)]
          "
        >
          Digital Asset Toolkit
        </span>
      </span>
    </Link>
  );
}