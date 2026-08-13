// src/pages/Create/CreateTransformPanel.tsx

import type { DesignObject } from "./CreatePage";

type Props = {
  object: DesignObject;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;
};

export default function CreateTransformPanel({ object, onUpdate }: Props) {
  const updateNumber = (
    key: "x" | "y" | "width" | "height" | "rotation" | "radius",
    value: number,
  ) => {
    onUpdate(object.id, {
      [key]: value,
    });
  };

  return (
    <div>
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        Transform
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(
          [
            ["x", "X"],
            ["y", "Y"],
            ["width", "W"],
            ["height", "H"],
          ] as const
        ).map(([key, label]) => (
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
              className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
            />
          </label>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Rotation
          </span>

          <input
            type="number"
            value={Math.round(object.rotation)}
            onChange={(event) =>
              updateNumber("rotation", Number(event.target.value))
            }
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Radius
          </span>

          <input
            type="number"
            min={0}
            value={Math.round(object.radius)}
            onChange={(event) =>
              updateNumber("radius", Number(event.target.value))
            }
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
          />
        </label>
      </div>
    </div>
  );
}
