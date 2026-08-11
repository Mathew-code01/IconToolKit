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
    <section className="lg:sticky lg:top-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text)]">
              Live preview
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              This is exactly what will be exported.
            </p>
          </div>

          {hasImage && (
            <span className="shrink-0 rounded-md bg-[var(--surface-muted)] px-2 py-1 text-[10px] font-medium text-[var(--text-muted)]">
              {imageWidth} × {imageHeight}
            </span>
          )}
        </div>

        {!hasImage ? (
          <div className="mt-5 flex min-h-[480px] items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-8 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--text-muted)] shadow-sm">
                <Monitor size={23} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
                Preview appears here
              </h3>

              <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--text-muted)]">
                Upload an image to begin editing.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]"
              style={{
                background:
                  settings.backgroundMode === "solid"
                    ? settings.background
                    : settings.backgroundMode === "gradient"
                      ? `linear-gradient(${settings.gradientAngle}deg, ${settings.gradientFrom}, ${settings.gradientTo})`
                      : undefined,
              }}
            >
              {settings.backgroundMode === "transparent" && (
                <div
                  className="absolute"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #ddd 25%, transparent 25%),
                      linear-gradient(-45deg, #ddd 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ddd 75%),
                      linear-gradient(-45deg, transparent 75%, #ddd 75%)
                    `,
                    backgroundSize: "24px 24px",
                    backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0",
                  }}
                />
              )}

              <div className="relative flex min-h-[430px] items-center justify-center p-12">
                <img
                  src={imageUrl ?? ""}
                  alt="Generated icon preview"
                  className="h-64 w-64 object-contain"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
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

            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-xs font-semibold text-[var(--text)]">
                Small-size test
              </p>

              <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                Make sure your icon remains recognizable at favicon sizes.
              </p>

              <div className="mt-5 flex items-end justify-between gap-3">
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
          </>
        )}
      </div>
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
      <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
        {icon}
        <span className="text-[10px] font-semibold">{label}</span>
      </div>

      <div className="mt-3 flex h-24 items-center justify-center">
        {children}
      </div>
    </div>
  );
}