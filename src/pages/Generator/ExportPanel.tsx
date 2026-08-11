import {
  Check,
  Clipboard,
  Download,
  FileCode2,
  FileImage,
  FileArchive,
  Package,
  Sparkles,
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
  onDownloadZip: () => void;
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
  onDownloadSvg,
  onDownloadIco,
  onDownloadZip,
}: ExportPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(key);

      window.setTimeout(() => {
        setCopied(null);
      }, 1600);
    } catch {
      setCopied(null);
    }
  };

  const hasGenerated = icons.length > 0;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div>
        <div className="flex items-center gap-2">
          <Package size={15} className="text-[#6366F1]" aria-hidden="true" />

          <h2 className="text-sm font-semibold text-[var(--text)]">Export</h2>
        </div>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Generate the complete icon set and download the formats you need.
        </p>
      </div>

      {/* Generate */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className="
          mt-5 flex h-11 w-full
          items-center justify-center gap-2
          rounded-lg bg-[#6366F1]
          px-4 text-sm font-semibold text-white
          shadow-[0_4px_12px_rgba(99,102,241,0.2)]
          transition-all duration-200
          hover:bg-[#4F46E5]
          disabled:pointer-events-none
          disabled:opacity-50
        "
      >
        <Sparkles size={16} aria-hidden="true" />

        {isGenerating ? "Generating..." : "Generate icon set"}
      </button>

      {/* Export formats */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-[var(--text-secondary)]">
          Export formats
        </p>

        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={!hasGenerated}
            className="
              flex items-center justify-between
              rounded-lg border border-[var(--border)]
              bg-[var(--surface)]
              px-3 py-3
              text-left
              transition-colors
              hover:bg-[var(--surface-muted)]
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <span className="flex items-center gap-2">
              <FileArchive
                size={15}
                className="text-[#6366F1]"
                aria-hidden="true"
              />

              <span>
                <span className="block text-xs font-semibold text-[var(--text)]">
                  ZIP package
                </span>

                <span className="block text-[10px] text-[var(--text-muted)]">
                  All PNGs + SVG + ICO + snippets
                </span>
              </span>
            </span>

            <Download
              size={14}
              className="text-[var(--text-muted)]"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={onDownloadIco}
            disabled={!hasGenerated}
            className="
              flex items-center justify-between
              rounded-lg border border-[var(--border)]
              bg-[var(--surface)]
              px-3 py-3
              text-left
              transition-colors
              hover:bg-[var(--surface-muted)]
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <span className="flex items-center gap-2">
              <FileImage
                size={15}
                className="text-[#6366F1]"
                aria-hidden="true"
              />

              <span>
                <span className="block text-xs font-semibold text-[var(--text)]">
                  ICO favicon
                </span>

                <span className="block text-[10px] text-[var(--text-muted)]">
                  Multi-size favicon file
                </span>
              </span>
            </span>

            <Download
              size={14}
              className="text-[var(--text-muted)]"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={onDownloadSvg}
            disabled={!svgContent}
            className="
              flex items-center justify-between
              rounded-lg border border-[var(--border)]
              bg-[var(--surface)]
              px-3 py-3
              text-left
              transition-colors
              hover:bg-[var(--surface-muted)]
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <span className="flex items-center gap-2">
              <FileCode2
                size={15}
                className="text-[#6366F1]"
                aria-hidden="true"
              />

              <span>
                <span className="block text-xs font-semibold text-[var(--text)]">
                  SVG icon
                </span>

                <span className="block text-[10px] text-[var(--text-muted)]">
                  Scalable vector container
                </span>
              </span>
            </span>

            <Download
              size={14}
              className="text-[var(--text-muted)]"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* HTML snippet */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">
              HTML
            </p>

            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              Add these links to your document head.
            </p>
          </div>

          <button
            type="button"
            onClick={() => copyText("html", htmlSnippet)}
            disabled={!hasGenerated}
            className="
              inline-flex items-center gap-1.5
              rounded-md px-2 py-1.5
              text-[10px] font-medium
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            {copied === "html" ? (
              <>
                <Check size={12} aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <Clipboard size={12} aria-hidden="true" />
                Copy
              </>
            )}
          </button>
        </div>

        <pre className="mt-3 max-h-48 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[10px] leading-5 text-[var(--text-secondary)]">
          <code>{htmlSnippet}</code>
        </pre>
      </div>

      {/* Manifest */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">
              Web App Manifest
            </p>

            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              Basic PWA icon configuration.
            </p>
          </div>

          <button
            type="button"
            onClick={() => copyText("manifest", manifestSnippet)}
            disabled={!hasGenerated}
            className="
              inline-flex items-center gap-1.5
              rounded-md px-2 py-1.5
              text-[10px] font-medium
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            {copied === "manifest" ? (
              <>
                <Check size={12} aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <Clipboard size={12} aria-hidden="true" />
                Copy
              </>
            )}
          </button>
        </div>

        <pre className="mt-3 max-h-56 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[10px] leading-5 text-[var(--text-secondary)]">
          <code>{manifestSnippet}</code>
        </pre>
      </div>

      {/* Local processing note */}
      <div className="mt-6 flex gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <Check
          size={14}
          className="mt-0.5 shrink-0 text-[#6366F1]"
          aria-hidden="true"
        />

        <p className="text-[10px] leading-5 text-[var(--text-muted)]">
          Your image processing happens locally in your browser. Your source
          image is not uploaded to a server.
        </p>
      </div>

      <p className="mt-4 truncate text-center text-[10px] text-[var(--text-muted)]">
        Output name: {fileName}
      </p>
    </section>
  );
}
