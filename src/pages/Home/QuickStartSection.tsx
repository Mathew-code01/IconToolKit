// src/pages/Home/QuickStartSection.tsx

// src/pages/Home/QuickStartSection.tsx

import { Download, Pencil, Upload, WandSparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Drop in your logo or image. PNG, JPG, WEBP, and SVG are supported.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Edit",
    description: "Resize, crop, position, add padding, and adjust the background.",
    icon: Pencil,
  },
  {
    number: "03",
    title: "Generate",
    description: "Create the icon sizes your website, browser, and devices need.",
    icon: WandSparkles,
  },
  {
    number: "04",
    title: "Export",
    description: "Download individual files or your complete icon package together.",
    icon: Download,
  },
];

export default function QuickStartSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#6366F1]">
            [ Workflow ]
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-4xl">
            Four steps, zero context-switching.
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            Upload, edit, generate, and export — without ever leaving the tab.
          </p>
        </div>

        <div className="relative mt-10">
          {/* Connecting line — this is a genuine sequence, so the numbering and the line earn their place */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[38px] hidden h-px bg-[var(--border)] lg:block"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    </div>

                    <span className="font-mono text-xs font-semibold text-[var(--text-muted)]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-base font-semibold text-[var(--text)]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}