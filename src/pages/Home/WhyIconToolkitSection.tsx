// src/pages/Home/WhyIconToolkitSection.tsx
// src/pages/Home/WhyIconToolkitSection.tsx

// src/pages/Home/WhyIconToolkitSection.tsx

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Code2,
  Globe2,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type Benefit = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Globe2;
  points: string[];
};

/* ============================================================
   DATA
   ============================================================ */

const benefits: Benefit[] = [
  {
    number: "01",
    eyebrow: "Architecture",
    title: "Browser-first",
    description:
      "Image workflows are designed to run locally whenever the browser can handle them, keeping common operations fast and frictionless.",
    icon: Globe2,
    points: [
      "Local-first processing",
      "No unnecessary uploads",
      "Instant feedback",
    ],
  },
  {
    number: "02",
    eyebrow: "Privacy",
    title: "Private by design",
    description:
      "Your assets don't need to become part of an account or permanent asset library just to use the toolkit.",
    icon: Lock,
    points: [
      "Your files stay yours",
      "No forced asset library",
      "Minimal data handling",
    ],
  },
  {
    number: "03",
    eyebrow: "Production",
    title: "Built for shipping",
    description:
      "Go beyond visual previews with properly prepared files, metadata, and developer-ready output for real products.",
    icon: Code2,
    points: [
      "Production-ready exports",
      "Developer-friendly output",
      "Practical asset workflows",
    ],
  },
  {
    number: "04",
    eyebrow: "Performance",
    title: "Fast by default",
    description:
      "Focused tools and lightweight workflows keep repetitive asset operations responsive without adding unnecessary complexity.",
    icon: Zap,
    points: [
      "Focused interfaces",
      "Responsive interactions",
      "Low-friction workflows",
    ],
  },
];

