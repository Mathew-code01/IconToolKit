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
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--text-muted)]">
            <RotateCcw size={15} />
          </div>

          <p className="mt-3 text-[11px] font-medium text-[var(--text-secondary)]">
            Nothing selected
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <div className="text-xs font-semibold text-[var(--text)]">
            Properties
          </div>

          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {object.type}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Duplicate"
            onClick={() => onDuplicate(object.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
          >
            <Copy size={13} />
          </button>

          <button
            type="button"
            title="Delete"
            onClick={() => onDelete(object.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 pb-5">
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
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)] outline-none focus:border-[#6366F1]"
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
