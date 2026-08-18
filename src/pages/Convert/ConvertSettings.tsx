// src/pages/Convert/ConvertSettings.tsx
// src/pages/Convert/ConvertSettings.tsx

import type {
  ConvertFile,
  ConvertFormat,
  ConvertSettingsState,
} from "./ConvertTypes";

import ConvertFormatSelector from "./ConvertFormatSelector";
import ConvertResizeControls from "./ConvertResizeControls";
import ConvertQualityControls from "./ConvertQualityControls";
import ConvertBackgroundControls from "./ConvertBackgroundControls";

import {
  FORMAT_LABELS,
  canConvert,
  getRecommendedOutputFormat,
} from "./ConvertToolRegistry";

interface ConvertSettingsProps {
  files: ConvertFile[];

  settings: ConvertSettingsState;

  onChange: (
    patch: Partial<ConvertSettingsState>,
  ) => void;

  onReset: () => void;
}

export default function ConvertSettings({
  files,
  settings,
  onChange,
  onReset,
}: ConvertSettingsProps) {
  const first = files[0];

  const mixedFormats =
    new Set(
      files.map(
        (file) => file.sourceFormat,
      ),
    ).size > 1;

  const recommendedFormats = files.map(
    (file) =>
      getRecommendedOutputFormat(
        file.sourceFormat,
      ),
  );

  const uniqueRecommendations =
    Array.from(
      new Set(
        recommendedFormats.filter(
          Boolean,
        ) as ConvertFormat[],
      ),
    );

  const incompatibleCount = files.filter(
    (file) =>
      !canConvert(
        file.sourceFormat,
        settings.outputFormat,
      ),
  ).length;

  const modeDescription =
    settings.outputMode === "smart"
      ? "Each file uses the safest recommended output format."
      : settings.outputMode === "single"
        ? "Apply one output format to every compatible selected file."
        : "Choose a different output format for each file.";

  return (
    <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] shadow-sm">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Conversion settings
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
              Choose how your selected files should be
              converted.
            </p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--brand)]"
          >
            Reset
          </button>
        </div>

        {files.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-[9px] font-semibold text-[var(--text-muted)]">
              {files.length}{" "}
              {files.length === 1
                ? "file"
                : "files"}
            </span>

            {mixedFormats ? (
              <span className="rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 px-2.5 py-1 text-[9px] font-semibold text-[var(--brand)]">
                Mixed formats
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {/* Conversion mode */}
        {files.length > 0 ? (
          <div>
            <div className="mb-2">
              <p className="text-xs font-semibold text-[var(--text)]">
                Conversion mode
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
                {modeDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <ModeButton
                active={
                  settings.outputMode ===
                  "smart"
                }
                title="Smart"
                description="Best format per file"
                icon="✦"
                onClick={() =>
                  onChange({
                    outputMode: "smart",
                  })
                }
              />

              <ModeButton
                active={
                  settings.outputMode ===
                  "single"
                }
                title="Same format"
                description="One format for selection"
                icon="↗"
                onClick={() =>
                  onChange({
                    outputMode: "single",
                  })
                }
              />

              <ModeButton
                active={
                  settings.outputMode ===
                  "individual"
                }
                title="Individual"
                description="Control each file"
                icon="☷"
                onClick={() =>
                  onChange({
                    outputMode:
                      "individual",
                  })
                }
              />
            </div>
          </div>
        ) : null}

        {/* Smart summary */}
        {settings.outputMode ===
        "smart" ? (
          <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand)]/5 p-3.5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-sm text-[var(--brand)]">
                ✦
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[var(--text)]">
                  Smart conversion is active
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
                  We will avoid unsupported conversions
                  and choose a sensible output for each
                  file.
                </p>

                {uniqueRecommendations.length >
                0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {uniqueRecommendations.map(
                      (format) => (
                        <span
                          key={format}
                          className="rounded-md bg-[var(--surface)] px-2 py-1 text-[9px] font-semibold text-[var(--text-muted)]"
                        >
                          →
                          {" "}
                          {FORMAT_LABELS[
                            format
                          ]}
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Manual output selector */}
        {settings.outputMode !==
        "smart" ? (
          <ConvertFormatSelector
            files={files}
            value={settings.outputFormat}
            onChange={(outputFormat) =>
              onChange({
                outputFormat,
              })
            }
          />
        ) : null}

        {/* Compatibility warning */}
        {settings.outputMode !==
          "smart" &&
        incompatibleCount > 0 ? (
          <div className="rounded-xl border border-amber-300/60 bg-amber-50/50 p-3 dark:border-amber-800/50 dark:bg-amber-950/20">
            <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              {incompatibleCount}{" "}
              {incompatibleCount === 1
                ? "file is"
                : "files are"}{" "}
              not compatible with{" "}
              {FORMAT_LABELS[
                settings.outputFormat
              ]}
              .
            </p>

            <p className="mt-1 text-[9px] leading-4 text-[var(--text-muted)]">
              Those files should be excluded from this
              conversion. They will not be sent to an
              unsupported converter.
            </p>
          </div>
        ) : null}

        <ConvertQualityControls
          settings={settings}
          onChange={onChange}
        />

        <ConvertResizeControls
          settings={settings}
          originalWidth={
            first?.width ?? null
          }
          originalHeight={
            first?.height ?? null
          }
          onChange={onChange}
        />

        <ConvertBackgroundControls
          settings={settings}
          onChange={onChange}
        />

        {/* ICO */}
        {settings.outputFormat ===
        "ico" ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <p className="text-xs font-semibold text-[var(--text)]">
              ICO sizes
            </p>

            <p className="mt-1 text-[9px] text-[var(--text-muted)]">
              Select the icon sizes to include.
            </p>

            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {[16, 24, 32, 48, 64, 128, 256].map(
                (size) => {
                  const selected =
                    settings.icoSizes.includes(
                      size,
                    );

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const next =
                          selected
                            ? settings.icoSizes.filter(
                                (item) =>
                                  item !==
                                  size,
                              )
                            : [
                                ...settings.icoSizes,
                                size,
                              ];

                        onChange({
                          icoSizes:
                            next.sort(
                              (a, b) =>
                                a - b,
                            ),
                        });
                      }}
                      className={[
                        "rounded-lg border px-2 py-2 text-[10px] font-medium transition",
                        selected
                          ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]",
                      ].join(" ")}
                    >
                      {size}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ) : null}

        {/* PDF */}
        {settings.outputFormat ===
        "pdf" ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="mb-3">
              <p className="text-xs font-semibold text-[var(--text)]">
                PDF output
              </p>

              <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                Configure the generated PDF document.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-medium text-[var(--text-muted)]">
                  Page size
                </label>

                <select
                  value={
                    settings.pdfPageSize
                  }
                  onChange={(event) =>
                    onChange({
                      pdfPageSize:
                        event.target
                          .value as ConvertSettingsState["pdfPageSize"],
                    })
                  }
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2 text-xs text-[var(--text)]"
                >
                  <option value="auto">
                    Auto
                  </option>

                  <option value="a4">
                    A4
                  </option>

                  <option value="letter">
                    Letter
                  </option>

                  <option value="square">
                    Square
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-medium text-[var(--text-muted)]">
                  Orientation
                </label>

                <select
                  value={
                    settings.pdfOrientation
                  }
                  onChange={(event) =>
                    onChange({
                      pdfOrientation:
                        event.target
                          .value as ConvertSettingsState["pdfOrientation"],
                    })
                  }
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2 text-xs text-[var(--text)]"
                >
                  <option value="portrait">
                    Portrait
                  </option>

                  <option value="landscape">
                    Landscape
                  </option>
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {/* General output settings */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="mb-3">
            <p className="text-xs font-semibold text-[var(--text)]">
              Output details
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-medium text-[var(--text-muted)]">
                DPI
              </label>

              <input
                type="number"
                min={72}
                max={1200}
                value={settings.dpi}
                onChange={(event) =>
                  onChange({
                    dpi: Math.max(
                      72,
                      Math.min(
                        1200,
                        Number(
                          event.target.value,
                        ) || 72,
                      ),
                    ),
                  })
                }
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2 text-xs text-[var(--text)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-medium text-[var(--text-muted)]">
                Output suffix
              </label>

              <input
                type="text"
                value={settings.suffix}
                onChange={(event) =>
                  onChange({
                    suffix:
                      event.target.value,
                  })
                }
                placeholder="-converted"
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2 text-xs text-[var(--text)]"
              />
            </div>
          </div>
        </div>

        {/* Filename */}
        <div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={
                settings.fileNameMode ===
                "custom"
              }
              onChange={(event) =>
                onChange({
                  fileNameMode:
                    event.target.checked
                      ? "custom"
                      : "original",
                })
              }
              className="accent-[var(--brand)]"
            />

            <span className="text-[11px] text-[var(--text-muted)]">
              Use custom output filename
            </span>
          </label>

          {settings.fileNameMode ===
          "custom" ? (
            <input
              type="text"
              value={
                settings.customFileName
              }
              onChange={(event) =>
                onChange({
                  customFileName:
                    event.target.value,
                })
              }
              placeholder="converted-file"
              className="mt-3 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ModeButton({
  active,
  title,
  description,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-xl border p-3 text-left transition",
        active
          ? "border-[var(--brand)] bg-[var(--brand)]/5 shadow-sm"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/30 hover:bg-[var(--surface-muted)]",
      ].join(" ")}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs",
            active
              ? "bg-[var(--brand)]/10 text-[var(--brand)]"
              : "bg-[var(--surface-muted)] text-[var(--text-muted)]",
          ].join(" ")}
        >
          {icon}
        </span>

        <span className="min-w-0">
          <span
            className={[
              "block text-[10px] font-bold",
              active
                ? "text-[var(--brand)]"
                : "text-[var(--text)]",
            ].join(" ")}
          >
            {title}
          </span>

          <span className="mt-1 block text-[9px] leading-4 text-[var(--text-muted)]">
            {description}
          </span>
        </span>
      </div>
    </button>
  );
}