// src/pages/Convert/convertEngine.ts
// src/pages/Convert/convertEngine.ts

import type {
  ConvertFile,
  ConvertFormat,
  ConvertSettingsState,
  ConversionResult,
} from "./ConvertTypes";

import {
  getExtension,
  getMimeType,
} from "./ConvertToolRegistry";

import {
  throwIfAborted,
} from "./ConvertErrors";

import * as pdfjsLib from "pdfjs-dist";

import {
  PDFDocument,
} from "pdf-lib";

import { decodeIco as decodeIcoFile, encodeIco } from "icojs";

import * as UTIF from "utif";

import {
  parseGIF,
  decompressFrames,
} from "gifuct-js";

import ExifReader from "exifreader";

import JSZip from "jszip";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const PDF_WASM_URL = new URL(
  "pdfjs-dist/wasm/",
  import.meta.url,
).toString();

export interface ConversionProgress {
  progress: number;
  stage?: string;
}

export interface ConversionOptions {
  signal?: AbortSignal;
}

export interface ImageFrame {
  canvas: HTMLCanvasElement;
  delay?: number;
}

export interface DecodedImage {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  frames?: ImageFrame[];
  animated?: boolean;
}

export interface ConversionPreviewResult {
  blob: Blob;

  width: number | null;
  height: number | null;

  size: number;

  previewUrl: string | null;

  fileName: string;
}

export async function previewConversion(
  item: ConvertFile,
  settings: ConvertSettingsState,
  options?: ConversionOptions,
): Promise<ConversionPreviewResult> {
  const signal = options?.signal;

  throwIfAborted(signal);

  if (item.sourceFormat === "pdf") {
    return previewPdfConversion(item, settings, signal);
  }

  return previewImageConversion(item, settings, signal);
}

const DEFAULT_ICO_SIZES = [
  16,
  24,
  32,
  48,
  64,
  128,
  256,
];

const MAX_CANVAS_PIXELS = 268_000_000;

function checkCanvasSize(
  width: number,
  height: number,
): void {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error("The image has invalid dimensions.");
  }

  const pixels = width * height;

  if (pixels > MAX_CANVAS_PIXELS) {
    throw new Error(
      `This image is too large to process safely (${Math.round(
        pixels / 1_000_000,
      )} megapixels).`,
    );
  }
}

function getFileExtension(file: File): string {
  const match = file.name.toLowerCase().match(/\.([a-z0-9]+)$/);

  return match?.[1] ?? "";
}

