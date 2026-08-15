// src/pages/Edit/ResizeTool.tsx
// src/pages/Edit/ResizeTool.tsx
// src/pages/Edit/ResizeTool.tsx

import { useId } from "react";
import {
  ArrowLeftRight,
  Check,
  Lock,
  Maximize2,
  Minimize2,
  Unlock,
} from "lucide-react";

import type { ResizeMode, ResizeSettings } from "./EditPage";

export interface ResizeToolProps {
  imageWidth: number;
  imageHeight: number;
  resize: ResizeSettings;
  onChange: (updates: Partial<ResizeSettings>) => void;
}

type ResizePreset = {
  label: string;
  width: number;
  height: number;
};

const PRESETS: ResizePreset[] = [
  {
    label: "Original",
    width: 0,
    height: 0,
  },
  {
    label: "Square",
    width: 1080,
    height: 1080,
  },
  {
    label: "HD",
    width: 1280,
    height: 720,
  },
  {
    label: "Full HD",
    width: 1920,
    height: 1080,
  },
  {
    label: "Portrait",
    width: 1080,
    height: 1350,
  },
  {
    label: "Story",
    width: 1080,
    height: 1920,
  },
];

const RESIZE_MODES: {
  id: ResizeMode;
  label: string;
  description: string;
}[] = [
  {
    id: "fit",
    label: "Fit",
    description: "Show the entire image without distortion.",
  },
  {
    id: "fill",
    label: "Fill",
    description: "Fill the canvas and crop overflowing edges.",
  },
  {
    id: "stretch",
    label: "Stretch",
    description: "Fill the canvas, allowing distortion.",
  },
];

function safeDimension(value: number, fallback = 1) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.round(value));
}

function getAspectRatio(width: number, height: number) {
  if (!width || !height) {
    return 1;
  }

  return width / height;
}

function greatestCommonDivisor(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));

  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a || 1;
}

function formatRatio(width: number, height: number) {
  if (!width || !height) {
    return "—";
  }

  const divisor = greatestCommonDivisor(width, height);

  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
}

function getMegapixels(width: number, height: number) {
  return (width * height) / 1_000_000;
}

function getRatioDifference(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const sourceRatio = getAspectRatio(sourceWidth, sourceHeight);
  const targetRatio = getAspectRatio(targetWidth, targetHeight);

  return Math.abs(sourceRatio - targetRatio);
}



