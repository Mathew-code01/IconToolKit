// src/pages/Edit/RotateFlipTool.tsx
// src/pages/Edit/RotateFlipTool.tsx

import type { RotateFlipSettings } from "./EditPage";

export interface RotateFlipToolProps {
  settings: RotateFlipSettings;
  onChange: (updates: Partial<RotateFlipSettings>) => void;
}

const ROTATIONS = [0, 90, 180, 270] as const;

export default function RotateFlipTool({ settings, onChange }: RotateFlipToolProps) {
  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Rotate & flip</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Change orientation or mirror the image.
        </p>
      </div>

      <div>
        <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
          Rotation
        </span>

        <div className="grid grid-cols-4 gap-2">
          {ROTATIONS.map((value) => {
            const active = settings.rotation === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ rotation: value })}
                className={`min-h-10 rounded-[var(--radius-md)] border text-xs font-medium transition ${
                  active
                    ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {value === 0 ? "Original" : `${value}°`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <ToggleOption
          active={settings.flipHorizontal}
          title="Flip horizontally"
          description="Mirror left to right"
          icon="↔"
          onClick={() => onChange({ flipHorizontal: !settings.flipHorizontal })}
        />

        <ToggleOption
          active={settings.flipVertical}
          title="Flip vertically"
          description="Mirror top to bottom"
          icon="↕"
          onClick={() => onChange({ flipVertical: !settings.flipVertical })}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange({ rotation: (settings.rotation + 270) % 360 })}
          className="min-h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
        >
          ↶ Rotate left
        </button>

        <button
          type="button"
          onClick={() => onChange({ rotation: (settings.rotation + 90) % 360 })}
          className="min-h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
        >
          ↷ Rotate right
        </button>
      </div>

      <button
        type="button"
        onClick={() => onChange({ rotation: 0, flipHorizontal: false, flipVertical: false })}
        className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
      >
        Reset
      </button>
    </section>
  );
}

function ToggleOption({
  active,
  title,
  description,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition ${
        active
          ? "border-[var(--brand)] bg-[var(--brand-light)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
      }`}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-muted)] text-lg text-[var(--text-secondary)]"
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-[var(--text)]">
          {title}
        </span>
        <span className="mt-0.5 block text-[10px] text-[var(--text-muted)]">
          {description}
        </span>
      </span>
    </button>
  );
}