function sanitizeFilename(name: string): string {
  let result = name.replace(/[<>:"/\\|?*]/g, "");

  result = Array.from(result)
    .filter((character) => character.charCodeAt(0) >= 32)
    .join("");

  return result.trim().replace(/\.+$/g, "") || "converted";
}

function makeOutputName(
  file: File,
  format: ConvertFormat,
  settings: ConvertSettingsState,
): string {
  const original = file.name.replace(/\.[^/.]+$/, "");

  const base =
    settings.fileNameMode === "custom" &&
    settings.customFileName.trim()
      ? settings.customFileName.trim()
      : original;

  const safeBase = sanitizeFilename(base);

  const suffix = settings.suffix.trim();

  return `${safeBase}${suffix}.${getExtension(format)}`;
}

function createCanvas(
  width: number,
  height: number,
): HTMLCanvasElement {
  checkCanvasSize(width, height);

  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  return canvas;
}

function loadImage(
  source: string | Blob,
  signal?: AbortSignal,
): Promise<HTMLImageElement> {
  throwIfAborted(signal);

  return new Promise((resolve, reject) => {
    const objectUrl =
      typeof source === "string"
        ? null
        : URL.createObjectURL(source);

    const image = new Image();

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };

    image.onload = () => {
      cleanup();

      try {
        throwIfAborted(signal);
        resolve(image);
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      cleanup();

      reject(
        new Error(
          "The browser could not decode this image.",
        ),
      );
    };

    image.src = typeof source === "string" ? source : objectUrl!;
  });
}

async function getExifOrientation(
  file: File,
): Promise<number> {
  try {
    const tags = await ExifReader.load(file);

    const orientation = tags.Orientation;

    if (
      orientation &&
      typeof orientation.value === "number"
    ) {
      return orientation.value;
    }
  } catch {
    // EXIF is optional.
  }

  return 1;
}

function orientationDimensions(
  width: number,
  height: number,
  orientation: number,
): {
  width: number;
  height: number;
} {
  if (
    orientation >= 5 &&
    orientation <= 8
  ) {
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

function applyOrientation(
  context: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number,
): void {
  switch (orientation) {
    case 2:
      context.translate(width, 0);
      context.scale(-1, 1);
      break;

    case 3:
      context.translate(width, height);
      context.rotate(Math.PI);
      break;

    case 4:
      context.translate(0, height);
      context.scale(1, -1);
      break;

    case 5:
      context.rotate(0.5 * Math.PI);
      context.scale(1, -1);
      break;

    case 6:
      context.rotate(0.5 * Math.PI);
      context.translate(0, -height);
      break;

    case 7:
      context.rotate(0.5 * Math.PI);
      context.translate(width, -height);
      context.scale(-1, 1);
      break;

    case 8:
      context.rotate(-0.5 * Math.PI);
      context.translate(-width, 0);
      break;

    default:
      break;
  }
}

async function decodeRasterImage(
  file: File,
  signal?: AbortSignal,
): Promise<DecodedImage> {
  throwIfAborted(signal);

  const image = await loadImage(file, signal);

  const orientation =
    await getExifOrientation(file);

  const oriented =
    orientationDimensions(
      image.naturalWidth,
      image.naturalHeight,
      orientation,
    );

  const canvas = createCanvas(
    oriented.width,
    oriented.height,
  );

  const context = canvas.getContext("2d", {
    alpha: true,
  });

  if (!context) {
    throw new Error(
      "Canvas rendering is not supported.",
    );
  }

  applyOrientation(
    context,
    orientation,
    image.naturalWidth,
    image.naturalHeight,
  );

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  return {
    canvas,
    width: canvas.width,
    height: canvas.height,
  };
}

async function decodeSvg(
  file: File,
  signal?: AbortSignal,
): Promise<DecodedImage> {
  throwIfAborted(signal);

  const svgText = await file.text();

  throwIfAborted(signal);

  const blob = new Blob(
    [svgText],
    {
      type: "image/svg+xml;charset=utf-8",
    },
  );

  const image = await loadImage(
    blob,
    signal,
  );

  const width =
    image.naturalWidth || 1024;

  const height =
    image.naturalHeight || 1024;

  const canvas = createCanvas(
    width,
    height,
  );

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas rendering is not supported.",
    );
  }

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  );

  return {
    canvas,
    width,
    height,
  };
}

async function decodeTiff(
  file: File,
  signal?: AbortSignal,
): Promise<DecodedImage> {
  throwIfAborted(signal);

  const buffer =
    await file.arrayBuffer();

  throwIfAborted(signal);

  const ifds = UTIF.decode(buffer);

  if (!ifds.length) {
    throw new Error(
      "The TIFF file contains no readable image pages.",
    );
  }

  const first = ifds[0];

  UTIF.decodeImage(
    buffer,
    first,
  );

  const rgba =
    UTIF.toRGBA8(first);

  const width =
    Number(first.width);

  const height =
    Number(first.height);

  checkCanvasSize(
    width,
    height,
  );

  const canvas =
    createCanvas(width, height);

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas rendering is not supported.",
    );
  }

  const imageData =
    new ImageData(
      new Uint8ClampedArray(rgba),
      width,
      height,
    );

  context.putImageData(
    imageData,
    0,
    0,
  );

  return {
    canvas,
    width,
    height,
  };
}

async function decodeGif(
  file: File,
  signal?: AbortSignal,
): Promise<DecodedImage> {
  throwIfAborted(signal);

  const buffer =
    await file.arrayBuffer();

  throwIfAborted(signal);

  const gif =
    parseGIF(buffer);

  const frames =
    decompressFrames(
      gif,
      true,
    );

  if (!frames.length) {
    throw new Error(
      "The GIF contains no frames.",
    );
  }

  const width =
    gif.lsd.width;

  const height =
    gif.lsd.height;

  checkCanvasSize(
    width,
    height,
  );

  const canvas =
    createCanvas(width, height);

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Canvas rendering is not supported.",
    );
  }

  const frameCanvases: ImageFrame[] = [];

  for (
    let index = 0;
    index < frames.length;
    index += 1
  ) {
    throwIfAborted(signal);

    const frame = frames[index];

    const frameCanvas =
      createCanvas(
        width,
        height,
      );

    const frameContext =
      frameCanvas.getContext("2d");

    if (!frameContext) {
      throw new Error(
        "Could not create GIF frame canvas.",
      );
    }

    const imageData =
      frameContext.createImageData(
        frame.dims.width,
        frame.dims.height,
      );

    imageData.data.set(
      frame.patch,
    );

    frameContext.putImageData(
      imageData,
      frame.dims.left,
      frame.dims.top,
    );

    frameCanvases.push({
      canvas: frameCanvas,
      delay: frame.delay,
    });
  }

  const firstFrame =
    frameCanvases[0];

  context.drawImage(
    firstFrame.canvas,
    0,
    0,
  );

  return {
    canvas,
    width,
    height,
    frames: frameCanvases,
    animated: frameCanvases.length > 1,
  };
}

