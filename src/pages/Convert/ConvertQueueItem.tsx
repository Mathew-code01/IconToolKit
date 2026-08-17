// src/pages/Convert/ConvertQueueItem.tsx

// src/pages/Convert/ConvertQueueItem.tsx

import type { ConvertFile } from "./ConvertTypes";

interface ConvertQueueItemProps {
  item: ConvertFile;
  index: number;
  total: number;
  selected?: boolean;
  onSelect?: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

export default function ConvertQueueItem({
  item,
  index,
  total,
  selected = false,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ConvertQueueItemProps) {
  const isBusy = item.status === "processing";

  return (
    <div
      className={[
        "group rounded-[var(--radius-lg)] border p-3 transition-all",
        selected
          ? "border-[var(--brand)] bg-[var(--surface-muted)] shadow-sm ring-1 ring-[var(--brand)]/20"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/40 hover:bg-[var(--surface-muted)]/50",
      ].join(" ")}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSelect}
          disabled={isBusy}
          className="min-w-0 flex-1 text-left disabled:cursor-default"
          aria-label={`Preview ${item.file.name}`}
        >
          <div className="flex gap-3">
            <div
              className={[
                "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-[var(--surface-muted)] transition",
                selected
                  ? "border-[var(--brand)]"
                  : "border-[var(--border)]",
              ].join(" ")}
            >
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-[9px] font-bold uppercase text-[var(--text-muted)]">
                    {item.sourceLabel}
                  </span>

                  <span className="text-[8px] text-[var(--text-muted)]">
                    Preview
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[var(--text)]">
                {item.file.name}
              </p>

              <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-[var(--text-muted)]">
                <span>{formatBytes(item.file.size)}</span>

                {item.width && item.height ? (
                  <span>
                    {item.width} × {item.height}
                  </span>
                ) : null}

                <span className="uppercase">
                  {item.sourceLabel}
                </span>
              </div>

              {isBusy ? (
                <div className="mt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand)] transition-all"
                      style={{
                        width: `${item.progress}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {item.status === "error" && item.error ? (
                <p className="mt-2 text-[10px] text-red-500">
                  {item.error}
                </p>
              ) : null}

              {item.status === "success" ? (
                <p className="mt-2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Conversion complete
                </p>
              ) : null}
            </div>
          </div>
        </button>

        <div className="flex shrink-0 items-start gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0 || isBusy}
            className="hidden h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)] disabled:opacity-30 sm:flex"
            aria-label="Move up"
          >
            ↑
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1 || isBusy}
            className="hidden h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)] disabled:opacity-30 sm:flex"
            aria-label="Move down"
          >
            ↓
          </button>

          <button
            type="button"
            onClick={onRemove}
            disabled={isBusy}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:border-red-300 hover:text-red-500 disabled:opacity-30"
            aria-label={`Remove ${item.file.name}`}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}