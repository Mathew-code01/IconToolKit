// src/pages/Home/PopularToolsSection.tsx

// src/pages/Home/PopularToolsSection.tsx
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Crop,
  FileImage,
  Gauge,
  ImageOff,
  ScanSearch,
  Sparkles,

} from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

/* ============================================================
   TYPES
   ============================================================ */

type Tool = {
  rank: string;
  title: string;
  description: string;
  eyebrow: string;
  href: string;
  icon: typeof FileImage;
  featured?: boolean;
  capabilities: string[];
};

/* ============================================================
   DATA
   ============================================================ */

const tools: Tool[] = [
  {
    rank: "01",
    title: "Favicon Generator",
    eyebrow: "Create",
    description:
      "Turn one image into a complete favicon system for websites, browsers, devices, and modern app surfaces.",
    href: "/generator",
    icon: FileImage,
    featured: true,
    capabilities: ["ICO", "PNG", "Apple Touch", "Manifest"],
  },
  {
    rank: "02",
    title: "Background Remover",
    eyebrow: "Edit",
    description:
      "Remove unwanted backgrounds and prepare clean transparent artwork for production use.",
    href: "/edit",
    icon: ImageOff,
    capabilities: ["Transparency", "Clean edges", "PNG export"],
  },
  {
    rank: "03",
    title: "Image Converter",
    eyebrow: "Convert",
    description:
      "Convert assets between the formats your websites, products, and platforms actually need.",
    href: "/convert",
    icon: FileImage,
    capabilities: ["PNG", "JPG", "WebP", "SVG", "ICO"],
  },
  {
    rank: "04",
    title: "Image Compressor",
    eyebrow: "Optimize",
    description:
      "Reduce unnecessary file weight while preserving the visual quality your assets deserve.",
    href: "/optimize",
    icon: Gauge,
    capabilities: ["Compression", "Quality control", "Smaller files"],
  },
  {
    rank: "05",
    title: "Favicon Inspector",
    eyebrow: "Inspect",
    description:
      "Discover favicon resources, metadata, and icon variations currently exposed by a website.",
    href: "/inspect",
    icon: ScanSearch,
    capabilities: ["Website scan", "Metadata", "Icon discovery"],
  },
  {
    rank: "06",
    title: "Image Cropper",
    eyebrow: "Edit",
    description:
      "Frame artwork to exact dimensions and proportions without leaving your asset workflow.",
    href: "/edit",
    icon: Crop,
    capabilities: ["Aspect ratios", "Custom dimensions", "Fast export"],
  },
];

/* ============================================================
   MOTION
   ============================================================ */

