// src/pages/Home/GeneratorShowcaseSection.tsx

import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileImage,
  Package,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const sizes = ["16", "32", "48", "64", "128", "180", "192", "512"];

export default function GeneratorShowcaseSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Copy */}
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
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[var(--text-muted)]
              "
            >
              <WandSparkles size={13} aria-hidden="true" />
              Flagship workflow
            </div>

            <h2
              className="
                mt-5
                text-3xl
                font-bold
                tracking-[-0.04em]
                text-[var(--text)]
                sm:text-4xl
              "
            >
              Turn one logo into a complete icon package.
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
              IconToolkit handles the repetitive parts of favicon creation so
              you can focus on shipping your product.
            </p>

            <div className="mt-7 space-y-3">
              {[
                "Generate all essential icon sizes",
                "Preview icons in realistic contexts",
                "Create HTML and manifest snippets",
                "Download a complete asset package",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#6366F1]/10
                      text-[#6366F1]
                    "
                  >
                    <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                  </span>

                  <span className="text-sm text-[var(--text-secondary)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/generator"
              className="
                mt-8
                inline-flex
                h-11
                items-center
                gap-2
                rounded-lg
                bg-[#6366F1]
                px-5
                text-sm
                font-semibold
                text-white
                shadow-[0_4px_14px_rgba(99,102,241,0.20)]
                transition-all
                hover:bg-[#4F46E5]
                hover:shadow-[0_6px_20px_rgba(99,102,241,0.26)]
              "
            >
              Open favicon generator
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {/* Product mockup */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-[0_24px_70px_rgba(0,0,0,0.08)]
            "
          >
            {/* Mock browser chrome */}
            <div
              className="
                flex
                items-center
                gap-2
                border-b
                border-[var(--border)]
                px-4
                py-3
              "
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />

              <div
                className="
                  ml-3
                  flex
                  h-7
                  flex-1
                  items-center
                  rounded-md
                  bg-[var(--surface-muted)]
                  px-3
                  font-mono
                  text-[10px]
                  text-[var(--text-muted)]
                "
              >
                icontoolkit.app / generator
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">
                    Icon package
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    8 assets ready
                  </p>
                </div>

                <Package
                  size={18}
                  className="text-[#6366F1]"
                  aria-hidden="true"
                />
              </div>

              {/* Main icon preview */}
              <div
                className="
                  mt-6
                  flex
                  h-40
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface-muted)]
                "
              >
                <div
                  className="
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-[26%]
                    bg-[#6366F1]
                    shadow-[0_12px_30px_rgba(99,102,241,0.28)]
                  "
                >
                  <FileImage
                    size={38}
                    strokeWidth={1.6}
                    className="text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Size list */}
              <div className="mt-5 grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className="
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--background)]
                      px-2
                      py-2.5
                      text-center
                    "
                  >
                    <div className="font-mono text-xs font-semibold text-[var(--text)]">
                      {size}
                    </div>
                    <div className="mt-0.5 text-[9px] text-[var(--text-muted)]">
                      px
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div
                  className="
                    flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-[var(--border)]
                    text-xs
                    font-medium
                    text-[var(--text-secondary)]
                  "
                >
                  <Eye size={14} aria-hidden="true" />
                  Preview
                </div>

                <div
                  className="
                    flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[#6366F1]
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  <Download size={14} aria-hidden="true" />
                  Download ZIP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
