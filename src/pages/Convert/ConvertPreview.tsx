// src/pages/Convert/ConvertPreview.tsx

// src/pages/Convert/ConvertPreview.tsx

import type { ConvertFile } from "./ConvertTypes";

interface ConvertPreviewProps {
  item?: ConvertFile;
}

function formatBytes(
  bytes: number | null,
): string {
  if (
    bytes === null ||
    !Number.isFinite(bytes)
  ) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(2)} MB`;
}

export default function ConvertPreview({
  item,
}: ConvertPreviewProps) {
  if (!item) {
    return null;
  }

  const isPdf =
    item.sourceFormat === "pdf";

  const isImage =
    item.sourceFormat === "png" ||
    item.sourceFormat === "jpg" ||
    item.sourceFormat === "webp" ||
    item.sourceFormat === "avif" ||
    item.sourceFormat === "bmp" ||
    item.sourceFormat === "gif" ||
    item.sourceFormat === "tiff" ||
    item.sourceFormat === "ico";

  const isSvg =
    item.sourceFormat === "svg";

  const generatedPreview =
    item.preview.previewUrl;

  const sourcePreview =
    item.previewUrl;

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Preview
            </h3>

            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              Review the source and generated output before downloading.
            </p>
          </div>

          <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {item.preview.status ===
            "generating"
              ? "Generating"
              : item.preview.status ===
                "ready"
                ? "Ready"
                : item.preview.status ===
                  "error"
                  ? "Error"
                  : "Idle"}
          </div>
        </div>
      </div>

      {item.preview.error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] leading-5 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {item.preview.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PreviewPanel
          title="Source"
          subtitle={item.file.name}
        >
          <div
            className={[
              "overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]",
              isPdf
                ? "min-h-[360px]"
                : "flex min-h-[280px] items-center justify-center p-4",
            ].join(" ")}
          >
            {sourcePreview &&
            isPdf ? (
              <iframe
                src={sourcePreview}
                title={`Source preview of ${item.file.name}`}
                className="h-[360px] w-full border-0 bg-white"
              />
            ) : sourcePreview &&
              (isImage ||
                isSvg) ? (
              <img
                src={sourcePreview}
                alt={`Preview of ${item.file.name}`}
                className="max-h-[360px] max-w-full object-contain"
              />
            ) : (
              <EmptyPreview />
            )}
          </div>
        </PreviewPanel>

        <PreviewPanel
          title="Output"
          subtitle={`.${item.settings.outputFormat}`}
        >
          <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            {generatedPreview ? (
              <img
                src={generatedPreview}
                alt={`Generated ${item.settings.outputFormat} preview`}
                className="max-h-[360px] max-w-full object-contain"
              />
            ) : item.preview.status ===
              "generating" ? (
              <div className="text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />

                <p className="mt-3 text-[10px] text-[var(--text-muted)]">
                  Generating preview…
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs font-medium text-[var(--text)]">
                  Output preview
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[var(--text-muted)]">
                  Change a conversion setting to generate an output preview.
                </p>
              </div>
            )}
          </div>
        </PreviewPanel>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <InfoCard
          label="Original"
          value={item.sourceLabel}
        />

        <InfoCard
          label="Output"
          value={item.settings.outputFormat.toUpperCase()}
        />

        <InfoCard
          label="Dimensions"
          value={
            item.preview.outputWidth &&
            item.preview.outputHeight
              ? `${item.preview.outputWidth} × ${item.preview.outputHeight}`
              : item.width &&
                  item.height
                ? `${item.width} × ${item.height}`
                : isPdf
                  ? "PDF"
                  : "—"
          }
        />

        <InfoCard
          label="Estimated size"
          value={formatBytes(
            item.preview.outputSize,
          )}
        />
      </div>
    </section>
  );
}

function PreviewPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {title}
        </p>

        <p className="max-w-[60%] truncate text-[9px] text-[var(--text-muted)]">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex min-h-[280px] items-center justify-center p-4 text-center">
      <div>
        <p className="text-xs font-medium text-[var(--text)]">
          No preview available
        </p>

        <p className="mt-1 text-[10px] leading-5 text-[var(--text-muted)]">
          This file type cannot be previewed directly in the browser.
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <p className="text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}