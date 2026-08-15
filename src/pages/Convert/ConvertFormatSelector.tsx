// src/pages/Convert/ConvertFormatSelector.tsx

import type { ConvertFile, ConvertFormat } from "./ConvertTypes";
import { FORMAT_LABELS, OUTPUT_FORMATS } from "./ConvertToolRegistry";

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
  const source = files[0]?.sourceFormat;

  const allowed = OUTPUT_FORMATS.filter((format) => format !== source);

  return (
    <div>
      <label
        htmlFor="convert-output-format"
        className="mb-2 block text-xs font-semibold text-[var(--text)]"
      >
        Output format
      </label>

      <select
        id="convert-output-format"
        value={value}
        onChange={(event) => onChange(event.target.value as ConvertFormat)}
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)]"
      >
        {allowed.map((format) => (
          <option key={format} value={format}>
            {FORMAT_LABELS[format]}
          </option>
        ))}
      </select>

      {files.length > 1 ? (
        <p className="mt-2 text-[10px] leading-4 text-[var(--text-muted)]">
          Batch conversion uses the same output format for every compatible
          file.
        </p>
      ) : null}
    </div>
  );
}
