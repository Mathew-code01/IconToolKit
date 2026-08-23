// src/pages/Home/HeroSection.tsx

import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  FileImage,
  FileText,
  Globe2,
  ImageIcon,
  Lock,
  ScanSearch,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import IconSpecimenStrip from "./IconSpecimenStrip";

const TRUST_ITEMS = ["Images", "Icons", "PDFs", "Documents", "Web assets"];

const QUICK_ACTIONS = [
  {
    label: "Create",
    description: "Build assets",
    icon: WandSparkles,
    href: "/create",
  },
  {
    label: "Edit",
    description: "Transform files",
    icon: ImageIcon,
    href: "/edit",
  },
  {
    label: "Convert",
    description: "Change formats",
    icon: FileImage,
    href: "/convert",
  },
  {
    label: "Inspect",
    description: "Analyze assets",
    icon: ScanSearch,
    href: "/inspect",
  },
];

const SUPPORTED_FORMATS = ["PNG", "JPG", "WEBP", "SVG", "PDF", "DOCX"];

export default function HeroSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    const isSupported =
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      file.type.includes("word") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isSupported) {
      return;
    }

    /*
     * Preserve the existing image workflow.
     *
     * Documents/PDFs can later be routed through their own
     * workspace based on file type.
     */
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") {
          return;
        }

        sessionStorage.setItem("icon-toolkit-pending-image", reader.result);

        sessionStorage.setItem("icon-toolkit-pending-image-name", file.name);

        window.location.href = "/generator";
      };

      reader.readAsDataURL(file);
      return;
    }

    /*
     * Keep the landing page extensible for non-image workflows.
     */
    sessionStorage.setItem("icon-toolkit-pending-file-name", file.name);

    window.location.href = "/convert";
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--border)] bg-[var(--background)]">
      {/* =====================================================
          Ambient background
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[60rem] -translate-x-1/2 rounded-full bg-[var(--brand)]/[0.07] blur-3xl dark:bg-[var(--brand)]/[0.10]" />

        <div className="absolute -left-40 top-[35%] h-72 w-72 rounded-full bg-[var(--brand-secondary)]/[0.035] blur-3xl" />

        <div className="absolute -right-40 top-[45%] h-80 w-80 rounded-full bg-[var(--brand-accent)]/[0.035] blur-3xl" />

        <div
          className="
            absolute
            inset-0
            opacity-[0.38]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:56px_56px]
            [mask-image:radial-gradient(ellipse_75%_65%_at_50%_20%,black,transparent_90%)]
          "
        />
      </div>

      {/* =====================================================
          Main hero
          ===================================================== */}

      <div className="relative mx-auto max-w-[var(--content-max-width)] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20 xl:px-10">
        {/* Product positioning */}
        <div className="flex justify-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1.5 shadow-[var(--shadow-xs)] backdrop-blur-xl">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-brand)] text-[var(--brand)]">
              <Sparkles size={11} strokeWidth={2} aria-hidden="true" />
            </span>

            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] sm:text-[11px]">
              The browser-first asset workspace
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-[var(--border-strong)] sm:block" />

            <span className="hidden text-[10px] font-medium text-[var(--text-muted)] sm:block">
              Private by default
            </span>
          </div>
        </div>

        {/* =================================================
            Heading
            ================================================= */}

        <div className="mx-auto mt-7 max-w-5xl text-center sm:mt-8">
          <h1 className="text-[2.7rem] font-bold leading-[0.98] tracking-[-0.055em] text-[var(--text)] sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            Your files.
            <br />
            <span className="itk-gradient-text">Your entire workflow.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl">
            Create, edit, convert, optimize, inspect, and ship digital assets
            from one beautifully focused workspace. No bloated desktop software.
            No unnecessary uploads.
          </p>
        </div>

        {/* =================================================
            Quick workflow navigation
            ================================================= */}

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-2 sm:mt-10 sm:grid-cols-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                to={action.href}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]/75
                  px-3
                  py-3
                  text-left
                  backdrop-blur-xl
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[var(--border-brand)]
                  hover:bg-[var(--surface)]
                  hover:shadow-[var(--shadow-sm)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                "
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--text-secondary)] transition-colors group-hover:bg-[var(--surface-brand)] group-hover:text-[var(--brand)]">
                  <Icon size={17} strokeWidth={1.8} />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-[var(--text)]">
                    {action.label}
                  </span>

                  <span className="mt-0.5 block truncate text-[10px] text-[var(--text-muted)]">
                    {action.description}
                  </span>
                </span>

                <ArrowRight
                  size={13}
                  className="ml-auto shrink-0 text-[var(--text-subtle)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
                />
              </Link>
            );
          })}
        </div>

        {/* =================================================
            Upload workspace
            ================================================= */}

        <div className="mx-auto mt-7 max-w-4xl sm:mt-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleInputChange}
            className="hidden"
          />

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              if (event.currentTarget === event.target) {
                setDragging(false);
              }
            }}
            onDrop={handleDrop}
            className={`
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              p-2
              transition-all
              duration-300
              sm:rounded-3xl
              sm:p-3
              ${
                dragging
                  ? "border-[var(--brand)] bg-[var(--surface-brand)] shadow-[var(--shadow-brand)]"
                  : "border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"
              }
            `}
          >
            {/* Inner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-16 top-0 h-px bg-[var(--brand)]/30 blur-sm"
            />

            <div
              className="
                relative
                rounded-xl
                border
                border-dashed
                border-[var(--border-strong)]
                bg-[var(--surface-subtle)]
                px-5
                py-8
                text-center
                transition-colors
                group-hover:bg-[var(--surface)]
                sm:rounded-2xl
                sm:px-8
                sm:py-10
              "
            >
              <div className="mx-auto flex max-w-md flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-[var(--brand)]/15 blur-xl" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]">
                    <Upload size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                </div>

                <p className="mt-5 text-sm font-semibold text-[var(--text)] sm:text-base">
                  Drop a file here to get started
                </p>

                <p className="mt-1.5 max-w-sm text-xs leading-5 text-[var(--text-muted)] sm:text-sm">
                  Images, icons, PDFs and supported documents. Everything stays
                  under your control.
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    mt-6
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[var(--brand)]
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-[var(--shadow-brand)]
                    transition-all
                    duration-200
                    hover:bg-[var(--brand-hover)]
                    hover:shadow-[var(--shadow-lg)]
                    active:translate-y-px
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--brand)]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--surface)]
                  "
                >
                  <Upload size={15} />
                  Choose a file
                  <ArrowRight size={15} />
                </button>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5">
                  {SUPPORTED_FORMATS.map((format, index) => (
                    <span
                      key={format}
                      className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--text-subtle)] sm:text-[10px]"
                    >
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-[var(--border-strong)]"
                        />
                      )}

                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy + alternate action */}
          <div className="mt-4 flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <Lock size={12} className="text-[var(--success)]" />

              <span>
                Browser-first processing means your files don't need to leave
                your device.
              </span>
            </div>

            <Link
              to="/inspect"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]"
            >
              <Globe2 size={14} />
              Inspect a website
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* =================================================
            Product capability strip
            ================================================= */}

        <div className="mx-auto mt-12 max-w-4xl border-y border-[var(--border)] py-4 sm:mt-14">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-7">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check size={13} className="text-[var(--brand)]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] sm:text-[11px]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            Product preview
            ================================================= */}

        <div className="mx-auto mt-14 max-w-5xl sm:mt-16 lg:mt-20">
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-[var(--brand)]" />

                <p className="text-xs font-semibold text-[var(--text)]">
                  One workspace. Multiple workflows.
                </p>
              </div>

              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Designed to feel like a serious developer tool, without the
                complexity.
              </p>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--surface-muted)] text-[var(--text-secondary)]">
                <FileText size={12} />
              </span>

              <span className="text-[10px] font-medium text-[var(--text-muted)]">
                Asset workspace
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xl)] sm:rounded-3xl">
            {/* Browser chrome */}
            <div className="flex h-10 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-subtle)] px-4 sm:h-11 sm:px-5">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
              </div>

              <div className="hidden items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />

                <span className="font-mono text-[9px] text-[var(--text-muted)]">
                  local workspace
                </span>
              </div>

              <div className="w-8" />
            </div>

            {/* Application header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                  <Sparkles size={14} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[var(--text)]">
                    Asset workspace
                  </p>

                  <p className="text-[9px] text-[var(--text-muted)]">
                    Untitled project
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                {["Create", "Edit", "Convert", "Inspect"].map((item) => (
                  <span
                    key={item}
                    className="rounded-md px-2 py-1 text-[9px] font-medium text-[var(--text-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview area */}
            <div className="bg-[var(--editor-workspace)] px-4 py-5 sm:px-8 sm:py-8">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:rounded-2xl sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[var(--text)]">
                      Icon & asset generation
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                      Preview, inspect and prepare production assets.
                    </p>
                  </div>

                  <span className="hidden rounded-md bg-[var(--success-bg)] px-2 py-1 text-[9px] font-semibold text-[var(--success)] sm:block">
                    READY
                  </span>
                </div>

                <IconSpecimenStrip className="justify-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}