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
    /*
     * We cannot remove files directly from here
     * because the parent currently only exposes
     * onRemove and onClear.
     *
     * The UI therefore uses the existing remove
     * callback for each successful file.
     */
    files
      .filter((item) => item.status === "success")
      .forEach((item) => onRemove(item.id));
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

    onClear();
  };

  const handleFilterChange = (filter: QueueFilter) => {
    setActiveFilter(filter);
    setShowAll(false);
  };

  return (
    <section
      className={[
        "overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]",
        "bg-[var(--surface-subtle)] shadow-sm",
      ].join(" ")}
      aria-label="Conversion queue"
    >
      {/* Header */}
      <div
        className={[
          "border-b border-[var(--border)]",
          "bg-[var(--surface)]",
          "p-4 sm:p-5",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => setQueueOpen((current) => !current)}
            className="group flex min-w-0 flex-1 items-start gap-3 text-left"
            aria-expanded={queueOpen}
          >
            <span
              className={[
                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                "border border-[var(--border)] bg-[var(--surface-subtle)]",
                "text-[var(--text-muted)] transition",
                "group-hover:border-[var(--brand)]/40",
                "group-hover:text-[var(--brand)]",
              ].join(" ")}
              aria-hidden="true"
            >
              <span className="text-sm">☷</span>
            </span>

            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text)]">
                  Conversion queue
                </span>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                  {files.length}
                </span>
              </span>

              <span className="mt-1 block text-[11px] leading-5 text-[var(--text-muted)]">
                {files.length === 0
                  ? "Add files to begin."
                  : `${successfulCount} done · ${pendingCount} pending${
                      processingCount ? ` · ${processingCount} processing` : ""
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
                    className="hidden rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--text)] sm:block"
                  >
                    Clear done
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleClear}
                  className={[
                    "rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition",
                    confirmClear
                      ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-red-500",
                  ].join(" ")}
                >
                  {confirmClear ? "Click again" : "Clear all"}
                </button>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => setQueueOpen((current) => !current)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-muted)] transition hover:border-[var(--brand)]/40 hover:text-[var(--brand)]"
              aria-label={queueOpen ? "Collapse queue" : "Expand queue"}
            >
              <span
                className={[
                  "text-xs transition-transform",
                  queueOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                ↓
              </span>
            </button>
          </div>
        </div>

        {/* Summary pills */}
        {files.length > 0 ? (
          <div className="mt-4 grid grid-cols-4 gap-2">
            <QueueSummary label="Total" value={files.length} />

            <QueueSummary label="Pending" value={pendingCount} />

            <QueueSummary label="Done" value={successfulCount} />

            <QueueSummary label="Errors" value={failedCount} />
          </div>
        ) : null}
      </div>

      {queueOpen ? (
        <div className="p-4 sm:p-5">
          {files.length > 0 ? (
            <>
              {/* Search + controls */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <span
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]"
                    aria-hidden="true"
                  >
                    ⌕
                  </span>

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search files..."
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-xs text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10"
                    aria-label="Search conversion files"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters((current) => !current)}
                  className={[
                    "flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition",
                    showFilters || activeFilter !== "all"
                      ? "border-[var(--brand)]/40 bg-[var(--brand)]/5 text-[var(--brand)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]",
                  ].join(" ")}
                  aria-expanded={showFilters}
                >
                  <span>Filter</span>

                  {activeFilter !== "all" ? (
                    <span className="rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[9px] text-white">
                      1
                    </span>
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => setCompactMode((current) => !current)}
                  className={[
                    "hidden h-10 items-center justify-center rounded-xl border px-3 text-xs font-semibold transition sm:flex",
                    compactMode
                      ? "border-[var(--brand)]/40 bg-[var(--brand)]/5 text-[var(--brand)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]",
                  ].join(" ")}
                  aria-pressed={compactMode}
                >
                  Compact
                </button>
              </div>

              {/* Filter bar */}
              {showFilters ? (
                <div className="mt-3 flex flex-wrap gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
                  {FILTERS.map((filter) => {
                    const count = getFilterCount(files, filter.id);

                    const active = activeFilter === filter.id;

                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => handleFilterChange(filter.id)}
                        className={[
                          "rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition",
                          active
                            ? "bg-[var(--brand)] text-white shadow-sm"
                            : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]",
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
              ) : null}

              {/* Search information */}
              {hasSearch || activeFilter !== "all" ? (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Showing{" "}
                    <span className="font-semibold text-[var(--text)]">
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
                    className="text-[10px] font-semibold text-[var(--brand)] hover:underline"
                  >
                    Reset
                  </button>
                </div>
              ) : null}

              {/* Queue */}
              <div className="mt-4">
                {!hasFilteredResults ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-10 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-muted)] text-lg text-[var(--text-muted)]">
                      ⌕
                    </div>

                    <p className="mt-3 text-xs font-semibold text-[var(--text)]">
                      No matching files
                    </p>

                    <p className="mx-auto mt-1 max-w-xs text-[10px] leading-5 text-[var(--text-muted)]">
                      Try another filename or change the queue filter.
                    </p>
                  </div>
                ) : (
                  <div
                    className={[
                      "space-y-5",
                      compactMode ? "space-y-3" : "",
                    ].join(" ")}
                  >
                    {groupedFiles.map((group) => (
                      <div key={group.category}>
                        {/* Category header */}
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                              {group.items[0]?.categoryLabel}
                            </span>

                            <span className="rounded-full bg-[var(--surface)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--text-muted)]">
                              {group.items.length}
                            </span>
                          </div>

                          <span className="hidden text-[9px] text-[var(--text-muted)] sm:block">
                            {group.items.length}{" "}
                            {group.items.length === 1 ? "file" : "files"}
                          </span>
                        </div>

                        <div
                          className={compactMode ? "space-y-1.5" : "space-y-2"}
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
                                selected={selectedFileId === item.id}
                                compact={compactMode}
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
              </div>

              {/* Show more / less */}
              {canShowMore ? (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--brand)]/40 hover:bg-[var(--brand)]/5 hover:text-[var(--brand)]"
                >
                  <span>
                    Show {hiddenCount} more{" "}
                    {hiddenCount === 1 ? "file" : "files"}
                  </span>

                  <span aria-hidden="true">↓</span>
                </button>
              ) : null}

              {canShowLess ? (
                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                >
                  <span>Show less</span>

                  <span aria-hidden="true">↑</span>
                </button>
              ) : null}

              {/* Queue footer */}
              {filteredFiles.length > INITIAL_VISIBLE_FILES ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] leading-4 text-[var(--text-muted)]">
                    {showAll
                      ? `Showing all ${filteredFiles.length} files`
                      : `Showing ${visibleFiles.length} of ${
                          filteredFiles.length
                        } files`}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowAll((current) => !current)}
                    className="text-left text-[10px] font-semibold text-[var(--brand)] hover:underline sm:text-right"
                  >
                    {showAll ? "Collapse list" : "View entire queue"}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
              <p className="text-xs text-[var(--text-muted)]">
                Your files will appear here.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Collapsed state */
        <div className="px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => setQueueOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-left transition hover:border-[var(--brand)]/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-xs text-[var(--text-muted)]">
                {files.length}
              </span>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--text)]">
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
              className="shrink-0 text-xs text-[var(--text-muted)]"
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

function QueueSummary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-2.5 text-center">
      <p className="text-sm font-bold leading-none text-[var(--text)]">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}