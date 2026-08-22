// src/pages/Convert/convertEngine.ts
// src/pages/Convert/convertEngine.ts

import type {
  ConvertFile,
  ConvertFormat,
  ConvertSettingsState,
  ConversionResult,
} from "./ConvertTypes";

import * as mammoth from "mammoth";

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

const PDF_WASM_URL = "/pdfjs/wasm/";

/**
 * PDF preview rendering is intentionally separated from
 * conversion rendering.
 *
 * Conversion should preserve every page at the best practical
 * quality, while the UI preview should stay lightweight enough
 * for large PDFs.
 */
const PDF_PREVIEW_MAX_WIDTH = 900;

/**
 * Maximum number of pages that will be placed into the visual
 * preview sheet.
 *
 * The actual conversion is NOT limited by this value.
 *
 * This only protects the browser UI from creating a gigantic
 * preview image for very large PDFs.
 */
const PDF_PREVIEW_MAX_PAGES = 50;

/**
 * Space between rendered pages in the preview sheet.
 */
const PDF_PREVIEW_PAGE_GAP = 24;

/**
 * Outer padding around the preview sheet.
 */
const PDF_PREVIEW_PADDING = 24;

/**
 * Background used between PDF pages.
 */
const PDF_PREVIEW_BACKGROUND = "#e5e7eb";

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

  /**
   * Number of pages represented by the preview.
   *
   * For normal images this is 1.
   * For multi-page PDF previews this is the PDF page count.
   */
  pageCount?: number;

  /**
   * True when the preview represents multiple pages.
   */
  isMultiPage?: boolean;

  fileName: string;
}

async function extractDocxText(
  file: File,
  signal?: AbortSignal,
): Promise<string> {
  throwIfAborted(signal);

  const arrayBuffer = await file.arrayBuffer();

  throwIfAborted(signal);

  const result = await mammoth.extractRawText({
    arrayBuffer,
  });

  throwIfAborted(signal);

  return result.value;
}

async function previewWordConversion(
  item: ConvertFile,
  settings: ConvertSettingsState,
  signal?: AbortSignal,
): Promise<ConversionPreviewResult> {
  throwIfAborted(signal);

  if (item.sourceFormat === "doc") {
    throw new Error(
      "Legacy DOC files are not supported by the browser-only Word converter yet.",
    );
  }

  if (item.sourceFormat !== "docx") {
    throw new Error("This Word preview requires a DOCX file.");
  }

  if (settings.outputFormat === "docx") {
    return {
      blob: item.file,
      width: null,
      height: null,
      size: item.file.size,
      previewUrl: null,
      fileName: makeOutputName(item.file, settings.outputFormat, settings),
    };
  }

  if (settings.outputFormat === "txt") {
    const text = await extractDocxText(item.file, signal);

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const previewBlob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    return {
      blob,
      width: null,
      height: null,
      size: blob.size,
      previewUrl: URL.createObjectURL(previewBlob),
      fileName: makeOutputName(item.file, settings.outputFormat, settings),
    };
  }

  const htmlResult = await mammoth.convertToHtml({
    arrayBuffer: await item.file.arrayBuffer(),
  });

  throwIfAborted(signal);

  const html = `
    <article
      style="
        box-sizing:border-box;
        width:794px;
        min-height:1123px;
        padding:64px;
        background:white;
        color:#111;
        font-family:Arial, Helvetica, sans-serif;
        font-size:14px;
        line-height:1.55;
      "
    >
      ${htmlResult.value}
    </article>
  `;

  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });

  return {
    blob,
    width: 794,
    height: 1123,
    size: blob.size,
    previewUrl: URL.createObjectURL(blob),
    fileName: makeOutputName(item.file, settings.outputFormat, settings),
  };
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
  onProgress?: (progress: ConversionProgress) => void,
  options?: {
    maxPages?: number;
    scale?: number;
  },
): Promise<HTMLCanvasElement[]> {
  throwIfAborted(signal);

  const data = new Uint8Array(await file.arrayBuffer());

  throwIfAborted(signal);

  const loadingTask = pdfjsLib.getDocument({
    data,
    wasmUrl: PDF_WASM_URL,
  });

  let abortHandler: (() => void) | null = null;

  if (signal) {
    abortHandler = () => {
      void loadingTask.destroy();
    };

    signal.addEventListener("abort", abortHandler, { once: true });
  }

  try {
    const pdf = await loadingTask.promise;

    const maxPages = options?.maxPages ?? pdf.numPages;

    const pageCount = Math.min(pdf.numPages, Math.max(1, maxPages));

    const scale = options?.scale ?? 2;

    const pages: HTMLCanvasElement[] = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      throwIfAborted(signal);

      const page = await pdf.getPage(pageNumber);

      let viewport = page.getViewport({
        scale,
      });

      /*
       * Protect preview rendering from enormous PDF pages.
       *
       * The normal conversion path can still use its
       * requested scale. This limit is mainly useful when
       * previewing PDFs with unusually large page sizes.
       */
      if (viewport.width > 4000) {
        const safeScale = scale * (4000 / viewport.width);

        viewport = page.getViewport({
          scale: safeScale,
        });
      }

      const canvas = createCanvas(viewport.width, viewport.height);

      const context = canvas.getContext("2d", {
        alpha: false,
      });

      if (!context) {
        throw new Error("Could not create PDF render canvas.");
      }

      context.fillStyle = "#ffffff";

      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        canvas,
        viewport,
      }).promise;

      pages.push(canvas);

      onProgress?.({
        progress: 10 + Math.round((pageNumber / pdf.numPages) * 80),

        stage: `Rendering PDF page ${pageNumber} of ${pdf.numPages}`,
      });

      /*
       * Explicitly release the page proxy before
       * continuing to the next page.
       */
      page.cleanup?.();
    }

    /*
     * If the preview was intentionally limited, make that
     * clear in the progress stage rather than silently
     * pretending the PDF contains fewer pages.
     */
    if (pageCount < pdf.numPages) {
      onProgress?.({
        progress: 90,
        stage: `Preview limited to ${pageCount} of ${pdf.numPages} pages`,
      });
    }

    return pages;
  } finally {
    if (signal && abortHandler) {
      signal.removeEventListener("abort", abortHandler);
    }

    /*
     * PDF.js requires the loading task to be destroyed
     * after the document is no longer needed.
     */
    try {
      await loadingTask.destroy();
    } catch {
      /*
       * Ignore cleanup errors. The original rendering
       * error/abort should remain the useful error.
       */
    }
  }
}

