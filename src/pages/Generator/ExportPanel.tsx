// src/pages/Generator/ExportPanel.tsx
import {
  Archive,
  Download,
  FileCode2,
  FileImage,
  FileJson,
  Loader2,
} from "lucide-react";

import type { GeneratedIcon } from "./SizeGrid";

interface ExportPanelProps {
  fileName: string;
  icons: GeneratedIcon[];
  disabled: boolean;
  isGenerating: boolean;
  svgContent: string | null;
  htmlSnippet: string;
  manifestSnippet: string;
  onGenerate: () => void;
  onDownloadIcon: (size: number) => void;
  onDownloadSvg: () => void;
  onDownloadIco: () => void;
  onDownloadZip: () => Promise<void>;
}

export default function ExportPanel({
  fileName,
  icons,
  disabled,
  isGenerating,
  svgContent,
  htmlSnippet,
  manifestSnippet,
  onGenerate,
  onDownloadIcon,
  onDownloadSvg,
  onDownloadIco,
  onDownloadZip,
}: ExportPanelProps) {
  const hasIcons = icons.length > 0;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div>
        <h2 className="text-sm font-semibold text-[var(--text)]">Export</h2>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Generate your icon set and download the files you need.
        </p>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-4 py-3 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileImage size={15} />
            Generate icon set
          </>
        )}
      </button>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={() => onDownloadIcon(32)}
          disabled={!hasIcons}
          className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={15} />
          <span className="flex-1">
            <span className="block font-medium text-[var(--text)]">
              Download PNG
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {fileName}-32x32.png
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onDownloadSvg}
          disabled={!svgContent}
          className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FileCode2 size={15} />
          <span className="flex-1">
            <span className="block font-medium text-[var(--text)]">
              Download SVG
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {fileName}.svg
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onDownloadIco}
          disabled={!hasIcons}
          className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FileImage size={15} />
          <span className="flex-1">
            <span className="block font-medium text-[var(--text)]">
              Download ICO
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {fileName}.ico
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onDownloadZip}
          disabled={!hasIcons && !svgContent}
          className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Archive size={15} />
          <span className="flex-1">
            <span className="block font-medium text-[var(--text)]">
              Download ZIP
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              Complete icon set
            </span>
          </span>
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <div className="flex items-center gap-2">
            <FileCode2 size={14} className="text-[#6366F1]" />
            <span className="text-xs font-medium text-[var(--text)]">
              HTML snippet
            </span>
          </div>

          <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-all text-[9px] leading-4 text-[var(--text-muted)]">
            {htmlSnippet}
          </pre>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <div className="flex items-center gap-2">
            <FileJson size={14} className="text-[#6366F1]" />
            <span className="text-xs font-medium text-[var(--text)]">
              Web App Manifest
            </span>
          </div>

          <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-all text-[9px] leading-4 text-[var(--text-muted)]">
            {manifestSnippet}
          </pre>
        </div>
      </div>
    </section>
  );
}