/* ============================================================
   MOTION
   ============================================================ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function WhyIconToolkitSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why-icon-toolkit"
      aria-labelledby="why-icon-toolkit-heading"
      className="
        relative
        isolate
        overflow-hidden
        border-b
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      {/* ======================================================
          BACKGROUND ATMOSPHERE
          ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Large ambient glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 35, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.06, 1],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            -left-40
            -top-40
            h-[34rem]
            w-[34rem]
            rounded-full
            bg-[var(--brand)]/[0.035]
            blur-3xl
          "
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -30, 0],
                  y: [0, 25, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 21,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            -right-40
            top-[30%]
            h-[30rem]
            w-[30rem]
            rounded-full
            bg-[var(--brand)]/[0.025]
            blur-3xl
          "
        />

        {/* Technical grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.13]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:linear-gradient(to_bottom,black,transparent_78%)]
          "
        />

        {/* Top fade */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-40
            bg-gradient-to-b
            from-[var(--background)]
            to-transparent
          "
        />
      </div>

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[var(--content-max-width)]
          px-4
          py-20
          sm:px-6
          sm:py-24
          lg:px-8
          lg:py-28
          xl:px-10
        "
      >
        {/* ====================================================
            INTRODUCTION
            ==================================================== */}

        <div
          className="
            grid
            gap-12
            lg:grid-cols-[0.72fr_1.28fr]
            lg:items-start
            lg:gap-20
            xl:gap-28
          "
        >
          {/* ==================================================
              LEFT COLUMN
              ================================================== */}

          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            variants={itemVariants}
            className="relative lg:sticky lg:top-24"
          >
            {/* Eyebrow */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-3
                py-1.5
                shadow-[var(--shadow-xs)]
                backdrop-blur-xl
              "
            >
              <span
                className="
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-md
                  bg-[var(--surface-brand)]
                  text-[var(--brand)]
                "
              >
                <Sparkles
                  size={11}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.11em]
                  text-[var(--text-muted)]
                "
              >
                Built differently
              </span>
            </div>

            {/* Heading */}

            <h2
              id="why-icon-toolkit-heading"
              className="
                mt-6
                max-w-xl
                text-[2.35rem]
                font-bold
                leading-[1.04]
                tracking-[-0.055em]
                text-[var(--text)]
                sm:text-5xl
                lg:text-[3.45rem]
                xl:text-[3.8rem]
              "
            >
              Practical tools.
              <span className="block itk-gradient-text">
                No unnecessary complexity.
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-[var(--text-secondary)]
                sm:text-base
                sm:leading-8
              "
            >
              IconToolkit is designed around the actual steps people take
              when preparing digital assets for websites, applications, and
              products.
            </p>

            {/* Philosophy card */}

            <div
              className="
                relative
                mt-8
                overflow-hidden
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-5
                shadow-[var(--shadow-xs)]
                sm:p-6
              "
            >
              {/* Decorative glow */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-32
                  w-32
                  rounded-full
                  bg-[var(--brand)]/[0.06]
                  blur-2xl
                "
              />

              <div className="relative flex items-start gap-3.5">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface-muted)]
                    text-[var(--brand)]
                  "
                >
                  <ShieldCheck
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-[var(--text)]
                      sm:text-sm
                    "
                  >
                    Designed around real workflows
                  </p>

                  <p
                    className="
                      mt-1.5
                      text-[11px]
                      leading-5
                      text-[var(--text-muted)]
                      sm:text-xs
                    "
                  >
                    Less configuration. Less friction. More control over the
                    assets you're actually trying to ship.
                  </p>
                </div>
              </div>

              {/* Mini status row */}

              <div
                className="
                  relative
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  border-t
                  border-[var(--border)]
                  pt-4
                "
              >
                <StatusItem label="Focused" />

                <span
                  aria-hidden="true"
                  className="
                    hidden
                    h-1
                    w-1
                    rounded-full
                    bg-[var(--border-strong)]
                    sm:block
                  "
                />

                <StatusItem label="Private" />

                <span
                  aria-hidden="true"
                  className="
                    hidden
                    h-1
                    w-1
                    rounded-full
                    bg-[var(--border-strong)]
                    sm:block
                  "
                />

                <StatusItem label="Production-ready" />
              </div>
            </div>
          </motion.div>

          {/* ==================================================
              RIGHT COLUMN — BENEFITS
              ================================================== */}

          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              amount: 0.12,
            }}
            variants={containerVariants}
            className="
              grid
              gap-3
              sm:grid-cols-2
            "
          >
            {benefits.map((benefit) => (
              <BenefitCard
                key={benefit.number}
                benefit={benefit}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
              />
            ))}
          </motion.div>
        </div>

        {/* ====================================================
            BOTTOM PRINCIPLE BAR
            ==================================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 24,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 0.65,
                  ease: "easeOut",
                }
          }
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[var(--shadow-xs)]
            sm:mt-6
            sm:rounded-3xl
          "
        >
          <div
            className="
              relative
              flex
              flex-col
              gap-6
              overflow-hidden
              p-5
              sm:p-6
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-7
              lg:py-6
            "
          >
            {/* Background architecture */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                w-1/2
                bg-gradient-to-l
                from-[var(--surface-brand)]
                to-transparent
                opacity-50
              "
            />

            {/* Left */}

            <div className="relative flex items-start gap-3.5">
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: [0, -4, 4, 0],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface-muted)]
                  text-[var(--brand)]
                  shadow-[var(--shadow-xs)]
                "
              >
                <Zap
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </motion.div>

              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    text-[var(--text)]
                    sm:text-sm
                  "
                >
                  The IconToolkit principle
                </p>

                <p
                  className="
                    mt-1
                    max-w-2xl
                    text-[11px]
                    leading-5
                    text-[var(--text-muted)]
                    sm:text-xs
                  "
                >
                  Every workflow should make the next step clearer, not add
                  another layer of configuration between you and your final
                  asset.
                </p>
              </div>
            </div>

            {/* Right */}

            <div
              className="
                relative
                flex
                shrink-0
                items-center
                gap-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[var(--text-muted)]
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--success)]
                  shadow-[0_0_0_4px_var(--surface-brand)]
                "
              />

              Built for the workflow
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   BENEFIT CARD
   ============================================================ */

