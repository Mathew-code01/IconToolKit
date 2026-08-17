// src/pages/Convert/ConvertQueue.tsx

import type { ConvertFile } from "./ConvertTypes";
import ConvertQueueItem from "./ConvertQueueItem";

interface ConvertQueueProps {
  files: ConvertFile[];
  selectedFileId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onClear: () => void;
}

const CATEGORY_ORDER = [
  "pdf",
  "word",
  "image",
  "spreadsheet",
  "presentation",
  "archive",
  "other",
] as const;

export default function ConvertQueue({
  files,
  selectedFileId,
  onSelect,
  onRemove,
  onMove,
  onClear,
}: ConvertQueueProps) {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: files.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

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
            className="text-[11px] font-medium text-[var(--text-muted)] transition hover:text-red-500"
          >
            Clear queue
          </button>
        ) : null}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Your files will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.category}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text)]">
                    {group.items[0]?.categoryLabel}
                  </span>

                  <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                    {group.items.length}
                  </span>
                </div>

                <span className="text-[10px] text-[var(--text-muted)]">
                  {group.items.length === 1 ? "file" : "files"}
                </span>
              </div>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const index = files.findIndex((file) => file.id === item.id);

                  return (
                    <ConvertQueueItem
                      key={item.id}
                      item={item}
                      index={index}
                      total={files.length}
                      selected={selectedFileId === item.id}
                      onSelect={() => onSelect(item.id)}
                      onRemove={() => onRemove(item.id)}
                      onMoveUp={() => onMove(item.id, "up")}
                      onMoveDown={() => onMove(item.id, "down")}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}