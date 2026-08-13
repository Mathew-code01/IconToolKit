// src/pages/Home/PopularToolsSection.tsx

import {
  ArrowRight,
  Crop,
  FileImage,
  Gauge,
  ImageOff,
  ScanSearch,
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "Favicon Generator",
    description: "Create a complete favicon package from one image.",
    href: "/generator",
    icon: FileImage,
  },
  {
    title: "Background Remover",
    description: "Prepare artwork for icons and transparent assets.",
    href: "/edit",
    icon: ImageOff,
  },
  {
    title: "Image Converter",
    description: "Convert between PNG, JPG, WebP, SVG, ICO, and more.",
    href: "/convert",
    icon: FileImage,
  },
  {
    title: "Image Compressor",
    description: "Reduce file size without unnecessary quality loss.",
    href: "/optimize",
    icon: Gauge,
  },
  {
    title: "Favicon Inspector",
    description: "See which icons a website currently exposes.",
    href: "/inspect",
    icon: ScanSearch,
  },
  {
    title: "Image Cropper",
    description: "Quickly crop artwork to the dimensions you need.",
    href: "/edit",
    icon: Crop,
  },
];

export default function PopularToolsSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6366F1]">
              Popular tools
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-bold
                tracking-[-0.035em]
                text-[var(--text)]
              "
            >
              Start with the tool you need.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              Jump directly into a focused workflow. More tools can be added
              without changing the core experience.
            </p>
          </div>

          <Link
            to="/create"
            className="
              inline-flex
              shrink-0
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#6366F1]
              hover:underline
            "
          >
            Explore the toolkit
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.title}
                to={tool.href}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  p-4
                  transition-all
                  duration-200
                  hover:border-[#6366F1]/30
                  hover:shadow-sm
                "
              >
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--surface-muted)]
                    text-[var(--text-secondary)]
                    transition-colors
                    group-hover:bg-[#6366F1]/10
                    group-hover:text-[#6366F1]
                  "
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[var(--text)]">
                    {tool.title}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">
                    {tool.description}
                  </span>
                </span>

                <ArrowRight
                  size={15}
                  className="
                    shrink-0
                    text-[var(--text-muted)]
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
