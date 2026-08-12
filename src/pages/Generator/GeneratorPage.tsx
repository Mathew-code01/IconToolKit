// src/pages/Generator/GeneratorPage.tsx
// src/pages/Generator/GeneratorPage.tsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";
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

const DEFAULT_SETTINGS: EditorSettings = {
  padding: 10,
  scale: 100,

  backgroundMode:
    "transparent",

  background: "#ffffff",

  gradientFrom:
    "#6366f1",

  gradientTo:
    "#8b5cf6",

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
  return Math.max(
    min,
    Math.min(max, value),
  );
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
    Math.pow(
      a.r - b.r,
      2,
    ) +
      Math.pow(
        a.g - b.g,
        2,
      ) +
      Math.pow(
        a.b - b.b,
        2,
      ),
  );
}

async function removeSimpleBackground(
  image: HTMLImageElement,
): Promise<HTMLImageElement> {
  const width =
    image.naturalWidth;

  const height =
    image.naturalHeight;

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

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

  const imageData =
    context.getImageData(
      0,
      0,
      width,
      height,
    );

  const pixels =
    imageData.data;

  const samplePoints = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];

  const backgroundColors =
    samplePoints.map(
      ([x, y]) => {
        const index =
          (y * width + x) *
          4;

        return {
          r: pixels[index],
          g: pixels[
            index + 1
          ],
          b: pixels[
            index + 2
          ],
        };
      },
    );

  const threshold = 45;

  for (
    let index = 0;
    index <
    pixels.length;
    index += 4
  ) {
    const pixel = {
      r: pixels[index],
      g: pixels[
        index + 1
      ],
      b: pixels[
        index + 2
      ],
    };

    const matches =
      backgroundColors.some(
        (background) =>
          colorDistance(
            pixel,
            background,
          ) <
          threshold,
      );

    if (matches) {
      pixels[
        index + 3
      ] = 0;
    }
  }

  context.putImageData(
    imageData,
    0,
    0,
  );

  return loadImage(
    canvas.toDataURL(
      "image/png",
    ),
  );
}

function loadImage(
  source: string,
): Promise<HTMLImageElement> {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
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

  return {
    x:
      (settings.crop.x /
        100) *
      width,

    y:
      (settings.crop.y /
        100) *
      height,

    width:
      (settings.crop.width /
        100) *
      width,

    height:
      (settings.crop.height /
        100) *
      height,
  };
}

