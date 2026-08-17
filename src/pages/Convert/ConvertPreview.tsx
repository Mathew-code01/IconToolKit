// src/pages/Convert/ConvertPreview.tsx

import type { ConvertFile } from "./ConvertTypes";

interface ConvertPreviewProps {
  item?: ConvertFile;
}

function formatBytes(bytes: number | null): string {
  if (bytes === null || !Number.isFinite(bytes)) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function isImageFormat(format: string): boolean {
  return [
    "png",
    "jpg",
    "jpeg",
    "webp",
    "avif",
    "bmp",
    "gif",
    "tiff",
    "ico",
    "svg",
  ].includes(format);
}

function getCategory(format: string): string {
  if (format === "pdf") return "PDF document";

  if (format === "doc" || format === "docx" || format === "word") {
    return "Word document";
  }

  if (isImageFormat(format)) {
    return "Image";
  }

  return "File";
}

export default function ConvertPreview({ item }: ConvertPreviewProps) {
  if (!item) {
    return null;
  }

  const sourceFormat = String(item.sourceFormat).toLowerCase();

  const isPdf = sourceFormat === "pdf";

  const isImage = isImageFormat(sourceFormat);

  const isWord =
    sourceFormat === "doc" ||
    sourceFormat === "docx" ||
    sourceFormat === "word";

  const generatedPreview = item.preview?.previewUrl ?? null;

  const sourcePreview = item.previewUrl ?? null;

  const previewStatus = item.preview?.status ?? "idle";

  return (
    <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)]">
      <div className="border-b border-[var(--border)] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--text)]">
                Preview
              </h3>

              <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {getCategory(sourceFormat)}
              </span>
            </div>

            <p className="mt-1 truncate text-[11px] text-[var(--text-muted)]">
              {item.file.name}
            </p>
          </div>

          <StatusBadge status={previewStatus} />
        </div>
      </div>

      {item.preview?.error ? (
        <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] leading-5 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {item.preview.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-px bg-[var(--border)] lg:grid-cols-2">
        <PreviewPanel
          title="Original"
          subtitle={`${item.sourceLabel} · ${formatBytes(item.file.size)}`}
        >
          <div className="flex min-h-[300px] items-center justify-center overflow-hidden bg-[var(--surface-muted)] p-4">
            {isPdf && sourcePreview ? (
              <iframe
                src={sourcePreview}
                title={`PDF preview of ${item.file.name}`}
                className="h-[420px] w-full rounded-lg border border-[var(--border)] bg-white"
              />
            ) : isImage && sourcePreview ? (
              <img
                src={sourcePreview}
                alt={`Preview of ${item.file.name}`}
                className="max-h-[420px] max-w-full object-contain"
              />
            ) : isWord ? (
              <DocumentPreview
                format={sourceFormat}
                fileName={item.file.name}
              />
            ) : (
              <EmptyPreview
                title="No source preview"
                description="This file type does not have a browser preview."
              />
            )}
          </div>
        </PreviewPanel>

        <PreviewPanel
          title="Output"
          subtitle={`${item.settings.outputFormat.toUpperCase()} · ${formatBytes(
            item.preview?.outputSize ?? null,
          )}`}
        >
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[var(--surface-muted)] p-4">
            {generatedPreview ? (
              <img
                src={generatedPreview}
                alt={`Generated ${item.settings.outputFormat} preview`}
                className="max-h-[420px] max-w-full object-contain"
              />
            ) : previewStatus === "generating" ? (
              <GeneratingPreview />
            ) : previewStatus === "error" ? (
              <EmptyPreview
                title="Preview unavailable"
                description="The conversion preview could not be generated."
              />
            ) : (
              <EmptyPreview
                title="Output preview"
                description="The generated output will appear here."
              />
            )}
          </div>
        </PreviewPanel>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
        <InfoCard label="Original" value={item.sourceLabel} />

        <InfoCard
          label="Output"
          value={item.settings.outputFormat.toUpperCase()}
        />

        <InfoCard
          label="Dimensions"
          value={
            item.preview?.outputWidth && item.preview?.outputHeight
              ? `${item.preview.outputWidth} × ${item.preview.outputHeight}`
              : item.width && item.height
                ? `${item.width} × ${item.height}`
                : isPdf
                  ? "PDF"
                  : "—"
          }
        />

        <InfoCard
          label="Estimated size"
          value={formatBytes(item.preview?.outputSize ?? null)}
        />
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label =
    status === "generating"
      ? "Generating"
      : status === "ready"
        ? "Ready"
        : status === "error"
          ? "Needs attention"
          : "Waiting";

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
      {status === "generating" ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand)]" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
      )}

      {label}
    </span>
  );
}

function GeneratingPreview() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />
      </div>

      <p className="mt-3 text-xs font-semibold text-[var(--text)]">
        Preparing preview
      </p>

      <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-[var(--text-muted)]">
        We are generating a lightweight preview of your output.
      </p>
    </div>
  );
}

function DocumentPreview({
  format,
  fileName,
}: {
  format: string;
  fileName: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <span className="text-xs font-bold uppercase text-[var(--brand)]">
          {format === "pdf" ? "PDF" : "DOC"}
        </span>
      </div>

      <p className="mt-3 text-xs font-semibold text-[var(--text)]">
        {format.toUpperCase()} document
      </p>

      <p className="mt-1 max-w-[240px] truncate text-[10px] text-[var(--text-muted)]">
        {fileName}
      </p>

      <p className="mt-2 text-[10px] leading-5 text-[var(--text-muted)]">
        Document content will be handled by the document conversion engine.
      </p>
    </div>
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
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2 bg-[var(--surface-subtle)] px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {title}
        </p>

        <p className="max-w-[65%] truncate text-[9px] text-[var(--text-muted)]">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}

function EmptyPreview({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto h-10 w-10 rounded-xl border border-[var(--border)] bg-[var(--surface)]" />

      <p className="mt-3 text-xs font-medium text-[var(--text)]">{title}</p>

      <p className="mx-auto mt-1 max-w-[240px] text-[10px] leading-5 text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-[var(--surface-subtle)] px-3 py-3">
      <p className="text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}
