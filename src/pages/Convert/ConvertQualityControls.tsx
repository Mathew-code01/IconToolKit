// src/pages/Convert/ConvertQualityControls.tsx

import type { ConvertSettingsState } from "./ConvertTypes";

interface ConvertQualityControlsProps {
  settings: ConvertSettingsState;
  onChange: (patch: Partial<ConvertSettingsState>) => void;
}

export default function ConvertQualityControls({
  settings,
  onChange,
}: ConvertQualityControlsProps) {
  const supportsQuality = ["jpg", "webp", "avif"].includes(
    settings.outputFormat,
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor="convert-quality"
          className="text-xs font-semibold text-[var(--text)]"
        >
          Quality
        </label>

        <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 text-[10px] font-medium text-[var(--text)]">
          {settings.quality}%
        </span>
      </div>

      <input
        id="convert-quality"
        type="range"
        min={1}
        max={100}
        value={settings.quality}
        disabled={!supportsQuality}
        onChange={(event) =>
          onChange({
            quality: Number(event.target.value),
          })
        }
        className="w-full accent-[var(--brand)] disabled:opacity-40"
      />

      <p className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
        {supportsQuality
          ? "Higher quality usually creates a larger file."
          : "Quality control is not used for this format."}
      </p>
    </div>
  );
}
