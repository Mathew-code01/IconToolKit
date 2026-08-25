// src/components/layout/Footer.tsx
// src/components/layout/Footer.tsx

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";

import logo from "../../assets/logo.png";

/* ============================================================================
 * Data
 * ========================================================================== */

const productLinks = [
  { label: "Icon Generator", href: "/generator" },
  { label: "Icon Inspector", href: "/inspector" },
  { label: "Icon Validator", href: "/validator" },
  { label: "Icon Preview", href: "/generator#preview" },
];

const resourceLinks = [
  { label: "Documentation", href: "/docs" },
  { label: "Icon sizes", href: "/docs/icon-sizes" },
  { label: "Browser support", href: "/docs/browser-support" },
  { label: "Changelog", href: "/changelog" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const APP_VERSION = "v1.0.0";

/* ============================================================================
 * Motion
 * ========================================================================== */

const footerReveal = {
  hidden: {
    opacity: 0,
    y: 18,
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

const columnReveal = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const columnsContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

/* ============================================================================
 * Primitives
 * ========================================================================== */

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      whileHover={{ x: 2 }}
      transition={{
        duration: 0.18,
        ease: "easeOut",
      }}
      className="
        group
        inline-flex
        min-h-8
        items-center
        gap-1.5
        text-sm
        text-[var(--text-muted)]
        underline-offset-4
        transition-colors
        duration-200
        hover:text-[var(--text)]
        hover:underline
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]
      "
    >
      {children}

      {external && (
        <ArrowUpRight
          size={13}
          strokeWidth={1.9}
          className="
            -translate-y-px
            opacity-0
            transition-all
            duration-200
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
            group-hover:opacity-100
          "
          aria-hidden="true"
        />
      )}
    </motion.a>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <motion.nav
      variants={columnReveal}
      aria-label={title}
    >
      <h3
        className="
          mb-4
          font-mono
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[var(--text-subtle)]
        "
      >
        {title}
      </h3>

      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}

/* ============================================================================
 * Footer
 * ========================================================================== */

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const currentYear = useMemo(
    () => new Date().getFullYear(),
    [],
  );

  return (
    <footer
      className="
        relative
        isolate
        overflow-hidden
        border-t
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      {/* ======================================================================
          Ambient background
         ====================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Subtle grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.12]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:72px_72px]
            [mask-image:linear-gradient(to_bottom,black,transparent_78%)]
          "
        />

        {/* Primary ambient glow */}

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 28, 0],
                  y: [0, -18, 0],
                  scale: [1, 1.05, 1],
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
            -left-40
            -top-48
            h-[32rem]
            w-[32rem]
            rounded-full
            bg-[var(--brand)]/[0.035]
            blur-3xl
          "
        />

        {/* Secondary ambient glow */}

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
            -right-40
            bottom-[-18rem]
            h-[30rem]
            w-[30rem]
            rounded-full
            bg-[var(--brand)]/[0.025]
            blur-3xl
          "
        />
      </div>

      {/* ======================================================================
          System status
         ====================================================================== */}

      <div className="relative border-b border-[var(--border)]">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-4
            py-3
            sm:px-6
            lg:px-8
          "
        >
          <a
            href="/status"
            className="
              group
              inline-flex
              min-h-8
              items-center
              gap-2.5
              rounded-lg
              text-xs
              font-medium
              text-[var(--text-secondary)]
              transition-colors
              duration-200
              hover:text-[var(--text)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--brand)]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[var(--background)]
            "
          >
            <span
              className="relative flex h-2 w-2 shrink-0"
              aria-hidden="true"
            >
              {!shouldReduceMotion && (
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-[var(--success)]
                    opacity-50
                    motion-reduce:animate-none
                  "
                />
              )}

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  bg-[var(--success)]
                  shadow-[0_0_0_3px_color-mix(in_srgb,var(--success)_10%,transparent)]
                "
              />
            </span>

            <span>All systems operational</span>

            <ArrowUpRight
              size={12}
              strokeWidth={1.9}
              className="
                opacity-0
                transition-all
                duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
                group-hover:opacity-100
              "
              aria-hidden="true"
            />
          </a>

          <span
            className="
              hidden
              font-mono
              text-[9px]
              uppercase
              tracking-[0.1em]
              text-[var(--text-subtle)]
              sm:block
            "
          >
            Browser-first asset toolkit
          </span>
        </div>
      </div>

      {/* ======================================================================
          Main footer
         ====================================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            amount: 0.12,
          }}
          variants={footerReveal}
          className="
            grid
            gap-12
            py-14
            sm:py-16
            lg:grid-cols-[1.8fr_1fr_1fr_1fr]
            lg:gap-12
            lg:py-20
          "
        >
          {/* ==================================================================
              Brand
             ================================================================== */}

          <motion.div
            variants={columnReveal}
            className="max-w-md"
          >
            {/* Brand mark */}

            <a
              href="/"
              aria-label="IconToolkit home"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-xl
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
                focus-visible:ring-offset-4
                focus-visible:ring-offset-[var(--background)]
              "
            >
              <motion.span
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -2,
                        rotate: -2,
                        scale: 1.03,
                      }
                }
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="
                  relative
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
                  bg-[var(--surface)]
                  p-1.5
                  shadow-[var(--shadow-sm)]
                  transition-all
                  duration-300
                  group-hover:border-[var(--border-brand)]
                  group-hover:shadow-[var(--shadow-md)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    rounded-xl
                    bg-[var(--brand)]/[0.04]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                <img
                  src={logo}
                  alt=""
                  className="
                    relative
                    h-full
                    w-full
                    object-contain
                  "
                />
              </motion.span>

              <span
                className="
                  text-[18px]
                  font-bold
                  tracking-[-0.035em]
                  text-[var(--text)]
                "
              >
                Icon
                <span className="text-[var(--brand)]">
                  Toolkit
                </span>
              </span>
            </a>

            {/* Description */}

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-7
                text-[var(--text-muted)]
              "
            >
              A focused browser-first toolkit for creating, editing,
              previewing, validating, and exporting production-ready
              icons and digital assets.
            </p>

            {/* Privacy / local processing badge */}

            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              }
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                mt-6
                inline-flex
                max-w-full
                items-center
                gap-2.5
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-3.5
                py-2.5
                shadow-[var(--shadow-xs)]
              "
            >
              <span
                className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--surface-brand)]
                  text-[var(--brand)]
                "
              >
                <ShieldCheck
                  size={13}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    text-[var(--text-secondary)]
                  "
                >
                  Browser-first processing
                </p>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    leading-4
                    text-[var(--text-muted)]
                  "
                >
                  Designed to keep supported workflows local.
                </p>
              </div>
            </motion.div>

            {/* Social */}

            <div className="mt-7 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="IconToolkit on GitHub"
                title="GitHub"
                className="
                  group
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  text-[var(--text-muted)]
                  shadow-[var(--shadow-xs)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[var(--border-strong)]
                  hover:bg-[var(--surface-muted)]
                  hover:text-[var(--text)]
                  hover:shadow-[var(--shadow-sm)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--background)]
                "
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.04.78 2.1v3.12c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* ==================================================================
              Navigation columns
             ================================================================== */}

          <motion.div
            variants={columnsContainer}
            className="
              grid
              grid-cols-2
              gap-x-8
              gap-y-10
              sm:col-span-2
              sm:grid-cols-3
              lg:col-span-3
            "
          >
            <FooterColumn
              title="Product"
              links={productLinks}
            />

            <FooterColumn
              title="Resources"
              links={resourceLinks}
            />

            <FooterColumn
              title="Company"
              links={companyLinks}
            />
          </motion.div>
        </motion.div>

        {/* ======================================================================
            Product capability strip
           ====================================================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 12,
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
            amount: 0.2,
          }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 0.55,
                  ease: "easeOut",
                }
          }
          className="
            border-t
            border-[var(--border)]
            py-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {[
                "Create",
                "Edit",
                "Convert",
                "Optimize",
                "Inspect",
              ].map((item) => (
                <span
                  key={item}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.07em]
                    text-[var(--text-subtle)]
                  "
                >
                  <CheckCircle2
                    size={11}
                    strokeWidth={2}
                    className="text-[var(--brand)]"
                    aria-hidden="true"
                  />

                  {item}
                </span>
              ))}
            </div>

            <span
              className="
                inline-flex
                items-center
                gap-2
                text-[10px]
                text-[var(--text-subtle)]
              "
            >
              <Sparkles
                size={11}
                className="text-[var(--brand)]"
                aria-hidden="true"
              />

              Built for real products
            </span>
          </div>
        </motion.div>

        {/* ======================================================================
            Bottom bar
           ====================================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-[var(--border)]
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
            "
          >
            <p
              className="
                text-xs
                text-[var(--text-muted)]
              "
            >
              © {currentYear} IconToolkit. All rights reserved.
            </p>

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
                rounded-md
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-1.5
                py-0.5
                font-mono
                text-[9px]
                font-medium
                text-[var(--text-muted)]
              "
            >
              {APP_VERSION}
            </span>
          </div>

          <p
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              text-[var(--text-muted)]
            "
          >
            Built with

            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.15, 1],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="inline-flex"
            >
              <Heart
                size={12}
                fill="currentColor"
                aria-hidden="true"
              />
            </motion.span>

            for people shipping real products
          </p>
        </div>
      </div>
    </footer>
  );
}