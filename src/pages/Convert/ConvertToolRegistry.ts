// src/pages/Convert/ConvertToolRegistry.ts

// src/pages/Convert/ConvertToolRegistry.ts

import type {
  ConversionTool,
  ConvertFormat,
} from "./ConvertTypes";

export const FORMAT_LABELS: Record<ConvertFormat, string> = {
  png: "PNG",
  jpg: "JPG",
  webp: "WebP",
  avif: "AVIF",
  svg: "SVG",
  ico: "ICO",
  pdf: "PDF",
  bmp: "BMP",
  gif: "GIF",
  tiff: "TIFF",
  doc: "DOC",
  docx: "DOCX",
  txt: "TXT",
  rtf: "RTF",
};

export const CONVERSION_TOOLS: ConversionTool[] = [
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    description:
      "Convert PNG images to JPG.",
    category: "raster",
    from: ["png"],
    to: ["jpg"],
    accepts: ["image/png"],
  },

  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    description:
      "Convert JPG images to PNG.",
    category: "raster",
    from: ["jpg"],
    to: ["png"],
    accepts: ["image/jpeg"],
  },

  {
    id: "image-to-webp",
    name: "Image to WebP",
    description:
      "Convert common images to efficient WebP.",
    category: "raster",
    from: ["png", "jpg", "bmp", "gif"],
    to: ["webp"],
    accepts: [
      "image/png",
      "image/jpeg",
      "image/bmp",
      "image/gif",
    ],
  },

  {
    id: "webp-to-png",
    name: "WebP to PNG",
    description:
      "Convert WebP images to PNG.",
    category: "raster",
    from: ["webp"],
    to: ["png"],
    accepts: ["image/webp"],
  },

  {
    id: "webp-to-jpg",
    name: "WebP to JPG",
    description:
      "Convert WebP images to JPG.",
    category: "raster",
    from: ["webp"],
    to: ["jpg"],
    accepts: ["image/webp"],
  },

  {
    id: "image-to-avif",
    name: "Image to AVIF",
    description:
      "Create compact AVIF images.",
    category: "raster",
    from: ["png", "jpg", "webp"],
    to: ["avif"],
    accepts: [
      "image/png",
      "image/jpeg",
      "image/webp",
    ],
  },

  {
    id: "avif-to-image",
    name: "AVIF to Image",
    description:
      "Convert AVIF to common image formats.",
    category: "raster",
    from: ["avif"],
    to: ["png", "jpg", "webp"],
    accepts: ["image/avif"],
  },

  {
    id: "bmp-to-png",
    name: "BMP to PNG",
    description:
      "Convert BMP images to PNG.",
    category: "raster",
    from: ["bmp"],
    to: ["png"],
    accepts: ["image/bmp"],
  },

  {
    id: "bmp-to-jpg",
    name: "BMP to JPG",
    description:
      "Convert BMP images to JPG.",
    category: "raster",
    from: ["bmp"],
    to: ["jpg"],
    accepts: ["image/bmp"],
  },

  {
    id: "gif-to-png",
    name: "GIF to PNG",
    description:
      "Convert GIF images to PNG.",
    category: "raster",
    from: ["gif"],
    to: ["png"],
    accepts: ["image/gif"],
  },

  {
    id: "tiff-to-png",
    name: "TIFF to PNG",
    description:
      "Convert TIFF images to PNG.",
    category: "raster",
    from: ["tiff"],
    to: ["png"],
    accepts: ["image/tiff"],
    browserSupported: false,
  },

  {
    id: "tiff-to-jpg",
    name: "TIFF to JPG",
    description:
      "Convert TIFF images to JPG.",
    category: "raster",
    from: ["tiff"],
    to: ["jpg"],
    accepts: ["image/tiff"],
    browserSupported: false,
  },

  {
    id: "svg-to-png",
    name: "SVG to PNG",
    description:
      "Rasterize SVG artwork into PNG.",
    category: "vector",
    from: ["svg"],
    to: ["png"],
    accepts: ["image/svg+xml"],
  },

  {
    id: "svg-to-jpg",
    name: "SVG to JPG",
    description:
      "Rasterize SVG artwork into JPG.",
    category: "vector",
    from: ["svg"],
    to: ["jpg"],
    accepts: ["image/svg+xml"],
  },

  {
    id: "svg-to-webp",
    name: "SVG to WebP",
    description:
      "Rasterize SVG artwork into WebP.",
    category: "vector",
    from: ["svg"],
    to: ["webp"],
    accepts: ["image/svg+xml"],
  },

  {
    id: "svg-to-ico",
    name: "SVG to ICO",
    description:
      "Create an ICO file from SVG artwork.",
    category: "icon",
    from: ["svg"],
    to: ["ico"],
    accepts: ["image/svg+xml"],
  },

  {
    id: "image-to-ico",
    name: "Image to ICO",
    description:
      "Create an ICO file from an image.",
    category: "icon",
    from: ["png", "jpg", "webp"],
    to: ["ico"],
    accepts: [
      "image/png",
      "image/jpeg",
      "image/webp",
    ],
  },

  {
    id: "ico-to-png",
    name: "ICO to PNG",
    description:
      "Extract the best ICO image as PNG.",
    category: "icon",
    from: ["ico"],
    to: ["png"],
    accepts: [".ico"],
  },

  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description:
      "Create a PDF document from images.",
    category: "document",
    from: ["png", "jpg", "webp", "bmp"],
    to: ["pdf"],
    accepts: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/bmp",
    ],
  },

  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description:
      "Render PDF pages as PNG images.",
    category: "document",
    from: ["pdf"],
    to: ["png"],
    accepts: ["application/pdf"],
    browserSupported: false,
  },

  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description:
      "Render PDF pages as JPG images.",
    category: "document",
    from: ["pdf"],
    to: ["jpg"],
    accepts: ["application/pdf"],
    browserSupported: false,
  },

  {
    id: "docx-to-txt",
    name: "Word to TXT",
    description:
      "Extract text from DOCX.",
    category: "document",
    from: ["docx"],
    to: ["txt"],
    accepts: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    browserSupported: true,
  },

  {
    id: "docx-to-pdf",
    name: "Word to PDF",
    description:
      "Convert DOCX documents to PDF.",
    category: "document",
    from: ["docx"],
    to: ["pdf"],
    accepts: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    browserSupported: true,
  },

  {
    id: "docx-to-docx",
    name: "DOCX",
    description:
      "Keep the DOCX document format.",
    category: "document",
    from: ["docx"],
    to: ["docx"],
    accepts: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    browserSupported: true,
  },

  {
    id: "doc-to-txt",
    name: "DOC to TXT",
    description:
      "Extract text from legacy Word documents.",
    category: "document",
    from: ["doc"],
    to: ["txt"],
    accepts: ["application/msword"],
    browserSupported: false,
  },
];

