// src/pages/Edit/RoundedCornersTool.tsx
// src/pages/Edit/RoundedCornersTool.tsx

import type { RoundedCornersSettings } from "./EditPage";

export interface RoundedCornersToolProps {
  settings: RoundedCornersSettings;
  onChange: (updates: Partial<RoundedCornersSettings>) => void;
}

const PRESETS = [
  { label: "Square", value: 0 },
  { label: "Rounded", value: 20 },
  { label: "Circle", value: 50 },
];

export default function RoundedCornersTool({ settings, onChange }: RoundedCornersToolProps) {
  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Rounded corners</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Round the corners of your image.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange({ radius: preset.value })}
            className={`rounded-[var(--radius-md)] border px-2 py-2.5 text-xs font-medium transition ${
              settings.radius === preset.value
                ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="corner-radius" className="text-xs font-medium text-[var(--text-secondary)]">
            Corner radius
          </label>
          <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 text-xs font-medium text-[var(--text)]">
            {settings.radius}%
          </span>
        </div>

        <input
          id="corner-radius"
          type="range"
          min={0}
          max={50}
          value={settings.radius}
          onChange={(event) => onChange({ radius: Number(event.target.value) })}
          className="w-full accent-[var(--brand)]"
        />
      </div>
    </section>
  );
}