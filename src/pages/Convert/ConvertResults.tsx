// src/pages/Convert/ConvertResults.tsx

import type { ConvertFile } from "./ConvertTypes";

interface ConvertResultsProps {
  files: ConvertFile[];
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ConvertResults({ files }: ConvertResultsProps) {
  const successful = files.filter((file) => file.result);

  if (!successful.length) return null;

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Conversion summary
        </h3>

        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          Compare your source and converted files.
        </p>
      </div>

      <div className="space-y-2">
        {successful.map((item) => {
          const result = item.result;

          if (!result) return null;

          return (
            <div
              key={item.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                    Before
                  </p>

                  <p className="mt-1 truncate text-xs font-medium text-[var(--text)]">
                    {item.file.name}
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    {formatBytes(item.file.size)}
                    {item.width && item.height
                      ? ` • ${item.width} × ${item.height}`
                      : ""}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
                    After
                  </p>

                  <p className="mt-1 truncate text-xs font-medium text-[var(--text)]">
                    {result.fileName}
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    {formatBytes(result.size)}
                    {result.width && result.height
                      ? ` • ${result.width} × ${result.height}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