const viewport = {
  once: true,
  amount: 0.15,
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function PopularToolsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="popular-tools"
      aria-labelledby="popular-tools-heading"
      className="
        relative
        isolate
        overflow-hidden
        border-b
        border-[var(--border)]
        bg-[var(--surface-muted)]
      "
    >
      {/* ======================================================
          ATMOSPHERIC BACKGROUND
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
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 28, 0],
                  y: [0, -18, 0],
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
            -left-48
            -top-48
            h-[34rem]
            w-[34rem]
            rounded-full
            bg-[var(--brand)]/[0.045]
            blur-3xl
          "
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -24, 0],
                  y: [0, 20, 0],
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
            -right-52
            top-[28%]
            h-[32rem]
            w-[32rem]
            rounded-full
            bg-[var(--brand)]/[0.03]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.13]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:80px_80px]
            [mask-image:linear-gradient(to_bottom,black,transparent_82%)]
          "
        />

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[var(--brand)]/20
            to-transparent
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
          lg:py-28
          xl:px-10
        "
      >
        {/* ====================================================
            HEADER
            ==================================================== */}

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={viewport}
          variants={headerVariants}
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.68fr)]
            lg:items-end
            lg:gap-16
          "
        >
          <div>
            {/* Brand signal */}

            <div
              className="
                inline-flex
                items-center
                gap-2.5
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
                  overflow-hidden
                  rounded-md
                  bg-[var(--surface-brand)]
                "
              >
                <img
                  src={logo}
                  alt=""
                  className="h-3.5 w-3.5 object-contain"
                  aria-hidden="true"
                />
              </span>

              <Sparkles
                size={11}
                strokeWidth={2}
                className="text-[var(--brand)]"
                aria-hidden="true"
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.11em]
                  text-[var(--text-muted)]
                "
              >
                Popular tools
              </span>
            </div>

            <h2
              id="popular-tools-heading"
              className="
                mt-6
                max-w-4xl
                text-[2.35rem]
                font-bold
                leading-[1.03]
                tracking-[-0.055em]
                text-[var(--text)]
                sm:text-5xl
                lg:text-[3.65rem]
                xl:text-[4rem]
              "
            >
              Start with the tool
              <span className="block itk-gradient-text">
                you need right now.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p
              className="
                max-w-xl
                text-sm
                leading-7
                text-[var(--text-secondary)]
                sm:text-base
                sm:leading-8
              "
            >
              Skip the setup and jump directly into a focused workflow.
              IconToolkit keeps everyday asset jobs close at hand while giving
              you the control to take each result all the way to production.
            </p>

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
              <TrustPoint label="Fast workflows" />
              <Divider />
              <TrustPoint label="Browser-first" />
              <Divider />
              <TrustPoint label="Production-ready" />
            </div>
          </div>
        </motion.div>

        {/* ====================================================
            TOOL GRID
            ==================================================== */}

        <motion.div
          variants={gridVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="
            mt-12
            grid
            gap-3
            sm:mt-14
            sm:grid-cols-2
            lg:grid-cols-12
          "
        >
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              variants={cardVariants}
              className={
                tool.featured
                  ? "sm:col-span-2 lg:col-span-7"
                  : index === 1
                    ? "lg:col-span-5"
                    : "lg:col-span-4"
              }
            >
              <PopularToolCard
                tool={tool}
                featured={Boolean(tool.featured)}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ====================================================
            TOOLKIT CTA
            ==================================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
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
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          className="
            relative
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
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-28
              -top-32
              h-72
              w-72
              rounded-full
              bg-[var(--brand)]/[0.055]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[var(--brand)]/30
              to-transparent
            "
            aria-hidden="true"
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              p-5
              sm:p-6
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-7
              lg:py-6
            "
          >
            <div className="flex items-start gap-3.5">
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: [0, -4, 4, 0],
                        scale: [1, 1.02, 1],
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
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface-muted)]
                  shadow-[var(--shadow-xs)]
                "
              >
                <img
                  src={logo}
                  alt=""
                  className="h-6 w-6 object-contain"
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
                  Looking for something more specific?
                </p>

                <p
                  className="
                    mt-1
                    max-w-2xl
                    text-[11px]
                    leading-5
                    text-[var(--text-muted)]
                    sm:text-xs
                    sm:leading-6
                  "
                >
                  Explore the complete toolkit for creating, editing,
                  converting, optimizing, inspecting, and shipping digital
                  assets.
                </p>
              </div>
            </div>

            <Link
              to="/tools"
              className="
                group
                inline-flex
                min-h-10
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                px-4
                py-2.5
                text-xs
                font-semibold
                text-[var(--text-secondary)]
                shadow-[var(--shadow-xs)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[var(--border-brand)]
                hover:bg-[var(--surface-brand)]
                hover:text-[var(--brand)]
                hover:shadow-[var(--shadow-sm)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[var(--surface)]
              "
            >
              Explore all tools
              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   TOOL CARD
   ============================================================ */

interface PopularToolCardProps {
  tool: Tool;
  featured: boolean;
  shouldReduceMotion: boolean;
}

function PopularToolCard({
  tool,
  featured,
  shouldReduceMotion,
}: PopularToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.href}
      aria-label={`Open ${tool.title}`}
      className="
        group
        block
        h-full
        rounded-2xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--surface-muted)]
        sm:rounded-3xl
      "
    >
      <motion.article
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -5,
              }
        }
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          relative
          flex
          h-full
          min-h-[250px]
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--background)]
          p-5
          shadow-[var(--shadow-xs)]
          transition-[border-color,box-shadow,background-color]
          duration-300
          group-hover:border-[var(--border-brand)]
          group-hover:shadow-[var(--shadow-lg)]
          sm:rounded-3xl
          sm:p-6
          ${featured ? "lg:min-h-[315px] lg:p-7" : ""}
        `}
      >
        {/* Ambient glow */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-56
            w-56
            rounded-full
            bg-[var(--brand)]/[0.025]
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-[var(--brand)]/[0.085]
          "
        />

        {/* Featured visual */}

        {featured && (
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-[-4rem]
              right-[-1rem]
              h-72
              w-80
              opacity-70
            "
          >
            <div
              className="
                absolute
                bottom-10
                right-4
                h-36
                w-36
                rotate-12
                rounded-[2rem]
                border
                border-[var(--border-brand)]
                bg-[var(--surface)]/[0.45]
                transition-transform
                duration-500
                group-hover:rotate-[18deg]
              "
            />

            <div
              className="
                absolute
                bottom-16
                right-24
                h-36
                w-36
                -rotate-6
                rounded-[2rem]
                border
                border-[var(--border)]
                bg-[var(--surface-muted)]/[0.75]
                transition-transform
                duration-500
                group-hover:-rotate-12
              "
            />

            <div
              className="
                absolute
                bottom-28
                right-44
                h-24
                w-24
                rotate-3
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--background)]/[0.85]
                transition-transform
                duration-500
                group-hover:rotate-6
              "
            />

            <div
              className="
                absolute
                bottom-24
                right-12
                h-14
                w-14
                rounded-2xl
                border
                border-[var(--border-brand)]
                bg-[var(--surface-brand)]
                p-3
                opacity-70
              "
            >
              <img
                src={logo}
                alt=""
                className="h-full w-full object-contain"
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        <div className="relative flex h-full flex-col">
          {/* Top row */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.span
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.06,
                        rotate: -3,
                      }
                }
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface-muted)]
                  text-[var(--text-secondary)]
                  transition-all
                  duration-200
                  group-hover:border-[var(--border-brand)]
                  group-hover:bg-[var(--surface-brand)]
                  group-hover:text-[var(--brand)]
                "
              >
                <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
              </motion.span>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="
                      font-mono
                      text-[9px]
                      font-medium
                      tracking-[0.1em]
                      text-[var(--text-subtle)]
                    "
                  >
                    {tool.rank}
                  </span>

                  {featured && (
                    <span
                      className="
                        rounded-md
                        border
                        border-[var(--border-brand)]
                        bg-[var(--surface-brand)]
                        px-1.5
                        py-0.5
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[var(--brand)]
                      "
                    >
                      Featured
                    </span>
                  )}
                </div>

                <span
                  className="
                    mt-0.5
                    block
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--text-muted)]
                  "
                >
                  {tool.eyebrow}
                </span>
              </div>
            </div>

            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--border)]
                text-[var(--text-subtle)]
                transition-all
                duration-200
                group-hover:border-[var(--border-brand)]
                group-hover:bg-[var(--surface-brand)]
                group-hover:text-[var(--brand)]
              "
            >
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
                aria-hidden="true"
              />
            </span>
          </div>

          {/* Main content */}

          <div className="relative mt-7 max-w-2xl">
            <h3
              className={`
                font-semibold
                tracking-[-0.035em]
                text-[var(--text)]
                ${featured ? "text-2xl sm:text-3xl" : "text-xl"}
              `}
            >
              {tool.title}
            </h3>

            <p
              className={`
                mt-2
                text-[var(--text-secondary)]
                ${featured ? "text-sm leading-6 sm:text-base sm:leading-7" : "text-sm leading-6"}
              `}
            >
              {tool.description}
            </p>
          </div>

          {/* Bottom content */}

          <div className="relative mt-auto pt-7">
            <div className="flex flex-wrap gap-1.5">
              {tool.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-[var(--surface-muted)]
                    px-2.5
                    py-1.5
                    text-[9px]
                    font-medium
                    text-[var(--text-muted)]
                    transition-all
                    duration-200
                    group-hover:border-[var(--border-brand)]/60
                  "
                >
                  <Check
                    size={9}
                    strokeWidth={2.4}
                    className="text-[var(--brand)]"
                    aria-hidden="true"
                  />

                  {capability}
                </span>
              ))}
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                gap-1.5
                text-[10px]
                font-semibold
                text-[var(--text-muted)]
                transition-colors
                duration-200
                group-hover:text-[var(--brand)]
              "
            >
              Open {tool.title}
              <ArrowRight
                size={12}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Active edge */}

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
      </motion.article>
    </Link>
  );
}

/* ============================================================
   TRUST POINT
   ============================================================ */

function TrustPoint({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-[var(--success)]
        "
      />

      <span
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.07em]
          text-[var(--text-muted)]
        "
      >
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   DIVIDER
   ============================================================ */

function Divider() {
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