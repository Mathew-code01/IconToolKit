// src/pages/Home/AllToolsSection.tsx

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Code2,
  ImagePlus,
  Layers3,
  PackageCheck,
  ScanSearch,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================================
   TYPES
   ============================================================ */

type ToolGroup = {
  number: string;
  title: string;
  href: string;
  description: string;
  tools: string[];
  icon: typeof ImagePlus;
  featured?: boolean;
};

/* ============================================================
   DATA
   ============================================================ */

const toolGroups: ToolGroup[] = [
  {
    number: "01",
    title: "Create",
    href: "/create",
    description:
      "Generate production-ready digital assets for websites, products, apps, and platforms.",
    icon: ImagePlus,
    featured: true,
    tools: [
      "Favicon & Web Icons",
      "App Icons",
      "PWA Icons",
      "Social / OG Images",
    ],
  },
  {
    number: "02",
    title: "Edit",
    href: "/edit",
    description:
      "Make precise visual changes without leaving your asset workflow.",
    icon: Sparkles,
    tools: [
      "Remove Background",
      "Add / Change Background",
      "Crop",
      "Resize",
      "Rotate / Flip",
      "Rounded Corners",
      "Add Padding",
      "Image Editor",
    ],
  },
  {
    number: "03",
    title: "Convert",
    href: "/convert",
    description:
      "Move assets between modern formats for the job, platform, or browser at hand.",
    icon: Zap,
    tools: [
      "PNG → JPG",
      "JPG → PNG",
      "PNG / JPG → WebP",
      "WebP → PNG / JPG",
      "SVG → PNG",
      "Image → ICO",
      "Image → PDF",
      "PDF → Image",
    ],
  },
  {
    number: "04",
    title: "Optimize",
    href: "/optimize",
    description:
      "Reduce file weight and improve delivery efficiency without unnecessary quality loss.",
    icon: PackageCheck,
    tools: [
      "Compress Image",
      "Resize & Compress",
      "Convert + Compress",
      "Quality vs File Size",
    ],
  },
  {
    number: "05",
    title: "Inspect",
    href: "/inspect",
    description:
      "Understand what is inside your assets and how websites expose their visual resources.",
    icon: ScanSearch,
    tools: [
      "Favicon Inspector",
      "Image Metadata",
      "Image Dimensions",
      "Color / Transparency",
      "Website Icon Checker",
      "PWA Icon Validator",
    ],
  },
  {
    number: "06",
    title: "Developer",
    href: "/developer",
    description:
      "Generate the implementation details needed to move from asset to production.",
    icon: Code2,
    featured: true,
    tools: [
      "HTML Favicon Generator",
      "manifest.json Generator",
      "<link> Tag Generator",
      "Framework Snippets",
      "ZIP Asset Pack",
    ],
  },
];

/* ============================================================
   MOTION
   ============================================================ */

