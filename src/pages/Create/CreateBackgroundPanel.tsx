// src/pages/Create/CreateBackgroundPanel.tsx

import type { BackgroundSettings } from "./CreatePage";

type Props = {
  background: BackgroundSettings;

  onChange: (value: BackgroundSettings) => void;
};

export default function CreateBackgroundPanel({ background, onChange }: Props) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-4">
        <div className="text-xs font-semibold text-[var(--text)]">
          Canvas background
        </div>

        <div className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
          Control the appearance behind your artwork.
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--surface-muted)] p-1">
        {(
          [
            ["solid", "Solid"],
            ["gradient", "Gradient"],
            ["transparent", "None"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              onChange({
                ...background,
                type: value,
              })
            }
            className={`
              rounded-md px-2 py-2 text-[10px] font-medium
              ${
                background.type === value
                  ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {background.type === "solid" && (
        <div className="mt-4 flex gap-2">
          <input
            type="color"
            value={background.color}
            onChange={(event) =>
              onChange({
                ...background,
                color: event.target.value,
              })
            }
            className="h-9 w-9 cursor-pointer rounded-lg border border-[var(--border)]"
          />

          <input
            value={background.color}
            onChange={(event) =>
              onChange({
                ...background,
                color: event.target.value,
              })
            }
            className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 font-mono text-[11px] uppercase text-[var(--text)] outline-none focus:border-[#6366F1]"
          />
        </div>
      )}

      {background.type === "gradient" && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="color"
              value={background.gradientFrom}
              onChange={(event) =>
                onChange({
                  ...background,
                  gradientFrom: event.target.value,
                })
              }
              className="h-9 w-full cursor-pointer rounded-lg border border-[var(--border)]"
            />

            <input
              type="color"
              value={background.gradientTo}
              onChange={(event) =>
                onChange({
                  ...background,
                  gradientTo: event.target.value,
                })
              }
              className="h-9 w-full cursor-pointer rounded-lg border border-[var(--border)]"
            />
          </div>

          <label>
            <div className="mb-2 flex justify-between">
              <span className="text-[10px] text-[var(--text-muted)]">
                Angle
              </span>

              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {background.gradientAngle}°
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="360"
              value={background.gradientAngle}
              onChange={(event) =>
                onChange({
                  ...background,
                  gradientAngle: Number(event.target.value),
                })
              }
              className="w-full accent-[#6366F1]"
            />
          </label>
        </div>
      )}
    </section>
  );
}
