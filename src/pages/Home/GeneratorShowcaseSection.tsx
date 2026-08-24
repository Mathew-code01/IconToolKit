// src/pages/Home/GeneratorShowcaseSection.tsx

// src/pages/Home/GeneratorShowcaseSection.tsx

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Eye,
  FileImage,
  Globe2,
  Package,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================================
   DATA
   ============================================================ */

const sizes = [
  { size: "16", label: "Favicon" },
  { size: "32", label: "Browser" },
  { size: "48", label: "Browser" },
  { size: "64", label: "Desktop" },
  { size: "128", label: "App" },
  { size: "180", label: "Apple" },
  { size: "192", label: "PWA" },
  { size: "512", label: "PWA" },
];

const features = [
  {
    title: "Complete icon set",
    description: "Generate the essential sizes automatically.",
  },
  {
    title: "Real-world previews",
    description: "See how your assets look before shipping.",
  },
  {
    title: "Developer-ready output",
    description: "Get HTML, manifest, and asset files together.",
  },
  {
    title: "One-click package",
    description: "Download everything as one organized package.",
  },
];

/* ============================================================
   MOTION
   ============================================================ */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
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

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.08,
    },
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function GeneratorShowcaseSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="generator-showcase"
      aria-labelledby="generator-showcase-heading"
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
        {/* Top glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.06, 1],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            left-[-14rem]
            top-[-15rem]
            h-[36rem]
            w-[36rem]
            rounded-full
            bg-[var(--brand)]/[0.045]
            blur-3xl
          "
        />

        {/* Product glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -25, 0],
                  y: [0, 20, 0],
                  scale: [1, 1.04, 1],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 19,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            right-[-16rem]
            top-[15%]
            h-[38rem]
            w-[38rem]
            rounded-full
            bg-[var(--brand)]/[0.035]
            blur-3xl
          "
        />

        {/* Fine grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.12]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:linear-gradient(to_bottom,black,transparent_80%)]
          "
        />

        {/* Center radial wash */}

        <div
          className="
            absolute
            inset-x-0
            top-1/4
            mx-auto
            h-[30rem]
            max-w-5xl
            rounded-full
            bg-[var(--brand)]/[0.018]
            blur-3xl
          "
        />
      </div>

      {/* ======================================================
          CONTENT
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
          lg:py-32
          xl:px-10
        "
      >
        <div
          className="
            grid
            items-center
            gap-14
            lg:grid-cols-[0.88fr_1.12fr]
            lg:gap-16
            xl:gap-24
          "
        >
          {/* ==================================================
              LEFT — COPY
              ================================================== */}

          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={
              shouldReduceMotion
                ? undefined
                : "visible"
            }
            viewport={{
              once: true,
              amount: 0.25,
            }}
            variants={stagger}
            className="relative z-10"
          >
            {/* Eyebrow */}

            <motion.div
              variants={fadeUp}
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
                <WandSparkles
                  size={11}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[var(--text-muted)]
                  sm:text-[10px]
                "
              >
                Flagship workflow
              </span>

              <span
                className="
                  hidden
                  h-1
                  w-1
                  rounded-full
                  bg-[var(--brand)]
                  sm:block
                "
              />

              <span
                className="
                  hidden
                  text-[9px]
                  font-medium
                  text-[var(--text-subtle)]
                  sm:block
                "
              >
                Favicon Generator
              </span>
            </motion.div>

            {/* Heading */}

            <motion.h2
              variants={fadeUp}
              id="generator-showcase-heading"
              className="
                mt-6
                max-w-2xl
                text-[2.35rem]
                font-bold
                leading-[1.02]
                tracking-[-0.055em]
                text-[var(--text)]
                sm:text-5xl
                lg:text-[3.45rem]
                xl:text-[3.9rem]
              "
            >
              One image.
              <br />

              <span className="itk-gradient-text">
                A complete icon system.
              </span>
            </motion.h2>

            {/* Description */}

            <motion.p
              variants={fadeUp}
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
              Turn a single logo into the favicon sizes, browser assets,
              app icons, manifest files, and developer-ready output your
              product needs to ship confidently.
            </motion.p>

            {/* Feature list */}

            <motion.div
              variants={fadeUp}
              className="
                mt-8
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="
                    group
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-3.5
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[var(--border-brand)]
                    hover:bg-[var(--surface-muted)]
                  "
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="
                        mt-0.5
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--surface-brand)]
                        text-[var(--brand)]
                      "
                    >
                      <Check
                        size={11}
                        strokeWidth={2.6}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0">
                      <p
                        className="
                          text-xs
                          font-semibold
                          text-[var(--text)]
                        "
                      >
                        {feature.title}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          leading-5
                          text-[var(--text-muted)]
                        "
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}

            <motion.div
              variants={fadeUp}
              className="
                mt-8
                flex
                flex-col
                items-stretch
                gap-4
                sm:flex-row
                sm:items-center
              "
            >
              <Link
                to="/generator"
                className="
                  group
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--brand)]
                  px-5
                  text-xs
                  font-semibold
                  text-white
                  shadow-[0_8px_24px_rgba(99,102,241,0.20)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--brand-hover)]
                  hover:shadow-[0_12px_30px_rgba(99,102,241,0.28)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--background)]
                  sm:w-auto
                "
              >
                Open favicon generator

                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                  "
                  aria-hidden="true"
                />
              </Link>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-medium
                  text-[var(--text-muted)]
                "
              >
                <CheckCircle2
                  size={14}
                  className="text-[var(--success)]"
                  aria-hidden="true"
                />

                No complicated setup
              </div>
            </motion.div>

            {/* Mini trust row */}

            <motion.div
              variants={fadeUp}
              className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
              "
            >
              <MiniTrust
                icon={<Zap size={11} aria-hidden="true" />}
                label="Fast workflow"
              />

              <MiniDivider />

              <MiniTrust
                icon={<Globe2 size={11} aria-hidden="true" />}
                label="Browser-first"
              />

              <MiniDivider />

              <MiniTrust
                icon={<Package size={11} aria-hidden="true" />}
                label="Ready to export"
              />
            </motion.div>
          </motion.div>

          {/* ==================================================
              RIGHT — PRODUCT MOCKUP
              ================================================== */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 30,
                    scale: 0.97,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }
            }
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 0.8,
                    ease: "easeOut",
                  }
            }
            className="
              relative
              min-w-0
            "
          >
            {/* Floating badge */}

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 1, y: 0 }
              }
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.5,
                delay: 0.35,
              }}
              className="
                absolute
                -top-4
                right-3
                z-20
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-3
                py-2
                text-[9px]
                font-semibold
                text-[var(--text-secondary)]
                shadow-[var(--shadow-md)]
                backdrop-blur-xl
                sm:flex
                lg:-right-4
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--success)]
                "
              />

              8 assets generated
            </motion.div>

            {/* Main browser */}

            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -5, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                shadow-[0_30px_90px_rgba(0,0,0,0.10)]
                sm:rounded-3xl
              "
            >
              {/* Browser top bar */}

              <div
                className="
                  flex
                  h-11
                  items-center
                  gap-1.5
                  border-b
                  border-[var(--border)]
                  bg-[var(--surface)]
                  px-3
                  sm:h-12
                  sm:px-4
                "
              >
                <BrowserDot />
                <BrowserDot />
                <BrowserDot />

                <div
                  className="
                    ml-2
                    flex
                    h-6
                    min-w-0
                    flex-1
                    items-center
                    rounded-md
                    bg-[var(--surface-muted)]
                    px-2.5
                    font-mono
                    text-[8px]
                    text-[var(--text-muted)]
                    sm:ml-3
                    sm:h-7
                    sm:px-3
                    sm:text-[9px]
                  "
                >
                  <span className="truncate">
                    icontoolkit.app / generator
                  </span>
                </div>

                <div
                  className="
                    ml-1
                    hidden
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-md
                    text-[var(--text-muted)]
                    sm:flex
                  "
                >
                  <Sparkles
                    size={13}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* App body */}

              <div
                className="
                  relative
                  p-4
                  sm:p-6
                  lg:p-7
                "
              >
                {/* Header */}

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className="
                          truncate
                          text-xs
                          font-semibold
                          text-[var(--text)]
                          sm:text-sm
                        "
                      >
                        Icon package
                      </p>

                      <span
                        className="
                          hidden
                          rounded-md
                          bg-[var(--surface-brand)]
                          px-1.5
                          py-0.5
                          text-[8px]
                          font-semibold
                          text-[var(--brand)]
                          sm:inline-flex
                        "
                      >
                        READY
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[var(--text-muted)]
                        sm:text-[10px]
                      "
                    >
                      8 production assets generated
                    </p>
                  </div>

                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            rotate: [0, 8, -5, 0],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--surface-brand)]
                      text-[var(--brand)]
                      sm:h-10
                      sm:w-10
                    "
                  >
                    <Package
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </motion.div>
                </div>

                {/* Main preview */}

                <div
                  className="
                    relative
                    mt-5
                    flex
                    h-40
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface-muted)]
                    sm:mt-6
                    sm:h-48
                    sm:rounded-2xl
                  "
                >
                  {/* Preview grid */}

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      opacity-[0.25]
                      [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
                      [background-size:24px_24px]
                    "
                  />

                  {/* Ambient glow */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      h-36
                      w-36
                      rounded-full
                      bg-[var(--brand)]/[0.10]
                      blur-3xl
                    "
                  />

                  {/* Icon */}

                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: [1, 1.025, 1],
                            rotate: [0, 0.5, 0],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                    className="
                      relative
                      flex
                      h-24
                      w-24
                      items-center
                      justify-center
                      rounded-[26%]
                      bg-[var(--brand)]
                      shadow-[0_18px_45px_rgba(99,102,241,0.28)]
                      sm:h-28
                      sm:w-28
                    "
                  >
                    <FileImage
                      size={38}
                      strokeWidth={1.55}
                      className="text-white sm:h-11 sm:w-11"
                      aria-hidden="true"
                    />

                    {/* Shine */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-[26%]
                      "
                    >
                      <motion.div
                        animate={
                          shouldReduceMotion
                            ? undefined
                            : {
                                x: ["-120%", "120%"],
                              }
                        }
                        transition={
                          shouldReduceMotion
                            ? undefined
                            : {
                                duration: 4.5,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "easeInOut",
                              }
                        }
                        className="
                          absolute
                          inset-y-0
                          w-1/3
                          skew-x-[-18deg]
                          bg-white/[0.13]
                          blur-md
                        "
                      />
                    </div>
                  </motion.div>

                  {/* Preview status */}

                  <div
                    className="
                      absolute
                      bottom-3
                      left-3
                      flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]/[0.88]
                      px-2
                      py-1.5
                      text-[8px]
                      font-medium
                      text-[var(--text-muted)]
                      shadow-[var(--shadow-xs)]
                      backdrop-blur-xl
                    "
                  >
                    <CheckCircle2
                      size={11}
                      className="text-[var(--success)]"
                      aria-hidden="true"
                    />

                    Preview ready
                  </div>
                </div>

                {/* Size heading */}

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-[var(--text)]
                        sm:text-xs
                      "
                    >
                      Generated sizes
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[8px]
                        text-[var(--text-muted)]
                        sm:text-[9px]
                      "
                    >
                      Optimized for common platforms
                    </p>
                  </div>

                  <span
                    className="
                      rounded-md
                      border
                      border-[var(--border)]
                      bg-[var(--surface-muted)]
                      px-2
                      py-1
                      font-mono
                      text-[8px]
                      text-[var(--text-muted)]
                    "
                  >
                    8 / 8
                  </span>
                </div>

                {/* Size list */}

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-4
                    gap-1.5
                    sm:gap-2
                  "
                >
                  {sizes.map((item, index) => (
                    <motion.div
                      key={item.size}
                      initial={
                        shouldReduceMotion
                          ? false
                          : {
                              opacity: 0,
                              y: 8,
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
                        amount: 0.5,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: shouldReduceMotion
                          ? 0
                          : index * 0.045,
                      }}
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : {
                              y: -2,
                            }
                      }
                      className="
                        group/size
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        px-1.5
                        py-2
                        text-center
                        transition-all
                        duration-200
                        hover:border-[var(--border-brand)]
                        hover:bg-[var(--surface-brand)]
                      "
                    >
                      <div
                        className="
                          font-mono
                          text-[10px]
                          font-semibold
                          text-[var(--text)]
                          transition-colors
                          group-hover/size:text-[var(--brand)]
                          sm:text-xs
                        "
                      >
                        {item.size}
                      </div>

                      <div
                        className="
                          mt-0.5
                          truncate
                          text-[7px]
                          text-[var(--text-muted)]
                          sm:text-[8px]
                        "
                      >
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-2
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--background)]
                      text-[9px]
                      font-semibold
                      text-[var(--text-secondary)]
                      transition-colors
                      duration-200
                      hover:bg-[var(--surface-muted)]
                      sm:text-[10px]
                    "
                  >
                    <Eye
                      size={13}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    Preview
                  </div>

                  <div
                    className="
                      flex
                      h-10
                      items-center
                      justify-center
                      gap-1.5
                      rounded-lg
                      bg-[var(--brand)]
                      text-[9px]
                      font-semibold
                      text-white
                      shadow-[0_6px_18px_rgba(99,102,241,0.18)]
                      sm:text-[10px]
                    "
                  >
                    <Download
                      size={13}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    Download ZIP
                  </div>
                </div>

                {/* Bottom status */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-t
                    border-[var(--border)]
                    pt-3
                  "
                >
                  <div className="flex items-center gap-1.5">
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
                        text-[8px]
                        font-medium
                        text-[var(--text-muted)]
                      "
                    >
                      All assets validated
                    </span>
                  </div>

                  <span
                    className="
                      font-mono
                      text-[8px]
                      text-[var(--text-subtle)]
                    "
                  >
                    1 package
                  </span>
                </div>
              </div>

              {/* Browser bottom highlight */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-0
                  left-0
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-transparent
                  via-[var(--brand)]/30
                  to-transparent
                "
              />
            </motion.div>

            {/* Floating info card */}

            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 14,
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
                amount: 0.25,
              }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -4, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: {
                        duration: 0.5,
                        delay: 0.45,
                      },
                      y: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
              }
              className="
                absolute
                -bottom-5
                left-3
                z-20
                hidden
                max-w-[190px]
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]/[0.94]
                p-3
                shadow-[var(--shadow-lg)]
                backdrop-blur-xl
                sm:block
                lg:-left-5
              "
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--surface-brand)]
                    text-[var(--brand)]
                  "
                >
                  <CheckCircle2
                    size={14}
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    Ready to ship
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      leading-4
                      text-[var(--text-muted)]
                    "
                  >
                    Assets and implementation details are packaged together.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ======================================================
            BOTTOM FEATURE STRIP
            ====================================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 18,
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="
            mt-14
            grid
            overflow-hidden
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            sm:mt-20
            sm:grid-cols-3
            lg:grid-cols-4
            lg:rounded-3xl
          "
        >
          <BottomFeature
            icon={<FileImage size={15} aria-hidden="true" />}
            label="Multiple formats"
            value="PNG · ICO · SVG"
          />

          <BottomFeature
            icon={<Package size={15} aria-hidden="true" />}
            label="Complete package"
            value="Assets + metadata"
          />

          <BottomFeature
            icon={<Eye size={15} aria-hidden="true" />}
            label="Visual validation"
            value="Preview before export"
          />

          <div className="hidden lg:block">
            <BottomFeature
              icon={<Download size={15} aria-hidden="true" />}
              label="Developer output"
              value="Ready to integrate"
              last
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   BROWSER DOT
   ============================================================ */

function BrowserDot() {
  return (
    <span
      aria-hidden="true"
      className="
        h-2
        w-2
        shrink-0
        rounded-full
        bg-[var(--border-strong)]
        sm:h-2.5
        sm:w-2.5
      "
    />
  );
}

/* ============================================================
   MINI TRUST
   ============================================================ */

function MiniTrust({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.06em]
        text-[var(--text-muted)]
      "
    >
      <span className="text-[var(--brand)]">
        {icon}
      </span>

      {label}
    </div>
  );
}

/* ============================================================
   MINI DIVIDER
   ============================================================ */

function MiniDivider() {
  return (
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
  );
}

/* ============================================================
   BOTTOM FEATURE
   ============================================================ */

function BottomFeature({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
        px-4
        py-4
        sm:px-5
        lg:px-6
        ${!last ? "border-b border-[var(--border)] sm:border-b-0 sm:border-r" : ""}
      `}
    >
      <span
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-[var(--surface-muted)]
          text-[var(--brand)]
        "
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p
          className="
            truncate
            text-[9px]
            font-semibold
            text-[var(--text)]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[8px]
            text-[var(--text-muted)]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}