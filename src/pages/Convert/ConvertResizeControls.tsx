// src/pages/Convert/ConvertResizeControls.tsx

import type { ConvertSettingsState } from "./ConvertTypes";

interface ConvertResizeControlsProps {
  settings: ConvertSettingsState;
  originalWidth: number | null;
  originalHeight: number | null;
  onChange: (patch: Partial<ConvertSettingsState>) => void;
}

export default function ConvertResizeControls({
  settings,
  originalWidth,
  originalHeight,
  onChange,
}: ConvertResizeControlsProps) {
  const aspect =
    originalWidth && originalHeight ? originalWidth / originalHeight : null;

  const updateWidth = (value: number | null) => {
    if (value && settings.keepAspectRatio && aspect) {
      onChange({
        width: value,
        height: Math.max(1, Math.round(value / aspect)),
      });

      return;
    }

    onChange({ width: value });
  };

  const updateHeight = (value: number | null) => {
    if (value && settings.keepAspectRatio && aspect) {
      onChange({
        height: value,
        width: Math.max(1, Math.round(value * aspect)),
      });

      return;
    }

    onChange({ height: value });
  };

  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={settings.resizeEnabled}
          onChange={(event) =>
            onChange({
              resizeEnabled: event.target.checked,
            })
          }
          className="accent-[var(--brand)]"
        />

        <span className="text-xs font-semibold text-[var(--text)]">
          Resize during conversion
        </span>
      </label>

      {settings.resizeEnabled ? (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] text-[var(--text-muted)]">
                Width
              </label>

              <input
                type="number"
                min={1}
                value={settings.width ?? ""}
                onChange={(event) =>
                  updateWidth(
                    event.target.value ? Number(event.target.value) : null,
                  )
                }
                className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] text-[var(--text-muted)]">
                Height
              </label>

              <input
                type="number"
                min={1}
                value={settings.height ?? ""}
                onChange={(event) =>
                  updateHeight(
                    event.target.value ? Number(event.target.value) : null,
                  )
                }
                className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={settings.keepAspectRatio}
              onChange={(event) =>
                onChange({
                  keepAspectRatio: event.target.checked,
                })
              }
              className="accent-[var(--brand)]"
            />

            <span className="text-[11px] text-[var(--text-muted)]">
              Keep aspect ratio
            </span>
          </label>

          {originalWidth && originalHeight ? (
            <p className="text-[10px] text-[var(--text-muted)]">
              Original: {originalWidth} × {originalHeight}px
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
