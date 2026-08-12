// src/pages/Generator/ExportPanel.tsx
// src/pages/Generator/ExportPanel.tsx

import {
  Archive,
  Check,
  Clipboard,
  Download,
  FileCode2,
  FileImage,
  FileJson,
  FolderArchive,
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
  const [copied, setCopied] =
    useState<string | null>(null);

  const hasIcons =
    icons.length > 0;

  const copy = async (
    value: string,
    type: string,
  ) => {
    try {
      await navigator.clipboard.writeText(
        value,
      );

      setCopied(type);

      window.setTimeout(
        () => setCopied(null),
        1500,
      );
    } catch {
      // Clipboard unavailable.
    }
  };

  return (
    <section className="lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="border-b border-[var(--border)] bg-gradient-to-br from-[#6366F1]/10 via-transparent to-transparent p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6366F1] text-white shadow-sm">
              <FolderArchive size={15} />
            </span>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6366F1]">
                Production export
              </p>

              <h2 className="mt-0.5 text-base font-bold text-[var(--text)]">
                Ship your icon set
              </h2>
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-[var(--text-secondary)]">
            Generate correctly named browser, PWA, Apple and ICO assets in one production-ready package.
          </p>

          <button
            type="button"
            onClick={onGenerate}
            disabled={
              disabled ||
              isGenerating
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#6366F1]/20 transition hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                Rendering assets…
              </>
            ) : (
              <>
                <FileImage size={15} />
                {hasIcons
                  ? "Regenerate production set"
                  : "Generate production set"}
              </>
            )}
          </button>
        </div>

        {hasIcons && (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                Included assets
              </p>

              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-600">
                {icons.length} PNG sizes
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <ExportButton
                icon={
                  <FileImage size={15} />
                }
                title="PNG icon set"
                description={`${icons.length} production sizes`}
                onClick={() =>
                  onDownloadIcon(512)
                }
              />

              <ExportButton
                icon={
                  <FileCode2 size={15} />
                }
                title="SVG"
                description={`${fileName}.svg`}
                onClick={
                  onDownloadSvg
                }
                disabled={!svgContent}
              />

              <ExportButton
                icon={
                  <FileImage size={15} />
                }
                title="favicon.ico"
                description="16×16 · 32×32 · 48×48 · 64×64 · 128×128 · 256×256"
                onClick={
                  onDownloadIco
                }
              />

              <button
                type="button"
                onClick={onDownloadZip}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text)] px-3 py-3 text-xs font-bold text-[var(--background)] transition hover:opacity-90"
              >
                <Archive size={14} />
                Download complete production ZIP
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-[var(--border)] p-4">
          <CodeBox
            title="HTML"
            icon={
              <FileCode2 size={14} />
            }
            value={htmlSnippet}
            copied={
              copied === "html"
            }
            onCopy={() =>
              copy(
                htmlSnippet,
                "html",
              )
            }
          />

          <CodeBox
            title="manifest.json"
            icon={
              <FileJson size={14} />
            }
            value={manifestSnippet}
            copied={
              copied === "manifest"
            }
            onCopy={() =>
              copy(
                manifestSnippet,
                "manifest",
              )
            }
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
      <span className="text-[#6366F1]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-[var(--text)]">
          {title}
        </span>

        <span className="mt-0.5 block truncate text-[9px] text-[var(--text-muted)]">
          {description}
        </span>
      </span>

      <Download
        size={13}
        className="text-[var(--text-muted)]"
      />
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
    <div className="mb-3 last:mb-0 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
      <div className="flex items-center gap-2">
        <span className="text-[#6366F1]">
          {icon}
        </span>

        <span className="flex-1 text-xs font-bold text-[var(--text)]">
          {title}
        </span>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[9px] font-semibold"
        >
          {copied ? (
            <>
              <Check size={11} />
              Copied
            </>
          ) : (
            <>
              <Clipboard size={11} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="mt-3 max-h-36 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/5 p-2.5 text-[9px] leading-4 text-[var(--text-muted)]">
        {value}
      </pre>
    </div>
  );
}