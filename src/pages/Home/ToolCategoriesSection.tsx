

// src/pages/Home/ToolCategoriesSection.tsx

import {
  ArrowRight,
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
    title: "Create",
    description:
      "Generate favicons, app icons, PWA assets, and social graphics from your artwork.",
    href: "/create",
    icon: ImagePlus,
    tools: [
      "Favicon & Web Icons",
      "App Icons",
      "PWA Icons",
      "Social / OG Images",
    ],
  },
  {
    title: "Edit",
    description:
      "Clean up and transform images with practical editing tools built around your workflow.",
    href: "/edit",
    icon: Sparkles,
    tools: [
      "Remove Background",
      "Crop & Resize",
      "Background Editor",
      "Image Editor",
    ],
  },
  {
    title: "Convert",
    description:
      "Move between popular image formats without leaving your browser.",
    href: "/convert",
    icon: FileOutput,
    tools: [
      "PNG → JPG",
      "JPG → PNG",
      "PNG → WebP",
      "Image → ICO",
    ],
  },
  {
    title: "Optimize",
    description:
      "Reduce file size while keeping the visual quality you actually need.",
    href: "/optimize",
    icon: Layers3,
    tools: [
      "Compress Image",
      "Resize & Compress",
      "Convert + Compress",
      "Quality Comparison",
    ],
  },
  {
    title: "Inspect",
    description:
      "Understand what is inside an image or what a website is using for its icons.",
    href: "/inspect",
    icon: ScanSearch,
    tools: [
      "Favicon Inspector",
      "Image Metadata",
      "Dimensions",
      "Website Icon Checker",
    ],
  },
  {
    title: "Developer",
    description:
      "Generate the code, manifests, snippets, and asset packages needed to ship.",
    href: "/developer",
    icon: Code2,
    tools: [
      "Favicon HTML",
      "manifest.json",
      "Framework Snippets",
      "ZIP Asset Pack",
    ],
  },
];

export default function ToolCategoriesSection() {
  return (
    <section
      id="tools"
      className="
        border-b
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-20
          sm:px-6
          sm:py-24
          lg:px-8
          lg:py-28
        "
      >
        {/* Section heading */}
        <div className="max-w-2xl">
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
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[var(--text-muted)]
            "
          >
            <Wrench size={13} aria-hidden="true" />
            The toolkit
          </div>

          <h2
            className="
              mt-5
              text-3xl
              font-bold
              tracking-[-0.035em]
              text-[var(--text)]
              sm:text-4xl
            "
          >
            One toolkit.
            <span className="text-[#6366F1]"> Every asset workflow.</span>
          </h2>

          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-[var(--text-secondary)]
              sm:text-base
            "
          >
            From creating your first favicon to inspecting a production
            website, IconToolkit keeps the tools you need in one focused
            workspace.
          </p>
        </div>

        {/* Category grid */}
        <div
          className="
            mt-12
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.href}
                to={category.href}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-6
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#6366F1]/40
                  hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#6366F1]
                  focus-visible:ring-offset-2
                "
              >
                <div
                  className="
                    absolute
                    right-0
                    top-0
                    h-24
                    w-24
                    rounded-full
                    bg-[#6366F1]/[0.04]
                    blur-2xl
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--surface-muted)]
                        text-[var(--text-secondary)]
                        transition-colors
                        group-hover:bg-[#6366F1]/10
                        group-hover:text-[#6366F1]
                      "
                    >
                      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                    </span>

                    <ArrowRight
                      size={17}
                      className="
                        text-[var(--text-muted)]
                        transition-all
                        duration-200
                        group-hover:translate-x-1
                        group-hover:text-[#6366F1]
                      "
                      aria-hidden="true"
                    />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-base
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    {category.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-[var(--text-secondary)]
                    "
                  >
                    {category.description}
                  </p>

                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      gap-1.5
                    "
                  >
                    {category.tools.map((tool) => (
                      <span
                        key={tool}
                        className="
                          rounded-md
                          border
                          border-[var(--border)]
                          bg-[var(--background)]
                          px-2
                          py-1
                          text-[10px]
                          font-medium
                          text-[var(--text-muted)]
                        "
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}