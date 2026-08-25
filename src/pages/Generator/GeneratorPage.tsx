// src/pages/Generator/GeneratorPage.tsx
// src/pages/Generator/GeneratorPage.tsx
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import JSZip from "jszip";

import EditorPanel, {
  type EditorSettings,
} from "./EditorPanel";
import ExportPanel from "./ExportPanel";
import PreviewPanel from "./PreviewPanel";
import SizeGrid, {
  type GeneratedIcon,
} from "./SizeGrid";
import UploadPanel from "./UploadPanel";

/* ============================================================================
 * Constants
 * ========================================================================== */

const ICON_SIZES = [
  16,
  32,
  48,
  64,
  96,
  128,
  144,
  152,
  180,
  192,
  256,
  384,
  512,
] as const;

const ICO_SIZES = [
  16,
  32,
  48,
  64,
  128,
  256,
] as const;

const MAX_HISTORY = 30;
const MAX_SHORT_NAME_LENGTH = 18;
const MAX_DESCRIPTION_LENGTH = 160;

const DEFAULT_DESCRIPTION =
  "Your website, application or progressive web app.";

const DEFAULT_SETTINGS: EditorSettings = {
  padding: 10,
  scale: 100,

  backgroundMode: "transparent",

  background: "#ffffff",

  gradientFrom: "#6366f1",
  gradientTo: "#8b5cf6",
  gradientAngle: 135,

  fit: "contain",

  positionX: 50,
  positionY: 50,

  zoom: 100,
  rotation: 0,

  borderRadius: 20,

  borderWidth: 0,
  borderColor: "#ffffff",

  shadow: false,
  shadowBlur: 20,
  shadowOpacity: 25,
  shadowOffsetX: 0,
  shadowOffsetY: 8,

  crop: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
};

const FEATURE_TAGS = [
  "Precision crop",
  "Real device preview",
  "PWA",
  "Apple",
  "Android",
  "Favicon",
  "ICO",
  "PNG",
  "SVG",
  "ZIP",
] as const;

/* ============================================================================
 * Utility helpers
 * ========================================================================== */

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.max(min, Math.min(max, value));
}

function colorDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
): number {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
      Math.pow(a.g - b.g, 2) +
      Math.pow(a.b - b.b, 2),
  );
}

function loadImage(
  source: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Unable to load image."));

    image.src = source;
  });
}

function revokeObjectUrl(url: string | null): void {
  if (!url) {
    return;
  }

  URL.revokeObjectURL(url);
}

function dataUrlToUint8Array(
  dataUrl: string,
): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";

  if (!base64) {
    return new Uint8Array();
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function downloadBlob(
  blob: Blob,
  filename: string,
): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function downloadDataUrl(
  dataUrl: string,
  filename: string,
): void {
  const bytes = dataUrlToUint8Array(dataUrl);

  downloadBlob(
    new Blob([bytes], {
      type: "image/png",
    }),
    filename,
  );
}

function createAppName(
  filename: string,
): string {
  const normalized = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!normalized) {
    return "My Website";
  }

  return normalized.replace(
    /\b\w/g,
    (letter) => letter.toUpperCase(),
  );
}

function getExportFilename(
  size: number,
): string {
  switch (size) {
    case 16:
      return "favicon-16x16.png";

    case 32:
      return "favicon-32x32.png";

    case 180:
      return "apple-touch-icon.png";

    case 192:
      return "android-chrome-192x192.png";

    case 512:
      return "android-chrome-512x512.png";

    default:
      return `icon-${size}x${size}.png`;
  }
}

/* ============================================================================
 * Background removal
 * ========================================================================== */

