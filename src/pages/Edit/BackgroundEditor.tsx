// src/pages/Edit/BackgroundEditor.tsx
// src/pages/Edit/BackgroundEditor.tsx

import type { BackgroundSettings, BackgroundType } from "./EditPage";

export interface BackgroundEditorProps {
  settings: BackgroundSettings;
  onChange: (updates: Partial<BackgroundSettings>) => void;
}

const OPTIONS: { value: BackgroundType; label: string; description: string }[] = [
  { value: "transparent", label: "Transparent", description: "Keep the background transparent." },
  { value: "solid", label: "Solid", description: "Use one background color." },
  { value: "gradient", label: "Gradient", description: "Blend two colors together." },
];

export default function BackgroundEditor({ settings, onChange }: BackgroundEditorProps) {
  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Background</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Control the canvas background used by your edited icon.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const active = settings.type === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ type: option.value })}
              className={`rounded-[var(--radius-md)] border p-3 text-left transition ${
                active
                  ? "border-[var(--brand)] bg-[var(--brand-light)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
              }`}
            >
              <span
                className={`block text-xs font-semibold ${
                  active ? "text-[var(--brand)]" : "text-[var(--text)]"
                }`}
              >
                {option.label}
              </span>
              <span className="mt-1 block text-[10px] leading-4 text-[var(--text-muted)]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      {settings.type !== "transparent" && (
        <div className="mt-4 space-y-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <ColorControl
            label={settings.type === "gradient" ? "Start color" : "Color"}
            value={settings.color}
            onChange={(value) => onChange({ color: value })}
          />

          {settings.type === "gradient" && (
            <>
              <ColorControl
                label="End color"
                value={settings.gradientTo}
                onChange={(value) => onChange({ gradientTo: value })}
              />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="gradient-angle" className="text-xs font-medium text-[var(--text-secondary)]">
                    Gradient angle
                  </label>
                  <span className="text-xs font-medium text-[var(--text)]">
                    {settings.gradientAngle}°
                  </span>
                </div>

                <input
                  id="gradient-angle"
                  type="range"
                  min={0}
                  max={360}
                  value={settings.gradientAngle}
                  onChange={(event) => onChange({ gradientAngle: Number(event.target.value) })}
                  className="w-full accent-[var(--brand)]"
                />
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          onChange({
            type: "transparent",
            color: "#ffffff",
            gradientFrom: "#6366f1",
            gradientTo: "#8b5cf6",
            gradientAngle: 135,
          })
        }
        className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
      >
        Reset background
      </button>
    </section>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">{label}</label>

      <div className="flex gap-2">
        <label className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
          <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-[-4px] h-[calc(100%+8px)] w-[calc(100%+8px)] cursor-pointer"
          />
        </label>

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--brand)]"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
}