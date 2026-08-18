// src/pages/Convert/ConvertFormatSelector.tsx

// src/pages/Convert/ConvertFormatSelector.tsx

import type {
  ConvertFile,
  ConvertFormat,
} from "./ConvertTypes";

import {
  FORMAT_LABELS,
  OUTPUT_FORMATS,
  canConvert,
  getRecommendedOutputFormat,
  getRecommendedOutputFormats,
} from "./ConvertToolRegistry";

interface ConvertFormatSelectorProps {
  files: ConvertFile[];
  value: ConvertFormat;
  onChange: (format: ConvertFormat) => void;
}

export default function ConvertFormatSelector({
  files,
  value,
  onChange,
}: ConvertFormatSelectorProps) {
  const first = files[0];

  const sourceFormats = Array.from(
    new Set(files.map((file) => file.sourceFormat)),
  );

  const singleSource = sourceFormats.length === 1;

  const recommendedFormats = singleSource
    ? getRecommendedOutputFormats(
        first?.sourceFormat ?? null,
      )
    : [];

  const compatibleForAll = OUTPUT_FORMATS.filter(
    (format) =>
      files.length > 0 &&
      files.every((file) =>
        canConvert(file.sourceFormat, format),
      ),
  );

  const hasCommonFormat =
    compatibleForAll.length > 0;

  const selectedCompatibleFiles = files.filter(
    (file) =>
      canConvert(file.sourceFormat, value),
  );

  const incompatibleFiles = files.filter(
    (file) =>
      !canConvert(file.sourceFormat, value),
  );

  const primaryRecommendation =
    getRecommendedOutputFormat(
      first?.sourceFormat ?? null,
    );

  const isRecommended =
    value === primaryRecommendation;

  const isMixedQueue =
    sourceFormats.length > 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <label
            htmlFor="convert-output-format"
            className="block text-xs font-semibold tracking-[-0.01em] text-[var(--text)]"
          >
            Output format
          </label>

          <p className="mt-1 max-w-xl text-[10px] leading-[1.55] text-[var(--text-secondary)]">
            {isMixedQueue
              ? "Choose a format for compatible files, or use Smart mode for automatic per-file conversion."
              : "Choose the format that best fits your file."}
          </p>
        </div>

        {isRecommended ? (
          <span className="shrink-0 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/10 px-2.5 py-1 text-[9px] font-bold tracking-wide text-[var(--brand)]">
            Recommended
          </span>
        ) : null}
      </div>

      {/* Mixed files */}
      {isMixedQueue ? (
        <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand)]/[0.07] p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--brand)]/15 bg-[var(--brand)]/10 text-sm text-[var(--brand)]">
              ✦
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[var(--text)]">
                Mixed files detected
              </p>

              <p className="mt-1 text-[10px] leading-[1.55] text-[var(--text-secondary)]">
                Your files have different formats. Smart mode is
                safer because each file gets its own compatible
                recommendation.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Output selector */}
      <div className="relative">
        <select
          id="convert-output-format"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value as ConvertFormat,
            )
          }
          className="h-10 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 pr-9 text-xs font-medium text-[var(--text)] shadow-sm outline-none transition hover:border-[var(--border-strong)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15"
        >
          {OUTPUT_FORMATS.map((format) => {
            const compatibleCount = files.filter(
              (file) =>
                canConvert(
                  file.sourceFormat,
                  format,
                ),
            ).length;

            const compatible =
              compatibleCount > 0;

            const common =
              compatibleForAll.includes(format);

            return (
              <option
                key={format}
                value={format}
                disabled={!compatible}
              >
                {FORMAT_LABELS[format]}
                {!compatible
                  ? " — unavailable"
                  : files.length > 1
                    ? common
                      ? " — all selected"
                      : ` — ${compatibleCount}/${files.length} compatible`
                    : ""}
              </option>
            );
          })}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        >
          ▾
        </span>
      </div>

      {/* Recommended formats */}
      {singleSource &&
      recommendedFormats.length > 0 ? (
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Recommended
          </p>

          <div className="flex flex-wrap gap-2">
            {recommendedFormats
              .slice(0, 3)
              .map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() =>
                    onChange(format)
                  }
                  className={[
                    "rounded-lg border px-3 py-2 text-[10px] font-semibold transition",
                    value === format
                      ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 text-[var(--brand)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand)]/40 hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
                  ].join(" ")}
                >
                  {FORMAT_LABELS[format]}
                </button>
              ))}
          </div>
        </div>
      ) : null}

      {/* Compatibility summary */}
      {files.length > 1 ? (
        <div
          className={[
            "rounded-xl border p-3.5",
            incompatibleFiles.length > 0
              ? "border-amber-300/50 bg-amber-50/60 dark:border-amber-700/40 dark:bg-amber-950/20"
              : "border-emerald-300/50 bg-emerald-50/60 dark:border-emerald-700/40 dark:bg-emerald-950/20",
          ].join(" ")}
        >
          {incompatibleFiles.length === 0 ? (
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓
              </span>

              <p className="text-[10px] leading-[1.55] text-[var(--text-secondary)]">
                All {files.length} selected files can be
                converted to{" "}
                <strong className="font-semibold text-[var(--text)]">
                  {FORMAT_LABELS[value]}
                </strong>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  !
                </span>

                <p className="text-[10px] leading-[1.55] text-[var(--text-secondary)]">
                  <strong className="font-semibold text-[var(--text)]">
                    {selectedCompatibleFiles.length}
                  </strong>{" "}
                  of {files.length} selected files support{" "}
                  <strong className="font-semibold text-[var(--text)]">
                    {FORMAT_LABELS[value]}
                  </strong>
                  .
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {incompatibleFiles
                  .slice(0, 4)
                  .map((file) => (
                    <span
                      key={file.id}
                      className="max-w-full truncate rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[9px] font-medium text-[var(--text-secondary)]"
                    >
                      {file.file.name}
                    </span>
                  ))}

                {incompatibleFiles.length >
                4 ? (
                  <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[9px] font-medium text-[var(--text-secondary)]">
                    +
                    {incompatibleFiles.length -
                      4}{" "}
                    more
                  </span>
                ) : null}
              </div>

              <p className="text-[9px] leading-[1.55] text-[var(--text-muted)]">
                Unsupported files should be excluded from
                this conversion instead of being sent to an
                incompatible converter.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Common-format helper */}
      {files.length > 1 &&
      hasCommonFormat ? (
        <p className="text-[9px] leading-[1.55] text-[var(--text-muted)]">
          Formats marked as “all selected” are safe for the
          entire current selection.
        </p>
      ) : null}
    </div>
  );
}