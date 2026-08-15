// src/pages/Convert/ConvertPreview.tsx

import type { ConvertFile } from "./ConvertTypes";

interface ConvertPreviewProps {
  item?: ConvertFile;
}

export default function ConvertPreview({ item }: ConvertPreviewProps) {
  const isPdf = item?.sourceFormat === "pdf";

  const isImage =
    item?.sourceFormat === "png" ||
    item?.sourceFormat === "jpg" ||
    item?.sourceFormat === "webp" ||
    item?.sourceFormat === "avif" ||
    item?.sourceFormat === "bmp" ||
    item?.sourceFormat === "gif" ||
    item?.sourceFormat === "tiff" ||
    item?.sourceFormat === "ico";

  const isSvg = item?.sourceFormat === "svg";

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Preview</h3>

        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          Review the selected source before converting.
        </p>
      </div>

      <div
        className={[
          "overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]",
          isPdf
            ? "min-h-[520px]"
            : "flex min-h-[280px] items-center justify-center p-4",
        ].join(" ")}
      >
        {item?.previewUrl && isPdf ? (
          <iframe
            src={item.previewUrl}
            title={`Preview of ${item.file.name}`}
            className="h-[520px] w-full border-0 bg-white"
          />
        ) : item?.previewUrl && (isImage || isSvg) ? (
          <img
            src={item.previewUrl}
            alt={`Preview of ${item.file.name}`}
            className="max-h-[360px] max-w-full object-contain"
          />
        ) : (
          <div className="flex min-h-[280px] items-center justify-center p-4 text-center">
            <div>
              <p className="text-xs font-medium text-[var(--text)]">
                No preview available
              </p>

              <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                This file type cannot be previewed directly in the browser.
              </p>
            </div>
          </div>
        )}
      </div>

      {item ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
              Original
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-[var(--text)]">
              {item.sourceLabel}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
              Dimensions
            </p>

            <p className="mt-1 text-xs font-semibold text-[var(--text)]">
              {item.width && item.height
                ? `${item.width} × ${item.height}`
                : isPdf
                  ? "PDF document"
                  : "—"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
