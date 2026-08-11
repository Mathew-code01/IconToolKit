// src/pages/Generator/CropEditor.tsx
// src/pages/Generator/CropEditor.tsx
import { Maximize2, Move, RotateCcw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

type AspectRatio = "free" | "1:1" | "4:3" | "16:9";

interface CropEditorProps {
  imageUrl: string;
  crop: CropSettings;
  onChange: (crop: CropSettings) => void;
  disabled?: boolean;
}

type InteractionMode =
  | "move"
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "e"
  | "s"
  | "w";

interface InteractionState {
  mode: InteractionMode;
  startX: number;
  startY: number;
  startCrop: CropSettings;
}

const MIN_CROP = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeCrop(crop: CropSettings): CropSettings {
  const width = clamp(crop.width, MIN_CROP, 100);

  const height = clamp(crop.height, MIN_CROP, 100);

  return {
    width,
    height,
    x: clamp(crop.x, 0, 100 - width),
    y: clamp(crop.y, 0, 100 - height),
  };
}

const ASPECT_RATIOS: readonly [AspectRatio, string][] = [
  ["free", "Free"],
  ["1:1", "Square"],
  ["4:3", "4:3"],
  ["16:9", "16:9"],
];

const CORNER_HANDLES: readonly [
  Extract<InteractionMode, "nw" | "ne" | "sw" | "se">,
  string,
][] = [
  ["nw", "left-0 top-0 cursor-nwse-resize"],
  ["ne", "right-0 top-0 cursor-nesw-resize"],
  ["sw", "left-0 bottom-0 cursor-nesw-resize"],
  ["se", "right-0 bottom-0 cursor-nwse-resize"],
];

const EDGE_HANDLES: readonly [
  Extract<InteractionMode, "n" | "e" | "s" | "w">,
  string,
][] = [
  ["n", "left-1/2 top-0 -translate-x-1/2 cursor-ns-resize"],
  ["e", "right-0 top-1/2 -translate-y-1/2 cursor-ew-resize"],
  ["s", "bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize"],
  ["w", "left-0 top-1/2 -translate-y-1/2 cursor-ew-resize"],
];

export default function CropEditor({
  imageUrl,
  crop,
  onChange,
  disabled = false,
}: CropEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const interactionRef = useRef<InteractionState | null>(null);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");

  const [dragging, setDragging] = useState(false);

  const startInteraction = useCallback(
    (event: PointerEvent<HTMLElement>, mode: InteractionMode) => {
      if (disabled) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      event.currentTarget.setPointerCapture(event.pointerId);

      interactionRef.current = {
        mode,
        startX: event.clientX,
        startY: event.clientY,
        startCrop: { ...crop },
      };

      setDragging(true);
    },
    [crop, disabled],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const interaction = interactionRef.current;

      const container = containerRef.current;

      if (!interaction || !container) {
        return;
      }

      const rect = container.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const dx = ((event.clientX - interaction.startX) / rect.width) * 100;

      const dy = ((event.clientY - interaction.startY) / rect.height) * 100;

      const start = interaction.startCrop;

      const next: CropSettings = {
        ...start,
      };

      switch (interaction.mode) {
        case "move": {
          next.x = clamp(start.x + dx, 0, 100 - start.width);

          next.y = clamp(start.y + dy, 0, 100 - start.height);

          break;
        }

        case "e": {
          next.width = clamp(start.width + dx, MIN_CROP, 100 - start.x);

          break;
        }

        case "w": {
          const newX = clamp(start.x + dx, 0, start.x + start.width - MIN_CROP);

          next.x = newX;

          next.width = start.width + (start.x - newX);

          break;
        }

        case "s": {
          next.height = clamp(start.height + dy, MIN_CROP, 100 - start.y);

          break;
        }

        case "n": {
          const newY = clamp(
            start.y + dy,
            0,
            start.y + start.height - MIN_CROP,
          );

          next.y = newY;

          next.height = start.height + (start.y - newY);

          break;
        }

        case "se": {
          next.width = clamp(start.width + dx, MIN_CROP, 100 - start.x);

          next.height = clamp(start.height + dy, MIN_CROP, 100 - start.y);

          break;
        }

        case "sw": {
          const newX = clamp(start.x + dx, 0, start.x + start.width - MIN_CROP);

          next.x = newX;

          next.width = start.width + (start.x - newX);

          next.height = clamp(start.height + dy, MIN_CROP, 100 - start.y);

          break;
        }

        case "ne": {
          next.width = clamp(start.width + dx, MIN_CROP, 100 - start.x);

          const newY = clamp(
            start.y + dy,
            0,
            start.y + start.height - MIN_CROP,
          );

          next.y = newY;

          next.height = start.height + (start.y - newY);

          break;
        }

        case "nw": {
          const newX = clamp(start.x + dx, 0, start.x + start.width - MIN_CROP);

          next.x = newX;

          next.width = start.width + (start.x - newX);

          const newY = clamp(
            start.y + dy,
            0,
            start.y + start.height - MIN_CROP,
          );

          next.y = newY;

          next.height = start.height + (start.y - newY);

          break;
        }
      }

      onChange(normalizeCrop(next));
    },
    [onChange],
  );

  const endInteraction = useCallback(() => {
    interactionRef.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    const handleWindowPointerUp = () => {
      endInteraction();
    };

    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [endInteraction]);

  const applyAspectRatio = (ratio: AspectRatio) => {
    setAspectRatio(ratio);

    if (ratio === "free") {
      return;
    }

    const numericRatio = ratio === "1:1" ? 1 : ratio === "4:3" ? 4 / 3 : 16 / 9;

    let width = crop.width;

    let height = width / numericRatio;

    if (height > 100) {
      height = 100;
      width = height * numericRatio;
    }

    if (width > 100) {
      width = 100;
      height = width / numericRatio;
    }

    width = clamp(width, MIN_CROP, 100);

    height = clamp(height, MIN_CROP, 100);

    onChange(
      normalizeCrop({
        width,
        height,
        x: crop.x + (crop.width - width) / 2,
        y: crop.y + (crop.height - height) / 2,
      }),
    );
  };

  const resetCrop = () => {
    onChange({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });

    setAspectRatio("free");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {ASPECT_RATIOS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => applyAspectRatio(value)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              aspectRatio === value
                ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {label}
          </button>
        ))}

        <button
          type="button"
          disabled={disabled}
          onClick={resetCrop}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-square select-none overflow-hidden rounded-xl border border-[var(--border)] bg-black touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
      >
        <img
          src={imageUrl}
          alt="Crop source"
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />

        <div className="pointer-events-none absolute inset-0 bg-black/50" />

        <div
          className="absolute"
          style={{
            left: `${crop.x}%`,
            top: `${crop.y}%`,
            width: `${crop.width}%`,
            height: `${crop.height}%`,
          }}
        >
          <div className="absolute inset-0 overflow-hidden border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              className="absolute max-w-none"
              style={{
                width: `${10000 / crop.width}%`,
                height: `${10000 / crop.height}%`,
                left: `${-(crop.x / crop.width) * 100}%`,
                top: `${-(crop.y / crop.height) * 100}%`,
              }}
            />

            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              {Array.from({
                length: 9,
              }).map((_, index) => (
                <div
                  key={index}
                  className={index % 3 !== 0 ? "border-l border-white/30" : ""}
                >
                  {index >= 3 && (
                    <div className="h-full border-t border-white/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="absolute inset-0 cursor-move"
            onPointerDown={(event) => startInteraction(event, "move")}
          />

          {CORNER_HANDLES.map(([mode, classes]) => (
            <button
              key={mode}
              type="button"
              aria-label={`Resize crop ${mode}`}
              disabled={disabled}
              onPointerDown={(event) => startInteraction(event, mode)}
              className={`absolute z-20 h-5 w-5 rounded-full border-2 border-white bg-[#6366F1] shadow-md ${classes}`}
            />
          ))}

          {EDGE_HANDLES.map(([mode, classes]) => (
            <button
              key={mode}
              type="button"
              aria-label={`Resize crop ${mode}`}
              disabled={disabled}
              onPointerDown={(event) => startInteraction(event, mode)}
              className={`absolute z-20 h-4 w-4 rounded-full border-2 border-white bg-[#6366F1] shadow ${classes}`}
            />
          ))}

          {dragging && (
            <div className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
              {Math.round(crop.width)}% × {Math.round(crop.height)}%
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1">
          <Move size={11} />
          Drag to reposition
        </span>

        <span className="inline-flex items-center gap-1">
          <Maximize2 size={11} />
          Drag handles to resize
        </span>
      </div>
    </div>
  );
}