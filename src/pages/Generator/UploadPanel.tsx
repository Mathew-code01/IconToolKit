// src/pages/Generator/UploadPanel.tsx
import { Image as ImageIcon, Sparkles, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface UploadPanelProps {
  imageUrl: string | null;
  fileName: string;
  sourceFormat: string;

  onFileSelect: (file: File) => void;

  onRemove: () => void;

  onRemoveBackground: () => void;

  onResetImage: () => void;

  disabled?: boolean;
}

export default function UploadPanel({
  imageUrl,
  fileName,
  sourceFormat,
  onFileSelect,
  onRemove,
  onRemoveBackground,
  onResetImage,
  disabled = false,
}: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      return;
    }

    onFileSelect(file);
  };

  const formatLabel =
    sourceFormat === "image/svg+xml"
      ? "SVG"
      : sourceFormat.replace("image/", "").toUpperCase();

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[#6366F1]" />

            <h2 className="text-sm font-semibold text-[var(--text)]">
              Source image
            </h2>
          </div>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            PNG, JPG, WebP, or SVG
          </p>
        </div>

        {imageUrl && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove image"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {imageUrl ? (
        <div className="mt-4">
          <div
            className="
              relative flex aspect-square
              items-center justify-center
              overflow-hidden rounded-xl
              border border-[var(--border)]
              bg-[var(--surface-muted)]
            "
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #888 25%, transparent 25%),
                  linear-gradient(-45deg, #888 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #888 75%),
                  linear-gradient(-45deg, transparent 75%, #888 75%)
                `,
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }}
            />

            <img
              src={imageUrl}
              alt={fileName}
              className="relative z-10 max-h-full max-w-full object-contain p-5"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p
              className="min-w-0 truncate text-xs font-medium text-[var(--text-secondary)]"
              title={fileName}
            >
              {fileName}
            </p>

            <span className="shrink-0 rounded-md bg-[#6366F1]/10 px-2 py-1 text-[10px] font-semibold text-[#6366F1]">
              {formatLabel}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-medium hover:bg-[var(--surface-muted)]"
            >
              <Upload size={14} />
              Replace
            </button>

            <button
              type="button"
              onClick={onResetImage}
              className="rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-medium hover:bg-[var(--surface-muted)]"
            >
              Original
            </button>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onRemoveBackground}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#4F46E5] disabled:opacity-50"
          >
            <Sparkles size={14} />
            Remove simple background
          </button>

          <p className="mt-2 text-[10px] leading-4 text-[var(--text-muted)]">
            Works best with logos or images that have a mostly uniform
            background.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();

            setDragging(false);

            handleFiles(event.dataTransfer.files);
          }}
          className={`mt-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-10 text-center transition ${
            dragging
              ? "border-[#6366F1] bg-[#6366F1]/10"
              : "border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
            <Upload size={19} />
          </div>

          <span className="mt-4 text-sm font-semibold text-[var(--text)]">
            Drop an image here
          </span>

          <span className="mt-1 text-xs text-[var(--text-muted)]">
            or choose a file
          </span>

          <span className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
            Choose image
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);

          event.target.value = "";
        }}
      />
    </section>
  );
}