async function removeSimpleBackground(
  image: HTMLImageElement,
): Promise<HTMLImageElement> {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  if (!width || !height) {
    return image;
  }

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    return image;
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  );

  const imageData = context.getImageData(
    0,
    0,
    width,
    height,
  );

  const pixels = imageData.data;

  const samplePoints = [
    [0, 0],
    [Math.max(0, width - 1), 0],
    [0, Math.max(0, height - 1)],
    [
      Math.max(0, width - 1),
      Math.max(0, height - 1),
    ],
  ] as const;

  const backgroundColors = samplePoints.map(
    ([x, y]) => {
      const index = (y * width + x) * 4;

      return {
        r: pixels[index],
        g: pixels[index + 1],
        b: pixels[index + 2],
      };
    },
  );

  const threshold = 45;

  for (
    let index = 0;
    index < pixels.length;
    index += 4
  ) {
    const pixel = {
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2],
    };

    const matchesBackground =
      backgroundColors.some(
        (background) =>
          colorDistance(
            pixel,
            background,
          ) < threshold,
      );

    if (matchesBackground) {
      pixels[index + 3] = 0;
    }
  }

  context.putImageData(
    imageData,
    0,
    0,
  );

  return loadImage(
    canvas.toDataURL("image/png"),
  );
}

/* ============================================================================
 * Canvas rendering
 * ========================================================================== */

function getCropRect(
  image: HTMLImageElement,
  settings: EditorSettings,
) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  return {
    x: (settings.crop.x / 100) * width,
    y: (settings.crop.y / 100) * height,
    width: (settings.crop.width / 100) * width,
    height: (settings.crop.height / 100) * height,
  };
}

function createRoundedPath(
  context: CanvasRenderingContext2D,
  size: number,
  radius: number,
): void {
  context.beginPath();

  if (radius >= size / 2) {
    context.arc(
      size / 2,
      size / 2,
      size / 2,
      0,
      Math.PI * 2,
    );

    context.closePath();
    return;
  }

  context.moveTo(radius, 0);

  context.lineTo(
    size - radius,
    0,
  );

  context.quadraticCurveTo(
    size,
    0,
    size,
    radius,
  );

  context.lineTo(
    size,
    size - radius,
  );

  context.quadraticCurveTo(
    size,
    size,
    size - radius,
    size,
  );

  context.lineTo(
    radius,
    size,
  );

  context.quadraticCurveTo(
    0,
    size,
    0,
    size - radius,
  );

  context.lineTo(
    0,
    radius,
  );

  context.quadraticCurveTo(
    0,
    0,
    radius,
    0,
  );

  context.closePath();
}