/**
 * Formats that are actually exposed to the user.
 */
export const OUTPUT_FORMATS: ConvertFormat[] = [
  "png",
  "jpg",
  "webp",
  "avif",
  "ico",
  "pdf",
  "txt",
];

/**
 * Get all formats that can be produced from one source.
 *
 * IMPORTANT:
 * This checks the conversion registry rather than simply
 * checking OUTPUT_FORMATS.
 */
export function getCompatibleOutputFormats(
  source: ConvertFormat | null,
): ConvertFormat[] {
  if (!source) {
    return [];
  }

  const formats = new Set<ConvertFormat>();

  for (const tool of CONVERSION_TOOLS) {
    if (!tool.from.includes(source)) {
      continue;
    }

    for (const format of tool.to) {
      formats.add(format);
    }
  }

  return OUTPUT_FORMATS.filter((format) =>
    formats.has(format),
  );
}

/**
 * Check whether a source can be converted to a target.
 */
export function canConvert(
  source: ConvertFormat | null,
  target: ConvertFormat,
): boolean {
  if (!source) {
    return false;
  }

  return CONVERSION_TOOLS.some(
    (tool) =>
      tool.from.includes(source) &&
      tool.to.includes(target),
  );
}

/**
 * Find the actual conversion tool for a source/target pair.
 *
 * Keeping this helper here prevents the UI and conversion engine
 * from implementing compatibility differently.
 */
export function getConversionTool(
  source: ConvertFormat | null,
  target: ConvertFormat,
): ConversionTool | null {
  if (!source) {
    return null;
  }

  return (
    CONVERSION_TOOLS.find(
      (tool) =>
        tool.from.includes(source) &&
        tool.to.includes(target),
    ) ?? null
  );
}

/**
 * Recommended output formats.
 *
 * The first item is the primary recommendation.
 */
export function getRecommendedOutputFormats(
  source: ConvertFormat | null,
): ConvertFormat[] {
  if (!source) {
    return [];
  }

  switch (source) {
    case "png":
    case "jpg":
    case "bmp":
    case "gif":
      return getCompatibleOutputFormats(source).sort(
        (a, b) =>
          recommendationRank(source, a) -
          recommendationRank(source, b),
      );

    case "webp":
      return ["png", "jpg", "avif"].filter((format) =>
        canConvert(source, format as ConvertFormat),
      ) as ConvertFormat[];

    case "avif":
      return ["webp", "png", "jpg"].filter((format) =>
        canConvert(source, format as ConvertFormat),
      ) as ConvertFormat[];

    case "svg":
      return ["webp", "png", "jpg"].filter((format) =>
        canConvert(source, format as ConvertFormat),
      ) as ConvertFormat[];

    case "ico":
      return ["png"].filter((format) =>
        canConvert(source, format as ConvertFormat),
      ) as ConvertFormat[];

    case "docx":
      return ["pdf", "txt"].filter((format) =>
        canConvert(source, format as ConvertFormat),
      ) as ConvertFormat[];

    case "doc":
      return ["txt"].filter((format) =>
        canConvert(source, format as ConvertFormat),
      ) as ConvertFormat[];

    case "pdf":
      return ["png", "jpg"].filter((format) =>
        canConvert(source, format as ConvertFormat),
      ) as ConvertFormat[];

    default:
      return getCompatibleOutputFormats(source);
  }
}