async function decodeIcoImage(
  file: File,
  signal?: AbortSignal,
): Promise<DecodedImage> {
  throwIfAborted(signal);

  const buffer = await file.arrayBuffer();

  const icons = await decodeIcoFile(buffer, "image/png");

  if (!icons.length) {
    throw new Error("The ICO file contains no readable images.");
  }

  const largest = [...icons].sort(
    (a, b) => b.width * b.height - a.width * a.height,
  )[0];

  const blob = new Blob([largest.buffer], {
    type: "image/png",
  });

  const image = await loadImage(blob, signal);

  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas rendering is not supported.");
  }

  context.drawImage(image, 0, 0);

  return {
    canvas,
    width: canvas.width,
    height: canvas.height,
  };
}

async function decodeImage(
  file: File,
  signal?: AbortSignal,
): Promise<DecodedImage> {
  const extension =
    getFileExtension(file);

  if (extension === "svg" || file.type === "image/svg+xml") {
    return decodeSvg(file, signal);
  }

  if (
    extension === "tif" ||
    extension === "tiff" ||
    file.type === "image/tiff"
  ) {
    return decodeTiff(
      file,
      signal,
    );
  }

  if (
    extension === "gif" ||
    file.type === "image/gif"
  ) {
    return decodeGif(
      file,
      signal,
    );
  }

  if (
    extension === "ico" ||
    file.type === "image/x-icon" ||
    file.type === "image/vnd.microsoft.icon"
  ) {
    return decodeIcoImage(file, signal);
  }

  return decodeRasterImage(
    file,
    signal,
  );
}

function getCanvasDimensions(
  width: number,
  height: number,
  settings: ConvertSettingsState,
): {
  width: number;
  height: number;
} {
  if (!settings.resizeEnabled) {
    return {
      width,
      height,
    };
  }

  let targetWidth =
    settings.width || width;

  let targetHeight =
    settings.height || height;

  if (
    settings.keepAspectRatio &&
    width > 0 &&
    height > 0
  ) {
    const ratio =
      width / height;

    if (
      settings.width &&
      !settings.height
    ) {
      targetWidth =
        settings.width;

      targetHeight =
        Math.round(
          targetWidth / ratio,
        );
    } else if (
      settings.height &&
      !settings.width
    ) {
      targetHeight =
        settings.height;

      targetWidth =
        Math.round(
          targetHeight * ratio,
        );
    } else if (
      settings.width &&
      settings.height
    ) {
      const scale =
        Math.min(
          settings.width / width,
          settings.height / height,
        );

      targetWidth =
        Math.round(
          width * scale,
        );

      targetHeight =
        Math.round(
          height * scale,
        );
    }
  }

  return {
    width: Math.max(
      1,
      Math.round(targetWidth),
    ),
    height: Math.max(
      1,
      Math.round(targetHeight),
    ),
  };
}

function drawToCanvas(
  source: HTMLCanvasElement,
  settings: ConvertSettingsState,
): HTMLCanvasElement {
  const dimensions =
    getCanvasDimensions(
      source.width,
      source.height,
      settings,
    );

  const canvas =
    createCanvas(
      dimensions.width,
      dimensions.height,
    );

  const context =
    canvas.getContext("2d", {
      alpha: true,
    });

  if (!context) {
    throw new Error(
      "Canvas rendering is not supported.",
    );
  }

  const needsBackground =
    !settings.preserveTransparency ||
    settings.outputFormat === "jpg";

  if (
    settings.backgroundEnabled ||
    needsBackground
  ) {
    context.fillStyle =
      settings.backgroundColor;

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    source,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ConvertFormat,
  quality: number,
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      const mime =
        getMimeType(format);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                `The browser could not encode ${format.toUpperCase()}.`,
              ),
            );

            return;
          }

          if (
            format === "avif" &&
            blob.type !== "image/avif"
          ) {
            reject(
              new Error(
                "AVIF encoding is not supported by this browser.",
              ),
            );

            return;
          }

          resolve(blob);
        },
        mime,
        quality / 100,
      );
    },
  );
}

