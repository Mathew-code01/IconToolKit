// src/pages/Generator/PreviewPanel.tsx

import { Image as ImageIcon, Monitor, Smartphone } from "lucide-react";

interface PreviewPanelProps {
  imageUrl: string | null;
  hasImage: boolean;
  imageWidth: number;
  imageHeight: number;
}

export default function PreviewPanel({
  imageUrl,
  hasImage,
  imageWidth,
  imageHeight,
}: PreviewPanelProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Live preview
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            See how your generated icon looks before exporting.
          </p>
        </div>

        {hasImage && (
          <div className="text-right">
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              Source
            </p>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {imageWidth} × {imageHeight}
            </p>
          </div>
        )}
      </div>

      {!hasImage ? (
        <div
          className="
            mt-6 flex min-h-[420px]
            flex-col items-center justify-center
            rounded-xl border border-dashed
            border-[var(--border-strong)]
            bg-[var(--surface-muted)]
            px-6 text-center
          "
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-muted)] shadow-sm">
            <ImageIcon size={20} aria-hidden="true" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
            Your preview will appear here
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[var(--text-muted)]">
            Upload an image to start editing and previewing your icon.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Browser */}
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <div className="flex h-10 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />

              <div className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2">
                <div className="h-3.5 w-3.5 overflow-hidden rounded">
                  <img
                    src={imageUrl ?? ""}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="text-[10px] text-[var(--text-muted)]">
                  example.com
                </span>
              </div>
            </div>

            <div className="flex min-h-[270px] items-center justify-center bg-[var(--background)] p-8">
              <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <img
                  src={imageUrl ?? ""}
                  alt="Generated icon preview"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Smaller previews */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="flex items-center gap-2">
                <Monitor
                  size={14}
                  className="text-[var(--text-muted)]"
                  aria-hidden="true"
                />

                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Desktop
                </span>
              </div>

              <div className="mt-4 flex h-24 items-center justify-center">
                <img
                  src={imageUrl ?? ""}
                  alt=""
                  className="h-16 w-16 object-contain"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="flex items-center gap-2">
                <Smartphone
                  size={14}
                  className="text-[var(--text-muted)]"
                  aria-hidden="true"
                />

                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Mobile
                </span>
              </div>

              <div className="mt-4 flex h-24 items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-2">
                  <img
                    src={imageUrl ?? ""}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
