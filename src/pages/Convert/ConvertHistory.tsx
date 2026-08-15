// src/pages/Convert/ConvertHistory.tsx
// src/pages/Convert/ConvertHistory.tsx

import { useState } from "react";
import type { ConvertHistoryItem } from "./ConvertTypes";
import {
  readConversionHistory,
} from "./convertHistoryStore";

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}

export default function ConvertHistory() {
  const [
    history,
  ] = useState<ConvertHistoryItem[]>(
    () => readConversionHistory(),
  );

  if (!history.length) {
    return null;
  }

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Recent conversions
            </h3>

            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              Stored locally in this browser.
            </p>
          </div>

          <span className="rounded-full border border-[var(--border)] px-2 py-1 text-[9px] font-medium text-[var(--text-muted)]">
            Last {Math.min(history.length, 5)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {history
          .slice(0, 5)
          .map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[var(--text)]">
                  {item.outputName}
                </p>

                <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                  {item.sourceFormat?.toUpperCase()}{" "}
                  →{" "}
                  {item.outputFormat.toUpperCase()}{" "}
                  ·{" "}
                  {formatBytes(item.size)}
                </p>
              </div>

              <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                {new Date(
                  item.createdAt,
                ).toLocaleDateString()}
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}