export async function supportsImageEncoding(
  mime: string,
): Promise<boolean> {
  const canvas =
    document.createElement("canvas");

  canvas.width = 1;
  canvas.height = 1;

  try {
    const dataUrl =
      canvas.toDataURL(mime);

    return dataUrl.startsWith(
      `data:${mime}`,
    );
  } catch {
    return false;
  }
}

export async function getFormatCapabilities() {
  return {
    webp: await supportsImageEncoding(
      "image/webp",
    ),
    avif: await supportsImageEncoding(
      "image/avif",
    ),
    jpeg: await supportsImageEncoding(
      "image/jpeg",
    ),
    png: await supportsImageEncoding(
      "image/png",
    ),
  };
}

async function createIco(
  source: HTMLCanvasElement,
  sizes: number[],
  signal?: AbortSignal,
): Promise<Blob> {
  const uniqueSizes =
    [
      ...new Set(
        sizes.length
          ? sizes
          : DEFAULT_ICO_SIZES,
      ),
    ]
      .filter(
        (size) =>
          size >= 16 &&
          size <= 256,
      )
      .sort(
        (a, b) => a - b,
      );

  if (!uniqueSizes.length) {
    throw new Error(
      "Select at least one ICO size.",
    );
  }

  const images: {
    buffer: ArrayBuffer;
    width: number;
    height: number;
  }[] = [];

  for (
    let index = 0;
    index < uniqueSizes.length;
    index += 1
  ) {
    throwIfAborted(signal);

    const size =
      uniqueSizes[index];

    const canvas =
      createCanvas(
        size,
        size,
      );

    const context =
      canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Could not create ICO canvas.",
      );
    }

    context.clearRect(
      0,
      0,
      size,
      size,
    );

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const scale =
      Math.min(
        size / source.width,
        size / source.height,
      );

    const width =
      source.width * scale;

    const height =
      source.height * scale;

    const x =
      (size - width) / 2;

    const y =
      (size - height) / 2;

    context.drawImage(
      source,
      x,
      y,
      width,
      height,
    );

    const blob =
      await new Promise<Blob>(
        (resolve, reject) => {
          canvas.toBlob(
            (result) => {
              if (!result) {
                reject(
                  new Error(
                    "Could not encode ICO image.",
                  ),
                );

                return;
              }

              resolve(result);
            },
            "image/png",
          );
        },
      );

    images.push({
      buffer:
        await blob.arrayBuffer(),
      width: size,
      height: size,
    });
  }

  const icoBuffer =
    await encodeIco(
      images,
    );

    

  const safeBuffer = new Uint8Array(icoBuffer);

  return new Blob([safeBuffer], {
    type: "image/x-icon",
  });
}

async function renderPdfPages(
  file: File,
  signal?: AbortSignal,
  onProgress?: (
    progress: ConversionProgress,
  ) => void,
): Promise<HTMLCanvasElement[]> {
  throwIfAborted(signal);

  const data =
    new Uint8Array(
      await file.arrayBuffer(),
    );

  throwIfAborted(signal);

  const loadingTask =
    pdfjsLib.getDocument({
      data,
      wasmUrl: PDF_WASM_URL,
    });

  if (signal) {
    signal.addEventListener(
      "abort",
      () => {
        void loadingTask.destroy();
      },
      { once: true },
    );
  }

  const pdf =
    await loadingTask.promise;

  const pages: HTMLCanvasElement[] = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber += 1
  ) {
    throwIfAborted(signal);

    const page =
      await pdf.getPage(
        pageNumber,
      );

    const viewport =
      page.getViewport({
        scale: 2,
      });

    const canvas =
      createCanvas(
        viewport.width,
        viewport.height,
      );

    const context =
      canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Could not create PDF render canvas.",
      );
    }

    await page.render({
      canvasContext: context,
      canvas,
      viewport,
    }).promise;

    pages.push(canvas);

    onProgress?.({
      progress:
        10 +
        Math.round(
          (pageNumber /
            pdf.numPages) *
            80,
        ),
      stage: `Rendering PDF page ${pageNumber} of ${pdf.numPages}`,
    });
  }

  await loadingTask.destroy();

  return pages;
}

