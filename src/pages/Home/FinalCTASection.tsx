// src/pages/Home/FinalCTASection.tsx

import {
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  FileCode2,
  FileImage,
  Lock,
  Package,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

/* ============================================================
   DATA
   ============================================================ */

const FEATURES = [
  "Generate complete icon sets",
  "Preview assets before shipping",
  "Export developer-ready files",
];

const EXPORT_ITEMS = [
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
];

/* ============================================================
   MOTION
   ============================================================ */

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const visualVariants = {
  hidden: {
    opacity: 0,
    x: 28,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.12,
      ease: "easeOut" as const,
    },
  },
};

const featureVariants = {
  hidden: {
    opacity: 0,
    x: -12,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function FinalCTASection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="
        relative
        isolate
        overflow-hidden
        border-t
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
        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.22]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black,transparent_82%)]
          "
        />

        {/* Center glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.45, 0.7, 0.45],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            left-1/2
            top-[42%]
            h-[28rem]
            w-[42rem]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[var(--brand)]/[0.055]
            blur-3xl
          "
        />

        {/* Left glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 35, 0],
                  y: [0, -20, 0],
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
            -left-48
            top-1/4
            h-80
            w-80
            rounded-full
            bg-[var(--brand)]/[0.035]
            blur-3xl
          "
        />

        {/* Right glow */}

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
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            -right-48
            bottom-0
            h-96
            w-96
            rounded-full
            bg-[var(--brand)]/[0.03]
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
          max-w-[1440px]
          px-4
          py-16
          sm:px-6
          sm:py-20
          lg:px-8
          lg:py-28
          xl:px-10
        "
      >
        {/* ====================================================
            MAIN CTA SHELL
            ==================================================== */}

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={revealVariants}
          className="
            relative
            mx-auto
            max-w-6xl
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            shadow-[var(--shadow-lg)]
            sm:rounded-[2rem]
            lg:rounded-[2.5rem]
          "
        >
          {/* ==================================================
              TOP BRAND LINE
              ================================================== */}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[var(--brand)]
              to-transparent
              opacity-70
            "
          />

          {/* ==================================================
              INNER GLOW
              ================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-80
              w-80
              rounded-full
              bg-[var(--brand)]/[0.055]
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-40
              -left-40
              h-96
              w-96
              rounded-full
              bg-[var(--brand)]/[0.035]
              blur-3xl
            "
          />

          <div
            className="
              relative
              grid
              lg:grid-cols-[1.08fr_0.92fr]
            "
          >
            {/* =================================================
                LEFT CONTENT
                ================================================= */}

            <div
              className="
                relative
                p-6
                sm:p-9
                md:p-11
                lg:p-12
                xl:p-14
              "
            >
              {/* Brand / status */}

              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 10,
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
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.55,
                }}
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--background)]
                    shadow-[var(--shadow-xs)]
                  "
                >
                  <img
                    src={logo}
                    alt="IconToolkit"
                    className="
                      h-6
                      w-6
                      object-contain
                    "
                  />
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[var(--border-brand)]
                    bg-[var(--surface-brand)]
                    px-3
                    py-1.5
                  "
                >
                  <motion.span
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: [1, 1.25, 1],
                          }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[var(--brand)]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[var(--brand)]
                    "
                  >
                    Ready when you are
                  </span>
                </div>
              </motion.div>

              {/* Heading */}

              <motion.h2
                id="final-cta-heading"
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
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.08,
                  ease: "easeOut",
                }}
                className="
                  mt-6
                  max-w-3xl
                  text-[2.25rem]
                  font-bold
                  leading-[1.04]
                  tracking-[-0.055em]
                  text-[var(--text)]
                  sm:text-5xl
                  lg:text-[3.65rem]
                  xl:text-[4rem]
                "
              >
                Turn one logo into a
                <span className="block text-[var(--brand)]">
                  complete icon system.
                </span>
              </motion.h2>

              {/* Description */}

              <motion.p
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
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.15,
                  ease: "easeOut",
                }}
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
                Create production-ready favicons, app icons, PWA assets,
                previews, and developer exports without interrupting your
                workflow or installing another desktop application.
              </motion.p>

              {/* =================================================
                  FEATURES
                  ================================================= */}

              <motion.div
                initial="hidden"
                whileInView={shouldReduceMotion ? undefined : "visible"}
                viewport={{
                  once: true,
                  amount: 0.4,
                }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.2,
                    },
                  },
                }}
                className="
                  mt-7
                  grid
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-1
                  xl:grid-cols-3
                "
              >
                {FEATURES.map((feature) => (
                  <motion.div
                    key={feature}
                    variants={featureVariants}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                    className="
                      flex
                      items-center
                      gap-2.5
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
                        border
                        border-[var(--border-brand)]
                        bg-[var(--surface-brand)]
                        text-[var(--brand)]
                      "
                    >
                      <Check size={11} strokeWidth={2.7} aria-hidden="true" />
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium
                        leading-5
                        text-[var(--text-secondary)]
                      "
                    >
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* =================================================
                  ACTIONS
                  ================================================= */}

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
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="
                  mt-8
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                {/* Primary */}

                <Link
                  to="/generator"
                  className="
                    group
                    relative
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2.5
                    overflow-hidden
                    rounded-xl
                    bg-[var(--brand)]
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_8px_28px_rgba(99,102,241,0.22)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_34px_rgba(99,102,241,0.30)]
                    active:translate-y-0
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--brand)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--surface)]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-white/15
                      to-transparent
                      transition-transform
                      duration-700
                      group-hover:translate-x-full
                    "
                  />

                  <WandSparkles
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <span className="relative">Open the icon generator</span>

                  <ArrowRight
                    size={16}
                    className="
                      relative
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                    aria-hidden="true"
                  />
                </Link>

                {/* Secondary */}

                <Link
                  to="/inspect"
                  className="
                    group
                    inline-flex
                    min-h-12
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
                    shadow-[var(--shadow-xs)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[var(--border-brand)]
                    hover:bg-[var(--surface-brand)]
                    hover:text-[var(--brand)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--brand)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--surface)]
                  "
                >
                  Inspect a website
                  <ChevronRight
                    size={15}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>

              {/* =================================================
                  TRUST / REASSURANCE
                  ================================================= */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                "
              >
                <TrustItem
                  icon={<Lock size={11} aria-hidden="true" />}
                  label="Browser-first"
                />

                <span
                  aria-hidden="true"
                  className="
                    hidden
                    h-3
                    w-px
                    bg-[var(--border)]
                    sm:block
                  "
                />

                <TrustItem
                  icon={<FileImage size={11} aria-hidden="true" />}
                  label="No account required"
                />

                <span
                  aria-hidden="true"
                  className="
                    hidden
                    h-3
                    w-px
                    sm:block
                  "
                />

                <TrustItem icon={<ZapIcon />} label="Fast workflows" />
              </div>
            </div>

            {/* =================================================
                RIGHT VISUAL PANEL
                ================================================= */}

            <motion.div
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "visible"}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={visualVariants}
              className="
                relative
                border-t
                border-[var(--border)]
                bg-[var(--background)]
                lg:border-l
                lg:border-t-0
              "
            >
              {/* Visual background */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  opacity-[0.35]
                  [background-image:radial-gradient(var(--border)_1px,transparent_1px)]
                  [background-size:18px_18px]
                  [mask-image:linear-gradient(to_bottom,black,transparent)]
                "
              />

              <div
                className="
                  relative
                  flex
                  min-h-[460px]
                  flex-col
                  justify-center
                  p-6
                  sm:p-8
                  lg:min-h-full
                  lg:p-10
                  xl:p-12
                "
              >
                {/* =================================================
                    VISUAL HEADER
                    ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        font-mono
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-[var(--text-muted)]
                      "
                    >
                      Export pipeline
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-semibold
                        text-[var(--text)]
                      "
                    >
                      Production package
                    </p>
                  </div>

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[var(--border-brand)]
                      bg-[var(--surface-brand)]
                      px-2.5
                      py-1.5
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

                    <span
                      className="
                        font-mono
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[var(--brand)]
                      "
                    >
                      Ready
                    </span>
                  </div>
                </div>

                {/* =================================================
                    PACKAGE PREVIEW
                    ================================================= */}

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
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="
                    relative
                    mt-6
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-4
                    shadow-[var(--shadow-md)]
                    sm:p-5
                  "
                >
                  {/* Top package row */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[var(--border-brand)]
                          bg-[var(--surface-brand)]
                          text-[var(--brand)]
                        "
                      >
                        <Package
                          size={16}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-[11px]
                            font-semibold
                            text-[var(--text)]
                          "
                        >
                          icon-package.zip
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[9px]
                            text-[var(--text-muted)]
                          "
                        >
                          8 assets · production ready
                        </p>
                      </div>
                    </div>

                    <Download
                      size={14}
                      className="text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </div>

                  {/* =================================================
                      ICON PREVIEW
                      ================================================= */}

                  <div
                    className="
                      relative
                      mt-5
                      flex
                      h-36
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface-muted)]
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-0
                        opacity-40
                        [background-image:linear-gradient(45deg,var(--border)_25%,transparent_25%,transparent_75%,var(--border)_75%),linear-gradient(45deg,var(--border)_25%,transparent_25%,transparent_75%,var(--border)_75%)]
                        [background-position:0_0,8px_8px]
                        [background-size:16px_16px]
                      "
                    />

                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              rotate: [0, 2, -2, 0],
                              scale: [1, 1.025, 1],
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
                        flex
                        h-24
                        w-24
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[26%]
                        border
                        border-white/10
                        bg-[var(--brand)]
                        shadow-[0_16px_40px_rgba(99,102,241,0.28)]
                      "
                    >
                      <img
                        src={logo}
                        alt=""
                        aria-hidden="true"
                        className="
                          h-14
                          w-14
                          object-contain
                          brightness-0
                          invert
                        "
                      />

                      <div
                        aria-hidden="true"
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-br
                          from-white/15
                          via-transparent
                          to-transparent
                        "
                      />
                    </motion.div>
                  </div>

                  {/* =================================================
                      EXPORT ITEMS
                      ================================================= */}

                  <div className="mt-4 space-y-1.5">
                    {EXPORT_ITEMS.map((item, index) => (
                      <motion.div
                        key={item.size}
                        initial={
                          shouldReduceMotion
                            ? false
                            : {
                                opacity: 0,
                                x: 12,
                              }
                        }
                        whileInView={
                          shouldReduceMotion
                            ? undefined
                            : {
                                opacity: 1,
                                x: 0,
                              }
                        }
                        viewport={{
                          once: true,
                          amount: 0.5,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 + index * 0.06,
                        }}
                        className="
                          group/item
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-lg
                          border
                          border-[var(--border)]
                          bg-[var(--background)]
                          px-2.5
                          py-2
                          transition-colors
                          duration-200
                          hover:border-[var(--border-brand)]
                          hover:bg-[var(--surface-brand)]
                        "
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="
                              flex
                              h-6
                              w-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-md
                              bg-[var(--surface-brand)]
                              font-mono
                              text-[8px]
                              font-bold
                              text-[var(--brand)]
                            "
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="min-w-0">
                            <p
                              className="
                                font-mono
                                text-[9px]
                                font-semibold
                                text-[var(--text)]
                              "
                            >
                              {item.size}
                            </p>

                            <p
                              className="
                                truncate
                                text-[8px]
                                text-[var(--text-muted)]
                              "
                            >
                              {item.label}
                            </p>
                          </div>
                        </div>

                        <Check
                          size={12}
                          strokeWidth={2.5}
                          className="
                            shrink-0
                            text-[var(--brand)]
                            transition-transform
                            duration-200
                            group-hover/item:scale-110
                          "
                          aria-hidden="true"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* =================================================
                      PACKAGE FOOTER
                      ================================================= */}

                  <div
                    className="
                      mt-3
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <PipelineStat
                      icon={<FileCode2 size={12} aria-hidden="true" />}
                      label="Code"
                      value="Ready"
                    />

                    <PipelineStat
                      icon={<Download size={12} aria-hidden="true" />}
                      label="Export"
                      value="ZIP"
                    />
                  </div>
                </motion.div>

                {/* =================================================
                    BOTTOM STATUS
                    ================================================= */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-xl
                    border
                    border-[var(--border-brand)]
                    bg-[var(--surface-brand)]
                    px-3
                    py-2.5
                  "
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Sparkles
                      size={13}
                      className="
                        shrink-0
                        text-[var(--brand)]
                      "
                      aria-hidden="true"
                    />

                    <span
                      className="
                        truncate
                        text-[9px]
                        font-medium
                        text-[var(--text-secondary)]
                      "
                    >
                      Everything is ready to ship.
                    </span>
                  </div>

                  <span
                    className="
                      shrink-0
                      font-mono
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-[var(--brand)]
                    "
                  >
                    Complete
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ========================================================
            BOTTOM REASSURANCE
            ======================================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 10,
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
            duration: 0.55,
            delay: 0.15,
          }}
          className="
            mx-auto
            mt-7
            flex
            max-w-3xl
            flex-col
            items-center
            justify-center
            gap-2
            text-center
            sm:flex-row
            sm:gap-3
          "
        >
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              font-medium
              text-[var(--text-muted)]
            "
          >
            <Lock size={11} aria-hidden="true" />
            No signup required
          </span>

          <span
            aria-hidden="true"
            className="
              hidden
              h-3
              w-px
              bg-[var(--border)]
              sm:block
            "
          />

          <span
            className="
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              font-medium
              text-[var(--text-muted)]
            "
          >
            <FileImage size={11} aria-hidden="true" />
            Browser-first workflows
          </span>

          <span
            aria-hidden="true"
            className="
              hidden
              h-3
              w-px
              bg-[var(--border)]
              sm:block
            "
          />

          <span
            className="
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              font-medium
              text-[var(--text-muted)]
            "
          >
            <Package size={11} aria-hidden="true" />
            Ready-to-ship exports
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   TRUST ITEM
   ============================================================ */

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        text-[10px]
        font-medium
        text-[var(--text-muted)]
      "
    >
      <span
        className="
          text-[var(--text-subtle)]
        "
      >
        {icon}
      </span>

      {label}
    </span>
  );
}

/* ============================================================
   PIPELINE STAT
   ============================================================ */

function PipelineStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-2
        rounded-lg
        border
        border-[var(--border)]
        bg-[var(--background)]
        px-2.5
        py-2
      "
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[var(--text-muted)]">{icon}</span>

        <span
          className="
            text-[8px]
            font-medium
            text-[var(--text-muted)]
          "
        >
          {label}
        </span>
      </div>

      <span
        className="
          font-mono
          text-[8px]
          font-semibold
          text-[var(--brand)]
        "
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   SMALL ZAP ICON
   ============================================================ */

function ZapIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
