// src/pages/Convert/ConvertBackgroundControls.tsx

import type { ConvertSettingsState } from "./ConvertTypes";

interface ConvertBackgroundControlsProps {
  settings: ConvertSettingsState;
  onChange: (patch: Partial<ConvertSettingsState>) => void;
}

export default function ConvertBackgroundControls({
  settings,
  onChange,
}: ConvertBackgroundControlsProps) {
  const needsBackground = settings.outputFormat === "jpg";

  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[var(--text)]">
            Transparency
          </p>

          <p className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
            Control how transparent pixels are handled.
          </p>
        </div>

        <input
          type="checkbox"
          checked={settings.preserveTransparency}
          disabled={needsBackground}
          onChange={(event) =>
            onChange({
              preserveTransparency: event.target.checked,
            })
          }
          className="accent-[var(--brand)] disabled:opacity-40"
        />
      </div>

      {needsBackground ? (
        <div className="mt-3">
          <label className="mb-2 block text-[10px] font-medium text-[var(--text-muted)]">
            Background color for JPG
          </label>

          <div className="flex gap-2">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(event) =>
                onChange({
                  backgroundColor: event.target.value,
                })
              }
              className="h-9 w-12 cursor-pointer rounded-md border border-[var(--border)] bg-transparent p-1"
            />

            <input
              type="text"
              value={settings.backgroundColor}
              onChange={(event) =>
                onChange({
                  backgroundColor: event.target.value,
                })
              }
              className="h-9 min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
