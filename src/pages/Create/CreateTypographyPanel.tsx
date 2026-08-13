// src/pages/Create/CreateTypographyPanel.tsx

import type { DesignObject } from "./CreatePage";

type Props = {
  object: DesignObject;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;
};

const fonts = [
  "Inter",
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
];

export default function CreateTypographyPanel({ object, onUpdate }: Props) {
  return (
    <div className="border-t border-[var(--border)] pt-5">
      <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        Typography
      </label>

      <textarea
        value={object.text ?? ""}
        onChange={(event) =>
          onUpdate(object.id, {
            text: event.target.value,
          })
        }
        rows={2}
        className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[#6366F1]"
      />

      <div className="mt-3">
        <label className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
          Font
        </label>

        <select
          value={object.fontFamily ?? "Inter"}
          onChange={(event) =>
            onUpdate(object.id, {
              fontFamily: event.target.value,
            })
          }
          className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--text)] outline-none focus:border-[#6366F1]"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Size
          </span>

          <input
            type="number"
            min={4}
            max={300}
            value={object.fontSize ?? 36}
            onChange={(event) =>
              onUpdate(object.id, {
                fontSize: Number(event.target.value),
              })
            }
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Weight
          </span>

          <select
            value={object.fontWeight ?? 700}
            onChange={(event) =>
              onUpdate(object.id, {
                fontWeight: Number(event.target.value),
              })
            }
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
          >
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semibold</option>
            <option value={700}>Bold</option>
            <option value={800}>Extra Bold</option>
            <option value={900}>Black</option>
          </select>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Tracking
          </span>

          <input
            type="number"
            value={object.letterSpacing ?? 0}
            onChange={(event) =>
              onUpdate(object.id, {
                letterSpacing: Number(event.target.value),
              })
            }
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Align
          </span>

          <select
            value={object.textAlign ?? "center"}
            onChange={(event) =>
              onUpdate(object.id, {
                textAlign: event.target.value as "left" | "center" | "right",
              })
            }
            className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 text-[10px] text-[var(--text)] outline-none focus:border-[#6366F1]"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
      </div>
    </div>
  );
}
