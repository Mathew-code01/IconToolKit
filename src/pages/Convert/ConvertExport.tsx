// src/pages/Convert/ConvertExport.tsx

import type { ConvertFile } from "./ConvertTypes";

interface ConvertExportProps {
  files: ConvertFile[];
  onDownload: (item: ConvertFile) => void;
  onDownloadAll: () => void;
}

export default function ConvertExport({
  files,
  onDownload,
  onDownloadAll,
}: ConvertExportProps) {
  const successful = files.filter((item) => item.result);

  if (!successful.length) return null;

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Export</h3>

          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Your converted files are ready.
          </p>
        </div>

        {successful.length > 1 ? (
          <button
            type="button"
            onClick={onDownloadAll}
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-[11px] font-semibold text-white transition hover:opacity-90"
          >
            Download all
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        {successful.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[var(--text)]">
                {item.result?.fileName}
              </p>

              <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                {item.result
                  ? `${(item.result.size / 1024).toFixed(1)} KB`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDownload(item)}
              className="shrink-0 rounded-md border border-[var(--border)] px-3 py-1.5 text-[10px] font-semibold text-[var(--text)] hover:bg-[var(--surface-muted)]"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