function drawIcon(
  image: HTMLImageElement,
  size: number,
  settings: EditorSettings,
): string {
  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const radius =
    (clamp(
      settings.borderRadius,
      0,
      50,
    ) /
      100) *
    size;

  /*
   * Everything rendered inside the icon surface
   * is clipped to the configured corner radius.
   */
  context.save();

  createRoundedPath(
    context,
    size,
    radius,
  );

  context.clip();

  /* ------------------------------------------------------------------------
   * Background
   * ---------------------------------------------------------------------- */

  if (
    settings.backgroundMode ===
    "solid"
  ) {
    context.fillStyle =
      settings.background;

    context.fillRect(
      0,
      0,
      size,
      size,
    );
  }

  if (
    settings.backgroundMode ===
    "gradient"
  ) {
    const angle =
      (settings.gradientAngle *
        Math.PI) /
      180;

    const length =
      size * Math.sqrt(2);

    const center = size / 2;

    const x1 =
      center -
      Math.cos(angle) *
        length;

    const y1 =
      center -
      Math.sin(angle) *
        length;

    const x2 =
      center +
      Math.cos(angle) *
        length;

    const y2 =
      center +
      Math.sin(angle) *
        length;

    const gradient =
      context.createLinearGradient(
        x1,
        y1,
        x2,
        y2,
      );

    gradient.addColorStop(
      0,
      settings.gradientFrom,
    );

    gradient.addColorStop(
      1,
      settings.gradientTo,
    );

    context.fillStyle = gradient;

    context.fillRect(
      0,
      0,
      size,
      size,
    );
  }

  /* ------------------------------------------------------------------------
   * Source image geometry
   * ---------------------------------------------------------------------- */

  const crop = getCropRect(
    image,
    settings,
  );

  const sourceRatio =
    crop.height > 0
      ? crop.width /
        crop.height
      : 1;

  let drawWidth =
    size *
    (1 -
      settings.padding /
        100);

  let drawHeight =
    drawWidth;

  if (
    settings.fit ===
    "contain"
  ) {
    if (sourceRatio > 1) {
      drawHeight =
        drawWidth /
        sourceRatio;
    } else {
      drawWidth =
        drawHeight *
        sourceRatio;
    }
  }

  if (
    settings.fit ===
    "cover"
  ) {
    if (sourceRatio > 1) {
      drawWidth =
        drawHeight *
        sourceRatio;
    } else {
      drawHeight =
        drawWidth /
        sourceRatio;
    }
  }

  const scale =
    (settings.scale / 100) *
    (settings.zoom / 100);

  drawWidth *= scale;
  drawHeight *= scale;

  const offsetX =
    ((settings.positionX - 50) /
      100) *
    size;

  const offsetY =
    ((settings.positionY - 50) /
      100) *
    size;

  const centerX =
    size / 2 + offsetX;

  const centerY =
    size / 2 + offsetY;

  /* ------------------------------------------------------------------------
   * Shadow
   * ---------------------------------------------------------------------- */

  if (settings.shadow) {
    context.shadowColor = `rgba(0, 0, 0, ${
      settings.shadowOpacity /
      100
    })`;

    context.shadowBlur =
      settings.shadowBlur;

    context.shadowOffsetX =
      settings.shadowOffsetX;

    context.shadowOffsetY =
      settings.shadowOffsetY;
  }

  /* ------------------------------------------------------------------------
   * Image
   * ---------------------------------------------------------------------- */

  context.save();

  context.translate(
    centerX,
    centerY,
  );

  context.rotate(
    (settings.rotation *
      Math.PI) /
      180,
  );

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight,
  );

  context.restore();

  /* ------------------------------------------------------------------------
   * Border
   * ---------------------------------------------------------------------- */

  if (
    settings.borderWidth >
    0
  ) {
    context.shadowColor =
      "transparent";

    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    createRoundedPath(
      context,
      size,
      radius,
    );

    context.strokeStyle =
      settings.borderColor;

    context.lineWidth =
      settings.borderWidth;

    context.stroke();
  }

  context.restore();

  return canvas.toDataURL(
    "image/png",
  );
}

/* ============================================================================
 * ICO generation
 * ========================================================================== */

function createIcoFile(
  icons: GeneratedIcon[],
): Blob {
  const selectedIcons =
    icons.filter((icon) =>
      ICO_SIZES.includes(
        icon.size as (typeof ICO_SIZES)[number],
      ),
    );

  const pngData =
    selectedIcons.map(
      (icon) => ({
        size: icon.size,
        bytes:
          dataUrlToUint8Array(
            icon.dataUrl,
          ),
      }),
    );

  if (!pngData.length) {
    return new Blob([], {
      type: "image/x-icon",
    });
  }

  const headerSize = 6;
  const directorySize =
    16 * pngData.length;

  let offset =
    headerSize +
    directorySize;

  const totalSize =
    offset +
    pngData.reduce(
      (total, item) =>
        total +
        item.bytes.length,
      0,
    );

  const buffer =
    new ArrayBuffer(
      totalSize,
    );

  const view =
    new DataView(buffer);

  /*
   * ICO header.
   */
  view.setUint16(
    0,
    0,
    true,
  );

  view.setUint16(
    2,
    1,
    true,
  );

  view.setUint16(
    4,
    pngData.length,
    true,
  );

  let directoryOffset = 6;

  for (const item of pngData) {
    const dimension =
      item.size >= 256
        ? 0
        : item.size;

    view.setUint8(
      directoryOffset,
      dimension,
    );

    view.setUint8(
      directoryOffset + 1,
      dimension,
    );

    view.setUint8(
      directoryOffset + 2,
      0,
    );

    view.setUint8(
      directoryOffset + 3,
      0,
    );

    view.setUint16(
      directoryOffset + 4,
      1,
      true,
    );

    view.setUint16(
      directoryOffset + 6,
      32,
      true,
    );

    view.setUint32(
      directoryOffset + 8,
      item.bytes.length,
      true,
    );

    view.setUint32(
      directoryOffset + 12,
      offset,
      true,
    );

    directoryOffset += 16;
    offset += item.bytes.length;
  }

  const output =
    new Uint8Array(buffer);

  let dataOffset =
    headerSize +
    directorySize;

  for (const item of pngData) {
    output.set(
      item.bytes,
      dataOffset,
    );

    dataOffset +=
      item.bytes.length;
  }

  return new Blob(
    [output],
    {
      type: "image/x-icon",
    },
  );
}

