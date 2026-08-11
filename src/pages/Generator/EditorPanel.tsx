// src/pages/Generator/UploadPanel.tsx

import { RotateCcw } from "lucide-react";

export interface EditorSettings {
  padding: number;
  scale: number;
  background:
    | "transparent"
    | "#ffffff"
    | "#000000";
  fit: "contain" | "cover";
  positionX: number;
  positionY: number;
}

interface EditorPanelProps {
  settings: EditorSettings;
  onChange: (
    updates: Partial<EditorSettings>,
  ) => void;
  disabled?: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
  padding: 10,
  scale: 100,
  background: "transparent",
  fit: "contain",
  positionX: 50,
  positionY: 50,
};

export default function EditorPanel({
  settings,
  onChange,
  disabled = false,
}: EditorPanelProps) {
  const reset = () => {
    onChange(DEFAULT_SETTINGS);
  };

  return (
    <section
      className={`
        rounded-2xl border border-[var(--border)]
        bg-[var(--surface)] p-4
        ${disabled ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Edit
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Adjust the icon appearance.
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          disabled={disabled}
          className="
            inline-flex items-center gap-1.5 rounded-lg
            px-2 py-1.5 text-xs font-medium
            text-[var(--text-muted)]
            transition-colors
            hover:bg-[var(--surface-muted)]
            hover:text-[var(--text)]
            disabled:pointer-events-none
          "
        >
          <RotateCcw
            size={13}
            aria-hidden="true"
          />
          Reset
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {/* Fit */}
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Fit
          </label>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              ["contain", "cover"] as const
            ).map((fit) => (
              <button
                key={fit}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({ fit })
                }
                className={`
                  rounded-lg border px-3 py-2
                  text-xs font-medium capitalize
                  transition-colors
                  ${
                    settings.fit === fit
                      ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                  }
                `}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="icon-scale"
              className="text-xs font-semibold text-[var(--text-secondary)]"
            >
              Scale
            </label>

            <span className="text-xs text-[var(--text-muted)]">
              {settings.scale}%
            </span>
          </div>

          <input
            id="icon-scale"
            type="range"
            min="50"
            max="150"
            step="1"
            value={settings.scale}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                scale: Number(
                  event.target.value,
                ),
              })
            }
            className="mt-3 w-full accent-[#6366F1]"
          />
        </div>

        {/* Padding */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="icon-padding"
              className="text-xs font-semibold text-[var(--text-secondary)]"
            >
              Safe area
            </label>

            <span className="text-xs text-[var(--text-muted)]">
              {settings.padding}%
            </span>
          </div>

          <input
            id="icon-padding"
            type="range"
            min="0"
            max="45"
            step="1"
            value={settings.padding}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                padding: Number(
                  event.target.value,
                ),
              })
            }
            className="mt-3 w-full accent-[#6366F1]"
          />
        </div>

        {/* Horizontal */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="icon-position-x"
              className="text-xs font-semibold text-[var(--text-secondary)]"
            >
              Horizontal
            </label>

            <span className="text-xs text-[var(--text-muted)]">
              {settings.positionX}%
            </span>
          </div>

          <input
            id="icon-position-x"
            type="range"
            min="0"
            max="100"
            value={settings.positionX}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                positionX: Number(
                  event.target.value,
                ),
              })
            }
            className="mt-3 w-full accent-[#6366F1]"
          />
        </div>

        {/* Vertical */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="icon-position-y"
              className="text-xs font-semibold text-[var(--text-secondary)]"
            >
              Vertical
            </label>

            <span className="text-xs text-[var(--text-muted)]">
              {settings.positionY}%
            </span>
          </div>

          <input
            id="icon-position-y"
            type="range"
            min="0"
            max="100"
            value={settings.positionY}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                positionY: Number(
                  event.target.value,
                ),
              })
            }
            className="mt-3 w-full accent-[#6366F1]"
          />
        </div>

        {/* Background */}
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            Background
          </label>

          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                onChange({
                  background: "transparent",
                })
              }
              className={`
                rounded-lg border px-2 py-2
                text-xs font-medium transition-colors
                ${
                  settings.background ===
                  "transparent"
                    ? "border-[#6366F1] text-[#6366F1]"
                    : "border-[var(--border)] text-[var(--text-secondary)]"
                }
              `}
            >
              Clear
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                onChange({
                  background: "#ffffff",
                })
              }
              className={`
                rounded-lg border bg-white px-2 py-2
                text-xs font-medium text-gray-800
                ${
                  settings.background ===
                  "#ffffff"
                    ? "border-[#6366F1]"
                    : "border-[var(--border)]"
                }
              `}
            >
              White
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                onChange({
                  background: "#000000",
                })
              }
              className={`
                rounded-lg border bg-black px-2 py-2
                text-xs font-medium text-white
                ${
                  settings.background ===
                  "#000000"
                    ? "border-[#6366F1]"
                    : "border-[var(--border)]"
                }
              `}
            >
              Black
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}