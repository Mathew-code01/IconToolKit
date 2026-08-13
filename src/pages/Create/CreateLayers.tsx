// src/pages/Create/CreateLayers.tsx

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  LockOpen,
  Trash2,
} from "lucide-react";

import type { DesignObject } from "./CreatePage";

type Props = {
  objects: DesignObject[];
  selectedId: string | null;

  onSelect: (id: string) => void;

  onMove: (id: string, direction: "up" | "down") => void;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;

  onDelete: (id: string) => void;
};

function getTypeLabel(object: DesignObject) {
  if (object.type === "text") return "Text";
  if (object.type === "circle") return "Circle";
  if (object.type === "line") return "Line";
  if (object.type === "image") return "Image";

  return "Rectangle";
}

export default function CreateLayers({
  objects,
  selectedId,
  onSelect,
  onMove,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <section className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-[var(--text)]">Layers</div>

          <div className="mt-1 text-[10px] text-[var(--text-muted)]">
            {objects.length} objects
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {[...objects].reverse().map((object) => {
          const selected = object.id === selectedId;

          return (
            <div
              key={object.id}
              className={`
                  group flex items-center gap-1 rounded-lg border px-1.5 py-1.5
                  ${
                    selected
                      ? "border-[#6366F1]/30 bg-[#6366F1]/5"
                      : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-muted)]"
                  }
                `}
            >
              <GripVertical
                size={13}
                className="shrink-0 text-[var(--text-muted)]"
              />

              <button
                type="button"
                onClick={() => onSelect(object.id)}
                className="min-w-0 flex-1 text-left"
              >
                <div
                  className={`truncate text-[11px] font-medium ${
                    selected ? "text-[#6366F1]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {object.name}
                </div>

                <div className="mt-0.5 text-[9px] text-[var(--text-muted)]">
                  {getTypeLabel(object)}
                </div>
              </button>

              <button
                type="button"
                title={object.visible ? "Hide" : "Show"}
                onClick={() =>
                  onUpdate(object.id, {
                    visible: !object.visible,
                  })
                }
                className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)]"
              >
                {object.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>

              <button
                type="button"
                title={object.locked ? "Unlock" : "Lock"}
                onClick={() =>
                  onUpdate(object.id, {
                    locked: !object.locked,
                  })
                }
                className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)]"
              >
                {object.locked ? <Lock size={12} /> : <LockOpen size={12} />}
              </button>

              {selected && (
                <>
                  <button
                    type="button"
                    title="Move up"
                    onClick={() => onMove(object.id, "up")}
                    className="hidden h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)] sm:flex"
                  >
                    <ChevronUp size={12} />
                  </button>

                  <button
                    type="button"
                    title="Move down"
                    onClick={() => onMove(object.id, "down")}
                    className="hidden h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)] sm:flex"
                  >
                    <ChevronDown size={12} />
                  </button>

                  <button
                    type="button"
                    title="Delete"
                    onClick={() => onDelete(object.id)}
                    className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
