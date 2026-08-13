// src/pages/Home/HeroSection.tsx

import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  FileImage,
  Globe,
  Lock,
  Sparkles,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

import IconSpecimenStrip from "./IconSpecimenStrip";

const STATS = [
  {
    value: "13+",
    label: "icon sizes",
  },
  {
    value: "100%",
    label: "browser-based",
  },
  {
    value: "0",
    label: "uploads required",
  },
];

const SUPPORTED_FORMATS = ["PNG", "JPG", "WEBP", "SVG"];

export default function HeroSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

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
        overflow-hidden
        border-b
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.45]
          [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
          [background-size:48px_48px]
          [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent_85%)]
        "
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-180px]
          h-[420px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-[#6366F1]/[0.08]
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[1440px]
          px-4
          pb-16
          pt-14
          sm:px-6
          sm:pb-20
          sm:pt-20
          lg:px-8
          lg:pb-28
          lg:pt-24
          xl:px-10
        "
      >
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
              bg-[var(--surface)]/90
              px-3
              py-1.5
              shadow-sm
              backdrop-blur
            "
          >
            <span
              className="
                flex
                h-4
                w-4
                items-center
                justify-center
                rounded-full
                bg-[#6366F1]/10
                text-[#6366F1]
              "
            >
              <Sparkles size={10} strokeWidth={2} aria-hidden="true" />
            </span>

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[var(--text-secondary)]
                sm:text-[11px]
              "
            >
              Browser-first icon toolkit
            </span>
          </div>
        </div>

        {/* Main heading */}
        <div className="mx-auto mt-7 max-w-4xl text-center">
          <h1
            className="
              text-4xl
              font-bold
              leading-[1.05]
              tracking-[-0.045em]
              text-[var(--text)]
              sm:text-5xl
              lg:text-6xl
              xl:text-7xl
            "
          >
            Create, edit, inspect, and
            <span className="block text-[#6366F1]">ship better icons.</span>
          </h1>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-[var(--text-secondary)]
              sm:text-lg
              sm:leading-8
            "
          >
            A professional browser-based toolkit for favicons, app icons, PWA
            assets, conversions, optimization, previews, and developer-ready
            exports.
          </p>
        </div>

        {/* Primary workflow */}
        <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
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
            onDragLeave={(event) => {
              if (event.currentTarget === event.target) {
                setDragging(false);
              }
            }}
            onDrop={handleDrop}
            className={`
              relative
              rounded-2xl
              border
              bg-[var(--surface)]
              p-2
              shadow-[0_20px_60px_rgba(0,0,0,0.06)]
              transition-all
              duration-200
              sm:rounded-3xl
              sm:p-3
              ${
                dragging
                  ? "border-[#6366F1] bg-[#6366F1]/[0.04] shadow-[0_20px_70px_rgba(99,102,241,0.12)]"
                  : "border-[var(--border)]"
              }
            `}
          >
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-[var(--border-strong)]
                px-5
                py-8
                text-center
                sm:rounded-2xl
                sm:px-8
                sm:py-10
              "
            >
              <div className="mx-auto flex w-fit items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#6366F1]/10
                    text-[#6366F1]
                  "
                >
                  <Upload size={20} strokeWidth={2} aria-hidden="true" />
                </div>

                <div className="text-left">
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[var(--text)]
                      sm:text-base
                    "
                  >
                    Start with your logo
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-[var(--text-muted)]
                    "
                  >
                    Drop an image here or choose a file
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  mt-7
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#6366F1]
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_5px_18px_rgba(99,102,241,0.22)]
                  transition-all
                  duration-200
                  hover:bg-[#4F46E5]
                  hover:shadow-[0_8px_24px_rgba(99,102,241,0.28)]
                  active:translate-y-px
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#6366F1]
                  focus-visible:ring-offset-2
                "
              >
                <FileImage size={16} aria-hidden="true" />
                Choose an image
                <ArrowRight size={15} aria-hidden="true" />
              </button>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-3
                  gap-y-1
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-[var(--text-muted)]
                "
              >
                {SUPPORTED_FORMATS.map((format, index) => (
                  <span key={format} className="inline-flex items-center gap-3">
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

          {/* Secondary action */}
          <div
            className="
              mt-4
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            <Link
              to="/inspect"
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
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Lock size={12} aria-hidden="true" />
              Files stay in your browser
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="
            mx-auto
            mt-12
            grid
            max-w-2xl
            grid-cols-3
            border-y
            border-[var(--border)]
            sm:mt-14
          "
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="
                border-r
                border-[var(--border)]
                px-3
                py-5
                text-center
                last:border-r-0
                sm:px-6
                sm:py-6
              "
            >
              <p
                className="
                  text-lg
                  font-bold
                  tracking-[-0.02em]
                  text-[var(--text)]
                  sm:text-xl
                "
              >
                {stat.value}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.06em]
                  text-[var(--text-muted)]
                  sm:text-[11px]
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Product preview */}
        <div className="mx-auto mt-14 max-w-4xl sm:mt-16">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  text-[var(--text)]
                "
              >
                Built for the complete workflow
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  text-[var(--text-muted)]
                "
              >
                Generate the sizes you need in one pass.
              </p>
            </div>

            <div className="hidden items-center gap-1.5 sm:flex">
              <Check size={13} className="text-[#6366F1]" aria-hidden="true" />

              <span
                className="
                  text-[10px]
                  font-medium
                  text-[var(--text-muted)]
                "
              >
                Local processing
              </span>
            </div>
          </div>

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-[0_24px_70px_rgba(0,0,0,0.07)]
            "
          >
            {/* Fake application toolbar */}
            <div
              className="
                flex
                h-11
                items-center
                justify-between
                border-b
                border-[var(--border)]
                px-4
                sm:px-5
              "
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
              </div>

              <span
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.08em]
                  text-[var(--text-muted)]
                "
              >
                icon toolkit / generator
              </span>

              <span className="w-10" />
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <IconSpecimenStrip className="justify-center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}