// src/pages/Edit/ImageEditorTool.tsx
// src/pages/Edit/ImageEditorTool.tsx
// src/pages/Edit/ImageEditorTool.tsx

import type {
  BackgroundSettings,
  PaddingSettings,
  ResizeSettings,
  RotateFlipSettings,
  RoundedCornersSettings,
} from "./EditPage";

export interface ImageEditorToolProps {
  imageUrl: string | null;
  imageName: string;
  imageWidth: number;
  imageHeight: number;
  imageType: string;
  background: BackgroundSettings;
  padding: PaddingSettings;
  resize: ResizeSettings;
  rotateFlip: RotateFlipSettings;
  roundedCorners: RoundedCornersSettings;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  previewOnly?: boolean;
}

function backgroundStyle(
  background: BackgroundSettings,
): React.CSSProperties {
  if (background.type === "solid") {
    return {
      backgroundColor: background.color,
    };
  }

  if (background.type === "gradient") {
    return {
      backgroundImage: `linear-gradient(${background.gradientAngle}deg, ${background.color}, ${background.gradientTo})`,
    };
  }

  // Transparent — a checkerboard so the user can see through it.
  return {
    backgroundImage:
      "linear-gradient(45deg, var(--surface-muted) 25%, transparent 25%), linear-gradient(-45deg, var(--surface-muted) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--surface-muted) 75%), linear-gradient(-45deg, transparent 75%, var(--surface-muted) 75%)",
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  };
}

function ComposedImage({
  imageUrl,
  padding,
  rotateFlip,
  roundedCorners,
  background,
}: Pick<
  ImageEditorToolProps,
  "imageUrl" | "padding" | "rotateFlip" | "roundedCorners" | "background"
>) {
  const transform = [
    `rotate(${rotateFlip.rotation}deg)`,
    `scaleX(${rotateFlip.flipHorizontal ? -1 : 1})`,
    `scaleY(${rotateFlip.flipVertical ? -1 : 1})`,
  ].join(" ");

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        borderRadius: `${roundedCorners.radius}%`,
        ...backgroundStyle(background),
      }}
    >
      {imageUrl ? (
        <div
          className="h-full w-full"
          style={{
            padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          }}
        >
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            className="h-full w-full object-contain"
            style={{ transform }}
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
          No image
        </div>
      )}
    </div>
  );
}

export default function ImageEditorTool({
  imageUrl,
  imageName,
  imageWidth,
  imageHeight,
  imageType,
  background,
  padding,
  resize,
  rotateFlip,
  roundedCorners,
  zoom,
  onZoomChange,
  previewOnly = false,
}: ImageEditorToolProps) {
  if (previewOnly) {
    return (
      <ComposedImage
        imageUrl={imageUrl}
        padding={padding}
        rotateFlip={rotateFlip}
        roundedCorners={roundedCorners}
        background={background}
      />
    );
  }

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Image
        </h3>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Overview of the current image and its combined edits.
        </p>
      </div>

      <div className="aspect-square w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
        <ComposedImage
          imageUrl={imageUrl}
          padding={padding}
          rotateFlip={rotateFlip}
          roundedCorners={roundedCorners}
          background={background}
        />
      </div>

      <div className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <InfoRow
          label="File name"
          value={imageName}
        />

        <InfoRow
          label="Dimensions"
          value={`${imageWidth} × ${imageHeight}px`}
        />

        <InfoRow
          label="Format"
          value={imageType.replace("image/", "").toUpperCase()}
        />

        <InfoRow
          label="Target size"
          value={`${resize.width} × ${resize.height}px`}
        />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="image-zoom"
            className="text-xs font-medium text-[var(--text-secondary)]"
          >
            Canvas zoom
          </label>

          <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 text-xs font-medium text-[var(--text)]">
            {zoom}%
          </span>
        </div>

        <input
          id="image-zoom"
          type="range"
          min={25}
          max={400}
          value={zoom}
          onChange={(event) =>
            onZoomChange(Number(event.target.value))
          }
          className="w-full accent-[var(--brand)]"
        />
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--text-muted)]">
        {label}
      </span>

      <span className="truncate font-mono text-xs font-medium text-[var(--text)]">
        {value}
      </span>
    </div>
  );
}