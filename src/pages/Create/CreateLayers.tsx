// src/pages/Create/CreateLayers.tsx

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Layers3,
  Lock,
  LockOpen,
  MoreHorizontal,
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

  onBringToFront?: (id: string) => void;

  onSendToBack?: (id: string) => void;
};

function getTypeLabel(object: DesignObject) {
  switch (object.type) {
    case "text":
      return "Text";

    case "circle":
      return "Ellipse";

    case "line":
      return "Line";

    case "image":
      return "Image";

    default:
      return "Rectangle";
  }
}

function getTypeIcon(object: DesignObject) {
  switch (object.type) {
    case "text":
      return "T";

    case "circle":
      return "○";

    case "line":
      return "╱";

    case "image":
      return "▧";

    default:
      return "□";
  }
}

export default function CreateLayers({
  objects,
  selectedId,
  onSelect,
  onMove,
  onUpdate,
  onDelete,
  onBringToFront,
  onSendToBack,
}: Props) {
  return (
    <section className="border-t border-white/[0.07]">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#15171d]/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] text-white/40">
            <Layers3 size={14} />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-white/85">
              Layers
            </div>

            <div className="text-[9px] text-white/30">
              {objects.length} {objects.length === 1 ? "object" : "objects"}
            </div>
          </div>
        </div>

        <button
          type="button"
          title="Layer options"
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/30 hover:bg-white/5 hover:text-white"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* =====================================================
          LAYER LIST
      ====================================================== */}
      <div className="p-2">
        {objects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/25">
              <Layers3 size={16} />
            </div>

            <div className="text-[10px] font-medium text-white/40">
              No layers yet
            </div>

            <div className="mt-1 text-[9px] text-white/20">
              Add a shape or text to begin.
            </div>
          </div>
        ) : (
          [...objects].reverse().map((object, reversedIndex) => {
            const selected = object.id === selectedId;

            const originalIndex = objects.length - 1 - reversedIndex;

            const canMoveUp = originalIndex < objects.length - 1;

            const canMoveDown = originalIndex > 0;

            return (
              <div
                key={object.id}
                className={`
                    group mb-1 flex min-h-12 items-center gap-1 rounded-xl
                    border px-1.5 transition-all
                    ${
                      selected
                        ? "border-[#6366F1]/30 bg-[#6366F1]/10"
                        : "border-transparent hover:border-white/[0.07] hover:bg-white/[0.035]"
                    }
                  `}
              >
                {/* Drag indicator */}
                <div className="flex h-8 w-5 shrink-0 items-center justify-center text-white/15">
                  <GripVertical size={13} />
                </div>

                {/* Object icon */}
                <button
                  type="button"
                  onClick={() => onSelect(object.id)}
                  className={`
                      flex h-8 w-8 shrink-0 items-center justify-center
                      rounded-lg text-xs font-medium transition
                      ${
                        selected
                          ? "bg-[#6366F1]/20 text-[#a5b4fc]"
                          : "bg-white/[0.04] text-white/35"
                      }
                    `}
                >
                  {getTypeIcon(object)}
                </button>

                {/* Layer information */}
                <button
                  type="button"
                  onClick={() => onSelect(object.id)}
                  className="min-w-0 flex-1 px-1.5 text-left"
                >
                  <div
                    className={`
                        truncate text-[10px] font-medium
                        ${selected ? "text-white" : "text-white/65"}
                      `}
                  >
                    {object.name}
                  </div>

                  <div className="mt-0.5 truncate text-[8px] text-white/25">
                    {getTypeLabel(object)}
                    {" • "}
                    {Math.round(object.opacity * 100)}%
                  </div>
                </button>

                {/* Visibility */}
                <button
                  type="button"
                  title={object.visible ? "Hide layer" : "Show layer"}
                  onClick={() =>
                    onUpdate(object.id, {
                      visible: !object.visible,
                    })
                  }
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/25 transition hover:bg-white/5 hover:text-white"
                >
                  {object.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>

                {/* Lock */}
                <button
                  type="button"
                  title={object.locked ? "Unlock layer" : "Lock layer"}
                  onClick={() =>
                    onUpdate(object.id, {
                      locked: !object.locked,
                    })
                  }
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/25 transition hover:bg-white/5 hover:text-white"
                >
                  {object.locked ? <Lock size={12} /> : <LockOpen size={12} />}
                </button>

                {/* Selected actions */}
                {selected && (
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      title="Move layer up"
                      disabled={!canMoveUp}
                      onClick={() => onMove(object.id, "up")}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/30 hover:bg-white/5 hover:text-white disabled:opacity-20"
                    >
                      <ChevronUp size={12} />
                    </button>

                    <button
                      type="button"
                      title="Move layer down"
                      disabled={!canMoveDown}
                      onClick={() => onMove(object.id, "down")}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/30 hover:bg-white/5 hover:text-white disabled:opacity-20"
                    >
                      <ChevronDown size={12} />
                    </button>

                    <button
                      type="button"
                      title="Delete layer"
                      onClick={() => onDelete(object.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/25 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* =====================================================
          LAYER FOOTER
      ====================================================== */}
      {selectedId && (
        <div className="border-t border-white/[0.06] px-3 py-2">
          <div className="flex items-center gap-1">
            {onBringToFront && (
              <button
                type="button"
                onClick={() => onBringToFront(selectedId)}
                className="flex-1 rounded-lg bg-white/[0.035] px-2 py-1.5 text-[9px] text-white/35 transition hover:bg-white/[0.06] hover:text-white"
              >
                Bring front
              </button>
            )}

            {onSendToBack && (
              <button
                type="button"
                onClick={() => onSendToBack(selectedId)}
                className="flex-1 rounded-lg bg-white/[0.035] px-2 py-1.5 text-[9px] text-white/35 transition hover:bg-white/[0.06] hover:text-white"
              >
                Send back
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}