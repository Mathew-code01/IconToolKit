// src/pages/Edit/PaddingTool.tsx
// src/pages/Edit/PaddingTool.tsx

import type { PaddingSettings } from "./EditPage";

export interface PaddingToolProps {
  settings: PaddingSettings;
  onChange: (updates: Partial<PaddingSettings>) => void;
}

export default function PaddingTool({ settings, onChange }: PaddingToolProps) {
  const setSide = (side: "top" | "right" | "bottom" | "left", value: number) => {
    const clamped = Math.max(0, value);

    if (settings.linked) {
      onChange({ top: clamped, right: clamped, bottom: clamped, left: clamped });
      return;
    }

    onChange({ [side]: clamped } as Partial<PaddingSettings>);
  };

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Padding</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Add safe space around your image for better icon composition.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange({ linked: !settings.linked })}
        aria-pressed={settings.linked}
        className={`mb-4 flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-xs font-medium transition ${
          settings.linked
            ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
            : "border-[var(--border)] text-[var(--text-secondary)]"
        }`}
      >
        <span aria-hidden="true">{settings.linked ? "🔗" : "🔓"}</span>
        {settings.linked ? "Linked" : "Independent"}
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        <PaddingField label="Top" value={settings.top} onChange={(value) => setSide("top", value)} />
        <PaddingField label="Right" value={settings.right} onChange={(value) => setSide("right", value)} />
        <PaddingField label="Bottom" value={settings.bottom} onChange={(value) => setSide("bottom", value)} />
        <PaddingField label="Left" value={settings.left} onChange={(value) => setSide("left", value)} />
      </div>

      <button
        type="button"
        onClick={() => onChange({ top: 0, right: 0, bottom: 0, left: 0 })}
        className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
      >
        Reset padding
      </button>
    </section>
  );
}

function PaddingField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">{label}</span>

      <div className="relative">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
          className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 pr-10 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)]"
        />

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
          px
        </span>
      </div>
    </label>
  );
}