/* ============================================================================
 * SVG export
 * ========================================================================== */

function createSvgExport(
  image: HTMLImageElement,
  settings: EditorSettings,
): string {
  const png = drawIcon(
    image,
    512,
    settings,
  );

  /*
   * This is a raster-backed SVG wrapper.
   * It preserves the editor's exact visual output.
   */
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <image href="${png}" width="512" height="512" preserveAspectRatio="none"/>
</svg>`;
}

/* ============================================================================
 * Manifest generation
 * ========================================================================== */

function createManifest(
  siteName: string,
  shortName: string,
  description: string,
): string {
  return JSON.stringify(
    {
      name:
        siteName ||
        "My Website",

      short_name:
        shortName ||
        siteName ||
        "My Website",

      description:
        description || "",

      start_url: "/",
      scope: "/",
      display: "standalone",

      background_color:
        "#ffffff",

      theme_color:
        "#6366f1",

      icons: [
        {
          src:
            "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src:
            "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  );
}

/* ============================================================================
 * Component
 * ========================================================================== */

export default function GeneratorPage() {
  const [siteName, setSiteName] =
    useState("");

  const [shortName, setShortName] =
    useState("");

  const [description, setDescription] =
    useState(
      DEFAULT_DESCRIPTION,
    );

  const [imageUrl, setImageUrl] =
    useState<string | null>(
      null,
    );

  const [image, setImage] =
    useState<HTMLImageElement | null>(
      null,
    );

  const [
    originalImage,
    setOriginalImage,
  ] =
    useState<HTMLImageElement | null>(
      null,
    );

  const [fileName, setFileName] =
    useState("icon");

  const [
    sourceFormat,
    setSourceFormat,
  ] = useState("image/png");

  const [settings, setSettings] =
    useState<EditorSettings>(
      DEFAULT_SETTINGS,
    );

  /*
   * History stores snapshots.
   *
   * historyIndex represents the currently
   * active snapshot.
   */
  const [history, setHistory] =
    useState<EditorSettings[]>([]);

  const [
    historyIndex,
    setHistoryIndex,
  ] = useState(-1);

  const [
    generatedIcons,
    setGeneratedIcons,
  ] = useState<GeneratedIcon[]>([]);

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const generationIdRef =
    useRef(0);

  /* --------------------------------------------------------------------------
   * Settings history
   * ------------------------------------------------------------------------ */

  const updateSettings =
    useCallback(
      (
        updates: Partial<EditorSettings>,
      ) => {
        setSettings((current) => {
          const next = {
            ...current,
            ...updates,
          };

          setHistory((currentHistory) => {
            const activeHistory =
              historyIndex >= 0
                ? currentHistory.slice(
                    0,
                    historyIndex + 1,
                  )
                : [];

            return [
              ...activeHistory,
              current,
              next,
            ].slice(-MAX_HISTORY);
          });

          setHistoryIndex((currentIndex) =>
            Math.min(
              Math.max(currentIndex + 2, 0),
              MAX_HISTORY - 1,
            ),
          );

          return next;
        });

        setGeneratedIcons([]);
      },
      [historyIndex],
    );

  const undo = useCallback(() => {
    if (
      historyIndex <= 0 ||
      !history.length
    ) {
      return;
    }

    const previous =
      history[historyIndex - 1];

    if (!previous) {
      return;
    }

    setSettings(previous);
    setHistoryIndex(
      historyIndex - 1,
    );
    setGeneratedIcons([]);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (
      historyIndex < 0 ||
      historyIndex >=
        history.length - 1
    ) {
      return;
    }

    const next =
      history[historyIndex + 1];

    if (!next) {
      return;
    }

    setSettings(next);
    setHistoryIndex(
      historyIndex + 1,
    );
    setGeneratedIcons([]);
  }, [history, historyIndex]);

  const canUndo =
    historyIndex > 0;

  const canRedo =
    historyIndex >= 0 &&
    historyIndex <
      history.length - 1;

  /* --------------------------------------------------------------------------
   * File handling
   * ------------------------------------------------------------------------ */

  const handleFileSelect =
    useCallback(
      (file: File) => {
        if (
          !file.type.startsWith(
            "image/",
          )
        ) {
          return;
        }

        const nextUrl =
          URL.createObjectURL(
            file,
          );

        const nextImage =
          new Image();

        nextImage.onload = () => {
          setImage(nextImage);
          setOriginalImage(
            nextImage,
          );
        };

        nextImage.onerror = () => {
          revokeObjectUrl(
            nextUrl,
          );
          setImage(null);
          setOriginalImage(
            null,
          );
          setImageUrl(null);
        };

        nextImage.src =
          nextUrl;

        setImageUrl(
          nextUrl,
        );

        setSourceFormat(
          file.type ||
            "image/png",
        );

        const cleanName =
          file.name
            .replace(
              /\.[^/.]+$/,
              "",
            )
            .trim();

        const generatedName =
          cleanName || "icon";

        const generatedSiteName =
          createAppName(
            generatedName,
          );

        setFileName(
          generatedName,
        );

        setSiteName(
          generatedSiteName,
        );

        setShortName(
          generatedSiteName.slice(
            0,
            MAX_SHORT_NAME_LENGTH,
          ),
        );

        setDescription(
          DEFAULT_DESCRIPTION,
        );

        setSettings(
          DEFAULT_SETTINGS,
        );

        setHistory([
          DEFAULT_SETTINGS,
        ]);

        setHistoryIndex(0);

        setGeneratedIcons([]);
      },
      [],
    );

  const handleRemoveImage =
    useCallback(() => {
      revokeObjectUrl(
        imageUrl,
      );

      setImageUrl(null);
      setImage(null);
      setOriginalImage(null);

      setFileName("icon");
      setSiteName("");
      setShortName("");
      setDescription(
        DEFAULT_DESCRIPTION,
      );

      setSourceFormat(
        "image/png",
      );

      setSettings(
        DEFAULT_SETTINGS,
      );

      setHistory([
        DEFAULT_SETTINGS,
      ]);

      setHistoryIndex(0);

      setGeneratedIcons([]);
    }, [imageUrl]);

  const handleRemoveBackground =
    useCallback(async () => {
      if (!image) {
        return;
      }

      try {
        const processed =
          await removeSimpleBackground(
            image,
          );

        setImage(processed);
        setGeneratedIcons([]);
      } catch {
        /*
         * Keep the original image intact
         * if processing fails.
         */
      }
    }, [image]);

  const resetImage =
    useCallback(() => {
      if (!originalImage) {
        return;
      }

      setImage(
        originalImage,
      );

      setSettings(
        DEFAULT_SETTINGS,
      );

      setHistory([
        DEFAULT_SETTINGS,
      ]);

      setHistoryIndex(0);

      setGeneratedIcons([]);
    }, [originalImage]);

  /* --------------------------------------------------------------------------
   * Transform controls
   * ------------------------------------------------------------------------ */

  const rotateLeft =
    useCallback(() => {
      updateSettings({
        rotation:
          (settings.rotation -
            90 +
            360) %
          360,
      });
    }, [
      settings.rotation,
      updateSettings,
    ]);

  const rotateRight =
    useCallback(() => {
      updateSettings({
        rotation:
          (settings.rotation +
            90) %
          360,
      });
    }, [
      settings.rotation,
      updateSettings,
    ]);

  /* --------------------------------------------------------------------------
   * Icon generation
   * ------------------------------------------------------------------------ */

  const generateIcons =
    useCallback(() => {
      if (!image) {
        return;
      }

      const generationId =
        ++generationIdRef.current;

      setIsGenerating(true);

      requestAnimationFrame(() => {
        if (
          generationId !==
          generationIdRef.current
        ) {
          return;
        }

        try {
          const icons =
            ICON_SIZES.map(
              (size) => ({
                size,
                dataUrl:
                  drawIcon(
                    image,
                    size,
                    settings,
                  ),
              }),
            );

          setGeneratedIcons(
            icons,
          );
        } finally {
          setIsGenerating(false);
        }
      });
    }, [image, settings]);

  /* --------------------------------------------------------------------------
   * Preview / exports
   * ------------------------------------------------------------------------ */

  const previewUrl =
    useMemo(() => {
      if (!image) {
        return null;
      }

      return drawIcon(
        image,
        512,
        settings,
      );
    }, [image, settings]);

  const svgContent =
    useMemo(() => {
      if (!image) {
        return null;
      }

      return createSvgExport(
        image,
        settings,
      );
    }, [image, settings]);

  const appName = useMemo(
    () => createAppName(fileName),
    [fileName],
  );

  const htmlSnippet =
    useMemo(
      () =>
        `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">`,
      [],
    );

  const manifestSnippet =
    useMemo(
      () =>
        createManifest(
          siteName ||
            appName,
          shortName ||
            siteName ||
            appName,
          description,
        ),
      [
        siteName,
        shortName,
        description,
        appName,
      ],
    );

  /* --------------------------------------------------------------------------
   * Downloads
   * ------------------------------------------------------------------------ */

  const handleDownloadIcon =
    useCallback(
      (size: number) => {
        const icon =
          generatedIcons.find(
            (item) =>
              item.size === size,
          );

        if (!icon) {
          return;
        }

        downloadDataUrl(
          icon.dataUrl,
          getExportFilename(
            size,
          ),
        );
      },
      [generatedIcons],
    );

  const handleDownloadSvg =
    useCallback(() => {
      if (!svgContent) {
        return;
      }

      downloadBlob(
        new Blob(
          [svgContent],
          {
            type:
              "image/svg+xml",
          },
        ),
        `${fileName}.svg`,
      );
    }, [fileName, svgContent]);

  const handleDownloadIco =
    useCallback(() => {
      if (
        !generatedIcons.length
      ) {
        return;
      }

      downloadBlob(
        createIcoFile(
          generatedIcons,
        ),
        "favicon.ico",
      );
    }, [generatedIcons]);

  const handleDownloadZip =
    useCallback(async () => {
      if (
        !generatedIcons.length &&
        !svgContent
      ) {
        return;
      }

      const zip =
        new JSZip();

      const root =
        zip.folder(
          "icon-toolkit-export",
        );

      if (!root) {
        return;
      }

      const publicFolder =
        root.folder(
          "public",
        );

      if (!publicFolder) {
        return;
      }

      const iconsFolder =
        publicFolder.folder(
          "icons",
        );

      const rootLevelFiles =
        new Set([
          "favicon-16x16.png",
          "favicon-32x32.png",
          "android-chrome-192x192.png",
          "android-chrome-512x512.png",
          "apple-touch-icon.png",
        ]);

      generatedIcons.forEach(
        (icon) => {
          const filename =
            getExportFilename(
              icon.size,
            );

          const targetFolder =
            rootLevelFiles.has(
              filename,
            )
              ? publicFolder
              : iconsFolder;

          targetFolder?.file(
            filename,
            dataUrlToUint8Array(
              icon.dataUrl,
            ),
          );
        },
      );

      if (
        generatedIcons.length
      ) {
        const icoBlob =
          createIcoFile(
            generatedIcons,
          );

        publicFolder.file(
          "favicon.ico",
          new Uint8Array(
            await icoBlob.arrayBuffer(),
          ),
        );
      }

      if (svgContent) {
        publicFolder.file(
          `${fileName}.svg`,
          svgContent,
        );
      }

      root.file(
        "manifest.json",
        manifestSnippet,
      );

      root.file(
        "favicon-snippet.html",
        htmlSnippet,
      );

      root.file(
        "README.txt",
        `Generated with IconToolkit.

Application:
${siteName || appName}

Short name:
${shortName || siteName || appName}

Description:
${description}

Production files:
- public/favicon.ico
- public/favicon-16x16.png
- public/favicon-32x32.png
- public/apple-touch-icon.png
- public/android-chrome-192x192.png
- public/android-chrome-512x512.png
- public/icons/*
- manifest.json
- favicon-snippet.html

All image processing was performed locally in the browser.
`,
      );

      const blob =
        await zip.generateAsync({
          type: "blob",
          compression:
            "DEFLATE",
          compressionOptions: {
            level: 6,
          },
        });

      downloadBlob(
        blob,
        `${fileName}-icon-set.zip`,
      );
    }, [
      generatedIcons,
      svgContent,
      fileName,
      manifestSnippet,
      htmlSnippet,
      siteName,
      appName,
      shortName,
      description,
    ]);

  /* --------------------------------------------------------------------------
   * Object URL cleanup
   * ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      revokeObjectUrl(
        imageUrl,
      );
    };
  }, [imageUrl]);

  /* --------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* =====================================================================
       * Page header
       * =================================================================== */}

      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[var(--text-secondary)]
                shadow-sm
              "
            >
              Professional icon studio
            </div>

            <h1
              className="
                mt-4
                text-3xl
                font-bold
                tracking-[-0.04em]
                text-[var(--text)]
                sm:text-4xl
              "
            >
              Create a production-ready
              icon system.
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-[var(--text-secondary)]
                sm:text-base
              "
            >
              Crop precisely, transform
              visually, preview in real
              device contexts, and export
              a complete favicon, PWA,
              and app icon package.
            </p>

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-2
              "
            >
              {FEATURE_TAGS.map(
                (item) => (
                  <span
                    key={item}
                    className="
                      rounded-full
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      px-3
                      py-1.5
                      text-[10px]
                      font-medium
                      text-[var(--text-muted)]
                    "
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * Workspace
       * =================================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            grid
            gap-6
            lg:grid-cols-[290px_minmax(0,1fr)_320px]
            lg:items-start
          "
        >
          {/* -----------------------------------------------------------------
           * Left column
           * ---------------------------------------------------------------- */}

          <div className="space-y-6">
            <UploadPanel
              imageUrl={imageUrl}
              fileName={fileName}
              sourceFormat={sourceFormat}
              imageWidth={
                image?.naturalWidth ?? 0
              }
              imageHeight={
                image?.naturalHeight ?? 0
              }
              onFileSelect={
                handleFileSelect
              }
              onRemove={
                handleRemoveImage
              }
              onRemoveBackground={
                handleRemoveBackground
              }
              onResetImage={
                resetImage
              }
              disabled={!image}
            />

            <EditorPanel
              settings={settings}
              imageUrl={imageUrl}
              onChange={updateSettings}
              disabled={!image}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              onRotateLeft={
                rotateLeft
              }
              onRotateRight={
                rotateRight
              }
            />
          </div>

          {/* -----------------------------------------------------------------
           * Center column
           * ---------------------------------------------------------------- */}

          <div
            className="
              min-w-0
              space-y-6
            "
          >
            {/* Site identity */}

            <div
              className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-4
                shadow-sm
              "
            >
              <div>
                <h2
                  className="
                    text-sm
                    font-semibold
                    text-[var(--text)]
                  "
                >
                  Site identity
                </h2>

                <p
                  className="
                    mt-1
                    text-[10px]
                    leading-4
                    text-[var(--text-muted)]
                  "
                >
                  These values are used
                  by browser tabs, PWA
                  installation, mobile
                  shortcuts, and
                  app-style previews.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {/* Site name */}

                <div>
                  <label
                    htmlFor="site-name"
                    className="
                      text-[10px]
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    Site name
                  </label>

                  <input
                    id="site-name"
                    type="text"
                    value={siteName}
                    onChange={(event) =>
                      setSiteName(
                        event.target
                          .value,
                      )
                    }
                    placeholder="My Website"
                    maxLength={60}
                    className="
                      mt-1.5
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface-muted)]
                      px-3
                      text-xs
                      text-[var(--text)]
                      outline-none
                      transition
                      placeholder:text-[var(--text-muted)]
                      focus:border-[#6366F1]
                      focus:ring-2
                      focus:ring-[#6366F1]/10
                    "
                  />

                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-[var(--text-muted)]
                    "
                  >
                    Full application/site
                    name.
                  </p>
                </div>

                {/* Short name */}

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="short-name"
                      className="
                        text-[10px]
                        font-semibold
                        text-[var(--text)]
                      "
                    >
                      Short name
                    </label>

                    <span
                      className="
                        text-[9px]
                        text-[var(--text-muted)]
                      "
                    >
                      {shortName.length}/
                      {
                        MAX_SHORT_NAME_LENGTH
                      }
                    </span>
                  </div>

                  <input
                    id="short-name"
                    type="text"
                    value={shortName}
                    onChange={(event) =>
                      setShortName(
                        event.target.value.slice(
                          0,
                          MAX_SHORT_NAME_LENGTH,
                        ),
                      )
                    }
                    placeholder="My Website"
                    maxLength={
                      MAX_SHORT_NAME_LENGTH
                    }
                    className="
                      mt-1.5
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface-muted)]
                      px-3
                      text-xs
                      text-[var(--text)]
                      outline-none
                      transition
                      placeholder:text-[var(--text-muted)]
                      focus:border-[#6366F1]
                      focus:ring-2
                      focus:ring-[#6366F1]/10
                    "
                  />

                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-[var(--text-muted)]
                    "
                  >
                    Used where space is
                    limited, such as
                    installed shortcuts.
                  </p>
                </div>

                {/* Description */}

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="site-description"
                      className="
                        text-[10px]
                        font-semibold
                        text-[var(--text)]
                      "
                    >
                      Description
                    </label>

                    <span
                      className="
                        text-[9px]
                        text-[var(--text-muted)]
                      "
                    >
                      {description.length}/
                      {
                        MAX_DESCRIPTION_LENGTH
                      }
                    </span>
                  </div>

                  <textarea
                    id="site-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value.slice(
                          0,
                          MAX_DESCRIPTION_LENGTH,
                        ),
                      )
                    }
                    rows={3}
                    maxLength={
                      MAX_DESCRIPTION_LENGTH
                    }
                    placeholder="Describe your website or application..."
                    className="
                      mt-1.5
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-[var(--border)]
                      bg-[var(--surface-muted)]
                      px-3
                      py-2
                      text-xs
                      leading-5
                      text-[var(--text)]
                      outline-none
                      transition
                      placeholder:text-[var(--text-muted)]
                      focus:border-[#6366F1]
                      focus:ring-2
                      focus:ring-[#6366F1]/10
                    "
                  />

                  <p
                    className="
                      mt-1
                      text-[9px]
                      text-[var(--text-muted)]
                    "
                  >
                    Used by the PWA and
                    installed-app preview.
                  </p>
                </div>
              </div>
            </div>

            {/* Production preview */}

            <div className="min-w-0">
              <PreviewPanel
                imageUrl={previewUrl}
                hasImage={Boolean(image)}
                imageWidth={
                  image?.naturalWidth ?? 0
                }
                imageHeight={
                  image?.naturalHeight ?? 0
                }
                settings={settings}
                siteName={siteName}
                shortName={shortName}
                description={description}
              />
            </div>
          </div>

          {/* -----------------------------------------------------------------
           * Right column
           * ---------------------------------------------------------------- */}

          <div className="min-w-0">
            <ExportPanel
              fileName={fileName}
              icons={generatedIcons}
              disabled={!image}
              isGenerating={
                isGenerating
              }
              svgContent={svgContent}
              htmlSnippet={
                htmlSnippet
              }
              manifestSnippet={
                manifestSnippet
              }
              onGenerate={
                generateIcons
              }
              onDownloadIcon={
                handleDownloadIcon
              }
              onDownloadSvg={
                handleDownloadSvg
              }
              onDownloadIco={
                handleDownloadIco
              }
              onDownloadZip={
                handleDownloadZip
              }
            />
          </div>
        </div>

        {/* ===================================================================
         * Generated icon sizes
         * ================================================================= */}

        <div className="mt-8">
          <SizeGrid
            icons={generatedIcons}
            isGenerating={
              isGenerating
            }
            onDownload={
              handleDownloadIcon
            }
          />
        </div>
      </section>
    </div>
  );
}