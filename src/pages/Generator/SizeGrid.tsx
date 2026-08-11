// src/pages/Generator/SizeGrid.tsx

import { Check, Download, Loader2 } from "lucide-react";

export interface GeneratedIcon {
  size: number;
  dataUrl: string;
}

interface SizeGridProps {
  icons: GeneratedIcon[];
  isGenerating: boolean;
  onDownload: (size: number) => void;
}

export default function SizeGrid({
  icons,
  isGenerating,
  onDownload,
}: SizeGridProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Generated sizes
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Standard favicon, PWA, browser, and app icon sizes.
          </p>
        </div>

        {isGenerating && (
          <Loader2 size={16} className="animate-spin text-[#6366F1]" />
        )}
      </div>

      {icons.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--border)] px-5 py-10 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Generate your icon set to see all available sizes.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {icons.map((icon) => (
            <div
              key={icon.size}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <img
                  src={icon.dataUrl}
                  alt={`${icon.size} by ${icon.size} icon`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text)]">
                  {icon.size}×{icon.size}
                </span>

                <Check size={13} className="text-[#6366F1]" />
              </div>

              <button
                type="button"
                onClick={() => onDownload(icon.size)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-[10px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
              >
                <Download size={12} />
                PNG
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}