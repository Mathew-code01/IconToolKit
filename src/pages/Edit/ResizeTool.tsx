// src/pages/Edit/ResizeTool.tsx
// src/pages/Edit/ResizeTool.tsx

// src/pages/Edit/ResizeTool.tsx

import { useId } from "react";
import type { ResizeSettings } from "./EditPage";

export interface ResizeToolProps {
  imageWidth: number;
  imageHeight: number;
  resize: ResizeSettings;
  onChange: (updates: Partial<ResizeSettings>) => void;
}

function getAspectRatio(width: number, height: number) {
  if (!width || !height) {
    return 1;
  }

  return width / height;
}

function getAspectRatioDifference(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const sourceRatio = getAspectRatio(sourceWidth, sourceHeight);
  const targetRatio = getAspectRatio(targetWidth, targetHeight);

  return Math.abs(sourceRatio - targetRatio);
}

function formatRatio(width: number, height: number) {
  if (!width || !height) {
    return "—";
  }

  const divisor = greatestCommonDivisor(width, height);

  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
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

export default function ResizeTool({
  imageWidth,
  imageHeight,
  resize,
  onChange,
}: ResizeToolProps) {
  const originalRatio = getAspectRatio(imageWidth, imageHeight);

  
  const megapixels = (resize.width * resize.height) / 1_000_000;

  const ratioDifference = getAspectRatioDifference(
    imageWidth,
    imageHeight,
    resize.width,
    resize.height,
  );

  const aspectRatioChanged = ratioDifference > 0.01;

  const setWidth = (value: number) => {
    const width = Math.max(1, Math.round(value));

    if (resize.lockAspectRatio) {
      onChange({
        width,
        height: Math.max(1, Math.round(width / originalRatio)),
      });
    } else {
      onChange({ width });
    }
  };

  const setHeight = (value: number) => {
    const height = Math.max(1, Math.round(value));

    if (resize.lockAspectRatio) {
      onChange({
        height,
        width: Math.max(1, Math.round(height * originalRatio)),
      });
    } else {
      onChange({ height });
    }
  };

  const useOriginalAspectRatio = () => {
    const width = resize.width;

    onChange({
      width,
      height: Math.max(1, Math.round(width / originalRatio)),
      lockAspectRatio: true,
    });
  };

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Resize
        </h3>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Set the final output canvas size. The image is fitted inside the
          canvas instead of being stretched automatically.
        </p>
      </div>

      {/* SIZE SUMMARY */}

      <div className="mb-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Original
          </span>

          <span className="font-mono text-xs font-medium text-[var(--text)]">
            {imageWidth} × {imageHeight}px
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Output
          </span>

          <span className="font-mono text-xs font-semibold text-[var(--brand)]">
            {resize.width} × {resize.height}px
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Output ratio
          </span>

          <span className="font-mono text-xs text-[var(--text-secondary)]">
            {formatRatio(resize.width, resize.height)}
          </span>
        </div>
      </div>

      {/* DIMENSIONS */}

      <div className="grid gap-3 sm:grid-cols-2">
        <DimensionField
          label="Width"
          value={resize.width}
          onChange={setWidth}
        />

        <DimensionField
          label="Height"
          value={resize.height}
          onChange={setHeight}
        />
      </div>

      {/* ASPECT RATIO LOCK */}

      <button
        type="button"
        onClick={() =>
          onChange({
            lockAspectRatio: !resize.lockAspectRatio,
          })
        }
        aria-pressed={resize.lockAspectRatio}
        className={`mt-4 flex w-full items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition ${
          resize.lockAspectRatio
            ? "border-[var(--brand)] bg-[var(--brand-light)]"
            : "border-[var(--border)] bg-[var(--surface)]"
        }`}
      >
        <span
          className="text-base"
          aria-hidden="true"
        >
          {resize.lockAspectRatio ? "🔗" : "⛓️"}
        </span>

        <span className="min-w-0">
          <span className="block text-xs font-semibold text-[var(--text)]">
            Maintain aspect ratio
          </span>

          <span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">
            Prevent the source image from being stretched.
          </span>
        </span>
      </button>

      {/* DIFFERENT ASPECT RATIO WARNING */}

      {aspectRatioChanged && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)]/30 bg-[var(--warning-bg)] p-3">
          <div className="text-xs font-semibold text-[var(--text)]">
            Different aspect ratio
          </div>

          <p className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
            Your original image is {formatRatio(imageWidth, imageHeight)},
            while the requested output is{" "}
            {formatRatio(resize.width, resize.height)}.
          </p>

          <p className="mt-2 text-[11px] leading-5 text-[var(--text-muted)]">
            A square image cannot naturally become a rectangle without
            changing the composition. The editor will preserve the image
            proportions and use the output canvas around it rather than
            stretching the image.
          </p>

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

      {/* RATIO INFORMATION */}

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
            {formatRatio(resize.width, resize.height)}
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

      {/* RESET */}

      <button
        type="button"
        onClick={() =>
          onChange({
            width: imageWidth,
            height: imageHeight,
            lockAspectRatio: true,
          })
        }
        className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
      >
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
          value={value}
          onChange={(event) => {
            const numericValue = Number(event.target.value);

            onChange(
              Number.isFinite(numericValue)
                ? Math.max(1, numericValue)
                : 1,
            );
          }}
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 pr-12 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)]"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
          px
        </span>
      </div>
    </label>
  );
}