const headerVariants = {
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

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function AllToolsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="all-tools"
      aria-labelledby="all-tools-heading"
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
          BACKGROUND SYSTEM
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
        {/* Ambient top glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.05, 1],
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
            left-[-14rem]
            top-[-18rem]
            h-[38rem]
            w-[38rem]
            rounded-full
            bg-[var(--brand)]/[0.035]
            blur-3xl
          "
        />

        {/* Ambient right glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -25, 0],
                  y: [0, 30, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            right-[-16rem]
            top-[35%]
            h-[34rem]
            w-[34rem]
            rounded-full
            bg-[var(--brand)]/[0.025]
            blur-3xl
          "
        />

        {/* Architectural grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.14]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:linear-gradient(to_bottom,black,transparent_78%)]
          "
        />

        {/* Top horizontal rule */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[var(--border)]
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
            SECTION HEADER
            ==================================================== */}

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={headerVariants}
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.7fr)]
            lg:items-end
            lg:gap-16
          "
        >
          {/* Main heading */}

          <div>
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
                <Layers3 size={11} strokeWidth={2} aria-hidden="true" />
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
                Complete toolkit
              </span>
            </div>

            <h2
              id="all-tools-heading"
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
              Everything you need
              <span className="block itk-gradient-text">
                to ship better assets.
              </span>
            </h2>
          </div>

          {/* Supporting information */}

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
              Explore the complete IconToolkit system. Start with a category,
              choose a focused workflow, and move between related tools without
              rebuilding your work from scratch.
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
              <MetaPoint label="6 workflows" />

              <MetaDivider />

              <MetaPoint label="Browser-first" />

              <MetaDivider />

              <MetaPoint label="Production-ready" />
            </div>
          </div>
        </motion.div>

        {/* ====================================================
            TOOL GROUP GRID
            ==================================================== */}

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            amount: 0.06,
          }}
          variants={gridVariants}
          className="
            mt-12
            grid
            gap-3
            sm:mt-14
            sm:grid-cols-2
            lg:grid-cols-12
          "
        >
          {toolGroups.map((group, index) => (
            <motion.div
              key={group.title}
              variants={cardVariants}
              className={
                group.featured
                  ? index === 0
                    ? "lg:col-span-7"
                    : "lg:col-span-7"
                  : index === 1
                    ? "lg:col-span-5"
                    : index === 2
                      ? "lg:col-span-4"
                      : index === 3
                        ? "lg:col-span-4"
                        : "lg:col-span-4"
              }
            >
              <ToolGroupCard
                group={group}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ====================================================
            SYSTEM FOOTER
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
            amount: 0.25,
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
            {/* Footer atmosphere */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-20
                -top-28
                h-64
                w-64
                rounded-full
                bg-[var(--brand)]/[0.04]
                blur-3xl
              "
            />

            {/* Status */}

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
                  shadow-[var(--shadow-xs)]
                "
              >
                <PackageCheck size={17} strokeWidth={1.8} aria-hidden="true" />
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
                  One toolkit. Multiple production workflows.
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
                  Create, edit, convert, optimize, inspect, and generate the
                  implementation code needed to ship your assets.
                </p>
              </div>
            </div>

            {/* Developer CTA */}

            <Link
              to="/developer"
              className="
                group
                relative
                inline-flex
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
                duration-300
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
              Developer tools
              <ArrowRight
                size={14}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
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
   TOOL GROUP CARD
   ============================================================ */

interface ToolGroupCardProps {
  group: ToolGroup;
  shouldReduceMotion: boolean;
}

function ToolGroupCard({ group, shouldReduceMotion }: ToolGroupCardProps) {
  const Icon = group.icon;

  return (
    <Link
      to={group.href}
      aria-label={`Explore ${group.title} tools`}
      className="group block h-full"
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
          ease: "easeOut",
        }}
        className={`
          relative
          flex
          h-full
          min-h-[275px]
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--background)]
          p-5
          shadow-[var(--shadow-xs)]
          transition-[border-color,box-shadow]
          duration-300
          group-hover:border-[var(--border-brand)]
          group-hover:shadow-[var(--shadow-lg)]
          sm:rounded-3xl
          sm:p-6
          ${group.featured ? "lg:min-h-[300px] lg:p-7" : "lg:min-h-[275px]"}
        `}
      >
        {/* ==================================================
            CARD BACKGROUND
            ================================================== */}

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
            group-hover:bg-[var(--brand)]/[0.075]
          "
        />

        {/* Architectural lines */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            h-full
            w-1/2
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:32px_32px]
            [mask-image:linear-gradient(to_left,black,transparent)]
          "
        />

        {/* ==================================================
            CONTENT
            ================================================== */}

        <div className="relative flex h-full flex-col">
          {/* Header */}

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
                transition={{
                  duration: 0.2,
                }}
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
                  duration-300
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
                      tracking-[0.12em]
                      text-[var(--text-subtle)]
                    "
                  >
                    {group.number}
                  </span>

                  {group.featured && (
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
                      Core workflow
                    </span>
                  )}
                </div>

                <h3
                  className="
                    mt-0.5
                    text-base
                    font-semibold
                    tracking-[-0.02em]
                    text-[var(--text)]
                    sm:text-lg
                  "
                >
                  {group.title}
                </h3>
              </div>
            </div>

            {/* Arrow */}

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
                duration-300
                group-hover:border-[var(--border-brand)]
                group-hover:bg-[var(--surface-brand)]
                group-hover:text-[var(--brand)]
              "
            >
              <ArrowRight
                size={14}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
                aria-hidden="true"
              />
            </span>
          </div>

          {/* Description */}

          <p
            className="
              relative
              mt-5
              max-w-xl
              text-xs
              leading-6
              text-[var(--text-secondary)]
              sm:text-sm
              sm:leading-6
            "
          >
            {group.description}
          </p>

          {/* Divider */}

          <div
            aria-hidden="true"
            className="
              relative
              my-5
              h-px
              w-full
              bg-[var(--border)]
            "
          />

          {/* Tools */}

          <div
            className="
              relative
              grid
              gap-x-5
              gap-y-2.5
              sm:grid-cols-2
            "
          >
            {group.tools.map((tool, index) => (
              <motion.div
                key={tool}
                initial={false}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                      }
                }
                transition={{
                  duration: 0.25,
                  delay: index * 0.015,
                }}
                className="
                  flex
                  min-w-0
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
                    rounded-md
                    bg-[var(--surface-muted)]
                    text-[var(--brand)]
                    transition-all
                    duration-200
                    group-hover:bg-[var(--surface-brand)]
                  "
                >
                  <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                </span>

                <span
                  className="
                    min-w-0
                    truncate
                    text-[11px]
                    font-medium
                    text-[var(--text-secondary)]
                    transition-colors
                    duration-200
                    group-hover:text-[var(--text)]
                    sm:text-xs
                  "
                >
                  {tool}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bottom action */}

          <div
            className="
              relative
              mt-auto
              flex
              items-center
              justify-between
              gap-3
              pt-7
            "
          >
            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[var(--text-muted)]
                transition-colors
                duration-200
                group-hover:text-[var(--brand)]
              "
            >
              Explore workflow
            </span>

            <span
              className="
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
              {group.tools.length} tools
              <ArrowRight
                size={11}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
                aria-hidden="true"
              />
            </span>
          </div>
        </div>

        {/* ==================================================
            ACTIVE EDGE
            ================================================== */}

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
            pointer-events-none
            absolute
            bottom-0
            right-0
            h-16
            w-16
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
        >
          <div
            className="
              absolute
              bottom-3
              right-3
              h-1
              w-1
              rounded-full
              bg-[var(--brand)]
              shadow-[0_0_0_4px_var(--surface-brand)]
            "
          />
        </div>
      </motion.article>
    </Link>
  );
}

/* ============================================================
   META POINT
   ============================================================ */

function MetaPoint({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="
          flex
          h-4
          w-4
          items-center
          justify-center
          rounded-full
          bg-[var(--surface-brand)]
          text-[var(--brand)]
        "
      >
        <Check size={9} strokeWidth={2.5} aria-hidden="true" />
      </span>

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
   META DIVIDER
   ============================================================ */

function MetaDivider() {
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
