// src/pages/Create/CreateTransformPanel.tsx

import type { DesignObject } from "./CreatePage";

type Props = {
  object: DesignObject;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;
};

type NumberKey = "x" | "y" | "width" | "height" | "rotation" | "radius";

const INPUT_CLASS = `
  h-9 w-full rounded-lg
  border border-[var(--border)]
  bg-[var(--background)]
  px-2.5
  font-mono text-[11px]
  text-[var(--text)]
  outline-none
  transition-colors
  focus:border-[var(--accent,#6366F1)]
  focus:ring-2
  focus:ring-[var(--accent,#6366F1)]/10
`;

export default function CreateTransformPanel({ object, onUpdate }: Props) {
  const updateNumber = (key: NumberKey, value: number) => {
    if (!Number.isFinite(value)) {
      return;
    }

    onUpdate(object.id, {
      [key]: value,
    });
  };

  const fields: Array<[NumberKey, string]> = [
    ["x", "X"],
    ["y", "Y"],
    ["width", "Width"],
    ["height", "Height"],
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Transform
        </div>

        <span className="font-mono text-[9px] text-[var(--text-muted)]">
          POSITION & SIZE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fields.map(([key, label]) => (
          <label key={key}>
            <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
              {label}
            </span>

            <input
              type="number"
              value={Math.round(object[key])}
              onChange={(event) =>
                updateNumber(key, Number(event.target.value))
              }
              className={INPUT_CLASS}
            />
          </label>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Rotation
          </span>

          <div className="relative">
            <input
              type="number"
              value={Math.round(object.rotation)}
              onChange={(event) =>
                updateNumber("rotation", Number(event.target.value))
              }
              className={`${INPUT_CLASS} pr-7`}
            />

            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)]">
              °
            </span>
          </div>
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Radius
          </span>

          <div className="relative">
            <input
              type="number"
              min={0}
              value={Math.round(object.radius)}
              onChange={(event) =>
                updateNumber("radius", Math.max(0, Number(event.target.value)))
              }
              className={`${INPUT_CLASS} pr-8`}
            />

            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-muted)]">
              px
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}