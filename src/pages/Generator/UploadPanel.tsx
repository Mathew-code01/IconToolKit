// src/pages/Generator/UploadPanel.tsx
// src/pages/Generator/UploadPanel.tsx

import {
  FileImage,
  Image as ImageIcon,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
} from "react";

interface UploadPanelProps {
  imageUrl: string | null;
  fileName: string;
  sourceFormat: string;
  imageWidth?: number;
  imageHeight?: number;

  onFileSelect: (
    file: File,
  ) => void;
  onRemove: () => void;
  onRemoveBackground: () => void;
  onResetImage: () => void;

  disabled?: boolean;
}

export default function UploadPanel({
  imageUrl,
  fileName,
  sourceFormat,
  imageWidth = 0,
  imageHeight = 0,
  onFileSelect,
  onRemove,
  onRemoveBackground,
  onResetImage,
  disabled = false,
}: UploadPanelProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [dragging, setDragging] =
    useState(false);

  const handleFiles = (
    files: FileList | null,
  ) => {
    if (!files?.length) {
      return;
    }

    const file = files[0];

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      return;
    }

    onFileSelect(file);
  };

  const formatLabel =
    sourceFormat ===
    "image/svg+xml"
      ? "SVG"
      : sourceFormat
          .replace(
            "image/",
            "",
          )
          .toUpperCase();

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
              <ImageIcon size={15} />
            </span>

            <div>
              <h2 className="text-sm font-semibold text-[var(--text)]">
                Source image
              </h2>

              <p className="text-[10px] text-[var(--text-muted)]">
                Upload the artwork you want to convert.
              </p>
            </div>
          </div>
        </div>

        {imageUrl && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove image"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {imageUrl ? (
        <div className="mt-4">
          <div
            className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)]"
            style={{
              backgroundImage: `
                linear-gradient(45deg,#d1d5db 25%,transparent 25%),
                linear-gradient(-45deg,#d1d5db 25%,transparent 25%),
                linear-gradient(45deg,transparent 75%,#d1d5db 75%),
                linear-gradient(-45deg,transparent 75%,#d1d5db 75%)
              `,
              backgroundSize:
                "16px 16px",
              backgroundPosition:
                "0 0,0 8px,8px -8px,-8px 0",
            }}
          >
            <img
              src={imageUrl}
              alt={fileName}
              className="relative z-10 h-full w-full object-contain p-6"
            />
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <p
                className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--text)]"
                title={fileName}
              >
                {fileName}
              </p>

              <span className="rounded-md bg-[#6366F1]/10 px-2 py-1 text-[9px] font-bold text-[#6366F1]">
                {formatLabel}
              </span>
            </div>

            {imageWidth > 0 &&
              imageHeight > 0 && (
                <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                  {imageWidth} ×{" "}
                  {imageHeight}px
                </p>
              )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-semibold transition hover:bg-[var(--surface-muted)]"
            >
              <Upload size={14} />
              Replace
            </button>

            <button
              type="button"
              onClick={onResetImage}
              className="rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-semibold transition hover:bg-[var(--surface-muted)]"
            >
              Reset edits
            </button>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={
              onRemoveBackground
            }
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-2.5 text-xs font-bold text-[#6366F1] transition hover:bg-[#6366F1]/15 disabled:opacity-50"
          >
            <Sparkles size={14} />
            Remove simple background
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFiles(
              event.dataTransfer.files,
            );
          }}
          className={`mt-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-12 text-center transition ${
            dragging
              ? "border-[#6366F1] bg-[#6366F1]/10"
              : "border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366F1]/10 text-[#6366F1]">
            <Upload size={20} />
          </div>

          <span className="mt-4 text-sm font-bold text-[var(--text)]">
            Drop an image here
          </span>

          <span className="mt-1 text-xs text-[var(--text-muted)]">
            PNG, JPG, WebP or SVG
          </span>

          <span className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold">
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
          handleFiles(
            event.target.files,
          );

          event.target.value = "";
        }}
      />

      {!imageUrl && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--surface-muted)] px-3 py-2">
          <FileImage
            size={12}
            className="text-[var(--text-muted)]"
          />

          <p className="text-[9px] leading-4 text-[var(--text-muted)]">
            For best results, start with a high-resolution source.
          </p>
        </div>
      )}
    </section>
  );
}