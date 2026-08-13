// src/pages/Create/CreateExport.tsx

import { Check, ChevronDown, Download, FileCode2, Image } from "lucide-react";
import { useState } from "react";

import type {
  BackgroundSettings,
  CanvasSize,
  DesignObject,
} from "./CreatePage";

type Props = {
  canvasSize: CanvasSize;
  objects: DesignObject[];
  background: BackgroundSettings;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

function getBackgroundCss(background: BackgroundSettings) {
  if (background.type === "transparent") {
    return "transparent";
  }

  if (background.type === "gradient") {
    return `linear-gradient(${background.gradientAngle}deg, ${background.gradientFrom}, ${background.gradientTo})`;
  }

  return background.color;
}

function createSvg(
  canvasSize: CanvasSize,
  objects: DesignObject[],
  background: BackgroundSettings,
) {
  const backgroundValue = getBackgroundCss(background);

  const backgroundMarkup =
    background.type === "solid"
      ? `<rect width="100%" height="100%" fill="${backgroundValue}" />`
      : background.type === "gradient"
        ? `
          <defs>
            <linearGradient
              id="background-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientTransform="rotate(${background.gradientAngle} .5 .5)"
            >
              <stop offset="0%" stop-color="${background.gradientFrom}" />
              <stop offset="100%" stop-color="${background.gradientTo}" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#background-gradient)" />
        `
        : "";

  const objectMarkup = objects
    .filter((object) => object.visible)
    .map((object) => {
      const transform = `rotate(${object.rotation} ${object.x + object.width / 2} ${object.y + object.height / 2})`;

      if (object.type === "circle") {
        return `
          <circle
            cx="${object.x + object.width / 2}"
            cy="${object.y + object.height / 2}"
            r="${Math.min(object.width, object.height) / 2}"
            fill="${object.fill}"
            opacity="${object.opacity}"
          />
        `;
      }

      if (object.type === "text") {
        return `
          <text
            x="${object.x + object.width / 2}"
            y="${object.y + (object.fontSize ?? 36)}"
            fill="${object.fill}"
            font-family="${object.fontFamily ?? "Inter"}"
            font-size="${object.fontSize ?? 36}px"
            font-weight="${object.fontWeight ?? 700}"
            letter-spacing="${object.letterSpacing ?? 0}px"
            text-anchor="middle"
            opacity="${object.opacity}"
            transform="${transform}"
          >
            ${object.text ?? ""}
          </text>
        `;
      }

      if (object.type === "line") {
        return `
          <rect
            x="${object.x}"
            y="${object.y}"
            width="${object.width}"
            height="${object.height}"
            rx="${object.height / 2}"
            fill="${object.fill}"
            opacity="${object.opacity}"
            transform="${transform}"
          />
        `;
      }

      return `
        <rect
          x="${object.x}"
          y="${object.y}"
          width="${object.width}"
          height="${object.height}"
          rx="${object.radius}"
          fill="${object.fill}"
          stroke="${object.stroke}"
          stroke-width="${object.strokeWidth}"
          opacity="${object.opacity}"
          transform="${transform}"
        />
      `;
    })
    .join("");

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${canvasSize.width}"
      height="${canvasSize.height}"
      viewBox="0 0 ${canvasSize.width} ${canvasSize.height}"
    >
      ${backgroundMarkup}
      ${objectMarkup}
    </svg>
  `.trim();
}

export default function CreateExport({
  canvasSize,
  objects,
  background,
}: Props) {
  const [open, setOpen] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const exportSvg = () => {
    const svg = createSvg(canvasSize, objects, background);

    downloadBlob(
      new Blob([svg], {
        type: "image/svg+xml",
      }),
      "icontoolkit-design.svg",
    );

    setExported("SVG");

    setTimeout(() => setExported(null), 1800);
  };

  const exportPng = async () => {
    const svg = createSvg(canvasSize, objects, background);

    const blob = new Blob([svg], {
      type: "image/svg+xml",
    });

    const url = URL.createObjectURL(blob);

    const image = new window.Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      const context = canvas.getContext("2d");

      if (!context) return;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((png) => {
        if (png) {
          downloadBlob(png, "icontoolkit-design.png");
        }
      }, "image/png");

      URL.revokeObjectURL(url);
    };

    image.src = url;

    setExported("PNG");

    setTimeout(() => setExported(null), 1800);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          inline-flex h-9 items-center gap-2 rounded-lg
          bg-[#6366F1] px-3.5 text-xs font-semibold text-white
          shadow-[0_4px_14px_rgba(99,102,241,0.18)]
          transition-all hover:bg-[#4F46E5]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#6366F1]
          focus-visible:ring-offset-2
        "
      >
        {exported ? (
          <>
            <Check size={14} />
            Exported {exported}
          </>
        ) : (
          <>
            <Download size={14} />
            Export
            <ChevronDown
              size={13}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_16px_50px_rgba(15,23,42,0.16)]">
          <div className="px-2.5 py-2">
            <div className="text-[11px] font-semibold text-[var(--text)]">
              Export design
            </div>

            <div className="mt-0.5 text-[10px] text-[var(--text-muted)]">
              {canvasSize.width} × {canvasSize.height}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              exportPng();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-[var(--surface-muted)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
              <Image size={15} />
            </span>

            <span>
              <span className="block text-[11px] font-semibold text-[var(--text)]">
                Export PNG
              </span>

              <span className="block text-[9px] text-[var(--text-muted)]">
                Best for images
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              exportSvg();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-[var(--surface-muted)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
              <FileCode2 size={15} />
            </span>

            <span>
              <span className="block text-[11px] font-semibold text-[var(--text)]">
                Export SVG
              </span>

              <span className="block text-[9px] text-[var(--text-muted)]">
                Best for icons & logos
              </span>
            </span>
          </button>

          <div className="my-1.5 border-t border-[var(--border)]" />

          <div className="px-2.5 py-2 text-[9px] leading-4 text-[var(--text-muted)]">
            SVG exports remain scalable and can be opened directly in your
            existing design tools.
          </div>
        </div>
      )}
    </div>
  );
}