async function createMultiPagePdf(
  canvases: HTMLCanvasElement[],
  settings: ConvertSettingsState,
  signal?: AbortSignal,
): Promise<Blob> {
  if (!canvases.length) {
    throw new Error(
      "There are no pages to add to the PDF.",
    );
  }

  const pdfDoc =
    await PDFDocument.create();

  for (
    let index = 0;
    index < canvases.length;
    index += 1
  ) {
    throwIfAborted(signal);

    const canvas =
      canvases[index];

    const jpegBlob =
      await canvasToBlob(
        canvas,
        "jpg",
        settings.quality,
      );

    const jpegBytes =
      new Uint8Array(
        await jpegBlob.arrayBuffer(),
      );

    const image =
      await pdfDoc.embedJpg(
        jpegBytes,
      );

    let pageWidth =
      canvas.width;

    let pageHeight =
      canvas.height;

    if (
      settings.pdfPageSize ===
      "a4"
    ) {
      pageWidth = 595.28;
      pageHeight = 841.89;
    } else if (
      settings.pdfPageSize ===
      "letter"
    ) {
      pageWidth = 612;
      pageHeight = 792;
    } else if (
      settings.pdfPageSize ===
      "square"
    ) {
      const side =
        Math.max(
          canvas.width,
          canvas.height,
        );

      pageWidth = side;
      pageHeight = side;
    }

    if (
      settings.pdfOrientation ===
      "landscape"
    ) {
      [
        pageWidth,
        pageHeight,
      ] = [
        pageHeight,
        pageWidth,
      ];
    }

    const scale =
      Math.min(
        pageWidth / canvas.width,
        pageHeight / canvas.height,
      );

    const drawWidth =
      canvas.width * scale;

    const drawHeight =
      canvas.height * scale;

    const x =
      (pageWidth -
        drawWidth) /
      2;

    const y =
      (pageHeight -
        drawHeight) /
      2;

    const page =
      pdfDoc.addPage([
        pageWidth,
        pageHeight,
      ]);

    page.drawImage(
      image,
      {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      },
    );
  }

  const pdfBytes = await pdfDoc.save();

  const safeBuffer = new Uint8Array(pdfBytes);

  return new Blob([safeBuffer], {
    type: "application/pdf",
  });
}

interface PdfImageConversionResult {
  blob: Blob;
  isArchive: boolean;
}

async function convertPdfToImages(
  file: File,
  settings: ConvertSettingsState,
  signal?: AbortSignal,
  onProgress?: (progress: ConversionProgress) => void,
): Promise<PdfImageConversionResult> {
  const pages = await renderPdfPages(file, signal, onProgress);

  if (!pages.length) {
    throw new Error("The PDF contains no renderable pages.");
  }

  const extension = getExtension(settings.outputFormat);

  const successful: {
    name: string;
    blob: Blob;
  }[] = [];

  for (let index = 0; index < pages.length; index += 1) {
    throwIfAborted(signal);

    const output = await canvasToBlob(
      pages[index],
      settings.outputFormat,
      settings.quality,
    );

    successful.push({
      name: `page-${String(index + 1).padStart(3, "0")}.${extension}`,

      blob: output,
    });

    onProgress?.({
      progress: 90 + Math.round(((index + 1) / pages.length) * 10),

      stage: `Encoding page ${index + 1} of ${pages.length}`,
    });
  }

  if (successful.length === 1) {
    return {
      blob: successful[0].blob,
      isArchive: false,
    };
  }

  const zip = new JSZip();

  successful.forEach((item) => {
    zip.file(item.name, item.blob);
  });

  const archive = await zip.generateAsync({
    type: "blob",

    compression: "DEFLATE",

    compressionOptions: {
      level: 6,
    },
  });

  return {
    blob: archive,
    isArchive: true,
  };
}