function createRoundedPath(
  context: CanvasRenderingContext2D,
  size: number,
  radius: number,
) {
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

  context.moveTo(
    radius,
    0,
  );

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
  const canvas =
    document.createElement(
      "canvas",
    );

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

  const radius =
    (clamp(
      settings.borderRadius,
      0,
      50,
    ) /
      100) *
    size;

  /*
   * Clip the entire icon surface.
   */
  context.save();

  createRoundedPath(
    context,
    size,
    radius,
  );

  context.clip();

  /*
   * Background.
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

    const length =
      size *
      Math.sqrt(2);

    const center =
      size / 2;

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

  const crop =
    getCropRect(
      image,
      settings,
    );

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
    if (
      sourceRatio > 1
    ) {
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
    if (
      sourceRatio > 1
    ) {
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
    (settings.scale /
      100) *
    (settings.zoom /
      100);

  drawWidth *= scale;
  drawHeight *= scale;

  const offsetX =
    ((settings.positionX -
      50) /
      100) *
    size;

  const offsetY =
    ((settings.positionY -
      50) /
      100) *
    size;

  const centerX =
    size / 2 +
    offsetX;

  const centerY =
    size / 2 +
    offsetY;

  /*
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

  /*
   * Border.
   */
  if (
    settings.borderWidth > 0
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

function dataUrlToUint8Array(
  dataUrl: string,
) {
  const base64 =
    dataUrl.split(",")[1] ??
    "";

  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(
      binary.length,
    );

  for (
    let index = 0;
    index <
    binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(
        index,
      );
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
    16 *
    pngData.length;

  let offset =
    headerSize +
    directorySize;

  const totalSize =
    offset +
    pngData.reduce(
      (
        total,
        item,
      ) =>
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

  let directoryOffset =
    6;

  for (
    const item of pngData
  ) {
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

  for (
    const item of pngData
  ) {
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
  /*
   * This intentionally creates a valid SVG container.
   *
   * Since the editor accepts raster sources and applies
   * raster transformations, embedding the rendered result
   * is more accurate than pretending the output is a
   * mathematically reconstructed vector.
   */
  const png =
    drawIcon(
      image,
      512,
      settings,
    );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <image href="${png}" width="512" height="512" preserveAspectRatio="none"/>
</svg>`;
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

  window.setTimeout(
    () =>
      URL.revokeObjectURL(
        url,
      ),
    1000,
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

  downloadBlob(
    new Blob(
      [bytes],
      {
        type: "image/png",
      },
    ),
    filename,
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

    case 192:
      return "android-chrome-192x192.png";

    case 512:
      return "android-chrome-512x512.png";

    case 180:
      return "apple-touch-icon.png";

    default:
      return `icon-${size}x${size}.png`;
  }
}

function createManifest(
  siteName: string,
  shortName: string,
  description: string,
) {
  return JSON.stringify(
    {
      name: siteName || "My Website",

      short_name: shortName || siteName || "My Website",

      description: description || "",

      start_url: "/",

      scope: "/",

      display: "standalone",

      background_color: "#ffffff",

      theme_color: "#6366f1",

      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  );
}

export default function GeneratorPage() {
  const [siteName, setSiteName] = useState("");

  const [shortName, setShortName] = useState("");

  const [description, setDescription] = useState(
    "Your website, application or progressive web app.",
  );
  const [
    imageUrl,
    setImageUrl,
  ] = useState<
    string | null
  >(null);

  const [
    image,
    setImage,
  ] = useState<
    HTMLImageElement | null
  >(null);

  const [
    originalImage,
    setOriginalImage,
  ] = useState<
    HTMLImageElement | null
  >(null);

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
    setSettings(
      (current) => {
        const next = {
          ...current,
          ...updates,
        };

        setHistory(
          (items) => {
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
          },
        );

        setHistoryIndex(
          (index) =>
            Math.min(
              index + 1,
              29,
            ),
        );

        return next;
      },
    );

    setGeneratedIcons([]);
  };

  const undo = () => {
    if (historyIndex < 0) {
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

    const generatedName = cleanName || "icon";

    setFileName(generatedName);

    const generatedSiteName = generatedName
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

    setSiteName(generatedSiteName);

    setShortName(generatedSiteName.slice(0, 18));

    setDescription("Your website, application or progressive web app.");

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
      setSiteName("");
      setShortName("");
      setDescription("Your website, application or progressive web app.");
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

      setImage(processed);
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

  const generateIcons =
    () => {
      if (!image) {
        return;
      }

      setIsGenerating(true);

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

  const appName =
    fileName
      .replace(
        /[-_]+/g,
        " ",
      )
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase(),
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

  const manifestSnippet = useMemo(
    () =>
      createManifest(
        siteName || appName,

        shortName || siteName || appName,

        description,
      ),
    [siteName, shortName, description, appName],
  );

  const handleDownloadIcon =
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
            type:
              "image/svg+xml",
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
        "favicon.ico",
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

      const iconsFolder =
        publicFolder?.folder(
          "icons",
        );

      if (!publicFolder) {
        return;
      }

      generatedIcons.forEach(
        (icon) => {
          const filename =
            getExportFilename(
              icon.size,
            );

          /*
           * Standard files live directly
           * inside public/.
           */
          if (
            filename ===
              "favicon-16x16.png" ||
            filename ===
              "favicon-32x32.png" ||
            filename ===
              "android-chrome-192x192.png" ||
            filename ===
              "android-chrome-512x512.png" ||
            filename ===
              "apple-touch-icon.png"
          ) {
            publicFolder.file(
              filename,
              dataUrlToUint8Array(
                icon.dataUrl,
              ),
            );

            return;
          }

          iconsFolder?.file(
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
        publicFolder.file(
          "favicon.ico",
          new Uint8Array(
            await createIcoFile(
              generatedIcons,
            ).arrayBuffer(),
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-sm">
              Professional icon studio
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
              Create a production-ready icon system.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              Crop precisely, transform visually, preview in real device
              contexts, and export a complete favicon, PWA and app icon package.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
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
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-medium text-[var(--text-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)_320px] lg:items-start">
          {/* LEFT COLUMN — Upload + Editor */}
          <div className="space-y-6">
            <UploadPanel
              imageUrl={imageUrl}
              fileName={fileName}
              sourceFormat={sourceFormat}
              imageWidth={image?.naturalWidth ?? 0}
              imageHeight={image?.naturalHeight ?? 0}
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

          {/* CENTER COLUMN — Site Identity + Production Preview */}
          <div className="min-w-0 space-y-6">
            {/* Site Identity */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Site identity
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-[var(--text-muted)]">
                  These values are used by browser tabs, PWA installation,
                  mobile shortcuts and app-style previews.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {/* Site name */}
                <div>
                  <label
                    htmlFor="site-name"
                    className="text-[10px] font-semibold text-[var(--text)]"
                  >
                    Site name
                  </label>

                  <input
                    id="site-name"
                    type="text"
                    value={siteName}
                    onChange={(event) => setSiteName(event.target.value)}
                    placeholder="My Website"
                    maxLength={60}
                    className="mt-1.5 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-xs text-[var(--text)] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
                  />

                  <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                    Full application/site name.
                  </p>
                </div>

                {/* Short name */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="short-name"
                      className="text-[10px] font-semibold text-[var(--text)]"
                    >
                      Short name
                    </label>

                    <span className="text-[9px] text-[var(--text-muted)]">
                      {shortName.length}/18
                    </span>
                  </div>

                  <input
                    id="short-name"
                    type="text"
                    value={shortName}
                    onChange={(event) =>
                      setShortName(event.target.value.slice(0, 18))
                    }
                    placeholder="My Website"
                    maxLength={18}
                    className="mt-1.5 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-xs text-[var(--text)] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
                  />

                  <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                    Used where space is limited, such as installed shortcuts.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="site-description"
                      className="text-[10px] font-semibold text-[var(--text)]"
                    >
                      Description
                    </label>

                    <span className="text-[9px] text-[var(--text-muted)]">
                      {description.length}/160
                    </span>
                  </div>

                  <textarea
                    id="site-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value.slice(0, 160))
                    }
                    rows={3}
                    placeholder="Describe your website or application..."
                    className="mt-1.5 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs leading-5 text-[var(--text)] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
                  />

                  <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                    Used by the PWA and installed-app preview.
                  </p>
                </div>
              </div>
            </div>

            {/* Production Preview */}
            <div className="min-w-0">
              <PreviewPanel
                imageUrl={previewUrl}
                hasImage={Boolean(image)}
                imageWidth={image?.naturalWidth ?? 0}
                imageHeight={image?.naturalHeight ?? 0}
                settings={settings}
                siteName={siteName}
                shortName={shortName}
                description={description}
              />
            </div>
          </div>

          {/* RIGHT COLUMN — Export */}
          <div className="min-w-0">
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

        {/* Generated Sizes */}
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