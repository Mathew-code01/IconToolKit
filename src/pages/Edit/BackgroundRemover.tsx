// src/pages/Edit/BackgroundRemover.tsx
// src/pages/Edit/BackgroundRemover.tsx

import { useState } from "react";

export interface BackgroundRemoverProps {
  imageUrl: string | null;
  onChange: (nextUrl: string) => void;
}

const sliderClasses =
  "w-full h-1.5 appearance-none rounded-full bg-[var(--surface-muted)] accent-[var(--brand)] cursor-pointer";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function colorDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

async function removeBackground(
  imageUrl: string,
  tolerance: number,
): Promise<string> {
  const image = await loadImage(imageUrl);
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return imageUrl;

  context.drawImage(image, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];

  const backgroundColors = corners.map(([x, y]) => {
    const index = (y * width + x) * 4;
    return { r: pixels[index], g: pixels[index + 1], b: pixels[index + 2] };
  });

  const threshold = (tolerance / 100) * 120;

  for (let index = 0; index < pixels.length; index += 4) {
    const pixel = { r: pixels[index], g: pixels[index + 1], b: pixels[index + 2] };

    const matches = backgroundColors.some(
      (background) => colorDistance(pixel, background) < threshold,
    );

    if (matches) {
      pixels[index + 3] = 0;
    }
  }

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

export default function BackgroundRemover({ imageUrl, onChange }: BackgroundRemoverProps) {
  const [tolerance, setTolerance] = useState(35);
  const [processing, setProcessing] = useState(false);

  const handleApply = async () => {
    if (!imageUrl) return;

    setProcessing(true);

    try {
      const nextUrl = await removeBackground(imageUrl, tolerance);
      onChange(nextUrl);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Remove background</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Remove a solid or near-solid background from your image.
        </p>
      </div>

      <div className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="background-tolerance" className="text-xs font-medium text-[var(--text-secondary)]">
              Color tolerance
            </label>
            <span className="rounded-md bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--text)]">
              {tolerance}%
            </span>
          </div>

          <input
            id="background-tolerance"
            type="range"
            min={0}
            max={100}
            value={tolerance}
            onChange={(event) => setTolerance(Number(event.target.value))}
            className={sliderClasses}
          />

          <div className="mt-1 flex justify-between text-[10px] text-[var(--text-muted)]">
            <span>Precise</span>
            <span>Aggressive</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleApply}
        disabled={!imageUrl || processing}
        className="mt-4 flex min-h-10 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-medium text-white transition hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? "Removing background…" : "Remove background"}
      </button>

      <p className="mt-2 text-[10px] leading-4 text-[var(--text-muted)]">
        Works best on flat, solid-color backgrounds sampled from the image corners.
      </p>
    </section>
  );
}