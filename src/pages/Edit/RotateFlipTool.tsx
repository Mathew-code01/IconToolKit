// src/pages/Edit/RotateFlipTool.tsx
// src/pages/Edit/RotateFlipTool.tsx

import type { RotateFlipSettings } from "./EditPage";

export interface RotateFlipToolProps {
  settings: RotateFlipSettings;
  onChange: (updates: Partial<RotateFlipSettings>) => void;
}

const ROTATIONS = [0, 90, 180, 270] as const;

export default function RotateFlipTool({
  settings,
  onChange,
}: RotateFlipToolProps) {
  const rotateLeft = () => {
    onChange({
      rotation: (settings.rotation + 270) % 360,
    });
  };

  const rotateRight = () => {
    onChange({
      rotation: (settings.rotation + 90) % 360,
    });
  };

  const reset = () => {
    onChange({
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
    });
  };

  const hasChanges =
    settings.rotation !== 0 ||
    settings.flipHorizontal ||
    settings.flipVertical;

  return (
    <section className="w-full p-4">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Rotate & flip
        </h3>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Change orientation or mirror the image.
        </p>
      </div>

      {/* Rotation presets */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            Rotation
          </span>

          <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 font-mono text-[10px] font-medium text-[var(--text)]">
            {settings.rotation}°
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {ROTATIONS.map((value) => {
            const active = settings.rotation === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
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

      {/* Rotate controls */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={rotateLeft}
          aria-label="Rotate image left 90 degrees"
          className="min-h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
        >
          <span className="mr-1.5 text-base">↶</span>
          Rotate left
        </button>

        <button
          type="button"
          onClick={rotateRight}
          aria-label="Rotate image right 90 degrees"
          className="min-h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
        >
          <span className="mr-1.5 text-base">↷</span>
          Rotate right
        </button>
      </div>

      {/* Flip */}
      <div className="mt-5">
        <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
          Mirror
        </span>

        <div className="grid gap-2 sm:grid-cols-2">
          <ToggleOption
            active={settings.flipHorizontal}
            title="Flip horizontally"
            description="Mirror left to right"
            icon="↔"
            onClick={() =>
              onChange({
                flipHorizontal: !settings.flipHorizontal,
              })
            }
          />

          <ToggleOption
            active={settings.flipVertical}
            title="Flip vertically"
            description="Mirror top to bottom"
            icon="↕"
            onClick={() =>
              onChange({
                flipVertical: !settings.flipVertical,
              })
            }
          />
        </div>
      </div>

      {/* Current state */}
      {hasChanges && (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              Current transformation
            </span>

            <span className="font-mono text-xs font-semibold text-[var(--brand)]">
              {settings.rotation}°
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {settings.flipHorizontal && (
              <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 text-[10px] font-medium text-[var(--text-secondary)]">
                Horizontal flip
              </span>
            )}

            {settings.flipVertical && (
              <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 text-[10px] font-medium text-[var(--text-secondary)]">
                Vertical flip
              </span>
            )}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        type="button"
        onClick={reset}
        disabled={!hasChanges}
        className={`mt-4 w-full rounded-[var(--radius-md)] border px-4 py-2.5 text-xs font-medium transition ${
          hasChanges
            ? "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            : "cursor-not-allowed border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-muted)] opacity-60"
        }`}
      >
        Reset rotation & flips
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
      className={`flex min-h-[64px] items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition ${
        active
          ? "border-[var(--brand)] bg-[var(--brand-light)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-lg ${
          active
            ? "bg-[var(--brand)] text-white"
            : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-[var(--text)]">
          {title}
        </span>

        <span className="mt-0.5 block text-[10px] leading-4 text-[var(--text-muted)]">
          {description}
        </span>
      </span>
    </button>
  );
}