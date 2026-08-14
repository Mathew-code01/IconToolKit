// src/pages/Edit/CropTool.tsx
// src/pages/Edit/CropTool.tsx

import { useId } from "react";
import type { CropSettings } from "./EditPage";

export interface CropToolProps {
  imageUrl: string | null;
  imageWidth: number;
  imageHeight: number;
  crop: CropSettings | null;
  onChange: (crop: CropSettings | null) => void;
}

type AspectPreset = "free" | "1:1" | "4:3" | "16:9" | "9:16";

const PRESETS: { id: AspectPreset; label: string; ratio: number | null }[] = [
  { id: "free", label: "Free", ratio: null },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "4:3", label: "4:3", ratio: 4 / 3 },
  { id: "16:9", label: "16:9", ratio: 16 / 9 },
  { id: "9:16", label: "9:16", ratio: 9 / 16 },
];

export default function CropTool({
  imageUrl,
  imageWidth,
  imageHeight,
  crop,
  onChange,
}: CropToolProps) {
  const disabled = !imageUrl || !imageWidth || !imageHeight;

  const current: CropSettings = crop ?? {
    x: 0,
    y: 0,
    width: imageWidth,
    height: imageHeight,
  };

  const applyPreset = (ratio: number | null) => {
    if (disabled) return;

    if (ratio === null) {
      onChange({ x: 0, y: 0, width: imageWidth, height: imageHeight });
      return;
    }

    let width = imageWidth;
    let height = width / ratio;

    if (height > imageHeight) {
      height = imageHeight;
      width = height * ratio;
    }

    onChange({
      x: (imageWidth - width) / 2,
      y: (imageHeight - height) / 2,
      width,
      height,
    });
  };

  const update = (key: keyof CropSettings, value: number) => {
    onChange({ ...current, [key]: Math.max(0, value) });
  };

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Crop</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Trim your image and control the exact crop area.
        </p>
      </div>

      <div className="mb-4">
        <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
          Aspect ratio
        </span>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => applyPreset(preset.ratio)}
              className="min-h-9 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label="X position"
          value={Math.round(current.x)}
          min={0}
          disabled={disabled}
          onChange={(value) => update("x", value)}
        />

        <NumberField
          label="Y position"
          value={Math.round(current.y)}
          min={0}
          disabled={disabled}
          onChange={(value) => update("y", value)}
        />

        <NumberField
          label="Width"
          value={Math.round(current.width)}
          min={1}
          disabled={disabled}
          onChange={(value) => update("width", value)}
        />

        <NumberField
          label="Height"
          value={Math.round(current.height)}
          min={1}
          disabled={disabled}
          onChange={(value) => update("height", value)}
        />
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(null)}
        className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset crop
      </button>
    </section>
  );
}

function NumberField({
  label,
  value,
  min = 0,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>

      <input
        id={id}
        type="number"
        min={min}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Math.max(min, Number(event.target.value)))}
        className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
      />
    </label>
  );
}