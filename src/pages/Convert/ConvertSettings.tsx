// src/pages/Convert/ConvertSettings.tsx

import type { ConvertFile, ConvertSettingsState } from "./ConvertTypes";
import ConvertFormatSelector from "./ConvertFormatSelector";
import ConvertResizeControls from "./ConvertResizeControls";
import ConvertQualityControls from "./ConvertQualityControls";
import ConvertBackgroundControls from "./ConvertBackgroundControls";

interface ConvertSettingsProps {
  files: ConvertFile[];
  settings: ConvertSettingsState;
  onChange: (patch: Partial<ConvertSettingsState>) => void;
  onReset: () => void;
}

export default function ConvertSettings({
  files,
  settings,
  onChange,
  onReset,
}: ConvertSettingsProps) {
  const first = files[0];

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">
            Conversion settings
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
            Configure the output before starting conversion.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--brand)]"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <ConvertFormatSelector
          files={files}
          value={settings.outputFormat}
          onChange={(outputFormat) => onChange({ outputFormat })}
        />

        <ConvertQualityControls settings={settings} onChange={onChange} />

        <ConvertResizeControls
          settings={settings}
          originalWidth={first?.width ?? null}
          originalHeight={first?.height ?? null}
          onChange={onChange}
        />

        <ConvertBackgroundControls settings={settings} onChange={onChange} />

        {settings.outputFormat === "ico" ? (
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs font-semibold text-[var(--text)]">
              ICO sizes
            </p>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {[16, 24, 32, 48, 64, 128, 256].map((size) => {
                const selected = settings.icoSizes.includes(size);

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? settings.icoSizes.filter((item) => item !== size)
                        : [...settings.icoSizes, size];

                      onChange({
                        icoSizes: next.sort((a, b) => a - b),
                      });
                    }}
                    className={[
                      "rounded-md border px-2 py-2 text-[10px] font-medium transition",
                      selected
                        ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                        : "border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]",
                    ].join(" ")}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {settings.outputFormat === "pdf" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-medium text-[var(--text-muted)]">
                Page size
              </label>

              <select
                value={settings.pdfPageSize}
                onChange={(event) =>
                  onChange({
                    pdfPageSize: event.target
                      .value as ConvertSettingsState["pdfPageSize"],
                  })
                }
                className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
              >
                <option value="auto">Auto</option>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="square">Square</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-medium text-[var(--text-muted)]">
                Orientation
              </label>

              <select
                value={settings.pdfOrientation}
                onChange={(event) =>
                  onChange({
                    pdfOrientation: event.target
                      .value as ConvertSettingsState["pdfOrientation"],
                  })
                }
                className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
        ) : null}

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
                    Math.min(1200, Number(event.target.value) || 72),
                  ),
                })
              }
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
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
                  suffix: event.target.value,
                })
              }
              placeholder="-converted"
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.fileNameMode === "custom"}
            onChange={(event) =>
              onChange({
                fileNameMode: event.target.checked ? "custom" : "original",
              })
            }
            className="accent-[var(--brand)]"
          />

          <span className="text-[11px] text-[var(--text-muted)]">
            Use custom output filename
          </span>
        </label>

        {settings.fileNameMode === "custom" ? (
          <input
            type="text"
            value={settings.customFileName}
            onChange={(event) =>
              onChange({
                customFileName: event.target.value,
              })
            }
            placeholder="converted-image"
            className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)]"
          />
        ) : null}
      </div>
    </section>
  );
}
