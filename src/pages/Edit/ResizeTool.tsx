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

export default function ResizeTool({
  imageWidth,
  imageHeight,
  resize,
  onChange,
}: ResizeToolProps) {
  const originalRatio = imageWidth && imageHeight ? imageWidth / imageHeight : 1;
  const megapixels = (resize.width * resize.height) / 1_000_000;

  const setWidth = (value: number) => {
    if (resize.lockAspectRatio) {
      onChange({ width: value, height: Math.round(value / originalRatio) });
    } else {
      onChange({ width: value });
    }
  };

  const setHeight = (value: number) => {
    if (resize.lockAspectRatio) {
      onChange({ height: value, width: Math.round(value * originalRatio) });
    } else {
      onChange({ height: value });
    }
  };

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Resize</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Change the image dimensions while preserving quality.
        </p>
      </div>

      <div className="mb-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[var(--text-muted)]">Original size</span>
          <span className="font-mono text-xs font-medium text-[var(--text)]">
            {imageWidth} × {imageHeight}px
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs text-[var(--text-muted)]">New size</span>
          <span className="font-mono text-xs font-semibold text-[var(--brand)]">
            {resize.width} × {resize.height}px
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DimensionField label="Width" value={resize.width} onChange={setWidth} />
        <DimensionField label="Height" value={resize.height} onChange={setHeight} />
      </div>

      <button
        type="button"
        onClick={() => onChange({ lockAspectRatio: !resize.lockAspectRatio })}
        aria-pressed={resize.lockAspectRatio}
        className={`mt-4 flex w-full items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition ${
          resize.lockAspectRatio
            ? "border-[var(--brand)] bg-[var(--brand-light)]"
            : "border-[var(--border)] bg-[var(--surface)]"
        }`}
      >
        <span className="text-base" aria-hidden="true">
          {resize.lockAspectRatio ? "🔗" : "⛓️"}
        </span>

        <span>
          <span className="block text-xs font-semibold text-[var(--text)]">
            Maintain aspect ratio
          </span>
          <span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">
            Prevent accidental stretching.
          </span>
        </span>
      </button>

      <div className="mt-4 flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--surface-muted)] px-3 py-2">
        <span className="text-xs text-[var(--text-muted)]">Output size</span>
        <span className="text-xs font-medium text-[var(--text)]">
          {megapixels.toFixed(2)} MP
        </span>
      </div>

      <button
        type="button"
        onClick={() => onChange({ width: imageWidth, height: imageHeight })}
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
          onChange={(event) => onChange(Math.max(1, Number(event.target.value)))}
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 pr-12 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)]"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
          px
        </span>
      </div>
    </label>
  );
}