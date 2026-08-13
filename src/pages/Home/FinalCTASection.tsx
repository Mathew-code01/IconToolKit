// src/pages/Home/FinalCTASection.tsx

import { ArrowRight, Check, FileImage, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  "Generate complete icon sets",
  "Preview assets before shipping",
  "Export developer-ready files",
];

export default function FinalCTASection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-t
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.35]
          [background-image:radial-gradient(var(--border)_1px,transparent_1px)]
          [background-size:20px_20px]
          [mask-image:radial-gradient(ellipse_65%_70%_at_50%_50%,black,transparent_80%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[400px]
          w-[600px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#6366F1]/[0.07]
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[1440px]
          px-4
          py-16
          sm:px-6
          sm:py-20
          lg:px-8
          lg:py-24
          xl:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
            overflow-hidden
            rounded-3xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[0_24px_80px_rgba(0,0,0,0.08)]
          "
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            {/* Content */}
            <div
              className="
                p-7
                sm:p-10
                lg:p-12
                xl:p-14
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#6366F1]/20
                  bg-[#6366F1]/[0.06]
                  px-3
                  py-1.5
                "
              >
                <Sparkles
                  size={12}
                  className="text-[#6366F1]"
                  aria-hidden="true"
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-[#6366F1]
                  "
                >
                  Ready when you are
                </span>
              </div>

              <h2
                className="
                  mt-5
                  max-w-2xl
                  text-3xl
                  font-bold
                  leading-[1.1]
                  tracking-[-0.04em]
                  text-[var(--text)]
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Turn one logo into a
                <span className="text-[#6366F1]"> complete icon system.</span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-[var(--text-secondary)]
                  sm:text-base
                "
              >
                Create production-ready favicons, app icons, PWA assets,
                previews, and exports without installing another desktop
                application.
              </p>

              {/* Feature list */}
              <div className="mt-7 space-y-3">
                {FEATURES.map((feature) => (
                  <div
                    key={feature}
                    className="
                      flex
                      items-center
                      gap-2.5
                      text-sm
                      text-[var(--text-secondary)]
                    "
                  >
                    <span
                      className="
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#6366F1]/10
                        text-[#6366F1]
                      "
                    >
                      <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                    </span>

                    {feature}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div
                className="
                  mt-8
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  to="/generator"
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#6366F1]
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_5px_18px_rgba(99,102,241,0.22)]
                    transition-all
                    duration-200
                    hover:bg-[#4F46E5]
                    hover:shadow-[0_8px_24px_rgba(99,102,241,0.28)]
                    active:translate-y-px
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#6366F1]
                    focus-visible:ring-offset-2
                  "
                >
                  Open the icon generator
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <Link
                  to="/inspect"
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--background)]
                    px-5
                    text-sm
                    font-medium
                    text-[var(--text)]
                    transition-colors
                    hover:bg-[var(--surface-muted)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#6366F1]
                    focus-visible:ring-offset-2
                  "
                >
                  Inspect a website
                </Link>
              </div>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  text-[10px]
                  text-[var(--text-muted)]
                "
              >
                <span className="inline-flex items-center gap-1.5">
                  <Lock size={11} aria-hidden="true" />
                  Browser-first
                </span>

                <span
                  aria-hidden="true"
                  className="hidden h-3 w-px bg-[var(--border)] sm:block"
                />

                <span className="inline-flex items-center gap-1.5">
                  <FileImage size={11} aria-hidden="true" />
                  No account required
                </span>
              </div>
            </div>

            {/* Visual panel */}
            <div
              className="
                relative
                border-t
                border-[var(--border)]
                bg-[var(--background)]
                p-6
                sm:p-8
                lg:border-l
                lg:border-t-0
                lg:p-10
              "
            >
              <div
                className="
                  flex
                  h-full
                  min-h-[280px]
                  flex-col
                  justify-center
                "
              >
                <p
                  className="
                    font-mono
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-[var(--text-muted)]
                  "
                >
                  Export pipeline
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    {
                      size: "16 × 16",
                      label: "Browser favicon",
                    },
                    {
                      size: "32 × 32",
                      label: "Standard favicon",
                    },
                    {
                      size: "180 × 180",
                      label: "Apple touch icon",
                    },
                    {
                      size: "192 × 192",
                      label: "PWA icon",
                    },
                    {
                      size: "512 × 512",
                      label: "High resolution",
                    },
                  ].map((item, index) => (
                    <div
                      key={item.size}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        px-3
                        py-2.5
                      "
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#6366F1]/10
                            text-[9px]
                            font-bold
                            text-[#6366F1]
                          "
                        >
                          {index + 1}
                        </span>

                        <div>
                          <p
                            className="
                              font-mono
                              text-[10px]
                              font-semibold
                              text-[var(--text)]
                            "
                          >
                            {item.size}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[9px]
                              text-[var(--text-muted)]
                            "
                          >
                            {item.label}
                          </p>
                        </div>
                      </div>

                      <Check
                        size={14}
                        className="text-[#6366F1]"
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>

                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-[#6366F1]/15
                    bg-[#6366F1]/[0.05]
                    px-3
                    py-2.5
                  "
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-[var(--text-secondary)]
                      "
                    >
                      Export package
                    </span>

                    <span
                      className="
                        font-mono
                        text-[9px]
                        font-semibold
                        text-[#6366F1]
                      "
                    >
                      READY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom reassurance */}
        <p
          className="
            mt-6
            text-center
            text-[11px]
            text-[var(--text-muted)]
          "
        >
          No signup. No complicated setup. Just open the toolkit and start
          creating.
        </p>
      </div>
    </section>
  );
}