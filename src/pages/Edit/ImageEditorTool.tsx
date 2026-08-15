// src/pages/Edit/ImageEditorTool.tsx
// src/pages/Edit/ImageEditorTool.tsx

// src/pages/Edit/ImageEditorTool.tsx

import type {
  BackgroundSettings,
  CropSettings,
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
  crop: CropSettings | null;
  resize: ResizeSettings;
  rotateFlip: RotateFlipSettings;
  roundedCorners: RoundedCornersSettings;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  previewOnly?: boolean;
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(max, Math.max(min, value));
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
    backgroundPosition:
      "0 0, 0 8px, 8px -8px, -8px 0px",
  };
}

function getResizeLayout(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  mode: ResizeSettings["mode"],
) {
  if (
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    targetWidth <= 0 ||
    targetHeight <= 0
  ) {
    return {
      width: 0,
      height: 0,
      scaleX: 1,
      scaleY: 1,
    };
  }

  if (mode === "stretch") {
    return {
      width: targetWidth,
      height: targetHeight,
      scaleX: targetWidth / sourceWidth,
      scaleY: targetHeight / sourceHeight,
    };
  }

  const scale =
    mode === "fill"
      ? Math.max(
          targetWidth / sourceWidth,
          targetHeight / sourceHeight,
        )
      : Math.min(
          targetWidth / sourceWidth,
          targetHeight / sourceHeight,
        );

  return {
    width: sourceWidth * scale,
    height: sourceHeight * scale,
    scaleX: scale,
    scaleY: scale,
  };
}

function getRoundedRadius(
  width: number,
  height: number,
  percentage: number,
) {
  const radius = clamp(percentage, 0, 100) / 100;

  return Math.min(width, height) * radius;
}

/**
 * Calculates the dimensions of the rotated rectangle.
 *
 * For 90° and 270°, width and height are effectively swapped.
 */
function getRotatedBounds(
  width: number,
  height: number,
  rotation: number,
) {
  const normalized = ((rotation % 360) + 360) % 360;

  if (normalized === 90 || normalized === 270) {
    return {
      width: height,
      height: width,
    };
  }

  return {
    width,
    height,
  };
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
  zoom = 100,
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
> & {
  zoom?: number;
}) {
  const outputWidth = Math.max(1, resize.width);
  const outputHeight = Math.max(1, resize.height);

  const availableWidth = Math.max(
    1,
    outputWidth - padding.left - padding.right,
  );

  const availableHeight = Math.max(
    1,
    outputHeight - padding.top - padding.bottom,
  );

  const layout = getResizeLayout(
    imageWidth,
    imageHeight,
    availableWidth,
    availableHeight,
    resize.mode,
  );

  const rotatedBounds = getRotatedBounds(
    layout.width,
    layout.height,
    rotateFlip.rotation,
  );

  const radius = getRoundedRadius(
    layout.width,
    layout.height,
    roundedCorners.radius,
  );

  /**
   * IMPORTANT:
   *
   * layout.width / layout.height are the REAL composition
   * dimensions.
   *
   * We calculate a separate visual scale so a large image
   * fits inside the browser preview.
   */
  const fitScale =
    rotatedBounds.width > 0 && rotatedBounds.height > 0
      ? Math.min(
          availableWidth / rotatedBounds.width,
          availableHeight / rotatedBounds.height,
        )
      : 1;

  /**
   * Keep normal zoom at 100%.
   *
   * The slider can then zoom in/out relative to the
   * automatically fitted image.
   */
  const visualScale =
    Math.max(0.01, fitScale) * (clamp(zoom, 25, 400) / 100);

  const transform = [
    `translate(-50%, -50%)`,
    `rotate(${rotateFlip.rotation}deg)`,
    `scaleX(${rotateFlip.flipHorizontal ? -1 : 1})`,
    `scaleY(${rotateFlip.flipVertical ? -1 : 1})`,
    `scale(${visualScale})`,
  ].join(" ");

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${Math.max(1, layout.width)}px`,
    height: `${Math.max(1, layout.height)}px`,
    maxWidth: "none",
    maxHeight: "none",
    objectFit: "fill",
    transform,
    transformOrigin: "center center",
    borderRadius: `${radius}px`,
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={backgroundStyle(background)}
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            paddingTop: `${padding.top}px`,
            paddingRight: `${padding.right}px`,
            paddingBottom: `${padding.bottom}px`,
            paddingLeft: `${padding.left}px`,
            boxSizing: "border-box",
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              className="block select-none"
              style={imageStyle}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
          No image
        </div>
      )}

      <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-sm">
        {resize.width} × {resize.height}px
      </div>

      <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[9px] font-medium text-white backdrop-blur-sm">
        {resize.mode}
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
  crop,
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
        zoom={100}
      />
    );
  }

  return (
    <section className="w-full p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Image</h3>

        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
          Preview the final composition and output dimensions.
        </p>
      </div>

      {/* Preview */}
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
          zoom={zoom}
        />
      </div>

      {/* Final canvas information */}
      <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">Final canvas</span>

          <span className="font-mono text-xs font-semibold text-[var(--brand)]">
            {resize.width} × {resize.height}px
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--text-muted)]">Resize mode</span>

          <span className="text-xs font-medium capitalize text-[var(--text)]">
            {resize.mode}
          </span>
        </div>

        <p className="mt-2 text-[10px] leading-4 text-[var(--text-muted)]">
          {resize.mode === "fit" &&
            "The entire image remains visible without distortion."}

          {resize.mode === "fill" &&
            "The image fills the canvas while preserving its proportions. Overflow is cropped."}

          {resize.mode === "stretch" &&
            "The image fills the canvas completely. Width and height may be distorted."}
        </p>
      </div>

      {/* Image information */}
      <div className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
        <InfoRow label="File name" value={imageName} />

        <InfoRow label="Original" value={`${imageWidth} × ${imageHeight}px`} />

        <InfoRow
          label="Crop"
          value={
            crop
              ? `${Math.round(crop.width)} × ${Math.round(crop.height)}px`
              : `${imageWidth} × ${imageHeight}px`
          }
        />

        <InfoRow
          label="Output"
          value={`${resize.width} × ${resize.height}px`}
        />

        <InfoRow
          label="Format"
          value={imageType.replace("image/", "").toUpperCase() || "—"}
        />
      </div>

      {/* Zoom */}
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
          onChange={(event) => onZoomChange(Number(event.target.value))}
          className="w-full accent-[var(--brand)]"
        />

        <div className="mt-1 flex justify-between text-[9px] text-[var(--text-muted)]">
          <span>25%</span>
          <span>100%</span>
          <span>400%</span>
        </div>
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