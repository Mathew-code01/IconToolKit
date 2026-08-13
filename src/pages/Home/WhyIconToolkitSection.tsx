// src/pages/Home/WhyIconToolkitSection.tsx
// src/pages/Home/WhyIconToolkitSection.tsx

import {
  Code2,
  Globe2,
  Lock,
  Zap,
} from "lucide-react";

const benefits = [
  {
    title: "Browser-first",
    description:
      "Image workflows are designed to run locally whenever the browser can handle them.",
    icon: Globe2,
  },
  {
    title: "Private by design",
    description:
      "Your assets don't need to become part of an account or asset library just to use the toolkit.",
    icon: Lock,
  },
  {
    title: "Built for shipping",
    description:
      "Export files and developer-ready code instead of stopping at a visual preview.",
    icon: Code2,
  },
  {
    title: "Fast by default",
    description:
      "Focused tools and lightweight workflows keep common asset operations quick.",
    icon: Zap,
  },
];

export default function WhyIconToolkitSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-20
          sm:px-6
          lg:px-8
          lg:py-24
        "
      >
        <div
          className="
            grid
            gap-12
            lg:grid-cols-[0.7fr_1.3fr]
            lg:gap-20
          "
        >
          {/* Section introduction */}
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[#6366F1]
              "
            >
              Built differently
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-bold
                tracking-[-0.035em]
                text-[var(--text)]
                sm:text-4xl
              "
            >
              Practical tools without the unnecessary complexity.
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-[var(--text-secondary)]
              "
            >
              IconToolkit is designed around the actual steps people
              take when preparing digital assets for websites and
              applications.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[var(--border-strong)]
                    hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                  "
                >
                  {/* Icon */}
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#6366F1]/10
                      text-[#6366F1]
                    "
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  {/* Title */}
                  <h3
                    className="
                      mt-5
                      text-sm
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-[var(--text-muted)]
                    "
                  >
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}