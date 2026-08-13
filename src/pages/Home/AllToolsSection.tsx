// src/pages/Home/AllToolsSection.tsx

import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const toolGroups = [
  {
    title: "Create",
    href: "/create",
    description: "Generate production-ready digital assets.",
    tools: [
      "Favicon & Web Icons",
      "App Icons",
      "PWA Icons",
      "Social / OG Images",
    ],
  },
  {
    title: "Edit",
    href: "/edit",
    description: "Make precise changes to your images.",
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
    title: "Convert",
    href: "/convert",
    description: "Change formats for the job at hand.",
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
    title: "Optimize",
    href: "/optimize",
    description: "Improve file size and delivery efficiency.",
    tools: [
      "Compress Image",
      "Resize & Compress",
      "Convert + Compress",
      "Quality vs File Size",
    ],
  },
  {
    title: "Inspect",
    href: "/inspect",
    description: "Understand your assets and websites.",
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
    title: "Developer",
    href: "/developer",
    description: "Generate the code needed to ship.",
    tools: [
      "HTML Favicon Generator",
      "manifest.json Generator",
      "<link> Tag Generator",
      "Framework Snippets",
      "ZIP Asset Pack",
    ],
  },
];

export default function AllToolsSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6366F1]">
            All tools
          </p>

          <h2
            className="
              mt-3
              text-3xl
              font-bold
              tracking-[-0.035em]
              text-[var(--text)]
              sm:text-4xl
            "
          >
            Everything in one place.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            Start with a category, choose a specific tool, and move between
            related workflows without rebuilding your work from scratch.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {toolGroups.map((group) => (
            <div
              key={group.title}
              className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                p-6
                sm:p-7
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text)]">
                    {group.title}
                  </h3>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {group.description}
                  </p>
                </div>

                <Link
                  to={group.href}
                  aria-label={`Explore ${group.title}`}
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
                    text-[var(--text-muted)]
                    transition-colors
                    hover:border-[#6366F1]/30
                    hover:text-[#6366F1]
                  "
                >
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <div
                className="
                  mt-6
                  grid
                  gap-x-5
                  gap-y-3
                  sm:grid-cols-2
                "
              >
                {group.tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-2.5">
                    <Check
                      size={14}
                      className="shrink-0 text-[#6366F1]"
                      aria-hidden="true"
                    />

                    <span className="text-xs text-[var(--text-secondary)]">
                      {tool}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
