// src/pages/Generator/GeneratorPage.tsx
import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";

import UploadPanel from "./UploadPanel";
import EditorPanel, {
  type EditorSettings,
} from "./EditorPanel";
import PreviewPanel from "./PreviewPanel";
import SizeGrid, {
  type GeneratedIcon,
} from "./SizeGrid";
import ExportPanel from "./ExportPanel";

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
];

const ICO_SIZES = [
  16,
  32,
  48,
  64,
  128,
  256,
];

export type BackgroundMode =
  | "transparent"
  | "solid"
  | "gradient";

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

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

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.max(min, Math.min(max, value));
}



function colorDistance(
  a: {
    r: number;
    g: number;
    b: number;
  },
  b: {
    r: number;
    g: number;
    b: number;
  },
) {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
      Math.pow(a.g - b.g, 2) +
      Math.pow(a.b - b.b, 2),
  );
}

/**
 * Basic browser-only background remover.
 *
 * This is intentionally conservative:
 * it samples the corner colors and removes pixels
 * sufficiently close to those colors.
 *
 * It is useful for simple logos placed on a flat
 * background, but it is not a replacement for
 * ML segmentation.
 */
async function removeSimpleBackground(
  image: HTMLImageElement,
): Promise<HTMLImageElement> {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

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
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];

  const backgroundColors = samplePoints.map(
    ([x, y]) => {
      const index =
        (y * width + x) * 4;

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

  const resultUrl =
    canvas.toDataURL("image/png");

  return await loadImage(resultUrl);
}

function loadImage(
  source: string,
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      image.onload = () =>
        resolve(image);

      image.onerror = reject;

      image.src = source;
    },
  );
}

function getCropRect(
  image: HTMLImageElement,
  settings: EditorSettings,
) {
  const width =
    image.naturalWidth;

  const height =
    image.naturalHeight;

  const x =
    (settings.crop.x / 100) *
    width;

  const y =
    (settings.crop.y / 100) *
    height;

  const cropWidth =
    (settings.crop.width / 100) *
    width;

  const cropHeight =
    (settings.crop.height / 100) *
    height;

  return {
    x,
    y,
    width: cropWidth,
    height: cropHeight,
  };
}

function drawIcon(
  image: HTMLImageElement,
  size: number,
  settings: EditorSettings,
): string {
  const canvas =
    document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return "";
  }

  context.imageSmoothingEnabled =
    true;

  context.imageSmoothingQuality =
    "high";

  /**
   * Rounded clipping shape.
   */
  const radius =
    (clamp(
      settings.borderRadius,
      0,
      50,
    ) /
      100) *
    size;

  context.save();

  context.beginPath();

  if (radius >= size / 2) {
    context.arc(
      size / 2,
      size / 2,
      size / 2,
      0,
      Math.PI * 2,
    );
  } else {
    const r = radius;

    context.moveTo(r, 0);
    context.lineTo(size - r, 0);
    context.quadraticCurveTo(
      size,
      0,
      size,
      r,
    );

    context.lineTo(
      size,
      size - r,
    );

    context.quadraticCurveTo(
      size,
      size,
      size - r,
      size,
    );

    context.lineTo(
      r,
      size,
    );

    context.quadraticCurveTo(
      0,
      size,
      0,
      size - r,
    );

    context.lineTo(0, r);

    context.quadraticCurveTo(
      0,
      0,
      r,
      0,
    );
  }

  context.closePath();
  context.clip();

  /**
   * Background
   */
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

    const center =
      size / 2;

    const length =
      size *
      Math.sqrt(2);

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

    context.fillStyle =
      gradient;

    context.fillRect(
      0,
      0,
      size,
      size,
    );
  }

  /**
   * Crop
   */
  const crop =
    getCropRect(
      image,
      settings,
    );

  /**
   * Calculate source ratio.
   */
  const sourceRatio =
    crop.width /
    crop.height;

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

  /**
   * Shadow.
   */
  if (settings.shadow) {
    context.shadowColor =
      `rgba(0,0,0,${
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

  /**
   * Rotate around center.
   */
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

  /**
   * Border.
   */
  if (settings.borderWidth > 0) {
    context.shadowColor =
      "transparent";

    context.shadowBlur = 0;

    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

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

function dataUrlToUint8Array(
  dataUrl: string,
) {
  const base64 =
    dataUrl.split(",")[1] ?? "";

  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(
      binary.length,
    );

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(index);
  }

  return bytes;
}

function createIcoFile(
  icons: GeneratedIcon[],
): Blob {
  const selectedIcons =
    icons.filter((icon) =>
      ICO_SIZES.includes(
        icon.size,
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

    offset +=
      item.bytes.length;
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

function createSvgExport(
  image: HTMLImageElement,
  settings: EditorSettings,
): string {
  const pngDataUrl =
    drawIcon(
      image,
      512,
      settings,
    );

  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="512"
  height="512"
  viewBox="0 0 512 512"
>
  <image
    href="${pngDataUrl}"
    width="512"
    height="512"
  />
</svg>
`;
}

