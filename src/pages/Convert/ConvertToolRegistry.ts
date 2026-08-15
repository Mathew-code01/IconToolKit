// src/pages/Convert/ConvertToolRegistry.ts

import type { ConversionTool, ConvertFormat } from "./ConvertTypes";

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
};

export const CONVERSION_TOOLS: ConversionTool[] = [
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    description: "Convert transparent or standard PNG images to JPG.",
    category: "raster",
    from: ["png"],
    to: ["jpg"],
    accepts: ["image/png"],
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    description: "Convert JPG and JPEG images to PNG.",
    category: "raster",
    from: ["jpg"],
    to: ["png"],
    accepts: ["image/jpeg"],
  },
  {
    id: "image-to-webp",
    name: "Image to WebP",
    description: "Convert common image formats to WebP.",
    category: "raster",
    from: ["png", "jpg", "bmp", "gif"],
    to: ["webp"],
    accepts: ["image/png", "image/jpeg", "image/bmp", "image/gif"],
  },
  {
    id: "webp-to-png",
    name: "WebP to PNG",
    description: "Convert WebP images to lossless PNG.",
    category: "raster",
    from: ["webp"],
    to: ["png"],
    accepts: ["image/webp"],
  },
  {
    id: "webp-to-jpg",
    name: "WebP to JPG",
    description: "Convert WebP images to JPG.",
    category: "raster",
    from: ["webp"],
    to: ["jpg"],
    accepts: ["image/webp"],
  },
  {
    id: "image-to-avif",
    name: "Image to AVIF",
    description:
      "Create compact AVIF images when browser encoding is supported.",
    category: "raster",
    from: ["png", "jpg", "webp"],
    to: ["avif"],
    accepts: ["image/png", "image/jpeg", "image/webp"],
  },
  {
    id: "avif-to-image",
    name: "AVIF to Image",
    description: "Convert AVIF to common browser image formats.",
    category: "raster",
    from: ["avif"],
    to: ["png", "jpg", "webp"],
    accepts: ["image/avif"],
  },
  {
    id: "bmp-to-png",
    name: "BMP to PNG",
    description: "Convert BMP images to PNG.",
    category: "raster",
    from: ["bmp"],
    to: ["png"],
    accepts: ["image/bmp"],
  },
  {
    id: "bmp-to-jpg",
    name: "BMP to JPG",
    description: "Convert BMP images to JPG.",
    category: "raster",
    from: ["bmp"],
    to: ["jpg"],
    accepts: ["image/bmp"],
  },
  {
    id: "gif-to-png",
    name: "GIF to PNG",
    description: "Convert GIF images to PNG.",
    category: "raster",
    from: ["gif"],
    to: ["png"],
    accepts: ["image/gif"],
  },
  {
    id: "tiff-to-png",
    name: "TIFF to PNG",
    description: "Convert TIFF images to PNG with a TIFF decoder.",
    category: "raster",
    from: ["tiff"],
    to: ["png"],
    accepts: ["image/tiff"],
    browserSupported: false,
  },
  {
    id: "tiff-to-jpg",
    name: "TIFF to JPG",
    description: "Convert TIFF images to JPG with a TIFF decoder.",
    category: "raster",
    from: ["tiff"],
    to: ["jpg"],
    accepts: ["image/tiff"],
    browserSupported: false,
  },
  {
    id: "svg-to-png",
    name: "SVG to PNG",
    description: "Rasterize SVG artwork into PNG.",
    category: "vector",
    from: ["svg"],
    to: ["png"],
    accepts: ["image/svg+xml"],
  },
  {
    id: "svg-to-jpg",
    name: "SVG to JPG",
    description: "Rasterize SVG artwork into JPG.",
    category: "vector",
    from: ["svg"],
    to: ["jpg"],
    accepts: ["image/svg+xml"],
  },
  {
    id: "svg-to-webp",
    name: "SVG to WebP",
    description: "Rasterize SVG artwork into WebP.",
    category: "vector",
    from: ["svg"],
    to: ["webp"],
    accepts: ["image/svg+xml"],
  },
  {
    id: "svg-to-ico",
    name: "SVG to ICO",
    description: "Rasterize SVG artwork and create an ICO file.",
    category: "icon",
    from: ["svg"],
    to: ["ico"],
    accepts: ["image/svg+xml"],
  },
  {
    id: "image-to-ico",
    name: "Image to ICO",
    description: "Create an ICO file from PNG, JPG or WebP.",
    category: "icon",
    from: ["png", "jpg", "webp"],
    to: ["ico"],
    accepts: ["image/png", "image/jpeg", "image/webp"],
  },
  {
    id: "ico-to-png",
    name: "ICO to PNG",
    description: "Extract the best available ICO image as PNG.",
    category: "icon",
    from: ["ico"],
    to: ["png"],
    accepts: [".ico"],
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Create a PDF document from images.",
    category: "document",
    from: ["png", "jpg", "webp", "bmp"],
    to: ["pdf"],
    accepts: ["image/png", "image/jpeg", "image/webp", "image/bmp"],
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description: "Render PDF pages as PNG images.",
    category: "document",
    from: ["pdf"],
    to: ["png"],
    accepts: ["application/pdf"],
    browserSupported: false,
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Render PDF pages as JPG images.",
    category: "document",
    from: ["pdf"],
    to: ["jpg"],
    accepts: ["application/pdf"],
    browserSupported: false,
  },
];

export const OUTPUT_FORMATS: ConvertFormat[] = [
  "png",
  "jpg",
  "webp",
  "avif",
  "ico",
  "pdf",
];

export function getFormatFromFile(file: File): ConvertFormat | null {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type === "image/png" || name.endsWith(".png")) return "png";
  if (
    type === "image/jpeg" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return "jpg";
  }

  if (type === "image/webp" || name.endsWith(".webp")) {
    return "webp";
  }

  if (type === "image/avif" || name.endsWith(".avif")) {
    return "avif";
  }

  if (type === "image/svg+xml" || name.endsWith(".svg")) {
    return "svg";
  }

  if (type === "image/bmp" || name.endsWith(".bmp")) {
    return "bmp";
  }

  if (type === "image/gif" || name.endsWith(".gif")) {
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

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return "pdf";
  }

  return null;
}

export function getMimeType(format: ConvertFormat): string {
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
    default:
      return "application/octet-stream";
  }
}

export function getExtension(format: ConvertFormat): string {
  return format === "jpg" ? "jpg" : format;
}

export function getToolsForSource(
  source: ConvertFormat | null,
): ConversionTool[] {
  if (!source) return [];

  return CONVERSION_TOOLS.filter((tool) => tool.from.includes(source));
}
