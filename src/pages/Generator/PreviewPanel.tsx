// src/pages/Generator/PreviewPanel.tsx
import { Monitor, Smartphone, Tablet } from "lucide-react";

import type { EditorSettings } from "./EditorPanel";

interface PreviewPanelProps {
  imageUrl: string | null;
  hasImage: boolean;
  imageWidth: number;
  imageHeight: number;
  settings: EditorSettings;
}

export default function PreviewPanel({
  imageUrl,
  hasImage,
  imageWidth,
  imageHeight,
  settings,
}: PreviewPanelProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Live preview
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Every preview uses the same settings that will be exported.
          </p>
        </div>

        {hasImage && (
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Source
            </p>

            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {imageWidth} × {imageHeight}
            </p>
          </div>
        )}
      </div>

      {!hasImage ? (
        <div className="mt-6 flex min-h-[560px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--text-muted)] shadow-sm">
            <Monitor size={23} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
            Your studio preview appears here
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[var(--text-muted)]">
            Upload an image to start editing your icon.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Browser preview */}
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <div className="flex h-10 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />

              <div className="ml-3 flex h-6 flex-1 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2">
                <img
                  src={imageUrl ?? ""}
                  alt=""
                  className="h-4 w-4 object-contain"
                />

                <span className="text-[10px] text-[var(--text-muted)]">
                  example.com
                </span>
              </div>
            </div>

            <div className="flex min-h-[350px] items-center justify-center bg-[var(--background)] p-10">
              <div className="relative">
                <img
                  src={imageUrl ?? ""}
                  alt="Generated icon preview"
                  className="h-52 w-52 object-contain"
                />

                {settings.shadow && (
                  <div className="pointer-events-none absolute inset-0" />
                )}
              </div>
            </div>
          </div>

          {/* Platform previews */}
          <div className="grid gap-4 sm:grid-cols-3">
            <PreviewCard icon={<Monitor size={14} />} label="Desktop">
              <img
                src={imageUrl ?? ""}
                alt=""
                className="h-16 w-16 object-contain"
              />
            </PreviewCard>

            <PreviewCard icon={<Smartphone size={14} />} label="Mobile">
              <div className="flex h-20 w-20 items-center justify-center rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm">
                <img
                  src={imageUrl ?? ""}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            </PreviewCard>

            <PreviewCard icon={<Tablet size={14} />} label="App">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28%] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm">
                <img
                  src={imageUrl ?? ""}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            </PreviewCard>
          </div>

          {/* Size preview */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--text)]">
                  Small-size test
                </p>

                <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                  Check how your icon behaves at favicon sizes.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-6">
              {[16, 32, 48, 64].map((size) => (
                <div key={size} className="text-center">
                  <div className="flex h-16 items-center justify-center">
                    <img
                      src={imageUrl ?? ""}
                      alt=""
                      style={{
                        width: size,
                        height: size,
                      }}
                      className="object-contain"
                    />
                  </div>

                  <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                    {size}px
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function PreviewCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        {icon}

        <span className="text-xs font-semibold">{label}</span>
      </div>

      <div className="mt-5 flex h-28 items-center justify-center">
        {children}
      </div>
    </div>
  );
}