export default function ResizeTool({
  imageWidth,
  imageHeight,
  resize,
  onChange,
}: ResizeToolProps) {
  const originalRatio = getAspectRatio(imageWidth, imageHeight);

  const width = safeDimension(resize.width, imageWidth || 1);
  const height = safeDimension(resize.height, imageHeight || 1);

  const megapixels = getMegapixels(width, height);

  const ratioDifference = getRatioDifference(
    imageWidth,
    imageHeight,
    width,
    height,
  );

  const aspectRatioChanged = ratioDifference > 0.01;

  const setWidth = (value: number) => {
    const nextWidth = safeDimension(value);

    if (resize.lockAspectRatio) {
      onChange({
        width: nextWidth,
        height: Math.max(
          1,
          Math.round(nextWidth / originalRatio),
        ),
      });

      return;
    }

    onChange({
      width: nextWidth,
    });
  };

  const setHeight = (value: number) => {
    const nextHeight = safeDimension(value);

    if (resize.lockAspectRatio) {
      onChange({
        height: nextHeight,
        width: Math.max(
          1,
          Math.round(nextHeight * originalRatio),
        ),
      });

      return;
    }

    onChange({
      height: nextHeight,
    });
  };

  const swapDimensions = () => {
    onChange({
      width: height,
      height: width,
      lockAspectRatio: false,
    });
  };

  const useOriginalAspectRatio = () => {
    const nextWidth = width;

    onChange({
      width: nextWidth,
      height: Math.max(
        1,
        Math.round(nextWidth / originalRatio),
      ),
      lockAspectRatio: true,
    });
  };

  const applyPreset = (preset: ResizePreset) => {
    if (preset.label === "Original") {
      onChange({
        width: imageWidth,
        height: imageHeight,
        lockAspectRatio: true,
      });

      return;
    }

    onChange({
      width: preset.width,
      height: preset.height,
      lockAspectRatio: false,
    });
  };

  const scalePercentage =
    imageWidth && imageHeight
      ? Math.round(
          ((width * height) /
            (imageWidth * imageHeight)) *
            100,
        )
      : 100;

  return (
    <section className="w-full p-4">
      {/* HEADER */}

      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Resize
        </h3>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Set the final output canvas and choose how the image should
          fit inside it.
        </p>
      </div>

      {/* SIZE SUMMARY */}

      <div className="mb-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Original
          </span>

          <span className="font-mono text-xs font-medium text-[var(--text)]">
            {imageWidth || 0} × {imageHeight || 0}px
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Output
          </span>

          <span className="font-mono text-xs font-semibold text-[var(--brand)]">
            {width} × {height}px
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Scale
          </span>

          <span className="font-mono text-xs text-[var(--text-secondary)]">
            {scalePercentage}%
          </span>
        </div>
      </div>

      {/* PRESETS */}

      <div className="mb-5">
        <div className="mb-2 text-xs font-semibold text-[var(--text-secondary)]">
          Presets
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => {
            const isActive =
              preset.label === "Original"
                ? width === imageWidth && height === imageHeight
                : width === preset.width &&
                  height === preset.height;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2.5 text-left transition ${
                  isActive
                    ? "border-[var(--brand)] bg-[var(--brand-light)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-[var(--text)]">
                    {preset.label}
                  </span>

                  <span className="mt-0.5 block text-[10px] text-[var(--text-muted)]">
                    {preset.label === "Original"
                      ? `${imageWidth} × ${imageHeight}`
                      : `${preset.width} × ${preset.height}`}
                  </span>
                </span>

                {isActive && (
                  <Check
                    size={13}
                    className="shrink-0 text-[var(--brand)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DIMENSIONS */}

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Dimensions
          </span>

          <button
            type="button"
            onClick={swapDimensions}
            title="Swap width and height"
            className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
          >
            <ArrowLeftRight size={12} />
            Swap
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DimensionField
            label="Width"
            value={width}
            onChange={setWidth}
          />

          <DimensionField
            label="Height"
            value={height}
            onChange={setHeight}
          />
        </div>
      </div>

      {/* ASPECT LOCK */}

      <button
        type="button"
        onClick={() =>
          onChange({
            lockAspectRatio: !resize.lockAspectRatio,
          })
        }
        aria-pressed={resize.lockAspectRatio}
        className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition ${
          resize.lockAspectRatio
            ? "border-[var(--brand)] bg-[var(--brand-light)]"
            : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
        }`}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)]"
          aria-hidden="true"
        >
          {resize.lockAspectRatio ? (
            <Lock size={14} />
          ) : (
            <Unlock size={14} />
          )}
        </span>

        <span className="min-w-0">
          <span className="block text-xs font-semibold text-[var(--text)]">
            Maintain aspect ratio
          </span>

          <span className="mt-0.5 block text-[11px] leading-4 text-[var(--text-muted)]">
            {resize.lockAspectRatio
              ? "Changing one dimension automatically updates the other."
              : "Width and height can be changed independently."}
          </span>
        </span>
      </button>

      {/* RESIZE MODE */}

      <div className="mt-5">
        <div className="mb-2">
          <div className="text-xs font-semibold text-[var(--text-secondary)]">
            Resize mode
          </div>

          <div className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
            Controls how the source image occupies the output canvas.
          </div>
        </div>

        <div className="space-y-2">
          {RESIZE_MODES.map((mode) => {
            const active = resize.mode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() =>
                  onChange({
                    mode: mode.id,
                  })
                }
                aria-pressed={active}
                className={`flex w-full items-start gap-3 rounded-[var(--radius-md)] border p-3 text-left transition ${
                  active
                    ? "border-[var(--brand)] bg-[var(--brand-light)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    active
                      ? "border-[var(--brand)]"
                      : "border-[var(--border-strong)]"
                  }`}
                >
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
                  )}
                </span>

                <span>
                  <span className="block text-xs font-semibold text-[var(--text)]">
                    {mode.label}
                  </span>

                  <span className="mt-0.5 block text-[10px] leading-4 text-[var(--text-muted)]">
                    {mode.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DIFFERENT RATIO */}

      {aspectRatioChanged && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)]/30 bg-[var(--warning-bg)] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
            <Maximize2 size={13} />
            Different aspect ratio
          </div>

          <p className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
            Original:{" "}
            <strong>
              {formatRatio(imageWidth, imageHeight)}
            </strong>
            {" · "}
            Output:{" "}
            <strong>
              {formatRatio(width, height)}
            </strong>
          </p>

          {resize.mode === "fit" && (
            <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
              Fit mode preserves the complete image and leaves unused
              canvas space around it.
            </p>
          )}

          {resize.mode === "fill" && (
            <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
              Fill mode preserves the image proportions but crops the
              parts that extend beyond the output canvas.
            </p>
          )}

          {resize.mode === "stretch" && (
            <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
              Stretch mode fills the canvas completely but may distort
              the image.
            </p>
          )}

          {resize.lockAspectRatio && (
            <button
              type="button"
              onClick={useOriginalAspectRatio}
              className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[10px] font-medium text-[var(--text)] hover:bg-[var(--surface-muted)]"
            >
              Restore original ratio
            </button>
          )}
        </div>
      )}

      {/* OUTPUT INFORMATION */}

      <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Original ratio
          </span>

          <span className="font-mono text-xs text-[var(--text)]">
            {formatRatio(imageWidth, imageHeight)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Output ratio
          </span>

          <span className="font-mono text-xs text-[var(--text)]">
            {formatRatio(width, height)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Output size
          </span>

          <span className="text-xs font-medium text-[var(--text)]">
            {megapixels.toFixed(2)} MP
          </span>
        </div>
      </div>

      {/* LARGE IMAGE WARNING */}

      {megapixels >= 40 && (
        <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--warning)]/30 bg-[var(--warning-bg)] p-3">
          <div className="text-xs font-semibold text-[var(--text)]">
            Large output
          </div>

          <p className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
            This output is {megapixels.toFixed(1)} MP. Large canvases
            may require more browser memory during export.
          </p>
        </div>
      )}

      {/* RESET */}

      <button
        type="button"
        onClick={() =>
          onChange({
            width: imageWidth,
            height: imageHeight,
            lockAspectRatio: true,
            mode: "fit",
          })
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
      >
        <Minimize2 size={13} />
        Reset to original
      </button>
    </section>
  );
}

function DimensionField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <label htmlFor={id}>
      <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>

      <div className="relative">
        <input
          id={id}
          type="number"
          min={1}
          max={32768}
          step={1}
          value={value}
          onChange={(event) => {
            const raw = event.target.value;

            if (!raw) {
              onChange(1);
              return;
            }

            const numericValue = Number(raw);

            if (!Number.isFinite(numericValue)) {
              return;
            }

            onChange(
              Math.min(
                32768,
                Math.max(1, Math.round(numericValue)),
              ),
            );
          }}
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 pr-12 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
          px
        </span>
      </div>
    </label>
  );
}