// src/pages/Edit/ImageEditorTool.tsx
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

  return {
    backgroundImage:
      "linear-gradient(45deg, var(--surface-muted) 25%, transparent 25%), linear-gradient(-45deg, var(--surface-muted) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--surface-muted) 75%), linear-gradient(-45deg, transparent 75%, var(--surface-muted) 75%)",
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  };
}

function getFitSize(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  if (
    !sourceWidth ||
    !sourceHeight ||
    !targetWidth ||
    !targetHeight
  ) {
    return {
      width: 0,
      height: 0,
    };
  }

  const scale = Math.min(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight,
  );

  return {
    width: sourceWidth * scale,
    height: sourceHeight * scale,
  };
}

function getDisplayDimensions(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
) {
  const fitted = getFitSize(
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight,
  );

  return fitted;
}

function ComposedImage({
  imageUrl,
  imageWidth,
  imageHeight,
  resize,
  padding,
  rotateFlip,
  roundedCorners,
  background,
}: Pick<
  ImageEditorToolProps,
  | "imageUrl"
  | "imageWidth"
  | "imageHeight"
  | "resize"
  | "padding"
  | "rotateFlip"
  | "roundedCorners"
  | "background"
>) {
  const transform = [
    `rotate(${rotateFlip.rotation}deg)`,
    `scaleX(${rotateFlip.flipHorizontal ? -1 : 1})`,
    `scaleY(${rotateFlip.flipVertical ? -1 : 1})`,
  ].join(" ");

  const fitted = getDisplayDimensions(
    imageWidth,
    imageHeight,
    resize.width,
    resize.height,
  );

  const paddingHorizontal =
    padding.left + padding.right;

  const paddingVertical =
    padding.top + padding.bottom;

  const availableWidth = Math.max(
    1,
    resize.width - paddingHorizontal,
  );

  const availableHeight = Math.max(
    1,
    resize.height - paddingVertical,
  );

  const fittedInsidePadding = getFitSize(
    imageWidth,
    imageHeight,
    availableWidth,
    availableHeight,
  );

  const previewWidth =
    fittedInsidePadding.width || fitted.width;

  const previewHeight =
    fittedInsidePadding.height || fitted.height;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        borderRadius: `${roundedCorners.radius}%`,
        ...backgroundStyle(background),
      }}
    >
      {imageUrl ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative flex items-center justify-center"
            style={{
              width: `${(previewWidth / resize.width) * 100}%`,
              height: `${(previewHeight / resize.height) * 100}%`,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              className="block h-full w-full select-none object-contain"
              style={{
                transform,
                paddingTop: `${(padding.top / Math.max(1, resize.height)) * 100}%`,
                paddingRight: `${(padding.right / Math.max(1, resize.width)) * 100}%`,
                paddingBottom: `${(padding.bottom / Math.max(1, resize.height)) * 100}%`,
                paddingLeft: `${(padding.left / Math.max(1, resize.width)) * 100}%`,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
          No image
        </div>
      )}

      {/* OUTPUT SIZE LABEL */}

      <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-sm">
        {resize.width} × {resize.height}px
      </div>
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
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        resize={resize}
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
          Preview the final composition and output dimensions.
        </p>
      </div>

      {/* FINAL OUTPUT PREVIEW */}

      <div
        className="relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)]"
        style={{
          aspectRatio:
            resize.width && resize.height
              ? `${resize.width} / ${resize.height}`
              : "1 / 1",
        }}
      >
        <ComposedImage
          imageUrl={imageUrl}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          resize={resize}
          padding={padding}
          rotateFlip={rotateFlip}
          roundedCorners={roundedCorners}
          background={background}
        />
      </div>

      <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Final canvas
          </span>

          <span className="font-mono text-xs font-semibold text-[var(--brand)]">
            {resize.width} × {resize.height}px
          </span>
        </div>

        <p className="mt-2 text-[10px] leading-4 text-[var(--text-muted)]">
          The image keeps its original proportions. A different output
          ratio creates extra canvas space rather than stretching the
          image.
        </p>
      </div>

      <div className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <InfoRow
          label="File name"
          value={imageName}
        />

        <InfoRow
          label="Original"
          value={`${imageWidth} × ${imageHeight}px`}
        />

        <InfoRow
          label="Output"
          value={`${resize.width} × ${resize.height}px`}
        />

        <InfoRow
          label="Format"
          value={
            imageType.replace("image/", "").toUpperCase() || "—"
          }
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
      <span className="shrink-0 text-xs text-[var(--text-muted)]">
        {label}
      </span>

      <span className="truncate font-mono text-xs font-medium text-[var(--text)]">
        {value}
      </span>
    </div>
  );
}