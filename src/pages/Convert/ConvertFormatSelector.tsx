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

  const singleSource =
    sourceFormats.length === 1;

  const recommendedFormats = singleSource
    ? getRecommendedOutputFormats(
        first?.sourceFormat ?? null,
      )
    : [];

  const compatibleForAll = OUTPUT_FORMATS.filter(
    (format) =>
      files.length > 0 &&
      files.every((file) =>
        canConvert(
          file.sourceFormat,
          format,
        ),
      ),
  );

  const hasCommonFormat =
    compatibleForAll.length > 0;

  const selectedCompatibleFiles = files.filter(
    (file) =>
      canConvert(
        file.sourceFormat,
        value,
      ),
  );

  const incompatibleFiles = files.filter(
    (file) =>
      !canConvert(
        file.sourceFormat,
        value,
      ),
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
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label
            htmlFor="convert-output-format"
            className="block text-xs font-semibold text-[var(--text)]"
          >
            Output format
          </label>

          <p className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
            {isMixedQueue
              ? "Choose a format for compatible files, or use Smart mode for automatic per-file conversion."
              : "Choose the format that best fits your file."}
          </p>
        </div>

        {isRecommended ? (
          <span className="shrink-0 rounded-full bg-[var(--brand)]/10 px-2 py-1 text-[9px] font-bold text-[var(--brand)]">
            Recommended
          </span>
        ) : null}
      </div>

      {isMixedQueue ? (
        <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand)]/5 p-3">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-sm text-[var(--brand)]">
              ✦
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[var(--text)]">
                Mixed files detected
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
                Your files have different formats. Smart mode is
                safer because each file gets its own compatible
                recommendation.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <select
        id="convert-output-format"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value as ConvertFormat,
          )
        }
        className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10"
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

      {singleSource &&
      recommendedFormats.length > 0 ? (
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
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
                      ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--brand)]/40 hover:text-[var(--text)]",
                  ].join(" ")}
                >
                  {FORMAT_LABELS[format]}
                </button>
              ))}
          </div>
        </div>
      ) : null}

      {files.length > 1 ? (
        <div
          className={[
            "rounded-xl border p-3",
            incompatibleFiles.length > 0
              ? "border-amber-300/60 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/20"
              : "border-emerald-300/50 bg-emerald-50/40 dark:border-emerald-800/50 dark:bg-emerald-950/20",
          ].join(" ")}
        >
          {incompatibleFiles.length === 0 ? (
            <div className="flex gap-2">
              <span className="text-xs text-emerald-600">
                ✓
              </span>

              <p className="text-[10px] leading-4 text-[var(--text-muted)]">
                All {files.length} selected files can be
                converted to{" "}
                <strong className="text-[var(--text)]">
                  {FORMAT_LABELS[value]}
                </strong>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-xs text-amber-600">
                  !
                </span>

                <p className="text-[10px] leading-4 text-[var(--text-muted)]">
                  <strong className="text-[var(--text)]">
                    {selectedCompatibleFiles.length}
                  </strong>{" "}
                  of {files.length} selected files support{" "}
                  <strong className="text-[var(--text)]">
                    {FORMAT_LABELS[value]}
                  </strong>
                  .
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {incompatibleFiles
                  .slice(0, 4)
                  .map((file) => (
                    <span
                      key={file.id}
                      className="max-w-full truncate rounded-md bg-[var(--surface)] px-2 py-1 text-[9px] text-[var(--text-muted)]"
                    >
                      {file.file.name}
                    </span>
                  ))}

                {incompatibleFiles.length >
                4 ? (
                  <span className="rounded-md bg-[var(--surface)] px-2 py-1 text-[9px] text-[var(--text-muted)]">
                    +
                    {incompatibleFiles.length -
                      4}{" "}
                    more
                  </span>
                ) : null}
              </div>

              <p className="text-[9px] leading-4 text-[var(--text-muted)]">
                Unsupported files should be excluded from
                this conversion instead of being sent to an
                incompatible converter.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {files.length > 1 &&
      hasCommonFormat ? (
        <p className="text-[9px] leading-4 text-[var(--text-muted)]">
          Formats marked as “all selected” are safe for the
          entire current selection.
        </p>
      ) : null}
    </div>
  );
}