/**
 * Primary recommendation.
 */
export function getRecommendedOutputFormat(
  source: ConvertFormat | null,
): ConvertFormat | null {
  return getRecommendedOutputFormats(source)[0] ?? null;
}

function recommendationRank(
  source: ConvertFormat,
  target: ConvertFormat,
): number {
  if (
    ["png", "jpg", "bmp", "gif"].includes(source) &&
    target === "webp"
  ) {
    return 0;
  }

  if (source === "webp" && target === "avif") {
    return 2;
  }

  if (target === "webp") {
    return 0;
  }

  return 10;
}

export function getFormatFromFile(
  file: File,
): ConvertFormat | null {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (
    type === "image/png" ||
    name.endsWith(".png")
  ) {
    return "png";
  }

  if (
    type === "image/jpeg" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return "jpg";
  }

  if (
    type === "image/webp" ||
    name.endsWith(".webp")
  ) {
    return "webp";
  }

  if (
    type === "image/avif" ||
    name.endsWith(".avif")
  ) {
    return "avif";
  }

  if (
    type === "image/svg+xml" ||
    name.endsWith(".svg")
  ) {
    return "svg";
  }

  if (
    type === "image/bmp" ||
    name.endsWith(".bmp")
  ) {
    return "bmp";
  }

  if (
    type === "image/gif" ||
    name.endsWith(".gif")
  ) {
    return "gif";
  }

  if (
    type === "image/tiff" ||
    name.endsWith(".tif") ||
    name.endsWith(".tiff")
  ) {
    return "tiff";
  }

  if (
    type === "image/x-icon" ||
    type === "image/vnd.microsoft.icon" ||
    name.endsWith(".ico")
  ) {
    return "ico";
  }

  if (
    type === "application/pdf" ||
    name.endsWith(".pdf")
  ) {
    return "pdf";
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx";
  }

  if (
    type === "application/msword" ||
    name.endsWith(".doc")
  ) {
    return "doc";
  }

  if (
    type === "text/plain" ||
    name.endsWith(".txt")
  ) {
    return "txt";
  }

  if (
    type === "application/rtf" ||
    type === "text/rtf" ||
    name.endsWith(".rtf")
  ) {
    return "rtf";
  }

  return null;
}

export function getMimeType(
  format: ConvertFormat,
): string {
  switch (format) {
    case "jpg":
      return "image/jpeg";

    case "png":
      return "image/png";

    case "webp":
      return "image/webp";

    case "avif":
      return "image/avif";

    case "svg":
      return "image/svg+xml";

    case "ico":
      return "image/x-icon";

    case "pdf":
      return "application/pdf";

    case "bmp":
      return "image/bmp";

    case "gif":
      return "image/gif";

    case "tiff":
      return "image/tiff";

    case "doc":
      return "application/msword";

    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    case "txt":
      return "text/plain;charset=utf-8";

    case "rtf":
      return "application/rtf";

    default:
      return "application/octet-stream";
  }
}

export function getExtension(
  format: ConvertFormat,
): string {
  return format === "jpg"
    ? "jpg"
    : format;
}

export function getToolsForSource(
  source: ConvertFormat | null,
): ConversionTool[] {
  if (!source) {
    return [];
  }

  return CONVERSION_TOOLS.filter((tool) =>
    tool.from.includes(source),
  );
}

/**
 * Determine whether a format works for EVERY selected file.
 */
export function getCommonOutputFormats(
  files: Array<Pick<ConvertFileLike, "sourceFormat">>,
): ConvertFormat[] {
  if (files.length === 0) {
    return [];
  }

  const first = new Set(
    getCompatibleOutputFormats(
      files[0].sourceFormat,
    ),
  );

  for (const file of files.slice(1)) {
    const compatible = new Set(
      getCompatibleOutputFormats(
        file.sourceFormat,
      ),
    );

    for (const format of Array.from(first)) {
      if (!compatible.has(format)) {
        first.delete(format);
      }
    }
  }

  return OUTPUT_FORMATS.filter((format) =>
    first.has(format),
  );
}

/**
 * Small structural type used by getCommonOutputFormats.
 * This avoids importing ConvertFile into helper-heavy code.
 */
interface ConvertFileLike {
  sourceFormat: ConvertFormat;
}