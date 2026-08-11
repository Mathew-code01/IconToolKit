// src/pages/Generator/ExportPanel.tsx
import {
  Archive,
  Check,
  Copy,
  Download,
  FileCode2,
  FileImage,
  FileJson,
  Loader2,
} from "lucide-react";
import { useState } from "react";

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
  const [copied, setCopied] = useState<string | null>(null);

  const hasIcons = icons.length > 0;

  const copy = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(type);

      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard may be unavailable.
    }
  };

  return (
    <section className="lg:sticky lg:top-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6366F1]">
            Final step
          </p>

          <h2 className="mt-1 text-base font-semibold text-[var(--text)]">
            Export your icon
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Generate once, then download any format you need.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-4 py-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating icon set…
            </>
          ) : (
            <>
              <FileImage size={15} />
              {hasIcons ? "Regenerate icon set" : "Generate icon set"}
            </>
          )}
        </button>

        {hasIcons && (
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Downloads
            </p>

            <div className="space-y-2">
              <ExportButton
                icon={<Download size={15} />}
                title="PNG"
                description={`${fileName}-32x32.png`}
                onClick={() => onDownloadIcon(32)}
              />

              <ExportButton
                icon={<FileCode2 size={15} />}
                title="SVG"
                description={`${fileName}.svg`}
                onClick={onDownloadSvg}
                disabled={!svgContent}
              />

              <ExportButton
                icon={<FileImage size={15} />}
                title="ICO"
                description={`${fileName}.ico`}
                onClick={onDownloadIco}
              />

              <ExportButton
                icon={<Archive size={15} />}
                title="Complete ZIP"
                description="All icon sizes + web files"
                onClick={onDownloadZip}
              />
            </div>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <CodeBox
            title="HTML favicon"
            icon={<FileCode2 size={14} />}
            value={htmlSnippet}
            copied={copied === "html"}
            onCopy={() => copy(htmlSnippet, "html")}
          />

          <CodeBox
            title="Web App Manifest"
            icon={<FileJson size={14} />}
            value={manifestSnippet}
            copied={copied === "manifest"}
            onCopy={() => copy(manifestSnippet, "manifest")}
          />
        </div>
      </div>
    </section>
  );
}

function ExportButton({
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-left transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="text-[var(--text-secondary)]">{icon}</span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-[var(--text)]">
          {title}
        </span>

        <span className="block truncate text-[10px] text-[var(--text-muted)]">
          {description}
        </span>
      </span>

      <Download size={13} className="text-[var(--text-muted)]" />
    </button>
  );
}

function CodeBox({
  title,
  icon,
  value,
  copied,
  onCopy,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
      <div className="flex items-center gap-2">
        <span className="text-[#6366F1]">{icon}</span>

        <span className="flex-1 text-xs font-semibold text-[var(--text)]">
          {title}
        </span>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[10px] font-medium"
        >
          {copied ? (
            <>
              <Check size={11} />
              Copied
            </>
          ) : (
            <>
              <Copy size={11} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="mt-3 max-h-28 overflow-auto whitespace-pre-wrap break-all text-[9px] leading-4 text-[var(--text-muted)]">
        {value}
      </pre>
    </div>
  );
}