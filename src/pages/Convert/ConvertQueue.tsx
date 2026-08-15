// src/pages/Convert/ConvertQueue.tsx

import type { ConvertFile } from "./ConvertTypes";
import ConvertQueueItem from "./ConvertQueueItem";

interface ConvertQueueProps {
  files: ConvertFile[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onClear: () => void;
}

export default function ConvertQueue({
  files,
  onRemove,
  onMove,
  onClear,
}: ConvertQueueProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">
            Conversion queue
          </h3>

          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            {files.length} {files.length === 1 ? "file" : "files"} ready
          </p>
        </div>

        {files.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-medium text-[var(--text-muted)] hover:text-red-500"
          >
            Clear queue
          </button>
        ) : null}
      </div>

      {files.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Your files will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((item, index) => (
            <ConvertQueueItem
              key={item.id}
              item={item}
              index={index}
              total={files.length}
              onRemove={() => onRemove(item.id)}
              onMoveUp={() => onMove(item.id, "up")}
              onMoveDown={() => onMove(item.id, "down")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
