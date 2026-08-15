// src/pages/Edit/CropTool.tsx
// src/pages/Edit/CropTool.tsx

import React from "react";

export type CropAspectRatio = "free" | "1:1" | "4:3" | "3:2" | "16:9" | "9:16";

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropToolProps {
  imageUrl: string | null;
  imageWidth: number;
  imageHeight: number;
  crop: CropSettings | null;
  onChange: (crop: CropSettings | null) => void;
}

const aspectRatios: {
  value: CropAspectRatio;
  label: string;
}[] = [
  { value: "free", label: "Free" },
  { value: "1:1", label: "1 : 1" },
  { value: "4:3", label: "4 : 3" },
  { value: "3:2", label: "3 : 2" },
  { value: "16:9", label: "16 : 9" },
  { value: "9:16", label: "9 : 16" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getRatioValue(ratio: CropAspectRatio) {
  if (ratio === "free") {
    return null;
  }

  const [width, height] = ratio.split(":").map(Number);

  return width / height;
}

export default function CropTool({
  imageUrl,
  imageWidth,
  imageHeight,
  crop,
  onChange,
}: CropToolProps) {
  const currentCrop = crop ?? {
    x: 0,
    y: 0,
    width: imageWidth,
    height: imageHeight,
  };

  const updateCrop = (updates: Partial<CropSettings>) => {
    const next = {
      ...currentCrop,
      ...updates,
    };

    const maxWidth = Math.max(1, imageWidth - next.x);
    const maxHeight = Math.max(1, imageHeight - next.y);

    onChange({
      x: clamp(next.x, 0, Math.max(0, imageWidth - 1)),
      y: clamp(next.y, 0, Math.max(0, imageHeight - 1)),
      width: clamp(next.width, 1, maxWidth),
      height: clamp(next.height, 1, maxHeight),
    });
  };

  const handleAspectRatioChange = (ratio: CropAspectRatio) => {
    if (ratio === "free") {
      return;
    }

    const aspect = getRatioValue(ratio);

    if (!aspect) {
      return;
    }

    let width = currentCrop.width;
    let height = Math.round(width / aspect);

    if (height > imageHeight - currentCrop.y) {
      height = imageHeight - currentCrop.y;
      width = Math.round(height * aspect);
    }

    if (width > imageWidth - currentCrop.x) {
      width = imageWidth - currentCrop.x;
      height = Math.round(width / aspect);
    }

    onChange({
      ...currentCrop,
      width: Math.max(1, width),
      height: Math.max(1, height),
    });
  };

  const resetCrop = () => {
    onChange({
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
    });
  };

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Crop</h3>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Trim your image and control the exact crop area.
        </p>
      </div>

      {imageUrl && (
        <div className="mb-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]">
          <img
            src={imageUrl}
            alt=""
            className="block max-h-40 w-full object-contain"
          />
        </div>
      )}

      <div className="mb-4">
        <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
          Aspect ratio
        </span>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.value}
              type="button"
              onClick={() => handleAspectRatioChange(ratio.value)}
              className="
                min-h-9 rounded-[var(--radius-md)]
                border border-[var(--border)]
                bg-[var(--surface)]
                px-2 text-xs font-medium
                text-[var(--text-secondary)]
                transition
                hover:bg-[var(--surface-muted)]
              "
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField
          label="X position"
          value={currentCrop.x}
          min={0}
          max={Math.max(0, imageWidth - 1)}
          onChange={(value) => updateCrop({ x: value })}
        />

        <NumberField
          label="Y position"
          value={currentCrop.y}
          min={0}
          max={Math.max(0, imageHeight - 1)}
          onChange={(value) => updateCrop({ y: value })}
        />

        <NumberField
          label="Width"
          value={currentCrop.width}
          min={1}
          max={Math.max(1, imageWidth - currentCrop.x)}
          onChange={(value) => updateCrop({ width: value })}
        />

        <NumberField
          label="Height"
          value={currentCrop.height}
          min={1}
          max={Math.max(1, imageHeight - currentCrop.y)}
          onChange={(value) => updateCrop({ height: value })}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={resetCrop}
          className="
            min-h-10 rounded-[var(--radius-md)]
            border border-[var(--border)]
            px-4 text-sm font-medium
            text-[var(--text-secondary)]
            hover:bg-[var(--surface-muted)]
          "
        >
          Reset crop
        </button>
      </div>
    </section>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

function NumberField({
  label,
  value,
  min = 0,
  max,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value);

          if (!Number.isFinite(parsed)) {
            return;
          }

          onChange(
            Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, parsed)),
          );
        }}
        className="
          h-10 w-full
          rounded-[var(--radius-md)]
          border border-[var(--border)]
          bg-[var(--surface)]
          px-3 text-sm
          text-[var(--text)]
          outline-none
          focus:border-[var(--brand)]
        "
      />
    </label>
  );
}