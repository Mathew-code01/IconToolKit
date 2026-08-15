// src/pages/Convert/ConvertUploader.tsx

import { useRef, useState } from "react";

interface ConvertUploaderProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export default function ConvertUploader({
  onFiles,
  disabled = false,
}: ConvertUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter((file) => file.size > 0);

    if (valid.length) {
      onFiles(valid);
    }
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);

        if (disabled) return;

        handleFiles(event.dataTransfer.files);
      }}
      className={[
        "relative flex min-h-[250px] w-full cursor-pointer",
        "items-center justify-center rounded-[var(--radius-xl)]",
        "border-2 border-dashed p-6 transition-all",
        dragging
          ? "border-[var(--brand)] bg-[var(--brand)]/5"
          : "border-[var(--border)] bg-[var(--surface-subtle)]",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={[
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/avif",
          "image/svg+xml",
          "image/bmp",
          "image/gif",
          "image/tiff",
          "image/x-icon",
          "application/pdf",
          ".ico",
          ".svg",
          ".tif",
          ".tiff",
        ].join(",")}
        onChange={(event) => {
          if (event.target.files) {
            handleFiles(event.target.files);
          }

          event.target.value = "";
        }}
      />

      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--brand)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-7 w-7"
          >
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M4 20h16" />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-[var(--text)]">
          Drop files here
        </h3>

        <p className="mt-1 text-sm text-[var(--text-muted)]">
          or click to choose files from your device
        </p>

        <p className="mt-4 text-[11px] leading-5 text-[var(--text-muted)]">
          PNG, JPG, WebP, AVIF, SVG, ICO, BMP, GIF, TIFF and PDF
        </p>

        <div className="mt-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-medium text-[var(--text-muted)]">
          Multiple files supported
        </div>
      </div>
    </div>
  );
}
