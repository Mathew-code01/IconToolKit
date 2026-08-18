// src/pages/Convert/ConvertQueueItem.tsx

// src/pages/Convert/ConvertQueueItem.tsx
import type { ConvertFile, ConversionStatus } from "./ConvertTypes";

interface ConvertQueueItemProps {
  item: ConvertFile;
  index: number;
  total: number;

  selected?: boolean;

  onSelect?: () => void;

  onToggleSelect?: () => void;

  onRemove: () => void;

  onMoveUp: () => void;

  onMoveDown: () => void;

  compact?: boolean;
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
        className: [
          "border-[var(--brand)]/20",
          "bg-[var(--brand)]/8",
          "text-[var(--brand)]",
        ].join(" "),
        dot: "bg-[var(--brand)]",
      };

    case "success":
      return {
        label: "Done",
        className: [
          "border-[var(--success)]/20",
          "bg-[var(--success)]/8",
          "text-[var(--success)]",
        ].join(" "),
        dot: "bg-[var(--success)]",
      };

    case "error":
      return {
        label: "Error",
        className: [
          "border-[var(--error)]/20",
          "bg-[var(--error)]/8",
          "text-[var(--error)]",
        ].join(" "),
        dot: "bg-[var(--error)]",
      };

    case "queued":
    default:
      return {
        label: "Pending",
        className: [
          "border-[var(--border)]",
          "bg-[var(--surface-subtle)]",
          "text-[var(--text-muted)]",
        ].join(" "),
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
  onToggleSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ConvertQueueItemProps) {
  const isBusy = item.status === "processing";
  const status = getStatusInfo(item.status);

  const progress = Math.max(0, Math.min(100, item.progress || 0));

  return (
    <div
      className={[
        "group relative overflow-hidden",
        "rounded-2xl border",
        "transition-all duration-200",
        selected
          ? [
              "border-[var(--brand)]/45",
              "bg-[var(--brand)]/8",
              "shadow-[0_6px_24px_rgba(0,0,0,0.16)]",
              "ring-1 ring-[var(--brand)]/15",
            ].join(" ")
          : [
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "hover:border-[var(--brand)]/30",
              "hover:bg-[var(--surface-subtle)]",
              "hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]",
            ].join(" "),
      ].join(" ")}
    >
      {/* Processing progress strip */}

      {isBusy ? (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--surface-muted)]">
          <div
            className="h-full rounded-r-full bg-[var(--brand)] transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      ) : null}

      <div
        className={[
          "flex min-w-0",
          compact
            ? "items-center gap-2 p-2"
            : "items-start gap-2.5 p-3 sm:gap-3 sm:p-3.5",
        ].join(" ")}
      >
        {/* Queue number */}

        <div className="hidden w-4 shrink-0 items-center justify-center pt-1 text-[9px] font-bold text-[var(--text-muted)] sm:flex">
          {index + 1}
        </div>

        {/* Preview */}

        <button
          type="button"
          onClick={onSelect}
          disabled={isBusy}
          className={[
            "shrink-0 overflow-hidden",
            "rounded-xl border",
            "bg-[var(--surface-muted)]",
            "transition-all",
            "disabled:cursor-default",
            "disabled:opacity-90",
            selected ? "border-[var(--brand)]/50" : "border-[var(--border)]",
            compact ? "h-10 w-10" : "h-12 w-12 sm:h-14 sm:w-14",
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
                  "font-extrabold text-[var(--text-muted)]",
                  compact ? "text-[7px]" : "text-[8px] sm:text-[9px]",
                ].join(" ")}
              >
                {getFileInitial(item)}
              </span>

              {!compact ? (
                <span className="text-[7px] font-medium text-[var(--text-muted)]">
                  File
                </span>
              ) : null}
            </div>
          )}
        </button>

        {/* Checkbox + main content */}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-2">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              onClick={(event) => event.stopPropagation()}
              disabled={isBusy}
              className={[
                "mt-1 h-4 w-4 shrink-0",
                "cursor-pointer",
                "rounded",
                "border-[var(--border)]",
                "accent-[var(--brand)]",
                "disabled:cursor-not-allowed",
              ].join(" ")}
              aria-label={`Select ${item.file.name}`}
            />

            <button
              type="button"
              onClick={onSelect}
              disabled={isBusy}
              className="min-w-0 flex-1 text-left disabled:cursor-default"
            >
              {/* File name + status */}

              <div className="flex min-w-0 items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <p
                      className={[
                        "min-w-0 truncate",
                        "font-bold text-[var(--text)]",
                        compact ? "text-[10px]" : "text-[11px] sm:text-xs",
                      ].join(" ")}
                      title={item.file.name}
                    >
                      {item.file.name}
                    </p>

                    {selected ? (
                      <span
                        className={[
                          "hidden shrink-0",
                          "rounded-full",
                          "bg-[var(--brand)]/10",
                          "px-1.5 py-0.5",
                          "text-[8px] font-bold",
                          "text-[var(--brand)]",
                          "sm:inline-flex",
                        ].join(" ")}
                      >
                        Selected
                      </span>
                    ) : null}
                  </div>

                  {!compact ? (
                    <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[9px] text-[var(--text-muted)] sm:text-[10px]">
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
                    "inline-flex shrink-0 items-center",
                    "gap-1 rounded-full border",
                    "font-bold",
                    compact
                      ? "px-1.5 py-0.5 text-[7px]"
                      : "px-2 py-1 text-[8px]",
                    status.className,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "shrink-0 rounded-full",
                      compact ? "h-1 w-1" : "h-1.5 w-1.5",
                      status.dot,
                      isBusy ? "animate-pulse" : "",
                    ].join(" ")}
                    aria-hidden="true"
                  />

                  <span className="hidden sm:inline">{status.label}</span>

                  <span className="sm:hidden">
                    {item.status === "success"
                      ? "Done"
                      : item.status === "error"
                        ? "Error"
                        : item.status === "processing"
                          ? "Working"
                          : "Pending"}
                  </span>
                </span>
              </div>

              {/* Progress */}

              {isBusy ? (
                <div className={compact ? "mt-1.5" : "mt-2.5"}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8px] font-medium text-[var(--text-muted)]">
                      Converting...
                    </span>

                    <span className="text-[8px] font-bold text-[var(--brand)]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand)] transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {/* Error */}

              {item.status === "error" && item.error ? (
                <div
                  className={[
                    "flex items-start gap-2",
                    "rounded-xl",
                    "border border-[var(--error)]/15",
                    "bg-[var(--error)]/5",
                    compact ? "mt-1.5 px-2 py-1.5" : "mt-2.5 px-2.5 py-2",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex shrink-0 items-center justify-center",
                      "rounded-full",
                      "bg-[var(--error)]/10",
                      "font-bold text-[var(--error)]",
                      compact ? "h-4 w-4 text-[8px]" : "h-5 w-5 text-[9px]",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    !
                  </span>

                  <p
                    className={[
                      "min-w-0 flex-1",
                      "font-medium leading-4",
                      "text-[var(--error)]",
                      compact ? "text-[8px]" : "text-[9px] sm:text-[10px]",
                    ].join(" ")}
                    title={item.error}
                  >
                    {item.error}
                  </p>
                </div>
              ) : null}

              {/* Success */}

              {item.status === "success" ? (
                <div
                  className={[
                    "flex items-center gap-1.5",
                    "font-semibold text-[var(--success)]",
                    compact
                      ? "mt-1 text-[8px]"
                      : "mt-2 text-[9px] sm:text-[10px]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex items-center justify-center",
                      "rounded-full",
                      "bg-[var(--success)]/10",
                      compact ? "h-4 w-4 text-[7px]" : "h-4 w-4 text-[8px]",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <span>Conversion complete</span>
                </div>
              ) : null}
            </button>
          </div>
        </div>

        {/* Actions */}

        <div
          className={[
            "flex shrink-0 items-start gap-1",
            compact ? "gap-0.5" : "",
          ].join(" ")}
        >
          {/* Move up */}

          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0 || isBusy}
            className={[
              "hidden items-center justify-center",
              "rounded-lg border border-[var(--border)]",
              "bg-[var(--surface-subtle)]",
              "text-[var(--text-muted)]",
              "transition-all",
              "hover:border-[var(--brand)]/25",
              "hover:bg-[var(--brand)]/5",
              "hover:text-[var(--text)]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-30",
              "sm:flex",
              compact ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]",
            ].join(" ")}
            aria-label={`Move ${item.file.name} up`}
            title="Move up"
          >
            ↑
          </button>

          {/* Move down */}

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1 || isBusy}
            className={[
              "hidden items-center justify-center",
              "rounded-lg border border-[var(--border)]",
              "bg-[var(--surface-subtle)]",
              "text-[var(--text-muted)]",
              "transition-all",
              "hover:border-[var(--brand)]/25",
              "hover:bg-[var(--brand)]/5",
              "hover:text-[var(--text)]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-30",
              "sm:flex",
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
              "flex items-center justify-center",
              "rounded-lg border",
              "border-[var(--border)]",
              "bg-[var(--surface-subtle)]",
              "text-[var(--text-muted)]",
              "transition-all",
              "hover:border-[var(--error)]/20",
              "hover:bg-[var(--error)]/8",
              "hover:text-[var(--error)]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-30",
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
        <div
          className={[
            "absolute bottom-0 left-0 top-0",
            "w-0.5 bg-[var(--brand)]",
          ].join(" ")}
        />
      ) : null}
    </div>
  );
}