async function convertImage(
  file: File,
  settings: ConvertSettingsState,
  signal?: AbortSignal,
  onProgress?: (
    progress: ConversionProgress,
  ) => void,
): Promise<Blob> {
  throwIfAborted(signal);

  onProgress?.({
    progress: 5,
    stage: "Decoding source",
  });

  const decoded =
    await decodeImage(
      file,
      signal,
    );

  throwIfAborted(signal);

  onProgress?.({
    progress: 30,
    stage: decoded.animated
      ? "Processing animated image"
      : "Preparing image",
  });

  if (
    settings.outputFormat ===
    "ico"
  ) {
    const blob =
      await createIco(
        decoded.canvas,
        settings.icoSizes,
        signal,
      );

    onProgress?.({
      progress: 100,
      stage: "ICO created",
    });

    return blob;
  }

  /*
   * GIF animation cannot be preserved by
   * normal canvas image encoders.
   *
   * We intentionally use the first frame
   * for raster output.
   */
  const canvas =
    drawToCanvas(
      decoded.canvas,
      settings,
    );

  onProgress?.({
    progress: 60,
    stage: "Encoding output",
  });

  const blob =
    await canvasToBlob(
      canvas,
      settings.outputFormat,
      settings.quality,
    );

  onProgress?.({
    progress: 100,
    stage: "Complete",
  });

  return blob;
}

async function previewImageConversion(
  item: ConvertFile,
  settings: ConvertSettingsState,
  signal?: AbortSignal,
): Promise<ConversionPreviewResult> {
  throwIfAborted(signal);

  const decoded = await decodeImage(item.file, signal);

  throwIfAborted(signal);

  /*
   * ICO is special because the generated file is a
   * multi-size container. For the visual preview,
   * use the decoded source canvas.
   */
  if (settings.outputFormat === "ico") {
    const blob = await createIco(decoded.canvas, settings.icoSizes, signal);

    throwIfAborted(signal);

    return {
      blob,

      width: decoded.canvas.width,

      height: decoded.canvas.height,

      size: blob.size,

      previewUrl: URL.createObjectURL(
        decoded.canvas ? await canvasToBlob(decoded.canvas, "png", 100) : blob,
      ),

      fileName: makeOutputName(item.file, settings.outputFormat, settings),
    };
  }

  const previewCanvas = drawToCanvas(decoded.canvas, settings);

  throwIfAborted(signal);

  const blob = await canvasToBlob(
    previewCanvas,
    settings.outputFormat,
    settings.quality,
  );

  throwIfAborted(signal);

  return {
    blob,

    width: previewCanvas.width,

    height: previewCanvas.height,

    size: blob.size,

    previewUrl: URL.createObjectURL(blob),

    fileName: makeOutputName(item.file, settings.outputFormat, settings),
  };
}

async function previewPdfConversion(
  item: ConvertFile,
  settings: ConvertSettingsState,
  signal?: AbortSignal,
): Promise<ConversionPreviewResult> {
  throwIfAborted(signal);

  if (settings.outputFormat === "pdf") {
    return {
      blob: item.file,

      width: null,
      height: null,

      size: item.file.size,

      previewUrl: item.previewUrl,

      fileName: makeOutputName(item.file, settings.outputFormat, settings),
    };
  }

  const pages = await renderPdfPages(item.file, signal);

  if (!pages.length) {
    throw new Error("The PDF contains no renderable pages.");
  }

  const firstPage = pages[0];

  const previewCanvas = drawToCanvas(firstPage, settings);

  const blob = await canvasToBlob(
    previewCanvas,
    settings.outputFormat,
    settings.quality,
  );

  return {
    blob,

    width: previewCanvas.width,

    height: previewCanvas.height,

    size: blob.size,

    previewUrl: URL.createObjectURL(blob),

    fileName: makeOutputName(item.file, settings.outputFormat, settings),
  };
}

