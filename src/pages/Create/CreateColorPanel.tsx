// src/pages/Create/CreateColorPanel.tsx

import type { DesignObject } from "./CreatePage";

type Props = {
  object: DesignObject;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;
};

const COLORS = [
  "#111827",
  "#1F2937",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#FFFFFF",

  "#6366F1",
  "#4F46E5",
  "#4338CA",
  "#8B5CF6",
  "#7C3AED",

  "#EC4899",
  "#DB2777",
  "#F43F5E",
  "#EF4444",

  "#F97316",
  "#F59E0B",
  "#EAB308",

  "#10B981",
  "#059669",
  "#14B8A6",

  "#06B6D4",
  "#0891B2",
  "#0EA5E9",
  "#3B82F6",
];

const INPUT_CLASS = `
  h-9 w-full rounded-lg
  border border-[var(--border)]
  bg-[var(--background)]
  px-2.5
  text-[11px]
  text-[var(--text)]
  outline-none
  transition-colors
  focus:border-[var(--accent,#6366F1)]
  focus:ring-2
  focus:ring-[var(--accent,#6366F1)]/10
`;

export default function CreateColorPanel({ object, onUpdate }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Appearance
        </label>

        <span className="font-mono text-[9px] text-[var(--text-muted)]">
          FILL
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label
          className="
            relative h-9 w-9 shrink-0 cursor-pointer
            overflow-hidden rounded-lg
            border border-[var(--border)]
            shadow-sm
          "
        >
          <input
            type="color"
            value={object.fill.startsWith("#") ? object.fill : "#6366F1"}
            onChange={(event) =>
              onUpdate(object.id, {
                fill: event.target.value,
              })
            }
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />

          <span
            className="block h-full w-full"
            style={{
              background: object.fill,
            }}
          />
        </label>

        <input
          value={object.fill}
          onChange={(event) =>
            onUpdate(object.id, {
              fill: event.target.value,
            })
          }
          className={`${INPUT_CLASS} min-w-0 flex-1 font-mono uppercase`}
          placeholder="#6366F1"
        />
      </div>

      <div className="mt-3">
        <span className="mb-2 block text-[10px] text-[var(--text-muted)]">
          Presets
        </span>

        <div className="flex flex-wrap gap-1.5">
          {COLORS.map((color) => {
            const selected = object.fill.toLowerCase() === color.toLowerCase();

            return (
              <button
                key={color}
                type="button"
                title={color}
                aria-label={`Set fill to ${color}`}
                onClick={() =>
                  onUpdate(object.id, {
                    fill: color,
                  })
                }
                className={`
                  h-6 w-6 rounded-md border
                  transition-transform hover:scale-105
                  ${
                    selected
                      ? "border-[var(--accent,#6366F1)] ring-2 ring-[var(--accent,#6366F1)]/20"
                      : "border-[var(--border)]"
                  }
                `}
                style={{
                  background: color,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Stroke
          </span>

          <input
            value={object.stroke}
            onChange={(event) =>
              onUpdate(object.id, {
                stroke: event.target.value,
              })
            }
            className={`${INPUT_CLASS} font-mono uppercase`}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Width
          </span>

          <input
            type="number"
            min={0}
            max={20}
            value={object.strokeWidth}
            onChange={(event) =>
              onUpdate(object.id, {
                strokeWidth: Math.min(
                  20,
                  Math.max(0, Number(event.target.value)),
                ),
              })
            }
            className={`${INPUT_CLASS} font-mono`}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] text-[var(--text-muted)]">Opacity</span>

          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {Math.round(object.opacity * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={object.opacity}
          onChange={(event) =>
            onUpdate(object.id, {
              opacity: Number(event.target.value),
            })
          }
          className="w-full accent-[var(--accent,#6366F1)]"
        />
      </label>
    </div>
  );
}