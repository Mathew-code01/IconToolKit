// src/pages/Create/CreateHistory.tsx

import { Redo2, RotateCcw, Undo2 } from "lucide-react";

type Props = {
  canUndo: boolean;
  canRedo: boolean;

  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
};

export default function CreateHistory({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
}: Props) {
  return (
    <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canUndo}
          onClick={onUndo}
          title="Undo"
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[10px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Undo2 size={13} />
          Undo
        </button>

        <button
          type="button"
          disabled={!canRedo}
          onClick={onRedo}
          title="Redo"
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[10px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Redo2 size={13} />
          Redo
        </button>

        <button
          type="button"
          onClick={onReset}
          title="Reset design"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}