/**
 * Creates one visual preview image containing multiple PDF pages.
 *
 * Why a single image?
 *
 * The existing ConvertPreview component already understands
 * previewUrl. By composing the pages into one PNG we can support
 * multi-page PDF previews without forcing the rest of the
 * conversion UI to understand PDF.js.
 */
async function createPdfPreviewSheet(
  pages: HTMLCanvasElement[],
  signal?: AbortSignal,
): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  throwIfAborted(signal);

  if (!pages.length) {
    throw new Error(
      "There are no PDF pages available for preview.",
    );
  }

  /*
   * Calculate a common preview width.
   *
   * Keeping all pages within the same visual column produces
   * a much cleaner document-preview experience.
   */
  const targetWidth = Math.min(
    PDF_PREVIEW_MAX_WIDTH,
    Math.max(
      320,
      Math.max(
        ...pages.map(
          (page) => page.width,
        ),
      ),
    ),
  );

  const scaledPages = pages.map(
    (page) => {
      const scale =
        targetWidth /
        page.width;

      return {
        source: page,

        width: Math.max(
          1,
          Math.round(
            page.width * scale,
          ),
        ),

        height: Math.max(
          1,
          Math.round(
            page.height * scale,
          ),
        ),
      };
    },
  );

  const sheetWidth =
    targetWidth +
    PDF_PREVIEW_PADDING * 2;

  const sheetHeight =
    PDF_PREVIEW_PADDING * 2 +
    scaledPages.reduce(
      (total, page) =>
        total + page.height,
      0,
    ) +
    PDF_PREVIEW_PAGE_GAP *
      Math.max(
        0,
        scaledPages.length - 1,
      );

  /*
   * Avoid creating an invalid/unsafe canvas.
   */
  checkCanvasSize(
    sheetWidth,
    sheetHeight,
  );

  const sheet = createCanvas(
    sheetWidth,
    sheetHeight,
  );

  const context =
    sheet.getContext("2d", {
      alpha: false,
    });

  if (!context) {
    throw new Error(
      "Could not create PDF preview canvas.",
    );
  }

  /*
   * Professional neutral document-preview background.
   */
  context.fillStyle =
    PDF_PREVIEW_BACKGROUND;

  context.fillRect(
    0,
    0,
    sheet.width,
    sheet.height,
  );

  context.imageSmoothingEnabled =
    true;

  context.imageSmoothingQuality =
    "high";

  let currentY =
    PDF_PREVIEW_PADDING;

  for (
    let index = 0;
    index < scaledPages.length;
    index += 1
  ) {
    throwIfAborted(signal);

    const page =
      scaledPages[index];

    const x =
      Math.round(
        (sheetWidth -
          page.width) /
          2,
      );

    /*
     * Subtle document shadow.
     *
     * This is intentionally done directly on the
     * canvas so the resulting preview remains a
     * normal image URL.
     */
    context.save();

    context.shadowColor =
      "rgba(15, 23, 42, 0.14)";

    context.shadowBlur = 18;

    context.shadowOffsetY = 5;

    context.fillStyle =
      "#ffffff";

    context.fillRect(
      x,
      currentY,
      page.width,
      page.height,
    );

    context.restore();

    /*
     * Draw the actual PDF page.
     */
    context.drawImage(
      page.source,
      x,
      currentY,
      page.width,
      page.height,
    );

    currentY +=
      page.height;

    if (
      index <
      scaledPages.length - 1
    ) {
      currentY +=
        PDF_PREVIEW_PAGE_GAP;
    }
  }

  const blob =
    await new Promise<Blob>(
      (resolve, reject) => {
        sheet.toBlob(
          (result) => {
            if (!result) {
              reject(
                new Error(
                  "Could not encode the PDF preview.",
                ),
              );

              return;
            }

            resolve(result);
          },
          "image/png",
          1,
        );
      },
    );

  return {
    blob,

    width: sheet.width,

    height: sheet.height,
  };
}