function downloadBlob(
  blob: Blob,
  filename: string,
) {
  const url =
    URL.createObjectURL(
      blob,
    );

  const anchor =
    document.createElement(
      "a",
    );

  anchor.href = url;
  anchor.download =
    filename;

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(
    url,
  );
}

function downloadDataUrl(
  dataUrl: string,
  filename: string,
) {
  const bytes =
    dataUrlToUint8Array(
      dataUrl,
    );

  const blob =
    new Blob([bytes], {
      type: "image/png",
    });

  downloadBlob(
    blob,
    filename,
  );
}

export default function GeneratorPage() {
  const [
    imageUrl,
    setImageUrl,
  ] =
    useState<string | null>(
      null,
    );

  const [
    image,
    setImage,
  ] =
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

  const [
    fileName,
    setFileName,
  ] = useState("icon");

  const [
    sourceFormat,
    setSourceFormat,
  ] = useState(
    "image/png",
  );

  const [
    settings,
    setSettings,
  ] =
    useState<EditorSettings>(
      DEFAULT_SETTINGS,
    );

  const [
    history,
    setHistory,
  ] = useState<
    EditorSettings[]
  >([]);

  const [
    historyIndex,
    setHistoryIndex,
  ] = useState(-1);

  const [
    generatedIcons,
    setGeneratedIcons,
  ] = useState<
    GeneratedIcon[]
  >([]);

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const updateSettings = (
    updates: Partial<EditorSettings>,
  ) => {
    setSettings((current) => {
      const next = {
        ...current,
        ...updates,
      };

      setHistory((items) => {
        const truncated =
          historyIndex >= 0
            ? items.slice(
                0,
                historyIndex + 1,
              )
            : items;

        return [
          ...truncated,
          current,
        ].slice(-30);
      });

      setHistoryIndex(
        (index) =>
          Math.min(
            index + 1,
            29,
          ),
      );

      return next;
    });

    setGeneratedIcons([]);
  };

  const undo = () => {
    if (
      historyIndex <
      0
    ) {
      return;
    }

    const previous =
      history[
        historyIndex
      ];

    if (!previous) {
      return;
    }

    setSettings(previous);

    setHistoryIndex(
      (index) => index - 1,
    );

    setGeneratedIcons([]);
  };

  const redo = () => {
    const nextIndex =
      historyIndex + 1;

    if (
      nextIndex >=
      history.length
    ) {
      return;
    }

    const next =
      history[nextIndex];

    if (!next) {
      return;
    }

    setSettings(next);

    setHistoryIndex(
      nextIndex,
    );

    setGeneratedIcons([]);
  };

  const handleFileSelect = (
    file: File,
  ) => {
    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(
        imageUrl,
      );
    }

    const nextUrl =
      URL.createObjectURL(
        file,
      );

    const nextImage =
      new Image();

    nextImage.onload = () => {
      setImage(
        nextImage,
      );

      setOriginalImage(
        nextImage,
      );
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

    setFileName(
      cleanName || "icon",
    );

    setSettings(
      DEFAULT_SETTINGS,
    );

    setHistory([]);
    setHistoryIndex(-1);
    setGeneratedIcons([]);
  };

  const handleRemoveImage =
    () => {
      if (imageUrl) {
        URL.revokeObjectURL(
          imageUrl,
        );
      }

      setImageUrl(null);
      setImage(null);
      setOriginalImage(null);

      setFileName("icon");

      setSourceFormat(
        "image/png",
      );

      setSettings(
        DEFAULT_SETTINGS,
      );

      setHistory([]);
      setHistoryIndex(-1);
      setGeneratedIcons([]);
    };

  const handleRemoveBackground =
    async () => {
      if (!image) {
        return;
      }

      const processed =
        await removeSimpleBackground(
          image,
        );

      setImage(
        processed,
      );

      setGeneratedIcons([]);
    };

  const resetImage = () => {
    if (!originalImage) {
      return;
    }

    setImage(
      originalImage,
    );

    setSettings(
      DEFAULT_SETTINGS,
    );

    setGeneratedIcons([]);
  };

  const rotateLeft = () => {
    updateSettings({
      rotation:
        (settings.rotation -
          90 +
          360) %
        360,
    });
  };

  const rotateRight = () => {
    updateSettings({
      rotation:
        (settings.rotation +
          90) %
        360,
    });
  };

  const generateIcons = () => {
    if (!image) {
      return;
    }

    setIsGenerating(
      true,
    );

    requestAnimationFrame(
      () => {
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

        setIsGenerating(
          false,
        );
      },
    );
  };

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
    }, [
      image,
      settings,
    ]);

  const svgContent =
    useMemo(() => {
      if (!image) {
        return null;
      }

      return createSvgExport(
        image,
        settings,
      );
    }, [
      image,
      settings,
    ]);

  const htmlSnippet =
    useMemo(() => {
      return `<link rel="icon" href="/icons/${fileName}-32x32.png" sizes="32x32">
<link rel="icon" href="/icons/${fileName}-192x192.png" sizes="192x192">
<link rel="icon" href="/icons/${fileName}-512x512.png" sizes="512x512">
<link rel="icon" href="/icons/${fileName}.ico">
<link rel="apple-touch-icon" href="/icons/${fileName}-180x180.png">`;
    }, [fileName]);

  const manifestSnippet =
    useMemo(() => {
      return JSON.stringify(
        {
          name: "Your App",
          short_name:
            "Your App",
          icons: [
            {
              src: `/icons/${fileName}-192x192.png`,
              sizes:
                "192x192",
              type: "image/png",
            },
            {
              src: `/icons/${fileName}-512x512.png`,
              sizes:
                "512x512",
              type: "image/png",
            },
          ],
          display:
            "standalone",
        },
        null,
        2,
      );
    }, [fileName]);

  const handleDownloadIcon = (
    size: number,
  ) => {
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
      `${fileName}-${size}x${size}.png`,
    );
  };

  const handleDownloadSvg =
    () => {
      if (!svgContent) {
        return;
      }

      downloadBlob(
        new Blob(
          [svgContent],
          {
            type: "image/svg+xml",
          },
        ),
        `${fileName}.svg`,
      );
    };

  const handleDownloadIco =
    () => {
      if (
        generatedIcons.length ===
        0
      ) {
        return;
      }

      downloadBlob(
        createIcoFile(
          generatedIcons,
        ),
        `${fileName}.ico`,
      );
    };

  const handleDownloadZip =
    async () => {
      if (
        generatedIcons.length ===
          0 &&
        !svgContent
      ) {
        return;
      }

      const zip =
        new JSZip();

      const folder =
        zip.folder(
          "icons",
        );

      if (!folder) {
        return;
      }

      generatedIcons.forEach(
        (icon) => {
          folder.file(
            `${fileName}-${icon.size}x${icon.size}.png`,
            dataUrlToUint8Array(
              icon.dataUrl,
            ),
          );
        },
      );

      if (svgContent) {
        folder.file(
          `${fileName}.svg`,
          svgContent,
        );
      }

      if (
        generatedIcons.length >
        0
      ) {
        const ico =
          createIcoFile(
            generatedIcons,
          );

        folder.file(
          `${fileName}.ico`,
          new Uint8Array(
            await ico.arrayBuffer(),
          ),
        );
      }

      zip.file(
        "index.html-snippet.txt",
        htmlSnippet,
      );

      zip.file(
        "manifest.json",
        manifestSnippet,
      );

      zip.file(
        "README.txt",
        `Generated with IconToolkit.

Included:
- PNG icon sizes
- SVG icon
- ICO favicon
- HTML favicon snippet
- Web App Manifest
- Apple touch icon

All image processing was performed locally in the browser.
`,
      );

      const blob =
        await zip.generateAsync({
          type: "blob",
        });

      downloadBlob(
        blob,
        `${fileName}-icon-set.zip`,
      );
    };

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(
          imageUrl,
        );
      }
    };
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
              Professional icon editor
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-4xl">
              Create your icon set.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              Crop, transform, style, preview, and export production-ready
              favicons and app icons directly in your browser.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
              {[
                "Browser-based",
                "Crop",
                "Transform",
                "Backgrounds",
                "Border radius",
                "Shadows",
                "PNG",
                "SVG",
                "ICO",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <UploadPanel
              imageUrl={imageUrl}
              fileName={fileName}
              sourceFormat={sourceFormat}
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveImage}
              onRemoveBackground={handleRemoveBackground}
              onResetImage={resetImage}
              disabled={!image}
            />

            <EditorPanel
              settings={settings}
              imageUrl={imageUrl}
              onChange={updateSettings}
              disabled={!image}
              onUndo={undo}
              onRedo={redo}
              canUndo={historyIndex >= 0}
              canRedo={historyIndex < history.length - 1}
              onRotateLeft={rotateLeft}
              onRotateRight={rotateRight}
            />
          </div>

          <div className="min-w-0">
            <PreviewPanel
              imageUrl={previewUrl}
              hasImage={Boolean(image)}
              imageWidth={image?.naturalWidth ?? 0}
              imageHeight={image?.naturalHeight ?? 0}
              settings={settings}
            />
          </div>

          <div>
            <ExportPanel
              fileName={fileName}
              icons={generatedIcons}
              disabled={!image}
              isGenerating={isGenerating}
              svgContent={svgContent}
              htmlSnippet={htmlSnippet}
              manifestSnippet={manifestSnippet}
              onGenerate={generateIcons}
              onDownloadIcon={handleDownloadIcon}
              onDownloadSvg={handleDownloadSvg}
              onDownloadIco={handleDownloadIco}
              onDownloadZip={handleDownloadZip}
            />
          </div>
        </div>

        <div className="mt-8">
          <SizeGrid
            icons={generatedIcons}
            isGenerating={isGenerating}
            onDownload={handleDownloadIcon}
          />
        </div>
      </section>
    </div>
  );
}