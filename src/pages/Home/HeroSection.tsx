// src/pages/Home/HeroSection.tsx

import {
  ArrowRight,
  Check,
  ChevronRight,
  FileImage,
  FileText,
  Globe2,
  ImageIcon,
  Layers3,
  Lock,
  ScanSearch,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

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

const WORKSPACE_TOOLS = [
  {
    label: "Create",
    icon: WandSparkles,
  },
  {
    label: "Edit",
    icon: ImageIcon,
  },
  {
    label: "Convert",
    icon: FileImage,
  },
  {
    label: "Inspect",
    icon: ScanSearch,
  },
];

const ASSET_SIZES = [
  {
    size: "16",
    label: "Favicon",
  },
  {
    size: "32",
    label: "Web",
  },
  {
    size: "180",
    label: "Apple",
  },
  {
    size: "512",
    label: "PWA",
  },
];

function BrandMark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  const sizes = {
    sm: "h-7 w-7 rounded-lg text-[9px]",
    md: "h-9 w-9 rounded-xl text-[10px]",
    lg: "h-12 w-12 rounded-2xl text-xs",
  };

  return (
    <span
      className={`
        relative
        inline-flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-[var(--shadow-xs)]
        ${sizes[size]}
        ${className}
      `}
    >
      {!failed ? (
        <img
          src={logo}
          alt="IconToolkit"
          className="h-full w-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-bold tracking-[-0.08em] text-[var(--brand)]">
          IT
        </span>
      )}
    </span>
  );
}

