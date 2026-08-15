// src/pages/Edit/CropTool.tsx
// src/pages/Edit/CropTool.tsx
// src/pages/Edit/CropTool.tsx

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { CropSettings } from "./EditPage";

export interface CropToolProps {
  imageUrl: string | null;
  imageWidth: number;
  imageHeight: number;
  crop: CropSettings | null;
  onChange: (crop: CropSettings | null) => void;
}

export interface CropOverlayProps {
  imageUrl: string | null;
  imageWidth: number;
  imageHeight: number;
  crop: CropSettings | null;
  zoom: number;
  onChange: (crop: CropSettings) => void;
  onInteractionStart?: () => void;
}

type AspectPreset = "free" | "1:1" | "4:3" | "16:9" | "9:16";

const PRESETS: {
  id: AspectPreset;
  label: string;
  ratio: number | null;
}[] = [
  { id: "free", label: "Free", ratio: null },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "4:3", label: "4:3", ratio: 4 / 3 },
  { id: "16:9", label: "16:9", ratio: 16 / 9 },
  { id: "9:16", label: "9:16", ratio: 9 / 16 },
];

type DragMode =
  | "move"
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

const MIN_CROP_SIZE = 1;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeCrop(
  crop: CropSettings,
  imageWidth: number,
  imageHeight: number,
): CropSettings {
  const width = clamp(crop.width, MIN_CROP_SIZE, imageWidth);
  const height = clamp(crop.height, MIN_CROP_SIZE, imageHeight);

  return {
    x: clamp(crop.x, 0, Math.max(0, imageWidth - width)),
    y: clamp(crop.y, 0, Math.max(0, imageHeight - height)),
    width,
    height,
  };
}

function createCropFromRatio(
  ratio: number | null,
  imageWidth: number,
  imageHeight: number,
): CropSettings {
  if (!ratio) {
    return {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
    };
  }

  let width = imageWidth;
  let height = width / ratio;

  if (height > imageHeight) {
    height = imageHeight;
    width = height * ratio;
  }

  return {
    x: (imageWidth - width) / 2,
    y: (imageHeight - height) / 2,
    width,
    height,
  };
}

export default function CropTool({
  imageUrl,
  imageWidth,
  imageHeight,
  crop,
  onChange,
}: CropToolProps) {
  const disabled = !imageUrl || !imageWidth || !imageHeight;

  const current = normalizeCrop(
    crop ?? {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
    },
    imageWidth,
    imageHeight,
  );

  const applyPreset = (ratio: number | null) => {
    if (disabled) return;

    onChange(createCropFromRatio(ratio, imageWidth, imageHeight));
  };

  const update = (key: keyof CropSettings, value: number) => {
    if (disabled) return;

    const next = normalizeCrop(
      {
        ...current,
        [key]: value,
      },
      imageWidth,
      imageHeight,
    );

    onChange(next);
  };

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Crop</h3>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Drag the crop box on the image, or enter exact dimensions below.
        </p>
      </div>

      <div className="mb-4 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-light)] p-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]" />

          <p className="text-[10px] leading-4 text-[var(--text-secondary)]">
            Drag inside the crop area to move it. Drag any edge or corner to
            resize the crop.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
          Aspect ratio
        </span>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESETS.map((preset) => {
            const presetCrop = createCropFromRatio(
              preset.ratio,
              imageWidth,
              imageHeight,
            );

            const active =
              Math.abs(
                presetCrop.width / presetCrop.height -
                  current.width / current.height,
              ) < 0.01;

            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => applyPreset(preset.ratio)}
                className={`
                  min-h-9 rounded-[var(--radius-md)]
                  border px-2 text-xs font-medium
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  ${
                    active
                      ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                  }
                `}
              >
                {preset.label}
              </button>
            );
          })}
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

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[var(--text-muted)]">Crop size</span>

          <span className="font-medium text-[var(--text)]">
            {Math.round(current.width)} × {Math.round(current.height)}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px]">
          <span className="text-[var(--text-muted)]">Position</span>

          <span className="font-medium text-[var(--text)]">
            {Math.round(current.x)}, {Math.round(current.y)}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onChange({
            x: 0,
            y: 0,
            width: imageWidth,
            height: imageHeight,
          })
        }
        className="
          mt-4 w-full
          rounded-[var(--radius-md)]
          border border-[var(--border)]
          bg-[var(--surface)]
          px-4 py-2.5
          text-xs font-medium
          text-[var(--text-secondary)]
          transition
          hover:bg-[var(--surface-muted)]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Reset crop
      </button>
    </section>
  );
}