interface BenefitCardProps {
  benefit: Benefit;
  shouldReduceMotion: boolean;
}

function BenefitCard({
  benefit,
  shouldReduceMotion,
}: BenefitCardProps) {
  const Icon = benefit.icon;

  return (
    <motion.article
      variants={itemVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -5,
            }
      }
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="
        group
        relative
        flex
        min-h-[300px]
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-5
        shadow-[var(--shadow-xs)]
        transition-[border-color,box-shadow]
        duration-300
        hover:border-[var(--border-brand)]
        hover:shadow-[var(--shadow-lg)]
        sm:min-h-[325px]
        sm:p-6
        lg:min-h-[340px]
      "
    >
      {/* ======================================================
          CARD ATMOSPHERE
          ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-52
          w-52
          rounded-full
          bg-[var(--brand)]/[0.025]
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-[var(--brand)]/[0.075]
        "
      />

      {/* Technical number */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-5
          top-5
          font-mono
          text-[10px]
          font-semibold
          tracking-[0.12em]
          text-[var(--text-subtle)]
          transition-colors
          duration-300
          group-hover:text-[var(--brand)]
          sm:right-6
          sm:top-6
        "
      >
        {benefit.number}
      </div>

      {/* ======================================================
          ICON
          ====================================================== */}

      <motion.div
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                scale: 1.06,
                rotate: -3,
              }
        }
        className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--surface-muted)]
          text-[var(--text-secondary)]
          shadow-[var(--shadow-xs)]
          transition-all
          duration-300
          group-hover:border-[var(--border-brand)]
          group-hover:bg-[var(--surface-brand)]
          group-hover:text-[var(--brand)]
        "
      >
        <Icon
          size={19}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </motion.div>

      {/* ======================================================
          COPY
          ====================================================== */}

      <div className="relative mt-7">
        <div
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.1em]
            text-[var(--text-muted)]
          "
        >
          {benefit.eyebrow}
        </div>

        <h3
          className="
            mt-1.5
            text-xl
            font-semibold
            tracking-[-0.035em]
            text-[var(--text)]
            sm:text-[1.35rem]
          "
        >
          {benefit.title}
        </h3>

        <p
          className="
            mt-2.5
            text-xs
            leading-6
            text-[var(--text-secondary)]
            sm:text-sm
          "
        >
          {benefit.description}
        </p>
      </div>

      {/* ======================================================
          BENEFIT POINTS
          ====================================================== */}

      <div
        className="
          relative
          mt-auto
          border-t
          border-[var(--border)]
          pt-5
        "
      >
        <div className="space-y-2">
          {benefit.points.map((point) => (
            <div
              key={point}
              className="
                flex
                items-center
                gap-2
                text-[10px]
                font-medium
                text-[var(--text-muted)]
                sm:text-[11px]
              "
            >
              <span
                className="
                  flex
                  h-4
                  w-4
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--surface-brand)]
                  text-[var(--brand)]
                "
              >
                <Check
                  size={9}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </span>

              {point}
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================
          ACTIVE EDGE
          ====================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-0
          bg-[var(--brand)]
          opacity-80
          transition-all
          duration-500
          group-hover:w-full
        "
      />

      {/* Corner indicator */}

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-4
          right-5
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-md
          border
          border-transparent
          text-[var(--text-subtle)]
          opacity-0
          transition-all
          duration-300
          group-hover:border-[var(--border)]
          group-hover:text-[var(--brand)]
          group-hover:opacity-100
          sm:right-6
        "
      >
        <ArrowUpRight
          size={12}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>
    </motion.article>
  );
}

/* ============================================================
   STATUS ITEM
   ============================================================ */

function StatusItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-[var(--success)]
        "
      />

      <span
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.08em]
          text-[var(--text-muted)]
        "
      >
        {label}
      </span>
    </div>
  );
}