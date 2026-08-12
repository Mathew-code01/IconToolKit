// src/components/layout/Footer.tsx

// src/components/layout/Footer.tsx

import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

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
 * Primitives
 * ==========================================================================*/

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
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="
        group
        inline-flex
        items-center
        gap-1
        text-sm
        text-[var(--text-muted)]
        underline-offset-4
        transition-colors
        duration-150
        hover:text-[var(--text)]
        hover:underline
        focus-visible:outline-none
        focus-visible:underline
        focus-visible:text-[var(--text)]
      "
    >
      {children}

      {external && (
        <ArrowUpRight
          size={13}
          strokeWidth={2}
          className="
            -translate-y-px
            opacity-0
            transition-opacity
            duration-150
            group-hover:opacity-100
          "
          aria-hidden="true"
        />
      )}
    </a>
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
    <nav aria-label={title}>
      <h3
        className="
          mb-4
          font-mono
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.1em]
          text-[var(--text-muted)]
        "
      >
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ============================================================================
 * Footer
 * ==========================================================================*/

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      {/* Status strip — a small, real signal, not decoration */}
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="/status"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-xs
              font-medium
              text-[var(--text-secondary)]
              transition-colors
              duration-150
              hover:text-[var(--text)]
              focus-visible:outline-none
              focus-visible:text-[var(--text)]
            "
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
            </span>

            All systems operational

            <ArrowUpRight
              size={12}
              strokeWidth={2}
              className="
                opacity-0
                transition-opacity
                duration-150
                group-hover:opacity-100
              "
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div
          className="
            grid
            gap-12
            py-12
            sm:grid-cols-2
            lg:grid-cols-[2fr_1fr_1fr_1fr]
            lg:gap-10
            lg:py-16
          "
        >
          {/* Brand */}
          <div className="max-w-sm">
            <a href="/" aria-label="IconToolkit home" className="group inline-flex items-center gap-2.5">
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-[10px]
                  bg-[#6366F1]
                  text-white
                  shadow-[0_4px_12px_rgba(99,102,241,0.22)]
                  transition-all
                  duration-200
                  group-hover:bg-[#4F46E5]
                  group-hover:shadow-[0_6px_16px_rgba(99,102,241,0.28)]
                "
              >
                <Sparkles size={19} strokeWidth={2.2} aria-hidden="true" />
              </span>

              <span className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--text)]">
                Icon<span className="text-[#6366F1]">Toolkit</span>
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
              A free toolkit for creating, editing, previewing, validating, and
              exporting icons for websites and apps.
            </p>

            <div
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-3
                py-2
                text-xs
                font-medium
                text-[var(--text-secondary)]
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
              Runs locally — nothing is uploaded to a server
            </div>

            {/* Social / connect */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="IconToolkit on GitHub"
                title="GitHub"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  text-[var(--text-muted)]
                  transition-colors
                  duration-150
                  hover:border-[var(--border-strong)]
                  hover:text-[var(--text)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#6366F1]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--background)]
                "
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.04.78 2.1v3.12c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        {/* Bottom bar */}
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-xs text-[var(--text-muted)]">
              © {currentYear} IconToolkit. All rights reserved.
            </p>

            <span className="hidden h-3 w-px bg-[var(--border)] sm:block" aria-hidden="true" />

            <span
              className="
                rounded-md
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-1.5
                py-0.5
                font-mono
                text-[10px]
                text-[var(--text-muted)]
              "
            >
              {APP_VERSION}
            </span>
          </div>

          <p className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            Built with
            <Heart size={12} fill="currentColor" aria-hidden="true" />
            for people shipping real products
          </p>
        </div>
      </div>
    </footer>
  );
}