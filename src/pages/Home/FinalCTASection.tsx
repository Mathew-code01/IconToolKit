// src/pages/Home/FinalCTASection.tsx

// src/pages/Home/FinalCTASection.tsx

import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#6366F1]">
          [ Get started ]
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-4xl">
          Ready to build your icon set?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
          Start with your logo and build a complete icon set directly in your
          browser.
        </p>

        <a
          href="/generator"
          className="
            mt-7
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#6366F1]
            px-5
            text-sm
            font-semibold
            text-white
            shadow-[0_4px_14px_rgba(99,102,241,0.2)]
            transition-all
            duration-200
            hover:bg-[#4F46E5]
            hover:shadow-[0_6px_18px_rgba(99,102,241,0.28)]
            active:translate-y-px
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#6366F1]
            focus-visible:ring-offset-2
          "
        >
          Open the icon generator
          <ArrowRight size={16} aria-hidden="true" />
        </a>

        <p className="mt-5 font-mono text-[11px] tracking-tight text-[var(--text-muted)]">
          PNG · ICO · SVG · manifest entries — generated on export
        </p>
      </div>
    </section>
  );
}