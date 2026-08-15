// src/pages/Convert/ConvertQueueItem.tsx

import type { ConvertFile } from "./ConvertTypes";

interface ConvertQueueItemProps {
  item: ConvertFile;
  index: number;
  total: number;
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
  onRemove,
  onMoveUp,
  onMoveDown,
}: ConvertQueueItemProps) {
  const isBusy = item.status === "processing";

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--surface-muted)]">
          {item.previewUrl ? (
            <img
              src={item.previewUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-[9px] font-semibold uppercase text-[var(--text-muted)]">
              {item.sourceLabel}
            </span>
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

            <span className="uppercase">{item.sourceLabel}</span>
          </div>

          {isBusy ? (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--brand)] transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ) : null}

          {item.status === "error" && item.error ? (
            <p className="mt-2 text-[10px] text-red-500">{item.error}</p>
          ) : null}

          {item.status === "success" ? (
            <p className="mt-2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Conversion complete
            </p>
          ) : null}
        </div>

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
            aria-label="Remove file"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