/* =========================================================
   INTERACTIVE CROP OVERLAY
========================================================= */

export function CropOverlay({
  imageUrl,
  imageWidth,
  imageHeight,
  crop,
  zoom,
  onChange,
  onInteractionStart,
}: CropOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    startCrop: CropSettings;
  } | null>(null);

  const [dragging, setDragging] = useState(false);

  const disabled =
    !imageUrl ||
    !imageWidth ||
    !imageHeight ||
    !crop ||
    crop.width <= 0 ||
    crop.height <= 0;

  const current = crop
    ? normalizeCrop(crop, imageWidth, imageHeight)
    : {
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight,
      };

  const displayWidth = imageWidth * (zoom / 100);
  const displayHeight = imageHeight * (zoom / 100);

  const left = current.x * (zoom / 100);
  const top = current.y * (zoom / 100);
  const width = current.width * (zoom / 100);
  const height = current.height * (zoom / 100);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;

      if (!drag || disabled) {
        return;
      }

      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const scale = zoom / 100;

      const deltaX = (clientX - drag.startX) / scale;
      const deltaY = (clientY - drag.startY) / scale;

      const start = drag.startCrop;

      let x = start.x;
      let y = start.y;
      let cropWidth = start.width;
      let cropHeight = start.height;

      const mode = drag.mode;

      if (mode === "move") {
        x = clamp(start.x + deltaX, 0, imageWidth - start.width);

        y = clamp(start.y + deltaY, 0, imageHeight - start.height);
      }

      if (mode.includes("e")) {
        cropWidth = clamp(
          start.width + deltaX,
          MIN_CROP_SIZE,
          imageWidth - start.x,
        );
      }

      if (mode.includes("s")) {
        cropHeight = clamp(
          start.height + deltaY,
          MIN_CROP_SIZE,
          imageHeight - start.y,
        );
      }

      if (mode.includes("w")) {
        const nextX = clamp(
          start.x + deltaX,
          0,
          start.x + start.width - MIN_CROP_SIZE,
        );

        x = nextX;
        cropWidth = start.width + (start.x - nextX);
      }

      if (mode.includes("n")) {
        const nextY = clamp(
          start.y + deltaY,
          0,
          start.y + start.height - MIN_CROP_SIZE,
        );

        y = nextY;
        cropHeight = start.height + (start.y - nextY);
      }

      onChange(
        normalizeCrop(
          {
            x,
            y,
            width: cropWidth,
            height: cropHeight,
          },
          imageWidth,
          imageHeight,
        ),
      );
    },
    [disabled, imageHeight, imageWidth, onChange, zoom],
  );

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      updateFromPointer(event.clientX, event.clientY);
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      setDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, updateFromPointer]);

  const startDrag = (event: React.PointerEvent, mode: DragMode) => {
    if (disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    onInteractionStart?.();

    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startCrop: { ...current },
    };

    setDragging(true);
  };

  if (disabled) {
    return null;
  }

  const handleSize = Math.max(10, Math.min(18, 12 * (zoom / 100)));

  const handleClass =
    "absolute z-30 rounded-sm border-2 border-white bg-[var(--brand)] shadow-[0_1px_5px_rgba(0,0,0,0.45)]";

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute left-0 top-0 z-20"
      style={{
        width: displayWidth,
        height: displayHeight,
      }}
    >
      {/* Darkened area outside crop */}
      <div
        className="absolute inset-0 bg-black/55"
        style={{
          clipPath: `
            polygon(
              0% 0%,
              100% 0%,
              100% 100%,
              0% 100%,
              0% 0%,
              ${left}px ${top}px,
              ${left}px ${top + height}px,
              ${left + width}px ${top + height}px,
              ${left + width}px ${top}px,
              ${left}px ${top}px
            )
          `,
        }}
      />

      {/* Crop box */}
      <div
        className={`
          pointer-events-auto
          absolute
          border-2
          border-white
          ${dragging ? "cursor-grabbing" : "cursor-grab"}
        `}
        style={{
          left,
          top,
          width,
          height,
          touchAction: "none",
        }}
        onPointerDown={(event) => startDrag(event, "move")}
      >
        {/* Rule of thirds */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/35" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-white/35" />
          <div className="absolute left-0 top-1/3 h-px w-full bg-white/35" />
          <div className="absolute left-0 top-2/3 h-px w-full bg-white/35" />
        </div>

        {/* Crop dimensions */}
        <div
          className="
          pointer-events-none
          absolute left-1/2 top-2
          -translate-x-1/2
          rounded-md
          bg-black/65
          px-2 py-1
          text-[9px]
          font-medium
          text-white
          whitespace-nowrap
        "
        >
          {Math.round(current.width)} × {Math.round(current.height)}
        </div>

        {/* Top */}
        <button
          type="button"
          aria-label="Resize crop top"
          className={handleClass}
          style={{
            width: handleSize * 1.5,
            height: handleSize,
            left: "50%",
            top: 0,
            transform: "translate(-50%, -50%)",
            cursor: "ns-resize",
          }}
          onPointerDown={(event) => startDrag(event, "n")}
        />

        {/* Bottom */}
        <button
          type="button"
          aria-label="Resize crop bottom"
          className={handleClass}
          style={{
            width: handleSize * 1.5,
            height: handleSize,
            left: "50%",
            bottom: 0,
            transform: "translate(-50%, 50%)",
            cursor: "ns-resize",
          }}
          onPointerDown={(event) => startDrag(event, "s")}
        />

        {/* Left */}
        <button
          type="button"
          aria-label="Resize crop left"
          className={handleClass}
          style={{
            width: handleSize,
            height: handleSize * 1.5,
            left: 0,
            top: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "ew-resize",
          }}
          onPointerDown={(event) => startDrag(event, "w")}
        />

        {/* Right */}
        <button
          type="button"
          aria-label="Resize crop right"
          className={handleClass}
          style={{
            width: handleSize,
            height: handleSize * 1.5,
            right: 0,
            top: "50%",
            transform: "translate(50%, -50%)",
            cursor: "ew-resize",
          }}
          onPointerDown={(event) => startDrag(event, "e")}
        />

        {/* NW */}
        <button
          type="button"
          aria-label="Resize crop top left"
          className={handleClass}
          style={{
            width: handleSize,
            height: handleSize,
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
            cursor: "nwse-resize",
          }}
          onPointerDown={(event) => startDrag(event, "nw")}
        />

        {/* NE */}
        <button
          type="button"
          aria-label="Resize crop top right"
          className={handleClass}
          style={{
            width: handleSize,
            height: handleSize,
            right: 0,
            top: 0,
            transform: "translate(50%, -50%)",
            cursor: "nesw-resize",
          }}
          onPointerDown={(event) => startDrag(event, "ne")}
        />

        {/* SW */}
        <button
          type="button"
          aria-label="Resize crop bottom left"
          className={handleClass}
          style={{
            width: handleSize,
            height: handleSize,
            left: 0,
            bottom: 0,
            transform: "translate(-50%, 50%)",
            cursor: "nesw-resize",
          }}
          onPointerDown={(event) => startDrag(event, "sw")}
        />

        {/* SE */}
        <button
          type="button"
          aria-label="Resize crop bottom right"
          className={handleClass}
          style={{
            width: handleSize,
            height: handleSize,
            right: 0,
            bottom: 0,
            transform: "translate(50%, 50%)",
            cursor: "nwse-resize",
          }}
          onPointerDown={(event) => startDrag(event, "se")}
        />
      </div>
    </div>
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
        onChange={(event) => {
          const value = Number(event.target.value);

          onChange(Number.isFinite(value) ? Math.max(min, value) : min);
        }}
        className="
          h-10 w-full
          rounded-[var(--radius-md)]
          border border-[var(--border)]
          bg-[var(--surface)]
          px-3
          text-sm
          text-[var(--text)]
          outline-none
          focus:border-[var(--brand)]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      />
    </label>
  );
}