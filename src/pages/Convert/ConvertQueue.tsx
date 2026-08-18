// src/pages/Convert/ConvertQueue.tsx
import { useMemo, useState } from "react";

import type { ConvertFile, ConversionStatus } from "./ConvertTypes";

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

const INITIAL_VISIBLE_FILES = 5;

type QueueFilter = "all" | "queued" | "processing" | "success" | "error";

const FILTERS: {
  id: QueueFilter;
  label: string;
}[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "queued",
    label: "Pending",
  },
  {
    id: "processing",
    label: "Processing",
  },
  {
    id: "success",
    label: "Done",
  },
  {
    id: "error",
    label: "Errors",
  },
];

function getStatusCount(
  files: ConvertFile[],
  status: ConversionStatus,
): number {
  return files.filter((item) => item.status === status).length;
}

function getFilterCount(files: ConvertFile[], filter: QueueFilter): number {
  if (filter === "all") {
    return files.length;
  }

  return getStatusCount(files, filter);
}

function statusLabel(status: QueueFilter): string {
  switch (status) {
    case "queued":
      return "Pending";

    case "processing":
      return "Processing";

    case "success":
      return "Done";

    case "error":
      return "Errors";

    default:
      return "All";
  }
}

export default function ConvertQueue({
  files,
  selectedFileId,
  onSelect,
  onRemove,
  onMove,
  onClear,
}: ConvertQueueProps) {
  const [queueOpen, setQueueOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<QueueFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const successfulCount = getStatusCount(files, "success");
  const processingCount = getStatusCount(files, "processing");
  const pendingCount = getStatusCount(files, "queued");
  const failedCount = getStatusCount(files, "error");

  const filteredFiles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return files.filter((item) => {
      const matchesFilter =
        activeFilter === "all" || item.status === activeFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        item.file.name.toLowerCase().includes(normalizedQuery) ||
        item.sourceLabel.toLowerCase().includes(normalizedQuery) ||
        item.categoryLabel.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [files, activeFilter, searchQuery]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const selectedFiles = files.filter((file) => selectedIds.has(file.id));

  /*
   * Keep the selected file visible even when the
   * queue is collapsed to the first five items.
   */
  const visibleFiles = useMemo(() => {
    if (showAll || filteredFiles.length <= INITIAL_VISIBLE_FILES) {
      return filteredFiles;
    }

    const firstFiles = filteredFiles.slice(0, INITIAL_VISIBLE_FILES);

    const selectedIndex = selectedFileId
      ? filteredFiles.findIndex((item) => item.id === selectedFileId)
      : -1;

    if (selectedIndex >= INITIAL_VISIBLE_FILES) {
      const selected = filteredFiles[selectedIndex];

      return [...firstFiles.slice(0, INITIAL_VISIBLE_FILES - 1), selected];
    }

    return firstFiles;
  }, [filteredFiles, selectedFileId, showAll]);

  const hiddenCount = Math.max(0, filteredFiles.length - visibleFiles.length);

  const groupedFiles = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: visibleFiles.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [visibleFiles]);

  const hasSearch = searchQuery.trim().length > 0;
  const hasFilteredResults = filteredFiles.length > 0;

  const canShowMore = hiddenCount > 0 && !showAll;

  const canShowLess = showAll && filteredFiles.length > INITIAL_VISIBLE_FILES;

  const clearCompleted = () => {
    files
      .filter((item) => item.status === "success")
      .forEach((item) => onRemove(item.id));

    setSelectedIds((current) => {
      const next = new Set(current);

      files
        .filter((item) => item.status === "success")
        .forEach((item) => next.delete(item.id));

      return next;
    });
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);

      window.setTimeout(() => {
        setConfirmClear(false);
      }, 3000);

      return;
    }

    setConfirmClear(false);
    setShowAll(false);
    setSearchQuery("");
    setActiveFilter("all");
    setSelectedIds(new Set());

    onClear();
  };

  const handleFilterChange = (filter: QueueFilter) => {
    setActiveFilter(filter);
    setShowAll(false);
  };

  return (
    <section
      className={[
        "w-full overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
      ].join(" ")}
      aria-label="Conversion queue"
    >
      {/* ---------------------------------------------------------
          HEADER
      --------------------------------------------------------- */}

      <div
        className={[
          "border-b border-[var(--border)]",
          "bg-[var(--surface)]",
          "px-3.5 py-4 sm:px-5 sm:py-5",
        ].join(" ")}
      >
        <div className="flex flex-col gap-4">
          {/* Main header row */}

          <div className="flex min-w-0 items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => setQueueOpen((current) => !current)}
              className="group flex min-w-0 flex-1 items-start gap-3 text-left"
              aria-expanded={queueOpen}
            >
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center",
                  "rounded-xl",
                  "border border-[var(--border)]",
                  "bg-[var(--surface-subtle)]",
                  "text-[var(--text-muted)]",
                  "shadow-sm",
                  "transition-all duration-200",
                  "group-hover:border-[var(--brand)]/30",
                  "group-hover:bg-[var(--brand)]/5",
                  "group-hover:text-[var(--brand)]",
                ].join(" ")}
                aria-hidden="true"
              >
                <span className="text-base leading-none">☷</span>
              </span>

              <span className="min-w-0 pt-0.5">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-bold tracking-[-0.01em] text-[var(--text)] sm:text-[15px]">
                    Conversion queue
                  </span>

                  <span
                    className={[
                      "inline-flex min-w-6 items-center justify-center",
                      "rounded-full",
                      "border border-[var(--border)]",
                      "bg-[var(--surface-subtle)]",
                      "px-2 py-0.5",
                      "text-[10px] font-bold",
                      "text-[var(--text-muted)]",
                    ].join(" ")}
                  >
                    {files.length}
                  </span>
                </span>

                <span className="mt-1 block text-[11px] leading-5 text-[var(--text-muted)]">
                  {files.length === 0
                    ? "Add files to begin."
                    : `${successfulCount} done · ${pendingCount} pending${
                        processingCount
                          ? ` · ${processingCount} processing`
                          : ""
                      }${failedCount ? ` · ${failedCount} failed` : ""}`}
                </span>
              </span>
            </button>

            <div className="flex shrink-0 items-center gap-1.5">
              {files.length > 0 ? (
                <>
                  {successfulCount > 0 ? (
                    <button
                      type="button"
                      onClick={clearCompleted}
                      className={[
                        "hidden rounded-lg px-2.5 py-2",
                        "text-[10px] font-semibold",
                        "text-[var(--text-muted)]",
                        "transition-all",
                        "hover:bg-[var(--surface-subtle)]",
                        "hover:text-[var(--text)]",
                        "sm:block",
                      ].join(" ")}
                    >
                      Clear done
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleClear}
                    className={[
                      "rounded-lg px-2.5 py-2",
                      "text-[10px] font-semibold",
                      "transition-all",
                      confirmClear
                        ? [
                            "border border-[var(--error)]/20",
                            "bg-[var(--error)]/10",
                            "text-[var(--error)]",
                          ].join(" ")
                        : [
                            "text-[var(--text-muted)]",
                            "hover:bg-[var(--surface-subtle)]",
                            "hover:text-[var(--error)]",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {confirmClear ? "Click again" : "Clear all"}
                  </button>
                </>
              ) : null}

              <button
                type="button"
                onClick={() => setQueueOpen((current) => !current)}
                className={[
                  "flex h-9 w-9 items-center justify-center",
                  "rounded-xl",
                  "border border-[var(--border)]",
                  "bg-[var(--surface-subtle)]",
                  "text-[var(--text-muted)]",
                  "transition-all",
                  "hover:border-[var(--brand)]/30",
                  "hover:bg-[var(--brand)]/5",
                  "hover:text-[var(--brand)]",
                  "focus:outline-none",
                  "focus:ring-2 focus:ring-[var(--brand)]/20",
                ].join(" ")}
                aria-label={queueOpen ? "Collapse queue" : "Expand queue"}
              >
                <span
                  className={[
                    "text-sm transition-transform duration-200",
                    queueOpen ? "rotate-180" : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </button>
            </div>
          </div>

          {/* Selected files banner */}

          {selectedFiles.length > 0 ? (
            <div
              className={[
                "rounded-2xl",
                "border border-[var(--brand)]/20",
                "bg-[var(--brand)]/5",
                "px-3.5 py-3",
                "shadow-sm",
              ].join(" ")}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span
                    className={[
                      "mt-0.5 flex h-7 w-7 shrink-0",
                      "items-center justify-center",
                      "rounded-lg",
                      "bg-[var(--brand)]/10",
                      "text-xs font-bold text-[var(--brand)]",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[var(--text)]">
                      {selectedFiles.length} selected
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-[var(--text-muted)]">
                      Choose a conversion format for the selected files.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className={[
                    "self-start rounded-lg",
                    "px-2.5 py-1.5",
                    "text-[10px] font-semibold",
                    "text-[var(--brand)]",
                    "transition-all",
                    "hover:bg-[var(--brand)]/10",
                    "sm:self-auto",
                  ].join(" ")}
                >
                  Clear selection
                </button>
              </div>
            </div>
          ) : null}

          {/* Summary */}

          {files.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <QueueSummary label="Total" value={files.length} />

              <QueueSummary label="Pending" value={pendingCount} />

              <QueueSummary label="Done" value={successfulCount} />

              <QueueSummary
                label="Errors"
                value={failedCount}
                tone={failedCount > 0 ? "danger" : "default"}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* ---------------------------------------------------------
          QUEUE CONTENT
      --------------------------------------------------------- */}

      {queueOpen ? (
        <div className="p-3.5 sm:p-5">
          {files.length > 0 ? (
            <>
              {/* Search + controls */}

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <span
                    className={[
                      "pointer-events-none absolute left-3",
                      "top-1/2 -translate-y-1/2",
                      "text-sm text-[var(--text-muted)]",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    ⌕
                  </span>

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search files..."
                    className={[
                      "h-11 w-full rounded-xl",
                      "border border-[var(--border)]",
                      "bg-[var(--surface-subtle)]",
                      "pl-9 pr-3",
                      "text-xs text-[var(--text)]",
                      "outline-none",
                      "transition-all",
                      "placeholder:text-[var(--text-muted)]",
                      "hover:border-[var(--border-strong,var(--border))]",
                      "focus:border-[var(--brand)]",
                      "focus:bg-[var(--surface)]",
                      "focus:ring-4",
                      "focus:ring-[var(--brand)]/10",
                    ].join(" ")}
                    aria-label="Search conversion files"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowFilters((current) => !current)}
                    className={[
                      "flex h-11 items-center justify-center gap-2",
                      "rounded-xl border px-3",
                      "text-xs font-semibold",
                      "transition-all",
                      "focus:outline-none",
                      "focus:ring-2 focus:ring-[var(--brand)]/20",
                      showFilters || activeFilter !== "all"
                        ? [
                            "border-[var(--brand)]/30",
                            "bg-[var(--brand)]/8",
                            "text-[var(--brand)]",
                          ].join(" ")
                        : [
                            "border-[var(--border)]",
                            "bg-[var(--surface-subtle)]",
                            "text-[var(--text-muted)]",
                            "hover:border-[var(--brand)]/25",
                            "hover:text-[var(--text)]",
                          ].join(" "),
                    ].join(" ")}
                    aria-expanded={showFilters}
                  >
                    <span>Filter</span>

                    {activeFilter !== "all" ? (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[8px] font-bold text-white">
                        1
                      </span>
                    ) : null}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompactMode((current) => !current)}
                    className={[
                      "flex h-11 items-center justify-center",
                      "rounded-xl border px-3",
                      "text-xs font-semibold",
                      "transition-all",
                      "focus:outline-none",
                      "focus:ring-2 focus:ring-[var(--brand)]/20",
                      compactMode
                        ? [
                            "border-[var(--brand)]/30",
                            "bg-[var(--brand)]/8",
                            "text-[var(--brand)]",
                          ].join(" ")
                        : [
                            "border-[var(--border)]",
                            "bg-[var(--surface-subtle)]",
                            "text-[var(--text-muted)]",
                            "hover:border-[var(--brand)]/25",
                            "hover:text-[var(--text)]",
                          ].join(" "),
                    ].join(" ")}
                    aria-pressed={compactMode}
                  >
                    Compact
                  </button>
                </div>
              </div>

              {/* Filter bar */}

              {showFilters ? (
                <div
                  className={[
                    "mt-3 overflow-x-auto",
                    "rounded-xl",
                    "border border-[var(--border)]",
                    "bg-[var(--surface-subtle)]",
                    "p-1.5",
                  ].join(" ")}
                >
                  <div className="flex min-w-max gap-1">
                    {FILTERS.map((filter) => {
                      const count = getFilterCount(files, filter.id);

                      const active = activeFilter === filter.id;

                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => handleFilterChange(filter.id)}
                          className={[
                            "rounded-lg px-3 py-2",
                            "text-[10px] font-bold",
                            "transition-all",
                            active
                              ? [
                                  "bg-[var(--brand)]",
                                  "text-white",
                                  "shadow-sm",
                                ].join(" ")
                              : [
                                  "text-[var(--text-muted)]",
                                  "hover:bg-[var(--surface)]",
                                  "hover:text-[var(--text)]",
                                ].join(" "),
                          ].join(" ")}
                        >
                          {filter.label}

                          <span
                            className={[
                              "ml-1.5",
                              active ? "opacity-80" : "opacity-60",
                            ].join(" ")}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Search information */}

              {hasSearch || activeFilter !== "all" ? (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Showing{" "}
                    <span className="font-bold text-[var(--text)]">
                      {filteredFiles.length}
                    </span>{" "}
                    {filteredFiles.length === 1 ? "file" : "files"}
                    {activeFilter !== "all"
                      ? ` · ${statusLabel(activeFilter)}`
                      : ""}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className={[
                      "rounded-md px-1.5 py-1",
                      "text-[10px] font-bold",
                      "text-[var(--brand)]",
                      "transition-colors",
                      "hover:bg-[var(--brand)]/8",
                    ].join(" ")}
                  >
                    Reset
                  </button>
                </div>
              ) : null}

              {/* Queue */}

              <div className="mt-5">
                {!hasFilteredResults ? (
                  <div
                    className={[
                      "rounded-2xl",
                      "border border-dashed border-[var(--border)]",
                      "bg-[var(--surface-subtle)]",
                      "px-5 py-12 text-center",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "mx-auto flex h-12 w-12",
                        "items-center justify-center",
                        "rounded-2xl",
                        "border border-[var(--border)]",
                        "bg-[var(--surface)]",
                        "text-lg text-[var(--text-muted)]",
                        "shadow-sm",
                      ].join(" ")}
                    >
                      ⌕
                    </div>

                    <p className="mt-4 text-xs font-bold text-[var(--text)]">
                      No matching files
                    </p>

                    <p className="mx-auto mt-1.5 max-w-xs text-[10px] leading-5 text-[var(--text-muted)]">
                      Try another filename or change the queue filter.
                    </p>
                  </div>
                ) : (
                  <div
                    className={[compactMode ? "space-y-3" : "space-y-6"].join(
                      " ",
                    )}
                  >
                    {groupedFiles.map((group) => (
                      <div key={group.category}>
                        {/* Category header */}

                        <div className="mb-2.5 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-[9px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                              {group.items[0]?.categoryLabel}
                            </span>

                            <span
                              className={[
                                "inline-flex min-w-5 items-center",
                                "justify-center rounded-full",
                                "border border-[var(--border)]",
                                "bg-[var(--surface-subtle)]",
                                "px-1.5 py-0.5",
                                "text-[8px] font-bold",
                                "text-[var(--text-muted)]",
                              ].join(" ")}
                            >
                              {group.items.length}
                            </span>
                          </div>

                          <span className="hidden text-[9px] font-medium text-[var(--text-muted)] sm:block">
                            {group.items.length}{" "}
                            {group.items.length === 1 ? "file" : "files"}
                          </span>
                        </div>

                        <div
                          className={
                            compactMode ? "space-y-1.5" : "space-y-2.5"
                          }
                        >
                          {group.items.map((item) => {
                            const index = files.findIndex(
                              (file) => file.id === item.id,
                            );

                            return (
                              <ConvertQueueItem
                                key={item.id}
                                item={item}
                                index={index}
                                total={files.length}
                                selected={selectedIds.has(item.id)}
                                compact={compactMode}
                                onSelect={() => onSelect(item.id)}
                                onToggleSelect={() => toggleSelected(item.id)}
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
              </div>

              {/* Show more */}

              {canShowMore ? (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className={[
                    "mt-5 flex w-full items-center",
                    "justify-center gap-2",
                    "rounded-xl",
                    "border border-dashed border-[var(--border)]",
                    "bg-[var(--surface-subtle)]",
                    "px-4 py-3",
                    "text-xs font-bold",
                    "text-[var(--text-muted)]",
                    "transition-all",
                    "hover:border-[var(--brand)]/30",
                    "hover:bg-[var(--brand)]/5",
                    "hover:text-[var(--brand)]",
                  ].join(" ")}
                >
                  <span>
                    Show {hiddenCount} more{" "}
                    {hiddenCount === 1 ? "file" : "files"}
                  </span>

                  <span aria-hidden="true">↓</span>
                </button>
              ) : null}

              {/* Show less */}

              {canShowLess ? (
                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className={[
                    "mt-5 flex w-full items-center",
                    "justify-center gap-2",
                    "rounded-xl",
                    "border border-[var(--border)]",
                    "bg-[var(--surface-subtle)]",
                    "px-4 py-3",
                    "text-xs font-bold",
                    "text-[var(--text-muted)]",
                    "transition-all",
                    "hover:bg-[var(--surface-muted)]",
                    "hover:text-[var(--text)]",
                  ].join(" ")}
                >
                  <span>Show less</span>

                  <span aria-hidden="true">↑</span>
                </button>
              ) : null}

              {/* Footer */}

              {filteredFiles.length > INITIAL_VISIBLE_FILES ? (
                <div
                  className={[
                    "mt-5 flex flex-col gap-2.5",
                    "border-t border-[var(--border)]",
                    "pt-4",
                    "sm:flex-row sm:items-center",
                    "sm:justify-between",
                  ].join(" ")}
                >
                  <p className="text-[10px] leading-4 text-[var(--text-muted)]">
                    {showAll
                      ? `Showing all ${filteredFiles.length} files`
                      : `Showing ${visibleFiles.length} of ${filteredFiles.length} files`}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowAll((current) => !current)}
                    className={[
                      "rounded-lg px-2 py-1",
                      "text-left text-[10px] font-bold",
                      "text-[var(--brand)]",
                      "transition-colors",
                      "hover:bg-[var(--brand)]/8",
                      "sm:text-right",
                    ].join(" ")}
                  >
                    {showAll ? "Collapse list" : "View entire queue"}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div
              className={[
                "rounded-2xl",
                "border border-dashed border-[var(--border)]",
                "bg-[var(--surface-subtle)]",
                "px-6 py-10 text-center",
              ].join(" ")}
            >
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Your files will appear here.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Collapsed state */

        <div className="p-3.5 sm:p-4">
          <button
            type="button"
            onClick={() => setQueueOpen(true)}
            className={[
              "flex w-full items-center justify-between gap-3",
              "rounded-xl",
              "border border-[var(--border)]",
              "bg-[var(--surface-subtle)]",
              "px-3.5 py-3",
              "text-left",
              "transition-all",
              "hover:border-[var(--brand)]/30",
              "hover:bg-[var(--brand)]/5",
            ].join(" ")}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={[
                  "flex h-9 w-9 shrink-0",
                  "items-center justify-center",
                  "rounded-xl",
                  "border border-[var(--border)]",
                  "bg-[var(--surface)]",
                  "text-[10px] font-bold",
                  "text-[var(--text-muted)]",
                ].join(" ")}
              >
                {files.length}
              </span>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[var(--text)]">
                  {files.length} {files.length === 1 ? "file" : "files"} in
                  queue
                </p>

                <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
                  {successfulCount} done · {pendingCount} pending
                  {failedCount ? ` · ${failedCount} errors` : ""}
                </p>
              </div>
            </div>

            <span
              className="shrink-0 text-sm text-[var(--text-muted)]"
              aria-hidden="true"
            >
              ↓
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

function QueueSummary({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "danger";
}) {
  return (
    <div
      className={[
        "min-w-0 rounded-xl",
        "border",
        "px-2.5 py-3",
        "text-center",
        "transition-colors",
        tone === "danger" && value > 0
          ? ["border-[var(--error)]/20", "bg-[var(--error)]/5"].join(" ")
          : ["border-[var(--border)]", "bg-[var(--surface-subtle)]"].join(" "),
      ].join(" ")}
    >
      <p
        className={[
          "text-sm font-extrabold leading-none",
          tone === "danger" && value > 0
            ? "text-[var(--error)]"
            : "text-[var(--text)]",
        ].join(" ")}
      >
        {value}
      </p>

      <p className="mt-1.5 truncate text-[8px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}