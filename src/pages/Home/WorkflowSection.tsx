// src/pages/Home/WorkflowSection.tsx

import { Download, Edit3, Eye, FileImage, Upload } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Start with a logo, image, or existing asset.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Edit",
    description: "Crop, resize, pad, recolor, or clean up the asset.",
    icon: Edit3,
  },
  {
    number: "03",
    title: "Generate",
    description: "Create the sizes and formats your project needs.",
    icon: FileImage,
  },
  {
    number: "04",
    title: "Inspect",
    description: "Preview the result and check the important details.",
    icon: Eye,
  },
  {
    number: "05",
    title: "Export",
    description: "Download the assets and developer-ready code.",
    icon: Download,
  },
];

export default function WorkflowSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6366F1]">
            One continuous workflow
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
            From image to production-ready asset.
          </h2>

          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
            The tools are separate when you need them, but designed to work
            together when you don't want to leave your workflow.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-5">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="
                  relative
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  p-5
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                      font-mono
                      text-[10px]
                      font-semibold
                      tracking-wider
                      text-[#6366F1]
                    "
                  >
                    {step.number}
                  </span>

                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-6 text-sm font-semibold text-[var(--text)]">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
