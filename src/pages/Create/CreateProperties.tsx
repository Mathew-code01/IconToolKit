// src/pages/Create/CreateProperties.tsx
import { Copy, RotateCcw, Trash2 } from "lucide-react";

import type { DesignObject } from "./CreatePage";

import CreateColorPanel from "./CreateColorPanel";
import CreateTypographyPanel from "./CreateTypographyPanel";
import CreateTransformPanel from "./CreateTransformPanel";

type Props = {
  object: DesignObject | null;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;

  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
};

export default function CreateProperties({
  object,
  onUpdate,
  onDelete,
  onDuplicate,
}: Props) {
  if (!object) {
    return (
      <section className="border-b border-[var(--border)] p-5">
        <div className="mb-4">
          <div className="text-xs font-semibold text-[var(--text)]">
            Properties
          </div>

          <div className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
            Select an object on the canvas to edit its properties.
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--background)] p-5 text-center">
          <div
            className="
              mx-auto flex h-10 w-10
              items-center justify-center rounded-xl
              border border-[var(--border)]
              bg-[var(--surface-muted)]
              text-[var(--text-muted)]
            "
          >
            <RotateCcw size={15} />
          </div>

          <p className="mt-3 text-[11px] font-medium text-[var(--text-secondary)]">
            Nothing selected
          </p>

          <p className="mt-1 text-[9px] leading-4 text-[var(--text-muted)]">
            Click an object on the canvas to start editing.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-[var(--text)]">
            Properties
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {object.type}
            </span>

            {object.locked && (
              <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-600">
                Locked
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Duplicate"
            aria-label="Duplicate object"
            onClick={() => onDuplicate(object.id)}
            className="
              flex h-7 w-7 items-center justify-center rounded-md
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            <Copy size={13} />
          </button>

          <button
            type="button"
            title="Delete"
            aria-label="Delete object"
            onClick={() => onDelete(object.id)}
            className="
              flex h-7 w-7 items-center justify-center rounded-md
              text-[var(--text-muted)]
              transition-colors
              hover:bg-red-500/10
              hover:text-red-500
            "
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Property content */}
      <div className="space-y-5 px-5 pb-5">
        {/* Layer name */}
        <div>
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Layer name
          </label>

          <input
            value={object.name}
            onChange={(event) =>
              onUpdate(object.id, {
                name: event.target.value,
              })
            }
            className="
              h-9 w-full rounded-lg
              border border-[var(--border)]
              bg-[var(--background)]
              px-3 text-xs
              text-[var(--text)]
              outline-none
              transition-colors
              focus:border-[var(--accent,#6366F1)]
              focus:ring-2
              focus:ring-[var(--accent,#6366F1)]/10
            "
          />
        </div>

        <CreateTransformPanel object={object} onUpdate={onUpdate} />

        <CreateColorPanel object={object} onUpdate={onUpdate} />

        {object.type === "text" && (
          <CreateTypographyPanel object={object} onUpdate={onUpdate} />
        )}
      </div>
    </section>
  );
}