// src/pages/Home/ToolCategoriesSection.tsx

// src/pages/Home/ToolCategoriesSection.tsx

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  FileOutput,
  ImagePlus,
  Layers3,
  ScanSearch,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    number: "01",
    title: "Create",
    eyebrow: "Build from scratch",
    description:
      "Turn artwork into production-ready icons, favicons, app assets, PWA resources, social graphics, and more.",
    href: "/create",
    icon: ImagePlus,
    tools: ["Favicons", "App icons", "PWA assets", "Social graphics"],
    featured: true,
  },
  {
    number: "02",
    title: "Edit",
    eyebrow: "Refine & transform",
    description:
      "Make precise changes to images and digital assets without leaving your browser.",
    href: "/edit",
    icon: Sparkles,
    tools: ["Image editor", "Crop & resize", "Background tools", "Transform"],
  },
  {
    number: "03",
    title: "Convert",
    eyebrow: "Move between formats",
    description:
      "Convert assets between the formats your products and platforms actually need.",
    href: "/convert",
    icon: FileOutput,
    tools: ["PNG / JPG", "WebP", "SVG", "ICO"],
  },
  {
    number: "04",
    title: "Optimize",
    eyebrow: "Make files lighter",
    description:
      "Reduce unnecessary file weight while preserving the quality your users actually see.",
    href: "/optimize",
    icon: Layers3,
    tools: ["Compression", "Resize", "Quality", "Batch workflows"],
  },
  {
    number: "05",
    title: "Inspect",
    eyebrow: "Understand what ships",
    description:
      "Inspect assets, metadata, dimensions, favicons, and the files powering real websites.",
    href: "/inspect",
    icon: ScanSearch,
    tools: ["Favicon inspector", "Metadata", "Dimensions", "Website analysis"],
  },
  {
    number: "06",
    title: "Developer",
    eyebrow: "Ship with confidence",
    description:
      "Turn finished assets into implementation-ready code, manifests, snippets, and packages.",
    href: "/developer",
    icon: Code2,
    tools: [
      "HTML snippets",
      "manifest.json",
      "Framework exports",
      "Asset packages",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ToolCategoriesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="tools"
      aria-labelledby="toolkit-heading"
      className="
        relative
        isolate
        overflow-hidden
        border-b
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      {/* =====================================================
          Background atmosphere
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Main atmospheric light */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 45, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.06, 1],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            left-[15%]
            top-[-18rem]
            h-[38rem]
            w-[38rem]
            rounded-full
            bg-[var(--brand)]/[0.045]
            blur-3xl
          "
        />

        {/* Secondary atmosphere */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -35, 0],
                  y: [0, 25, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 17,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="
            absolute
            right-[-14rem]
            top-[28%]
            h-[32rem]
            w-[32rem]
            rounded-full
            bg-[var(--brand-accent)]/[0.025]
            blur-3xl
          "
        />

        {/* Very subtle grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.22]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:linear-gradient(to_bottom,black,transparent_80%)]
          "
        />
      </div>

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
        {/* =====================================================
            Section introduction
            ===================================================== */}

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.35 }}
          variants={itemVariants}
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]
            lg:items-end
            lg:gap-16
          "
        >
          {/* Left */}
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]/80
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
                <Wrench size={11} strokeWidth={2} aria-hidden="true" />
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
                The workspace
              </span>
            </div>

            <h2
              id="toolkit-heading"
              className="
                mt-6
                max-w-3xl
                text-[2.35rem]
                font-bold
                leading-[1.02]
                tracking-[-0.055em]
                text-[var(--text)]
                sm:text-5xl
                lg:text-[3.75rem]
                xl:text-[4.25rem]
              "
            >
              Everything your
              <span className="block itk-gradient-text">
                digital assets need.
              </span>
            </h2>
          </div>

          {/* Right */}
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
              IconToolkit is more than an icon utility. It is a browser-first
              workspace for creating, editing, converting, optimizing,
              inspecting, and shipping the assets behind modern digital
              products.
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
              {[
                "Browser-first",
                "Private by default",
                "Developer-ready",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                >
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="
                        mr-2
                        hidden
                        h-1
                        w-1
                        rounded-full
                        bg-[var(--border-strong)]
                        sm:block
                      "
                    />
                  )}

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
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]
                      text-[var(--text-muted)]
                    "
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            Workflow architecture
            ===================================================== */}

        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.08 }}
          className="
            mt-14
            grid
            gap-3
            sm:mt-16
            lg:grid-cols-12
          "
        >
          {/* =================================================
              Featured CREATE card
              ================================================= */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-7"
          >
            <WorkflowCard
              category={categories[0]}
              featured
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          </motion.div>

          {/* =================================================
              EDIT
              ================================================= */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-5"
          >
            <WorkflowCard
              category={categories[1]}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          </motion.div>

          {/* =================================================
              CONVERT
              ================================================= */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-4"
          >
            <WorkflowCard
              category={categories[2]}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          </motion.div>

          {/* =================================================
              OPTIMIZE
              ================================================= */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-4"
          >
            <WorkflowCard
              category={categories[3]}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          </motion.div>

          {/* =================================================
              INSPECT
              ================================================= */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-4"
          >
            <WorkflowCard
              category={categories[4]}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          </motion.div>

          {/* =================================================
              DEVELOPER
              ================================================= */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-12"
          >
            <DeveloperCard
              category={categories[5]}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          </motion.div>
        </motion.div>

        {/* =====================================================
            Workflow statement
            ===================================================== */}

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface-subtle)]
            sm:mt-6
            sm:rounded-3xl
          "
        >
          <div
            className="
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
                  bg-[var(--surface)]
                  text-[var(--brand)]
                  shadow-[var(--shadow-xs)]
                "
              >
                <Zap size={16} strokeWidth={1.8} />
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
                  One workflow. From source to shipped asset.
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
                  Start with almost anything, refine it, prepare the right
                  formats, inspect the result, and ship without jumping
                  between disconnected tools.
                </p>
              </div>
            </div>

            <Link
              to="/tools"
              className="
                group
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-4
                py-2.5
                text-xs
                font-semibold
                text-[var(--text-secondary)]
                shadow-[var(--shadow-xs)]
                transition-all
                duration-200
                hover:border-[var(--border-brand)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--brand)]
                hover:shadow-[var(--shadow-sm)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
              "
            >
              Explore all tools

              <ArrowUpRight
                size={14}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   WORKFLOW CARD
   ============================================================ */

interface WorkflowCardProps {
  category: (typeof categories)[number];
  featured?: boolean;
  shouldReduceMotion: boolean;
}

function WorkflowCard({
  category,
  featured = false,
  shouldReduceMotion,
}: WorkflowCardProps) {
  const Icon = category.icon;

  return (
    <Link
      to={category.href}
      aria-label={`Explore ${category.title}`}
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
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          relative
          flex
          h-full
          min-h-[270px]
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
          group-hover:border-[var(--border-brand)]
          group-hover:shadow-[var(--shadow-lg)]
          sm:rounded-3xl
          sm:p-6
          ${featured ? "lg:min-h-[365px] lg:p-7" : ""}
        `}
      >
        {/* Card glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[var(--brand)]/[0.045]
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-[var(--brand)]/[0.10]
          "
        />

        {/* Featured visual lines */}
        {featured && (
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              right-0
              h-48
              w-72
              opacity-60
            "
          >
            <div className="absolute bottom-8 right-8 h-28 w-28 rounded-2xl border border-[var(--border-brand)] rotate-12 transition-transform duration-500 group-hover:rotate-[18deg]" />

            <div className="absolute bottom-14 right-20 h-28 w-28 rounded-2xl border border-[var(--border)] rotate-[-8deg] bg-[var(--surface-subtle)]/60 transition-transform duration-500 group-hover:rotate-[-14deg]" />

            <div className="absolute bottom-20 right-32 h-24 w-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 rotate-[4deg] transition-transform duration-500 group-hover:rotate-[8deg]" />
          </div>
        )}

        <div className="relative flex h-full flex-col">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.span
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: -4,
                        scale: 1.05,
                      }
                }
                className="
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
                  transition-all
                  duration-200
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
              </motion.span>

              <div>
                <span
                  className="
                    block
                    font-mono
                    text-[9px]
                    font-medium
                    tracking-[0.1em]
                    text-[var(--text-subtle)]
                  "
                >
                  {category.number}
                </span>

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
                  {category.eyebrow}
                </span>
              </div>
            </div>

            <span
              className="
                flex
                h-8
                w-8
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
                className="
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </span>
          </div>

          {/* Main content */}
          <div className="relative mt-7">
            <h3
              className={`
                font-semibold
                tracking-[-0.035em]
                text-[var(--text)]
                ${featured ? "text-2xl sm:text-3xl" : "text-xl"}
              `}
            >
              {category.title}
            </h3>

            <p
              className={`
                mt-2
                max-w-lg
                leading-6
                text-[var(--text-secondary)]
                ${featured ? "text-sm sm:text-base sm:leading-7" : "text-sm"}
              `}
            >
              {category.description}
            </p>
          </div>

          {/* Bottom */}
          <div className="relative mt-auto pt-8">
            <div className="flex flex-wrap gap-1.5">
              {category.tools.map((tool) => (
                <span
                  key={tool}
                  className="
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-[var(--surface-subtle)]
                    px-2.5
                    py-1.5
                    text-[9px]
                    font-medium
                    text-[var(--text-muted)]
                    transition-colors
                    duration-200
                    group-hover:border-[var(--border-subtle)]
                  "
                >
                  {tool}
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
              Explore {category.title}

              <ArrowUpRight
                size={12}
                className="
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

/* ============================================================
   DEVELOPER CARD
   ============================================================ */

interface DeveloperCardProps {
  category: (typeof categories)[number];
  shouldReduceMotion: boolean;
}

function DeveloperCard({
  category,
  shouldReduceMotion,
}: DeveloperCardProps) {
  const Icon = category.icon;

  return (
    <Link
      to={category.href}
      aria-label={`Explore ${category.title}`}
      className="group block"
    >
      <motion.article
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -4,
              }
        }
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          p-5
          shadow-[var(--shadow-xs)]
          transition-[border-color,box-shadow]
          duration-300
          group-hover:border-[var(--border-brand)]
          group-hover:shadow-[var(--shadow-lg)]
          sm:rounded-3xl
          sm:p-6
          lg:p-7
        "
      >
        {/* Developer atmosphere */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            w-1/2
            bg-[var(--brand-gradient-soft)]
            opacity-60
            [mask-image:linear-gradient(to_right,transparent,black)]
          "
        />

        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)] lg:items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3">
              <motion.span
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: -4,
                        scale: 1.05,
                      }
                }
                className="
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
                  transition-all
                  duration-200
                  group-hover:border-[var(--border-brand)]
                  group-hover:bg-[var(--surface-brand)]
                  group-hover:text-[var(--brand)]
                "
              >
                <Icon size={19} strokeWidth={1.7} />
              </motion.span>

              <div>
                <span
                  className="
                    block
                    font-mono
                    text-[9px]
                    font-medium
                    tracking-[0.1em]
                    text-[var(--text-subtle)]
                  "
                >
                  {category.number}
                </span>

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
                  {category.eyebrow}
                </span>
              </div>
            </div>

            <h3
              className="
                mt-6
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-[var(--text)]
                sm:text-3xl
              "
            >
              {category.title}
            </h3>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-[var(--text-secondary)]
                sm:text-base
                sm:leading-7
              "
            >
              {category.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {category.tools.map((tool) => (
                <span
                  key={tool}
                  className="
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-[var(--surface-subtle)]
                    px-2.5
                    py-1.5
                    text-[9px]
                    font-medium
                    text-[var(--text-muted)]
                  "
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Code preview */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--editor-workspace)]
              shadow-[var(--shadow-md)]
            "
          >
            <div
              className="
                flex
                h-9
                items-center
                justify-between
                border-b
                border-[var(--border)]
                bg-[var(--surface-subtle)]
                px-3
              "
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
              </div>

              <span
                className="
                  font-mono
                  text-[8px]
                  text-[var(--text-subtle)]
                "
              >
                production-ready
              </span>
            </div>

            <div className="space-y-3 p-4">
              <CodeLine width="65%" />
              <CodeLine width="82%" />
              <CodeLine width="48%" />
              <CodeLine width="72%" />
              <CodeLine width="56%" />
            </div>

            <div
              className="
                absolute
                bottom-0
                left-0
                h-px
                w-1/2
                bg-[var(--brand)]
                opacity-50
                transition-all
                duration-500
                group-hover:w-full
              "
            />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

/* ============================================================
   CODE PREVIEW LINE
   ============================================================ */

function CodeLine({ width }: { width: string }) {
  return (
    <div
      className="
        h-1.5
        overflow-hidden
        rounded-full
        bg-[var(--border)]
      "
      style={{ width }}
    >
      <div className="h-full w-1/3 rounded-full bg-[var(--brand)] opacity-30" />
    </div>
  );
}