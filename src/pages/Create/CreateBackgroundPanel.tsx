// src/pages/Create/CreateBackgroundPanel.tsx

import type { BackgroundSettings } from "./CreatePage";

type Props = {
  background: BackgroundSettings;

  onChange: (value: BackgroundSettings) => void;
};

export default function CreateBackgroundPanel({ background, onChange }: Props) {
  return (
    <section
      className="
        rounded-xl border border-[var(--border)]
        bg-[var(--surface)] p-4
      "
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-[var(--text)]">
            Canvas background
          </div>

          <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-[9px] uppercase text-[var(--text-muted)]">
            Canvas
          </span>
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
        ).map(([value, label]) => {
          const selected = background.type === value;

          return (
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
                rounded-md px-2 py-2
                text-[10px] font-medium
                transition-all
                ${
                  selected
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      {background.type === "solid" && (
        <div className="mt-4">
          <div className="mb-2 text-[10px] text-[var(--text-muted)]">Color</div>

          <div className="flex gap-2">
            <input
              type="color"
              value={background.color}
              onChange={(event) =>
                onChange({
                  ...background,
                  color: event.target.value,
                })
              }
              className="
                h-9 w-9 cursor-pointer
                rounded-lg border border-[var(--border)]
                bg-transparent
              "
            />

            <input
              value={background.color}
              onChange={(event) =>
                onChange({
                  ...background,
                  color: event.target.value,
                })
              }
              className="
                h-9 flex-1 rounded-lg
                border border-[var(--border)]
                bg-[var(--background)]
                px-3 font-mono text-[11px]
                uppercase text-[var(--text)]
                outline-none
                focus:border-[var(--accent,#6366F1)]
                focus:ring-2
                focus:ring-[var(--accent,#6366F1)]/10
              "
            />
          </div>
        </div>
      )}

      {background.type === "gradient" && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-2 text-[10px] text-[var(--text-muted)]">
              Gradient colors
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="relative">
                <input
                  type="color"
                  value={background.gradientFrom}
                  onChange={(event) =>
                    onChange({
                      ...background,
                      gradientFrom: event.target.value,
                    })
                  }
                  className="
                    h-10 w-full cursor-pointer
                    rounded-lg border border-[var(--border)]
                    bg-transparent
                  "
                />

                <span className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[8px] text-white">
                  FROM
                </span>
              </label>

              <label className="relative">
                <input
                  type="color"
                  value={background.gradientTo}
                  onChange={(event) =>
                    onChange({
                      ...background,
                      gradientTo: event.target.value,
                    })
                  }
                  className="
                    h-10 w-full cursor-pointer
                    rounded-lg border border-[var(--border)]
                    bg-transparent
                  "
                />

                <span className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[8px] text-white">
                  TO
                </span>
              </label>
            </div>
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
              className="w-full accent-[var(--accent,#6366F1)]"
            />
          </label>
        </div>
      )}

      {background.type === "transparent" && (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <div className="flex items-center gap-3">
            <div
              className="
                h-9 w-9 shrink-0 rounded-md border
                border-[var(--border)]
                bg-white
              "
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)",
                backgroundSize: "12px 12px",
                backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
              }}
            />

            <div>
              <div className="text-[10px] font-medium text-[var(--text)]">
                Transparent canvas
              </div>

              <div className="mt-0.5 text-[9px] text-[var(--text-muted)]">
                The checkerboard represents transparency.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}