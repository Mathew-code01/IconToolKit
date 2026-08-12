// src/pages/Generator/SizeGrid.tsx

// src/pages/Generator/SizeGrid.tsx

import {
  Check,
  Download,
  FileImage,
  Loader2,
} from "lucide-react";

export interface GeneratedIcon {
  size: number;
  dataUrl: string;
}

interface SizeGridProps {
  icons: GeneratedIcon[];
  isGenerating: boolean;
  onDownload: (size: number) => void;
}

const SIZE_INFO: Record<
  number,
  {
    label: string;
    description: string;
  }
> = {
  16: {
    label: "Favicon",
    description: "Browser tab",
  },
  32: {
    label: "Favicon",
    description: "Browser UI",
  },
  48: {
    label: "Browser",
    description: "Browser shortcuts",
  },
  64: {
    label: "Small UI",
    description: "Small surfaces",
  },
  96: {
    label: "Android",
    description: "Launcher",
  },
  128: {
    label: "Android",
    description: "Launcher",
  },
  144: {
    label: "PWA",
    description: "Windows tile",
  },
  152: {
    label: "iPad",
    description: "iPad touch icon",
  },
  180: {
    label: "Apple",
    description: "Apple touch icon",
  },
  192: {
    label: "Android",
    description: "PWA icon",
  },
  256: {
    label: "Desktop",
    description: "Large icon",
  },
  384: {
    label: "PWA",
    description: "Large launcher",
  },
  512: {
    label: "PWA",
    description: "Maximum quality",
  },
};

export default function SizeGrid({
  icons,
  isGenerating,
  onDownload,
}: SizeGridProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileImage
              size={15}
              className="text-[#6366F1]"
            />

            <h2 className="text-sm font-semibold text-[var(--text)]">
              Production icon set
            </h2>
          </div>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Every size is rendered independently at high quality.
          </p>
        </div>

        {isGenerating && (
          <Loader2
            size={16}
            className="animate-spin text-[#6366F1]"
          />
        )}
      </div>

      {icons.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--border)] px-5 py-12 text-center">
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Your production assets will appear here.
          </p>

          <p className="mt-1 text-[10px] text-[var(--text-muted)]">
            Generate the icon set when your design is ready.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {icons.map((icon) => {
            const info =
              SIZE_INFO[icon.size] ?? {
                label: "Icon",
                description:
                  "Generated asset",
              };

            return (
              <div
                key={icon.size}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-white p-5"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg,#e5e7eb 25%,transparent 25%),
                      linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),
                      linear-gradient(45deg,transparent 75%,#e5e7eb 75%),
                      linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)
                    `,
                    backgroundSize:
                      "12px 12px",
                    backgroundPosition:
                      "0 0,0 6px,6px -6px,-6px 0",
                  }}
                >
                  <img
                    src={icon.dataUrl}
                    alt={`${icon.size} by ${icon.size} icon`}
                    className="relative max-h-full max-w-full object-contain drop-shadow-sm"
                  />
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--text)]">
                      {icon.size}×
                      {icon.size}
                    </span>

                    <Check
                      size={13}
                      className="text-emerald-500"
                    />
                  </div>

                  <p className="mt-1 text-[10px] font-semibold text-[var(--text-secondary)]">
                    {info.label}
                  </p>

                  <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">
                    {info.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onDownload(
                      icon.size,
                    )
                  }
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-[10px] font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)]"
                >
                  <Download size={11} />
                  Download PNG
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}