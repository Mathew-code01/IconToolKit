// src/pages/Convert/ConvertQueueItem.tsx

// src/pages/Convert/ConvertQueueItem.tsx

import type { ConvertFile, ConversionStatus } from "./ConvertTypes";

interface ConvertQueueItemProps {
  item: ConvertFile;
  index: number;
  total: number;
  selected?: boolean;
  compact?: boolean;
  onSelect?: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function formatBytes(bytes: number) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function getStatusInfo(status: ConversionStatus) {
  switch (status) {
    case "processing":
      return {
        label: "Processing",
        className:
          "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/20",
        dot: "bg-[var(--brand)]",
      };

    case "success":
      return {
        label: "Done",
        className:
          "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
        dot: "bg-emerald-500",
      };

    case "error":
      return {
        label: "Error",
        className:
          "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40",
        dot: "bg-red-500",
      };

    case "queued":
    default:
      return {
        label: "Pending",
        className:
          "bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)]",
        dot: "bg-[var(--text-muted)]",
      };
  }
}

function getFileInitial(file: ConvertFile): string {
  const extension =
    file.sourceLabel || file.file.name.split(".").pop() || "file";

  return extension.slice(0, 4).toUpperCase();
}

export default function ConvertQueueItem({
  item,
  index,
  total,
  selected = false,
  compact = false,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ConvertQueueItemProps) {
  const isBusy = item.status === "processing";

  const status = getStatusInfo(item.status);

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[var(--radius-lg)] border transition-all",
        selected
          ? "border-[var(--brand)] bg-[var(--surface-muted)] shadow-sm ring-1 ring-[var(--brand)]/20"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/30 hover:bg-[var(--surface-muted)]/40",
      ].join(" ")}
    >
      {/* Processing progress strip */}
      {isBusy ? (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--surface-muted)]">
          <div
            className="h-full bg-[var(--brand)] transition-all duration-300"
            style={{
              width: `${Math.max(0, Math.min(100, item.progress))}%`,
            }}
          />
        </div>
      ) : null}

      <div
        className={compact ? "flex items-center gap-2 p-2" : "flex gap-3 p-3"}
      >
        {/* Queue number */}
        <div className="hidden shrink-0 items-center justify-center text-[9px] font-semibold text-[var(--text-muted)] sm:flex sm:w-4">
          {index + 1}
        </div>

        {/* Preview */}
        <button
          type="button"
          onClick={onSelect}
          disabled={isBusy}
          className={[
            "shrink-0 overflow-hidden rounded-xl border bg-[var(--surface-muted)]",
            "transition disabled:cursor-default",
            selected ? "border-[var(--brand)]" : "border-[var(--border)]",
            compact ? "h-10 w-10" : "h-14 w-14",
          ].join(" ")}
          aria-label={`Preview ${item.file.name}`}
        >
          {item.previewUrl ? (
            <img
              src={item.previewUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
              <span
                className={[
                  "font-bold text-[var(--text-muted)]",
                  compact ? "text-[7px]" : "text-[9px]",
                ].join(" ")}
              >
                {getFileInitial(item)}
              </span>

              {!compact ? (
                <span className="text-[7px] text-[var(--text-muted)]">
                  File
                </span>
              ) : null}
            </div>
          )}
        </button>

        {/* Main content */}
        <button
          type="button"
          onClick={onSelect}
          disabled={isBusy}
          className="min-w-0 flex-1 text-left disabled:cursor-default"
        >
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <p
                  className={[
                    "min-w-0 truncate font-semibold text-[var(--text)]",
                    compact ? "text-[10px]" : "text-xs",
                  ].join(" ")}
                  title={item.file.name}
                >
                  {item.file.name}
                </p>

                {selected ? (
                  <span className="hidden shrink-0 rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[8px] font-bold text-white sm:inline-flex">
                    Selected
                  </span>
                ) : null}
              </div>

              {!compact ? (
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[var(--text-muted)]">
                  <span>{formatBytes(item.file.size)}</span>

                  {item.width && item.height ? (
                    <>
                      <span aria-hidden="true">·</span>

                      <span>
                        {item.width} × {item.height}
                      </span>
                    </>
                  ) : null}

                  <span aria-hidden="true">·</span>

                  <span className="uppercase">{item.sourceLabel}</span>
                </div>
              ) : null}
            </div>

            {/* Status */}
            <span
              className={[
                "inline-flex shrink-0 items-center gap-1 rounded-full border font-semibold",
                compact ? "px-1.5 py-0.5 text-[7px]" : "px-2 py-1 text-[8px]",
                status.className,
              ].join(" ")}
            >
              <span
                className={[
                  "rounded-full",
                  compact ? "h-1 w-1" : "h-1.5 w-1.5",
                  status.dot,
                  isBusy ? "animate-pulse" : "",
                ].join(" ")}
                aria-hidden="true"
              />

              {status.label}
            </span>
          </div>

          {/* Progress */}
          {isBusy ? (
            <div className={compact ? "mt-1.5" : "mt-2"}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[8px] text-[var(--text-muted)]">
                  Converting...
                </span>

                <span className="text-[8px] font-semibold text-[var(--brand)]">
                  {Math.round(item.progress)}%
                </span>
              </div>

              <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--brand)] transition-all duration-300"
                  style={{
                    width: `${Math.max(0, Math.min(100, item.progress))}%`,
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* Error */}
          {item.status === "error" && item.error ? (
            <p
              className={[
                "line-clamp-2 text-red-500",
                compact ? "mt-1 text-[8px]" : "mt-2 text-[10px]",
              ].join(" ")}
              title={item.error}
            >
              {item.error}
            </p>
          ) : null}

          {/* Success information */}
          {item.status === "success" ? (
            <p
              className={[
                "font-medium text-emerald-600 dark:text-emerald-400",
                compact ? "mt-1 text-[8px]" : "mt-2 text-[10px]",
              ].join(" ")}
            >
              Conversion complete
            </p>
          ) : null}
        </button>

        {/* Actions */}
        <div
          className={[
            "flex shrink-0 items-start gap-1",
            compact ? "gap-0.5" : "",
          ].join(" ")}
        >
          {/* Desktop move buttons */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0 || isBusy}
            className={[
              "hidden items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition",
              "hover:border-[var(--brand)]/30 hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
              "disabled:cursor-not-allowed disabled:opacity-30 sm:flex",
              compact ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]",
            ].join(" ")}
            aria-label={`Move ${item.file.name} up`}
            title="Move up"
          >
            ↑
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1 || isBusy}
            className={[
              "hidden items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition",
              "hover:border-[var(--brand)]/30 hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
              "disabled:cursor-not-allowed disabled:opacity-30 sm:flex",
              compact ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]",
            ].join(" ")}
            aria-label={`Move ${item.file.name} down`}
            title="Move down"
          >
            ↓
          </button>

          {/* Remove */}
          <button
            type="button"
            onClick={onRemove}
            disabled={isBusy}
            className={[
              "flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition",
              "hover:border-red-300 hover:bg-red-50 hover:text-red-500",
              "dark:hover:bg-red-950/20",
              "disabled:cursor-not-allowed disabled:opacity-30",
              compact ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[11px]",
            ].join(" ")}
            aria-label={`Remove ${item.file.name}`}
            title="Remove file"
          >
            ×
          </button>
        </div>
      </div>

      {/* Selected indicator */}
      {selected ? (
        <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-[var(--brand)]" />
      ) : null}
    </div>
  );
}