export async function convertFile(
  item: ConvertFile,
  settings: ConvertSettingsState,
  onProgress?: (
    progress: ConversionProgress,
  ) => void,
  options?: ConversionOptions,
): Promise<ConversionResult> {
  const signal =
    options?.signal;

  throwIfAborted(signal);

  if (!item.sourceFormat) {
    throw new Error(
      "The source format could not be detected.",
    );
  }

  const sourceFormat =
    item.sourceFormat;

  let blob: Blob;
let outputFileName: string | null = null;

  /*
   * PDF → image
   */
 if (sourceFormat === "pdf") {
   if (settings.outputFormat === "pdf") {
     throw new Error("The source and output formats are both PDF.");
   }

   const pdfResult = await convertPdfToImages(
     item.file,
     settings,
     signal,
     onProgress,
   );

   blob = pdfResult.blob;

   if (pdfResult.isArchive) {
     const original = item.file.name.replace(/\.[^/.]+$/, "");

     outputFileName = `${original}${settings.suffix}.zip`;
   }
 } else if (settings.outputFormat === "pdf") {
   /*
    * Image → multi-page PDF.
    *
    * A GIF animation becomes one page per
    * decoded frame in a future animation-aware
    * PDF workflow; the current conversion
    * preserves the first frame.
    */
   const decoded = await decodeImage(item.file, signal);

   blob = await createMultiPagePdf([decoded.canvas], settings, signal);

   onProgress?.({
     progress: 100,
     stage: "PDF created",
   });
 } else {
   blob = await convertImage(item.file, settings, signal, onProgress);
 }

  throwIfAborted(signal);

  const fileName =
    outputFileName ??
    makeOutputName(item.file, settings.outputFormat, settings);

  return {
    blob,
    fileName,
    format:
      settings.outputFormat,
    width:
      item.width ?? null,
    height:
      item.height ?? null,
    size: blob.size,
    downloadUrl:
      URL.createObjectURL(blob),
  };
}

export async function getFileDimensions(
  file: File,
): Promise<{
  width: number | null;
  height: number | null;
}> {
  try {
    const extension =
      getFileExtension(file);

    if (
      extension === "pdf" ||
      file.type ===
        "application/pdf"
    ) {
      const buffer =
        new Uint8Array(
          await file.arrayBuffer(),
        );

      const loadingTask =
        pdfjsLib.getDocument({
          data: buffer,
          wasmUrl:
            PDF_WASM_URL,
        });

      const pdf =
        await loadingTask.promise;

      if (!pdf.numPages) {
        await loadingTask.destroy();

        return {
          width: null,
          height: null,
        };
      }

      const page =
        await pdf.getPage(1);

      const viewport =
        page.getViewport({
          scale: 1,
        });

      await loadingTask.destroy();

      return {
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
      };
    }

    const decoded =
      await decodeImage(file);

    return {
      width:
        decoded.width,
      height:
        decoded.height,
    };
  } catch {
    return {
      width: null,
      height: null,
    };
  }
}

export async function estimateOutputSize(
  file: File,
  settings: ConvertSettingsState,
): Promise<number | null> {
  try {
    if (settings.outputFormat === "ico") {
      const decoded = await decodeImage(file);

      const sizes = settings.icoSizes.length
        ? settings.icoSizes
        : DEFAULT_ICO_SIZES;

      const uniqueSizes = [...new Set(sizes)]
        .filter((size) => size >= 16 && size <= 256)
        .sort((a, b) => a - b);

      if (!uniqueSizes.length) {
        return null;
      }

      let total = 0;

      for (const size of uniqueSizes) {
        const previewCanvas = createCanvas(size, size);

        const context = previewCanvas.getContext("2d");

        if (!context) {
          return null;
        }

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const scale = Math.min(size / decoded.width, size / decoded.height);

        const width = decoded.width * scale;

        const height = decoded.height * scale;

        context.drawImage(
          decoded.canvas,
          (size - width) / 2,
          (size - height) / 2,
          width,
          height,
        );

        const blob = await new Promise<Blob | null>((resolve) => {
          previewCanvas.toBlob(resolve, "image/png");
        });

        if (blob) {
          total += blob.size;
        }
      }

      return total || null;
    }

    const decoded = await decodeImage(file);

    const canvas = drawToCanvas(decoded.canvas, settings);

    const preview = await canvasToBlob(
      canvas,
      settings.outputFormat,
      settings.quality,
    );

    return preview.size;
  } catch {
    return null;
  }
}

export async function extractIcoImages(
  file: File,
): Promise<
  {
    width: number;
    height: number;
    bpp: number;
    blob: Blob;
    downloadUrl: string;
  }[]
> {
  const buffer =
    await file.arrayBuffer();

  const icons = await decodeIcoFile(buffer, "image/png");

  return icons.map(
    (icon) => {
      const safeBuffer = new Uint8Array(icon.buffer);

      const blob = new Blob([safeBuffer], {
        type: "image/png",
      });
      return {
        width: icon.width,
        height: icon.height,
        bpp: icon.bpp,
        blob,
        downloadUrl:
          URL.createObjectURL(
            blob,
          ),
      };
    },
  );
}