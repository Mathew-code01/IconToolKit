// src/pages/Home/QuickStartSection.tsx


// src/pages/Home/ToolsSection.tsx

import { Eye, FileCheck2, Image, ScanSearch } from "lucide-react";

const tools = [
  {
    title: "Icon Generator",
    description: "Create a complete set of favicon, PWA, Apple, and app icon sizes from one image.",
    href: "/generator",
    icon: Image,
  },
  {
    title: "Website Inspector",
    description: "Check what icons a website currently uses and find missing or outdated assets.",
    href: "/inspector",
    icon: ScanSearch,
  },
  {
    title: "Icon Validator",
    description: "Check formats, sizes, transparency, manifest entries, and common icon requirements.",
    href: "/validator",
    icon: FileCheck2,
  },
  {
    title: "Live Preview",
    description: "See how your icon looks in browsers, mobile interfaces, and different sizes.",
    href: "/generator#preview",
    icon: Eye,
  },
];

export default function ToolsSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#6366F1]">
            [ Toolkit ]
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-4xl">
            One workspace, four tools.
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            Everything you need to generate, inspect, validate, and preview
            icons, without switching tools.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <a
                key={tool.href}
                href={tool.href}
                className="
                  group
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
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#6366F1]
                  focus-visible:ring-offset-2
                "
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
                    <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  </div>

                  <span className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] text-[var(--text-muted)]">
                    {tool.href}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-semibold text-[var(--text)]">
                  {tool.title}
                </h3>

                <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--text-muted)]">
                  {tool.description}
                </p>

                <span className="mt-5 inline-flex text-sm font-medium text-[#6366F1] transition-transform duration-200 group-hover:translate-x-1">
                  Open tool →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}