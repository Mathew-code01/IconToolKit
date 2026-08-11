// src/pages/Home/HeroSection.tsx


// src/pages/Home/HeroSection.tsx

import { useRef, useState } from "react";
import { ArrowRight, FileImage, Globe, Upload } from "lucide-react";
import IconSpecimenStrip from "./IconSpecimenStrip";

const STATS = [
  { value: "13", label: "sizes per export" },
  { value: "0 KB", label: "uploaded to a server" },
  { value: "100%", label: "free, no account" },
];

export default function HeroSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    /*
     * Temporary handoff to the Generator page.
     * The Generator reads this value and loads the image on mount.
     */
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        sessionStorage.setItem(
          "icon-toolkit-pending-image",
          reader.result,
        );

        sessionStorage.setItem(
          "icon-toolkit-pending-image-name",
          file.name,
        );

        window.location.href = "/generator";
      }
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)]">
      {/* Pixel-grid backdrop — faded to the edges, reinforces the "precision" identity */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.5]
          [background-image:radial-gradient(var(--border)_1px,transparent_1px)]
          [background-size:22px_22px]
          [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_10%,transparent_75%)]
        "
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          {/* Eyebrow */}
          <div className="flex justify-center">
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
                font-mono
                text-[11px]
                font-medium
                uppercase
                tracking-[0.08em]
                text-[var(--text-secondary)]
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" aria-hidden="true" />
              [ Browser-based icon toolkit ]
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1
              className="
                mx-auto
                mt-6
                max-w-3xl
                text-4xl
                font-bold
                tracking-[-0.04em]
                text-[var(--text)]
                sm:text-5xl
                lg:text-6xl
                lg:leading-[1.05]
              "
            >
              The favicon workflow,
              <span className="block text-[#6366F1]">done properly.</span>
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-2xl
                text-base
                leading-7
                text-[var(--text-secondary)]
                sm:text-lg
                sm:leading-8
              "
            >
              Upload a logo, generate every favicon, PWA, and app-icon size it
              needs, preview each one in context, and export a package ready
              to ship — entirely in your browser.
            </p>
          </div>

          {/* Upload */}
          <div className="mx-auto mt-10 max-w-2xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleInputChange}
              className="hidden"
            />

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`
                rounded-2xl
                border
                border-dashed
                bg-[var(--surface)]
                p-3
                transition-colors
                duration-200
                ${dragging ? "border-[#6366F1] bg-[#6366F1]/5" : "border-[var(--border-strong)]"}
              `}
            >
              <div className="flex flex-col items-center justify-center rounded-xl px-6 py-10 text-center sm:py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
                  <Upload size={21} strokeWidth={2} aria-hidden="true" />
                </div>

                <h2 className="mt-5 text-base font-semibold text-[var(--text)] sm:text-lg">
                  Drop your image here
                </h2>

                <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">
                  PNG · JPG · WEBP · SVG — up to 10MB
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    mt-6
                    inline-flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[#6366F1]
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_4px_14px_rgba(99,102,241,0.2)]
                    transition-all
                    duration-200
                    hover:bg-[#4F46E5]
                    hover:shadow-[0_6px_18px_rgba(99,102,241,0.28)]
                    active:translate-y-px
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#6366F1]
                    focus-visible:ring-offset-2
                  "
                >
                  <FileImage size={16} aria-hidden="true" />
                  Choose an image
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
              <a
                href="/inspector"
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  px-4
                  text-sm
                  font-medium
                  text-[var(--text)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface-muted)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#6366F1]
                  focus-visible:ring-offset-2
                "
              >
                <Globe size={15} aria-hidden="true" />
                Inspect a website
                <ArrowRight size={14} aria-hidden="true" />
              </a>

              <span className="text-xs text-[var(--text-muted)]">
                No account required
              </span>
            </div>
          </div>

          {/* Stats strip */}
          <div
            className="
              mx-auto
              mt-12
              flex
              max-w-lg
              items-center
              justify-center
              divide-x
              divide-[var(--border)]
            "
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex-1 px-4 text-center first:pl-0 last:pr-0">
                <div className="font-mono text-lg font-semibold text-[var(--text)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] leading-tight text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Specimen strip — the signature motif, introduced here and echoed later */}
          <div className="mx-auto mt-14 max-w-3xl">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Every size, generated locally
            </p>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-6">
              <IconSpecimenStrip className="justify-center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}