// src/pages/Create/CreateColorPanel.tsx

import type { DesignObject } from "./CreatePage";

type Props = {
  object: DesignObject;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;
};

const COLORS = [
  "#111827",
  "#374151",
  "#6B7280",
  "#FFFFFF",
  "#6366F1",
  "#4F46E5",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
];

export default function CreateColorPanel({ object, onUpdate }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Appearance
        </label>

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          Fill
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[var(--border)]">
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
          className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 font-mono text-[11px] uppercase text-[var(--text)] outline-none focus:border-[#6366F1]"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() =>
              onUpdate(object.id, {
                fill: color,
              })
            }
            className={`
              h-6 w-6 rounded-md border
              ${
                object.fill.toLowerCase() === color.toLowerCase()
                  ? "border-[#6366F1] ring-2 ring-[#6366F1]/20"
                  : "border-[var(--border)]"
              }
            `}
            style={{
              background: color,
            }}
          />
        ))}
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
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
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
                strokeWidth: Number(event.target.value),
              })
            }
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <div className="mb-2 flex justify-between">
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
          className="w-full accent-[#6366F1]"
        />
      </label>
    </div>
  );
}