/**
 * Renders a PDF into a browser-friendly preview image.
 *
 * The returned image contains every previewable page.
 *
 * Large PDFs are intentionally capped for the visual preview,
 * while conversion itself remains uncapped.
 */
async function createPdfVisualPreview(
  file: File | Blob,
  signal?: AbortSignal,
  settings?: ConvertSettingsState,
): Promise<{
  previewUrl: string;
  width: number;
  height: number;
  pageCount: number;
  previewedPageCount: number;
}> {
  throwIfAborted(signal);

  const pdfFile =
    file instanceof File
      ? file
      : new File([file], "preview.pdf", {
          type: "application/pdf",
        });

  /*
   * Render only the pages required for the visual preview.
   *
   * This is intentionally independent from the actual
   * conversion path. The real conversion must never be
   * limited by PDF_PREVIEW_MAX_PAGES.
   */
  const pages = await renderPdfPages(pdfFile, signal, undefined, {
    maxPages: PDF_PREVIEW_MAX_PAGES,
    scale: 1.25,
  });

  throwIfAborted(signal);

  if (!pages.length) {
    throw new Error("The PDF contains no renderable pages.");
  }

  /*
   * Apply conversion settings to the visual preview
   * when settings are available.
   */
  const previewPages = settings
    ? pages.map((page) => drawToCanvas(page, settings))
    : pages;

  throwIfAborted(signal);

  /*
   * Build the browser-friendly visual preview.
   *
   * This PNG is ONLY the preview representation.
   * It is NOT the converted output.
   */
  const preview = await createPdfPreviewSheet(previewPages, signal);

  throwIfAborted(signal);

  /*
   * Read the actual PDF page count.
   *
   * Do this separately from rendering so a 100-page PDF
   * can still report "100 pages" even though only the first
   * PDF_PREVIEW_MAX_PAGES pages are rendered visually.
   */
  const pdfData = new Uint8Array(await pdfFile.arrayBuffer());

  const loadingTask = pdfjsLib.getDocument({
    data: pdfData,
    wasmUrl: PDF_WASM_URL,
  });

  let pageCount: number;

  try {
    const pdf = await loadingTask.promise;

    pageCount = pdf.numPages;
  } finally {
    try {
      await loadingTask.destroy();
    } catch {
      /*
       * PDF.js cleanup errors should never
       * replace the useful conversion result.
       */
    }
  }

  throwIfAborted(signal);

  return {
    previewUrl: URL.createObjectURL(preview.blob),

    width: preview.width,

    height: preview.height,

    pageCount,

    previewedPageCount: previewPages.length,
  };
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

async function convertWord(
  file: File,
  settings: ConvertSettingsState,
  signal?: AbortSignal,
  onProgress?: (progress: ConversionProgress) => void,
): Promise<Blob> {
  throwIfAborted(signal);

  if (getFileExtension(file) === "doc" || file.type === "application/msword") {
    throw new Error(
      "Legacy .doc conversion is not available in browser-only mode yet.",
    );
  }

  if (settings.outputFormat === "docx") {
    onProgress?.({
      progress: 100,
      stage: "DOCX ready",
    });

    return file;
  }

  if (settings.outputFormat === "txt") {
    const text = await extractDocxText(file, signal);

    onProgress?.({
      progress: 100,
      stage: "Text extracted",
    });

    return new Blob([text], {
      type: "text/plain;charset=utf-8",
    });
  }

  throw new Error(
    `DOCX → ${settings.outputFormat.toUpperCase()} is not implemented in the browser converter yet.`,
  );
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
  onProgress?.({
    progress: 5,
    stage: "Opening PDF",
  });

  const pages =
    await renderPdfPages(
      file,
      signal,
      onProgress,
      {
        /*
         * IMPORTANT:
         * No maxPages here.
         *
         * Actual conversion must process
         * the entire PDF.
         */
        scale: 2,
      },
    );

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
   * multi-size container.
   */
  if (settings.outputFormat === "ico") {
    const blob = await createIco(decoded.canvas, settings.icoSizes, signal);

    throwIfAborted(signal);

    const previewBlob = await canvasToBlob(decoded.canvas, "png", 100);

    return {
      blob,

      width: decoded.canvas.width,

      height: decoded.canvas.height,

      size: blob.size,

      previewUrl: URL.createObjectURL(previewBlob),

      fileName: makeOutputName(item.file, settings.outputFormat, settings),
    };
  }

  const previewCanvas = drawToCanvas(decoded.canvas, settings);

  throwIfAborted(signal);

  /*
   * =========================================================
   * IMAGE → PDF
   * =========================================================
   *
   * The actual result is a real PDF.
   *
   * But the visual preview is NOT the PDF blob.
   *
   * We render the generated PDF through PDF.js and create
   * a PNG preview. This avoids depending on the browser's
   * native PDF viewer and guarantees the preview is visible.
   */
  if (settings.outputFormat === "pdf") {
    const blob = await createMultiPagePdf([previewCanvas], settings, signal);

    throwIfAborted(signal);

    const visualPreview = await createPdfVisualPreview(blob, signal, settings);

    throwIfAborted(signal);

    return {
      blob,

      width: previewCanvas.width,

      height: previewCanvas.height,

      size: blob.size,

      /*
       * IMPORTANT:
       * This is now a PNG preview URL, not the PDF URL.
       */
      previewUrl: visualPreview.previewUrl,

      pageCount: visualPreview.pageCount,

      isMultiPage: visualPreview.pageCount > 1,

      fileName: makeOutputName(item.file, settings.outputFormat, settings),
    };
  }

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

  /*
   * =========================================================
   * PDF → PDF
   * =========================================================
   *
   * The source PDF itself is already the output.
   *
   * We still create a visual PNG preview so the UI does not
   * depend on the browser's built-in PDF viewer.
   */
  if (settings.outputFormat === "pdf") {
    const visualPreview = await createPdfVisualPreview(item.file, signal);

    throwIfAborted(signal);

    return {
      blob: item.file,

      width: item.width ?? null,

      height: item.height ?? null,

      size: item.file.size,

      /*
       * PNG preview sheet containing all previewed pages.
       */
      previewUrl: visualPreview.previewUrl,

      pageCount: visualPreview.pageCount,

      isMultiPage: visualPreview.pageCount > 1,

      fileName: makeOutputName(item.file, settings.outputFormat, settings),
    };
  }

  /*
   * =========================================================
   * PDF → IMAGE
   * =========================================================
   *
   * Render the PDF pages for the visual preview.
   *
   * The actual conversion remains completely separate and
   * still processes every page in convertPdfToImages().
   */
  const pages = await renderPdfPages(item.file, signal, undefined, {
    /*
     * The visual preview is intentionally capped so that
     * a 500-page PDF cannot create an enormous browser
     * canvas.
     *
     * Actual conversion is NOT capped.
     */
    maxPages: PDF_PREVIEW_MAX_PAGES,

    scale: 1.25,
  });

  throwIfAborted(signal);

  if (!pages.length) {
    throw new Error("The PDF contains no renderable pages.");
  }

  /*
   * Apply output settings to EVERY preview page.
   */
  const previewPages: HTMLCanvasElement[] = [];

  for (let index = 0; index < pages.length; index += 1) {
    throwIfAborted(signal);

    const convertedPage = drawToCanvas(pages[index], settings);

    previewPages.push(convertedPage);
  }

  /*
   * Combine all pages into one professional visual
   * preview sheet.
   */
  const previewSheet = await createPdfPreviewSheet(previewPages, signal);

  throwIfAborted(signal);

  /*
   * The preview result needs a representative blob because
   * the existing conversion queue expects one.
   *
   * This is ONLY for preview metadata.
   *
   * Actual PDF → image conversion is handled separately
   * by convertPdfToImages(), which processes every page.
   */
  const firstPageOutput = await canvasToBlob(
    previewPages[0],
    settings.outputFormat,
    settings.quality,
  );

  throwIfAborted(signal);

  /*
   * Get the real PDF page count so the UI can report:
   *
   * "5 pages"
   *
   * even if the visual preview is capped.
   */
  let totalPageCount = pages.length;

  try {
    const pdfData = new Uint8Array(await item.file.arrayBuffer());

    const loadingTask = pdfjsLib.getDocument({
      data: pdfData,
      wasmUrl: PDF_WASM_URL,
    });

    try {
      const pdf = await loadingTask.promise;

      totalPageCount = pdf.numPages;
    } finally {
      try {
        await loadingTask.destroy();
      } catch {
        // Ignore cleanup errors.
      }
    }
  } catch {
    /*
     * If page-count inspection fails, the already-rendered
     * pages are still valid.
     */
  }

  return {
    blob: firstPageOutput,

    width: previewPages[0].width,

    height: previewPages[0].height,

    size: firstPageOutput.size,

    /*
     * IMPORTANT:
     *
     * This is the PNG sheet, NOT the PDF.
     */
    previewUrl: URL.createObjectURL(previewSheet.blob),

    pageCount: totalPageCount,

    isMultiPage: totalPageCount > 1,

    fileName: makeOutputName(item.file, settings.outputFormat, settings),
  };
}

export async function previewConversion(
  item: ConvertFile,
  settings: ConvertSettingsState,
  signal?: AbortSignal,
): Promise<ConversionPreviewResult> {
  throwIfAborted(signal);

  switch (item.sourceFormat) {
    case "pdf":
      return previewPdfConversion(
        item,
        settings,
        signal,
      );

    case "doc":
    case "docx":
      return previewWordConversion(
        item,
        settings,
        signal,
      );

    default:
      return previewImageConversion(
        item,
        settings,
        signal,
      );
  }
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
 } else if (sourceFormat === "docx" || sourceFormat === "doc") {
   blob = await convertWord(item.file, settings, signal, onProgress);
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

export async function getFileDimensions(file: File): Promise<{
  width: number | null;
  height: number | null;
}> {
  try {
    const extension = getFileExtension(file);

    if (extension === "pdf" || file.type === "application/pdf") {
      const buffer = new Uint8Array(await file.arrayBuffer());

      const loadingTask = pdfjsLib.getDocument({
        data: buffer,
        wasmUrl: PDF_WASM_URL,
      });

      try {
        const pdf = await loadingTask.promise;

        if (!pdf.numPages) {
          return {
            width: null,
            height: null,
          };
        }

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({
          scale: 1,
        });

        page.cleanup?.();

        return {
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
        };
      } finally {
        try {
          await loadingTask.destroy();
        } catch {
          // Ignore PDF.js cleanup errors.
        }
      }
    }

    if (extension === "svg" || file.type === "image/svg+xml") {
      const decoded = await decodeSvg(file);

      return {
        width: decoded.width,
        height: decoded.height,
      };
    }

    if (
      extension === "tif" ||
      extension === "tiff" ||
      file.type === "image/tiff"
    ) {
      const decoded = await decodeTiff(file);

      return {
        width: decoded.width,
        height: decoded.height,
      };
    }

    if (extension === "gif" || file.type === "image/gif") {
      const decoded = await decodeGif(file);

      return {
        width: decoded.width,
        height: decoded.height,
      };
    }

    if (
      extension === "ico" ||
      file.type === "image/x-icon" ||
      file.type === "image/vnd.microsoft.icon"
    ) {
      const decoded = await decodeIcoImage(file);

      return {
        width: decoded.width,
        height: decoded.height,
      };
    }

    const image = await loadImage(file);

    return {
      width: image.naturalWidth || null,
      height: image.naturalHeight || null,
    };
  } catch {
    return {
      width: null,
      height: null,
    };
  }
}

export async function createSourcePreview(
  file: File,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    throwIfAborted(signal);

    const format = getFileExtension(file);

    if (format === "pdf" || file.type === "application/pdf") {
      const pages = await renderPdfPages(file, signal, undefined, {
        /*
         * Queue thumbnails only need a few pages.
         * The main preview handles the larger preview.
         */
        maxPages: 4,

        scale: 0.8,
      });

      if (!pages.length) {
        return null;
      }

      const preview = await createPdfPreviewSheet(pages, signal);

      throwIfAborted(signal);

      return URL.createObjectURL(preview.blob);
    }

    if (
      format === "docx" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return null;
    }

    const decoded = await decodeImage(file, signal);

    const blob = await canvasToBlob(decoded.canvas, "jpg", 80);

    return URL.createObjectURL(blob);
  } catch {
    return null;
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