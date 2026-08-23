// src/pages/Home/ToolCategoriesSection.tsx

import {
  ArrowUpRight,
  Code2,
  FileOutput,
  ImagePlus,
  Layers3,
  ScanSearch,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    number: "01",
    title: "Create",
    description:
      "Turn artwork into production-ready icons, favicons, PWA assets, social graphics, and more.",
    href: "/create",
    icon: ImagePlus,
    tools: ["Favicons", "App icons", "PWA assets", "Social graphics"],
  },
  {
    number: "02",
    title: "Edit",
    description:
      "Make precise changes to images and assets without leaving your browser.",
    href: "/edit",
    icon: Sparkles,
    tools: ["Image editor", "Crop & resize", "Background tools", "Transform"],
  },
  {
    number: "03",
    title: "Convert",
    description:
      "Move assets between modern formats with a workflow built for speed.",
    href: "/convert",
    icon: FileOutput,
    tools: ["PNG / JPG", "WebP", "SVG", "ICO"],
  },
  {
    number: "04",
    title: "Optimize",
    description:
      "Reduce unnecessary file weight while keeping your assets sharp and usable.",
    href: "/optimize",
    icon: Layers3,
    tools: ["Compression", "Resize", "Quality control", "Batch workflows"],
  },
  {
    number: "05",
    title: "Inspect",
    description:
      "Understand assets, metadata, dimensions, favicons, and what websites actually ship.",
    href: "/inspect",
    icon: ScanSearch,
    tools: ["Favicon inspector", "Metadata", "Dimensions", "Website analysis"],
  },
  {
    number: "06",
    title: "Developer",
    description:
      "Go from finished asset to implementation with code, manifests, snippets, and packages.",
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

export default function ToolCategoriesSection() {
  return (
    <section
      id="tools"
      className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)]"
    >
      {/* Ambient section glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[var(--brand)]/[0.035] blur-3xl"
      />

      <div className="relative mx-auto max-w-[var(--content-max-width)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 xl:px-10">
        {/* =================================================
            Header
            ================================================= */}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] shadow-[var(--shadow-xs)]">
              <Wrench size={12} className="text-[var(--brand)]" />
              Everything in one place
            </div>

            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[1.05] tracking-[-0.045em] text-[var(--text)] sm:text-4xl lg:text-5xl">
              One toolkit for the
              <span className="itk-gradient-text">
                {" "}
                entire asset lifecycle.
              </span>
            </h2>
          </div>

          <div className="max-w-xl lg:ml-auto">
            <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
              IconToolkit goes beyond icons. Create, edit, convert, optimize,
              inspect, and prepare the files that make websites, products, and
              digital experiences work.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              Browser-first
              <span className="text-[var(--text-subtle)]">/</span>
              No desktop installation
              <span className="text-[var(--text-subtle)]">/</span>
              Developer-ready
            </div>
          </div>
        </div>

        {/* =================================================
            Category grid
            ================================================= */}

        <div className="mt-12 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.href}
                to={category.href}
                className="
                  group
                  relative
                  flex
                  min-h-[280px]
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-5
                  shadow-[var(--shadow-xs)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[var(--border-brand)]
                  hover:shadow-[var(--shadow-lg)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                  sm:p-6
                "
              >
                {/* Card ambient glow */}
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
                    bg-[var(--brand)]/[0.055]
                    blur-3xl
                    transition-all
                    duration-500
                    group-hover:bg-[var(--brand)]/[0.10]
                  "
                />

                <div className="relative flex h-full flex-col">
                  {/* Card top */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-secondary)] transition-colors duration-200 group-hover:border-[var(--border-brand)] group-hover:bg-[var(--surface-brand)] group-hover:text-[var(--brand)]">
                        <Icon size={18} strokeWidth={1.8} />
                      </span>

                      <span className="font-mono text-[9px] font-medium tracking-[0.08em] text-[var(--text-subtle)]">
                        {category.number}
                      </span>
                    </div>

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-200 group-hover:border-[var(--border-brand)] group-hover:text-[var(--brand)]">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-7">
                    <h3 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text)]">
                      {category.title}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                      {category.description}
                    </p>
                  </div>

                  {/* Tools */}
                  <div className="mt-auto pt-7">
                    <div className="flex flex-wrap gap-1.5">
                      {category.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-1 text-[9px] font-medium text-[var(--text-muted)]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center gap-1.5 text-[10px] font-semibold text-[var(--text-muted)] transition-colors group-hover:text-[var(--brand)]">
                      Explore {category.title}
                      <ArrowUpRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* =================================================
            Bottom statement
            ================================================= */}

        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 sm:mt-12 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-brand)] text-[var(--brand)]">
                <Sparkles size={15} />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--text)]">
                  Built around real workflows, not feature clutter.
                </p>

                <p className="mt-1 max-w-2xl text-[11px] leading-5 text-[var(--text-muted)] sm:text-xs">
                  Each workspace is designed to get you from source file to
                  finished asset with fewer tools, fewer tabs, and less
                  friction.
                </p>
              </div>
            </div>

            <Link
              to="/tools"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-xs)] transition-all hover:border-[var(--border-brand)] hover:text-[var(--brand)]"
            >
              View all tools
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}