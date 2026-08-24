// src/pages/Home/WorkflowSection.tsx

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Download,
  Edit3,
  Eye,
  FileImage,
  Sparkles,
  Upload,
} from "lucide-react";

import logo from "../../assets/logo.png";

/* ============================================================
   TYPES
   ============================================================ */

type WorkflowStep = {
  number: string;
  title: string;
  description: string;
  icon: typeof Upload;
  label: string;
};

/* ============================================================
   DATA
   ============================================================ */

const steps: WorkflowStep[] = [
  {
    number: "01",
    title: "Upload",
    label: "Input",
    description:
      "Start with a logo, image, favicon, or existing digital asset.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Edit",
    label: "Prepare",
    description:
      "Crop, resize, pad, recolor, remove backgrounds, or refine the asset.",
    icon: Edit3,
  },
  {
    number: "03",
    title: "Generate",
    label: "Build",
    description:
      "Create the sizes, variants, formats, and outputs your project requires.",
    icon: FileImage,
  },
  {
    number: "04",
    title: "Inspect",
    label: "Validate",
    description:
      "Preview the result and verify dimensions, formats, metadata, and details.",
    icon: Eye,
  },
  {
    number: "05",
    title: "Export",
    label: "Ship",
    description:
      "Download polished assets and developer-ready output for your project.",
    icon: Download,
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
    y: 22,
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

const stepVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function WorkflowSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
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
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.04, 1],
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
            -left-56
            top-[-10rem]
            h-[32rem]
            w-[32rem]
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
                  x: [0, -25, 0],
                  y: [0, 22, 0],
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
            -right-56
            top-[38%]
            h-[30rem]
            w-[30rem]
            rounded-full
            bg-[var(--brand)]/[0.025]
            blur-3xl
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

        <div
          className="
            absolute
            inset-0
            opacity-[0.1]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:96px_96px]
            [mask-image:linear-gradient(to_bottom,black,transparent_78%)]
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
          className="mx-auto max-w-3xl text-center"
        >
          {/* Brand marker */}

          <div
            className="
              mx-auto
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
              One continuous workflow
            </span>
          </div>

          <h2
            id="workflow-heading"
            className="
              mt-6
              text-[2.35rem]
              font-bold
              leading-[1.04]
              tracking-[-0.055em]
              text-[var(--text)]
              sm:text-5xl
              lg:text-[3.65rem]
            "
          >
            From image to
            <span className="block itk-gradient-text">
              production-ready asset.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-[var(--text-secondary)]
              sm:text-base
              sm:leading-8
            "
          >
            Your tools are separate when you need precision, but connected when
            you want speed. Move through the entire asset lifecycle without
            breaking your flow.
          </p>
        </motion.div>

        {/* ====================================================
            WORKFLOW PIPELINE
            ==================================================== */}

        <div className="relative mt-14 sm:mt-16 lg:mt-20">
          {/* Desktop connecting rail */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-[10%]
              right-[10%]
              top-[4.5rem]
              hidden
              h-px
              lg:block
            "
          >
            <div className="absolute inset-0 bg-[var(--border)]" />

            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      scaleX: 0,
                    }
              }
              whileInView={
                shouldReduceMotion
                  ? undefined
                  : {
                      scaleX: 1,
                    }
              }
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 1.2,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
              style={{
                transformOrigin: "left center",
              }}
              className="
                absolute
                inset-0
                bg-[var(--brand)]/35
              "
            />
          </div>

          {/* Steps */}

          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              amount: 0.08,
            }}
            className="
              grid
              gap-3
              lg:grid-cols-5
              lg:gap-4
            "
          >
            {steps.map((step, index) => (
              <WorkflowStepCard
                key={step.number}
                step={step}
                index={index}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
              />
            ))}
          </motion.div>
        </div>

        {/* ====================================================
            BRAND / OUTCOME PANEL
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
            amount: 0.25,
          }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          className="
            relative
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface-muted)]
            shadow-[var(--shadow-xs)]
            sm:mt-8
            sm:rounded-3xl
          "
        >
          {/* Panel glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-56
              w-56
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
              -bottom-32
              -right-20
              h-64
              w-64
              rounded-full
              bg-[var(--brand)]/[0.035]
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-7
              p-5
              sm:p-7
              lg:flex-row
              lg:items-center
              lg:gap-10
              lg:px-8
              lg:py-7
            "
          >
            {/* Brand visual */}

            <div className="flex shrink-0 items-center gap-4">
              <motion.div
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: -3,
                        scale: 1.04,
                      }
                }
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--border-brand)]
                  bg-[var(--surface)]
                  p-3
                  shadow-[var(--shadow-sm)]
                "
              >
                <img
                  src={logo}
                  alt="IconToolkit"
                  className="h-full w-full object-contain"
                />
              </motion.div>

              <div className="lg:hidden">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-[var(--brand)]
                  "
                >
                  The result
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-[var(--text)]
                  "
                >
                  Ready to ship.
                </p>
              </div>
            </div>

            {/* Copy */}

            <div className="min-w-0 flex-1">
              <div className="hidden lg:block">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-[var(--brand)]
                  "
                >
                  The result
                </p>

                <h3
                  className="
                    mt-1.5
                    text-xl
                    font-semibold
                    tracking-[-0.035em]
                    text-[var(--text)]
                  "
                >
                  A cleaner path from idea to shipped asset.
                </h3>
              </div>

              <p
                className="
                  text-xs
                  leading-6
                  text-[var(--text-secondary)]
                  sm:text-sm
                  sm:leading-7
                "
              >
                No unnecessary handoffs. No scattered utilities. Just a focused
                workflow designed around the way digital assets are actually
                created and shipped.
              </p>
            </div>

            {/* Outcome indicators */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-4
                lg:w-auto
                lg:min-w-[390px]
              "
            >
              <Outcome label="Create" />
              <Outcome label="Refine" />
              <Outcome label="Validate" />
              <Outcome label="Ship" />
            </div>
          </div>
        </motion.div>

        {/* ====================================================
            MOBILE / FLOW NOTE
            ==================================================== */}

        <div
          className="
            mt-7
            flex
            items-center
            justify-center
            gap-2
            text-center
            lg:hidden
          "
        >
          <span
            aria-hidden="true"
            className="
              h-1
              w-1
              rounded-full
              bg-[var(--brand)]
            "
          />

          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[var(--text-muted)]
            "
          >
            A simple five-step production flow
          </span>

          <span
            aria-hidden="true"
            className="
              h-1
              w-1
              rounded-full
              bg-[var(--brand)]
            "
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   WORKFLOW STEP CARD
   ============================================================ */

interface WorkflowStepCardProps {
  step: WorkflowStep;
  index: number;
  shouldReduceMotion: boolean;
}

function WorkflowStepCard({
  step,
  index,
  shouldReduceMotion,
}: WorkflowStepCardProps) {
  const Icon = step.icon;
  const isLast = index === steps.length - 1;

  return (
    <motion.div
      variants={stepVariants}
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
      className="
        relative
        lg:h-full
      "
    >
      <div
        className="
          group
          relative
          flex
          min-h-[220px]
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
          hover:border-[var(--border-brand)]
          hover:shadow-[var(--shadow-lg)]
          sm:min-h-[235px]
          sm:p-6
          lg:min-h-[300px]
          lg:rounded-3xl
        "
      >
        {/* Card glow */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-[var(--brand)]/[0.02]
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-[var(--brand)]/[0.07]
          "
        />

        {/* Step header */}

        <div className="relative flex items-center justify-between">
          <span
            className="
              font-mono
              text-[10px]
              font-semibold
              tracking-[0.14em]
              text-[var(--brand)]
            "
          >
            {step.number}
          </span>

          <span
            className="
              rounded-md
              border
              border-[var(--border)]
              bg-[var(--surface-muted)]
              px-2
              py-1
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[var(--text-muted)]
            "
          >
            {step.label}
          </span>
        </div>

        {/* Icon */}

        <motion.div
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  scale: 1.05,
                  rotate: -3,
                }
          }
          className="
            relative
            mt-7
            flex
            h-12
            w-12
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
          <Icon size={19} strokeWidth={1.7} aria-hidden="true" />

          {index === 0 && (
            <span
              aria-hidden="true"
              className="
                absolute
                -right-1
                -top-1
                h-2
                w-2
                rounded-full
                bg-[var(--brand)]
                ring-4
                ring-[var(--background)]
              "
            />
          )}
        </motion.div>

        {/* Content */}

        <div className="relative mt-6">
          <h3
            className="
              text-lg
              font-semibold
              tracking-[-0.03em]
              text-[var(--text)]
            "
          >
            {step.title}
          </h3>

          <p
            className="
              mt-2
              text-xs
              leading-6
              text-[var(--text-muted)]
              sm:text-sm
              sm:leading-6
            "
          >
            {step.description}
          </p>
        </div>

        {/* Completion indicator */}

        <div className="relative mt-auto flex items-center gap-2 pt-6">
          <span
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-[var(--surface-brand)]
              text-[var(--brand)]
            "
          >
            <Check size={10} strokeWidth={2.5} aria-hidden="true" />
          </span>

          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[var(--text-subtle)]
            "
          >
            Workflow step
          </span>
        </div>

        {/* Active bottom edge */}

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
      </div>

      {/* Mobile connector */}

      {!isLast && (
        <div
          aria-hidden="true"
          className="
            flex
            h-9
            items-center
            justify-center
            lg:hidden
          "
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className="
                h-4
                w-px
                bg-gradient-to-b
                from-[var(--border)]
                to-[var(--brand)]/50
              "
            />

            <ArrowDown
              size={11}
              strokeWidth={1.8}
              className="text-[var(--brand)]/70"
            />
          </div>
        </div>
      )}

      {/* Desktop arrow */}

      {!isLast && (
        <div
          aria-hidden="true"
          className="
            absolute
            -right-3
            top-[4.1rem]
            z-10
            hidden
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            border
            border-[var(--border)]
            bg-[var(--background)]
            text-[var(--brand)]
            shadow-[var(--shadow-xs)]
            lg:flex
          "
        >
          <ArrowRight size={11} strokeWidth={1.8} />
        </div>
      )}
    </motion.div>
  );
}

/* ============================================================
   OUTCOME
   ============================================================ */

function Outcome({ label }: { label: string }) {
  return (
    <div
      className="
        flex
        min-h-10
        items-center
        gap-2
        rounded-xl
        border
        border-[var(--border)]
        bg-[var(--background)]
        px-3
        py-2
        transition-colors
        duration-200
        hover:border-[var(--border-brand)]
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
          bg-[var(--surface-brand)]
          text-[var(--brand)]
        "
      >
        <Check size={9} strokeWidth={2.5} aria-hidden="true" />
      </span>

      <span
        className="
          text-[9px]
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