function WorkspacePreview() {
  return (
    <div className="relative">
      {/* =====================================================
          Floating background objects
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-5
          top-8
          hidden
          h-32
          w-32
          rounded-full
          bg-[var(--brand)]/[0.10]
          blur-3xl
          lg:block
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-10
          -left-8
          hidden
          h-40
          w-40
          rounded-full
          bg-[var(--brand-secondary)]/[0.08]
          blur-3xl
          lg:block
        "
      />

      {/* =====================================================
          Floating asset card — top right
          ===================================================== */}

      <div
        className="
          absolute
          -right-3
          -top-5
          z-20
          hidden
          w-40
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]/90
          p-3
          shadow-[var(--shadow-lg)]
          backdrop-blur-xl
          transition-transform
          duration-500
          hover:-translate-y-1
          hover:rotate-1
          sm:block
          lg:-right-8
          lg:-top-7
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Asset ready
          </span>

          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--success-bg)] text-[var(--success)]">
            <Check size={11} strokeWidth={2.5} />
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <BrandMark size="sm" />

          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold text-[var(--text)]">
              brand-mark.png
            </p>

            <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">
              512 × 512
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          Floating asset card — bottom left
          ===================================================== */}

      <div
        className="
          absolute
          -bottom-5
          -left-3
          z-20
          hidden
          w-44
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]/90
          p-3
          shadow-[var(--shadow-lg)]
          backdrop-blur-xl
          transition-transform
          duration-500
          hover:-translate-y-1
          hover:-rotate-1
          sm:block
          lg:-bottom-7
          lg:-left-8
        "
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-brand)] text-[var(--brand)]">
            <Zap size={13} />
          </span>

          <div>
            <p className="text-[10px] font-semibold text-[var(--text)]">
              Production export
            </p>

            <p className="text-[9px] text-[var(--text-muted)]">Ready to ship</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {ASSET_SIZES.slice(0, 3).map((item) => (
            <span
              key={item.size}
              className="
                rounded-md
                border
                border-[var(--border)]
                bg-[var(--surface-subtle)]
                px-1.5
                py-1
                font-mono
                text-[8px]
                font-medium
                text-[var(--text-muted)]
              "
            >
              {item.size}
            </span>
          ))}

          <span className="text-[8px] text-[var(--text-subtle)]">+</span>
        </div>
      </div>

      {/* =====================================================
          Main workspace
          ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[1.5rem]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          shadow-[var(--shadow-xl)]
          transition-all
          duration-500
          hover:-translate-y-1
          hover:shadow-[var(--shadow-xl)]
          sm:rounded-[1.75rem]
        "
      >
        {/* Top browser bar */}

        <div
          className="
            flex
            h-10
            items-center
            justify-between
            border-b
            border-[var(--border)]
            bg-[var(--surface-subtle)]
            px-3
            sm:h-11
            sm:px-4
          "
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
          </div>

          <div
            className="
              flex
              items-center
              gap-1.5
              rounded-md
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-2.5
              py-1
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />

            <span className="font-mono text-[8px] text-[var(--text-muted)]">
              local workspace
            </span>
          </div>

          <div className="w-8" />
        </div>

        {/* Application header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--border)]
            px-4
            py-3
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark size="sm" />

            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-[var(--text)]">
                Asset workspace
              </p>

              <p className="truncate text-[8px] text-[var(--text-muted)]">
                Untitled project
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            {WORKSPACE_TOOLS.map((tool, index) => {
              const Icon = tool.icon;

              return (
                <div
                  key={tool.label}
                  className={`
                    flex
                    items-center
                    gap-1.5
                    rounded-md
                    px-2
                    py-1.5
                    text-[8px]
                    font-medium
                    transition-colors
                    ${
                      index === 0
                        ? "bg-[var(--surface-brand)] text-[var(--brand)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                    }
                  `}
                >
                  <Icon size={10} />
                  {tool.label}
                </div>
              );
            })}
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--text-muted)] sm:hidden">
            <Layers3 size={12} />
          </div>
        </div>

        {/* Workspace body */}

        <div
          className="
            relative
            bg-[var(--editor-workspace)]
            p-3
            sm:p-5
            lg:p-6
          "
        >
          {/* subtle workspace grid */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-50
              [background-image:linear-gradient(to_right,var(--editor-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--editor-grid)_1px,transparent_1px)]
              [background-size:var(--editor-grid-size)_var(--editor-grid-size)]
            "
          />

          <div className="relative grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
            {/* Main canvas */}

            <div
              className="
                relative
                min-h-[280px]
                overflow-hidden
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                shadow-[var(--shadow-sm)]
                sm:min-h-[330px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[var(--border)]
                  px-3
                  py-2.5
                "
              >
                <div>
                  <p className="text-[9px] font-semibold text-[var(--text)]">
                    Preview
                  </p>

                  <p className="mt-0.5 text-[8px] text-[var(--text-muted)]">
                    brand-mark.svg
                  </p>
                </div>

                <span className="rounded-md bg-[var(--success-bg)] px-1.5 py-1 text-[7px] font-semibold text-[var(--success)]">
                  VALID
                </span>
              </div>

              <div className="flex min-h-[230px] items-center justify-center p-5 sm:min-h-[275px]">
                {/* checkerboard canvas */}

                <div
                  className="
                    relative
                    flex
                    h-44
                    w-44
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    shadow-[var(--shadow-md)]
                    transition-transform
                    duration-500
                    hover:scale-[1.03]
                    sm:h-52
                    sm:w-52
                  "
                >
                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      inset-0
                      opacity-40
                      [background-image:linear-gradient(45deg,var(--surface-muted)_25%,transparent_25%),linear-gradient(-45deg,var(--surface-muted)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--surface-muted)_75%),linear-gradient(-45deg,transparent_75%,var(--surface-muted)_75%)]
                      [background-position:0_0,0_8px,8px_-8px,-8px_0]
                      [background-size:16px_16px]
                    "
                  />

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-lg)] sm:h-32 sm:w-32">
                    <BrandMark
                      size="lg"
                      className="h-full w-full rounded-[1.35rem] border-0 shadow-none"
                    />
                  </div>

                  <span className="absolute bottom-2 left-2 rounded-md border border-[var(--border)] bg-[var(--surface)]/90 px-1.5 py-1 font-mono text-[7px] text-[var(--text-muted)] backdrop-blur">
                    512 × 512
                  </span>

                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)]/90 text-[var(--brand)] backdrop-blur">
                    <Sparkles size={9} />
                  </span>
                </div>
              </div>

              {/* Bottom status */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-[var(--border)]
                  px-3
                  py-2.5
                "
              >
                <div className="flex items-center gap-1.5">
                  <Lock size={9} className="text-[var(--success)]" />

                  <span className="text-[8px] text-[var(--text-muted)]">
                    Processed locally
                  </span>
                </div>

                <span className="font-mono text-[8px] text-[var(--text-subtle)]">
                  SVG
                </span>
              </div>
            </div>

            {/* Inspector / output panel */}

            <div className="grid gap-3">
              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-3.5
                  shadow-[var(--shadow-sm)]
                "
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold text-[var(--text)]">
                    Asset details
                  </p>

                  <ChevronRight
                    size={11}
                    className="text-[var(--text-subtle)]"
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["Type", "SVG"],
                    ["Size", "8.4 KB"],
                    ["Canvas", "512²"],
                    ["Status", "Ready"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--surface-subtle)]
                        px-2.5
                        py-2
                      "
                    >
                      <p className="text-[7px] uppercase tracking-[0.08em] text-[var(--text-subtle)]">
                        {label}
                      </p>

                      <p className="mt-1 truncate text-[9px] font-semibold text-[var(--text)]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-3.5
                  shadow-[var(--shadow-sm)]
                "
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold text-[var(--text)]">
                    Export set
                  </p>

                  <span className="text-[8px] font-medium text-[var(--brand)]">
                    4 assets
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  {ASSET_SIZES.map((item, index) => (
                    <div
                      key={item.size}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-lg
                        border
                        border-[var(--border)]
                        bg-[var(--surface-subtle)]
                        px-2.5
                        py-2
                        transition-colors
                        hover:border-[var(--border-brand)]
                        hover:bg-[var(--surface-brand)]
                      "
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--surface-muted)] font-mono text-[7px] font-semibold text-[var(--text-muted)]">
                          {item.size}
                        </span>

                        <span className="text-[8px] font-medium text-[var(--text-secondary)]">
                          {item.label}
                        </span>
                      </div>

                      <Check
                        size={9}
                        className={
                          index === 3
                            ? "text-[var(--text-subtle)]"
                            : "text-[var(--success)]"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace footer */}

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-[var(--border)]
            bg-[var(--surface)]
            px-4
            py-2.5
            sm:px-5
          "
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--surface-brand)] text-[var(--brand)]">
              <Zap size={9} />
            </span>

            <span className="text-[8px] font-medium text-[var(--text-muted)]">
              Fast, local, focused
            </span>
          </div>

          <span className="font-mono text-[8px] text-[var(--text-subtle)]">
            ICONTOOLKIT
          </span>
        </div>
      </div>
    </div>
  );
}

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
     * Existing image workflow is preserved.
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
     * PDF/document workflow remains extensible.
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
    <section
      className="
        relative
        isolate
        overflow-hidden
        border-b
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      {/* =====================================================
          HERO BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="
            absolute
            left-[15%]
            top-[-24rem]
            h-[48rem]
            w-[48rem]
            rounded-full
            bg-[var(--brand)]/[0.055]
            blur-3xl
            dark:bg-[var(--brand)]/[0.09]
          "
        />

        <div
          className="
            absolute
            right-[-14rem]
            top-[18%]
            h-[30rem]
            w-[30rem]
            rounded-full
            bg-[var(--brand-secondary)]/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-[-14rem]
            bottom-[5%]
            h-[26rem]
            w-[26rem]
            rounded-full
            bg-[var(--brand-accent)]/[0.025]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.28]
            [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
            [background-size:64px_64px]
            [mask-image:radial-gradient(ellipse_90%_75%_at_50%_20%,black,transparent_88%)]
          "
        />
      </div>

      {/* =====================================================
          HERO CONTAINER
          ===================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[var(--content-max-width)]
          px-4
          pb-16
          pt-10
          sm:px-6
          sm:pb-20
          sm:pt-14
          lg:px-8
          lg:pb-24
          lg:pt-20
          xl:px-10
          xl:pb-28
        "
      >
        {/* ===================================================
            MAIN TWO-COLUMN COMPOSITION
            =================================================== */}

        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]
            lg:gap-14
            xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
            xl:gap-20
          "
        >
          {/* =================================================
              LEFT — PRODUCT MESSAGE
              ================================================= */}

          <div className="max-w-2xl">
            {/* Eyebrow */}

            <div
              className="
                inline-flex
                max-w-full
                items-center
                gap-2
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]/80
                px-3
                py-1.5
                shadow-[var(--shadow-xs)]
                backdrop-blur-xl
              "
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-brand)] text-[var(--brand)]">
                <Sparkles size={10} strokeWidth={2} />
              </span>

              <span className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] sm:text-[10px]">
                Browser-first asset workspace
              </span>

              <span className="hidden h-1 w-1 shrink-0 rounded-full bg-[var(--border-strong)] sm:block" />

              <span className="hidden whitespace-nowrap text-[9px] font-medium text-[var(--text-muted)] sm:block">
                Private by default
              </span>
            </div>

            {/* Heading */}

            <h1
              className="
                mt-7
                max-w-3xl
                text-[3rem]
                font-bold
                leading-[0.94]
                tracking-[-0.065em]
                text-[var(--text)]
                sm:mt-8
                sm:text-6xl
                lg:text-[4.5rem]
                xl:text-[5.15rem]
              "
            >
              Everything you need
              <span className="block itk-gradient-text">
                to ship better assets.
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-xl
                text-[15px]
                leading-7
                text-[var(--text-secondary)]
                sm:mt-7
                sm:text-lg
                sm:leading-8
                lg:text-[1.05rem]
              "
            >
              Create, edit, convert, optimize and inspect images, icons, PDFs,
              documents and web assets from one focused workspace. Built for
              people who care about the details.
            </p>

            {/* Primary actions */}

            <div
              className="
                mt-8
                flex
                flex-col
                items-stretch
                gap-2.5
                sm:mt-9
                sm:flex-row
                sm:items-center
              "
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  group
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2.5
                  rounded-xl
                  bg-[var(--brand)]
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[var(--shadow-brand)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[var(--brand-hover)]
                  hover:shadow-[var(--shadow-lg)]
                  active:translate-y-0
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--background)]
                "
              >
                <Upload size={16} />
                Start with a file
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>

              <Link
                to="/inspect"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]/70
                  px-5
                  text-sm
                  font-semibold
                  text-[var(--text)]
                  shadow-[var(--shadow-xs)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[var(--border-brand)]
                  hover:bg-[var(--surface)]
                  hover:shadow-[var(--shadow-sm)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                "
              >
                <Globe2 size={16} className="text-[var(--text-muted)]" />
                Inspect a website
                <ArrowRight size={14} className="text-[var(--text-subtle)]" />
              </Link>
            </div>

            {/* Privacy signal */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                text-[10px]
                text-[var(--text-muted)]
                sm:text-[11px]
              "
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--success-bg)]">
                <Lock size={10} className="text-[var(--success)]" />
              </span>

              <span>
                Browser-first processing. Your files stay under your control.
              </span>
            </div>

            {/* Quick actions */}

            <div className="mt-9 border-t border-[var(--border)] pt-5 sm:mt-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                  Jump into a workflow
                </span>

                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.href}
                      to={action.href}
                      className="
                        group
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]/60
                        px-2.5
                        py-2.5
                        backdrop-blur
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-[var(--border-brand)]
                        hover:bg-[var(--surface)]
                        hover:shadow-[var(--shadow-sm)]
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[var(--surface-muted)]
                          text-[var(--text-secondary)]
                          transition-all
                          duration-200
                          group-hover:bg-[var(--surface-brand)]
                          group-hover:text-[var(--brand)]
                        "
                      >
                        <Icon size={14} strokeWidth={1.8} />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-semibold text-[var(--text)]">
                          {action.label}
                        </span>

                        <span className="mt-0.5 block truncate text-[8px] text-[var(--text-muted)]">
                          {action.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT — PRODUCT WORKSPACE
              ================================================= */}

          <div className="relative pt-4 lg:pt-0">
            <WorkspacePreview />
          </div>
        </div>

        {/* ===================================================
            UPLOAD STRIP
            =================================================== */}

        <div className="mt-12 lg:mt-16">
          <input
            ref={fileInputRef}
            type="file"
            accept="
              image/png,
              image/jpeg,
              image/webp,
              image/svg+xml,
              application/pdf,
              application/vnd.openxmlformats-officedocument.wordprocessingml.document
            "
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
              p-1.5
              transition-all
              duration-300
              sm:rounded-3xl
              sm:p-2
              ${
                dragging
                  ? "border-[var(--brand)] bg-[var(--surface-brand)] shadow-[var(--shadow-brand)]"
                  : "border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]"
              }
            `}
          >
            <div
              className="
                relative
                flex
                flex-col
                gap-5
                rounded-xl
                border
                border-dashed
                border-[var(--border-strong)]
                bg-[var(--surface-subtle)]
                px-4
                py-4
                transition-colors
                group-hover:bg-[var(--surface)]
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:rounded-2xl
                sm:px-5
                sm:py-4
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    text-[var(--brand)]
                    shadow-[var(--shadow-xs)]
                  "
                >
                  <Upload size={17} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--text)] sm:text-sm">
                    Drop anything you want to work with
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                    Images, icons, PDFs and supported documents
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {SUPPORTED_FORMATS.map((format) => (
                    <span
                      key={format}
                      className="
                        rounded-md
                        bg-[var(--surface-muted)]
                        px-1.5
                        py-1
                        font-mono
                        text-[8px]
                        font-medium
                        text-[var(--text-muted)]
                      "
                    >
                      {format}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    inline-flex
                    h-9
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    px-3.5
                    text-[11px]
                    font-semibold
                    text-[var(--text)]
                    shadow-[var(--shadow-xs)]
                    transition-all
                    hover:border-[var(--border-brand)]
                    hover:bg-[var(--surface-brand)]
                    hover:text-[var(--brand)]
                  "
                >
                  Choose file
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            TRUST / CAPABILITY BAR
            =================================================== */}

        <div
          className="
            mt-7
            flex
            flex-col
            gap-4
            border-t
            border-[var(--border)]
            pt-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check
                  size={11}
                  strokeWidth={2.5}
                  className="text-[var(--brand)]"
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[9px] font-medium text-[var(--text-subtle)]">
            <FileText size={11} />

            <span>One workspace. Multiple workflows.</span>
          </div>
        </div>
      </div>
    </section>
  );
}