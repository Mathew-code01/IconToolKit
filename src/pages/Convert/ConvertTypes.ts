// src/pages/Convert/ConvertTypes.ts

// src/pages/Convert/ConvertTypes.ts
// src/pages/Convert/ConvertTypes.ts

export type ConvertFormat =
  | "png"
  | "jpg"
  | "webp"
  | "avif"
  | "svg"
  | "ico"
  | "pdf"
  | "bmp"
  | "gif"
  | "tiff"
  | "doc"
  | "docx"
  | "txt"
  | "rtf";

export type ConversionCategory =
  | "raster"
  | "vector"
  | "icon"
  | "document";

export type ConversionStatus =
  | "queued"
  | "processing"
  | "success"
  | "error";

export type ConversionOutputMode =
  | "smart"
  | "single"
  | "individual";

export interface ConversionTool {
  id: string;
  name: string;
  description: string;
  category: ConversionCategory;

  from: ConvertFormat[];

  to: ConvertFormat[];

  accepts: string[];

  browserSupported?: boolean;
}

export interface ConvertFile {
  id: string;

  file: File;

  sourceFormat: ConvertFormat;

  sourceLabel: string;

  category: ConvertFileCategory;

  categoryLabel: string;

  previewUrl: string | null;

  width: number | null;

  height: number | null;

  status: ConversionStatus;

  progress: number;

  error: string | null;

  result: ConversionResult | null;

  /**
   * Settings belonging to this individual file.
   *
   * This is important because a mixed queue does not
   * necessarily use one output format for every file.
   */
  settings: ConvertSettingsState;

  preview: ConversionPreview;
}

export interface ConversionResult {
  blob: Blob;

  fileName: string;

  format: ConvertFormat;

  width: number | null;

  height: number | null;

  size: number;

  downloadUrl: string;
}

/**
 * A single rendered preview page.
 *
 * This allows PDF previews and other multi-page document
 * previews to display more than one page.
 */
export interface ConversionPreviewPage {
  /**
   * Zero-based page index internally.
   */
  page: number;

  /**
   * Browser-displayable URL.
   *
   * Usually an object URL or data URL.
   */
  url: string;

  /**
   * Optional page dimensions.
   */
  width?: number | null;

  height?: number | null;

  /**
   * Optional rendered image size.
   */
  size?: number | null;
}

export interface ConvertSettingsState {
  /**
   * Smart:
   * Each file uses its recommended compatible output.
   *
   * Single:
   * The user is applying one format to the selected
   * compatible files.
   *
   * Individual:
   * Each file can have its own manually chosen format.
   */
  outputMode: ConversionOutputMode;

  /**
   * The output format currently assigned to this file.
   */
  outputFormat: ConvertFormat;

  quality: number;

  resizeEnabled: boolean;

  width: number | null;

  height: number | null;

  keepAspectRatio: boolean;

  backgroundEnabled: boolean;

  backgroundColor: string;

  preserveTransparency: boolean;

  dpi: number;

  fileNameMode: "original" | "custom";

  customFileName: string;

  suffix: string;

  icoSizes: number[];

  pdfPageSize: "auto" | "a4" | "letter" | "square";

  pdfOrientation: "portrait" | "landscape";
}

export interface ConversionPreview {
  sourceSize: number;

  sourceWidth: number | null;

  sourceHeight: number | null;

  outputSize: number | null;

  outputWidth: number | null;

  outputHeight: number | null;

  sourceFormat: ConvertFormat;

  outputFormat: ConvertFormat;

  sizeEstimated: boolean;

  /**
   * Backward-compatible single preview URL.
   *
   * Keep this because existing conversion code may still
   * populate it.
   */
  previewUrl: string | null;

  /**
   * Optional multi-page preview collection.
   *
   * PDF -> PNG/JPG and multi-page PDF output can use this.
   */
  previewPages?: ConversionPreviewPage[];

  /**
   * Optional total number of pages.
   *
   * Useful when the preview renderer knows the document
   * contains more pages than are currently rendered.
   */
  pageCount?: number | null;

  /**
   * Optional currently rendered/available page count.
   */
  renderedPageCount?: number | null;

  status:
    | "idle"
    | "generating"
    | "ready"
    | "error";

  error: string | null;
}

export interface ConvertHistoryItem {
  id: string;

  sourceName: string;

  outputName: string;

  sourceFormat: ConvertFormat | null;

  outputFormat: ConvertFormat;

  size: number;

  createdAt: number;
}

export interface ConversionResultSummary {
  successful: number;

  failed: number;

  total: number;
}

export type ConvertFileCategory =
  | "image"
  | "pdf"
  | "word"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "other";

export function getConvertFileCategory(
  format: ConvertFormat,
): ConvertFileCategory {
  switch (format) {
    case "pdf":
      return "pdf";

    case "doc":
    case "docx":
      return "word";

    case "png":
    case "jpg":
    case "webp":
    case "avif":
    case "bmp":
    case "gif":
    case "tiff":
    case "svg":
    case "ico":
      return "image";

    default:
      return "other";
  }
}

export function getConvertFileCategoryLabel(
  category: ConvertFileCategory,
): string {
  switch (category) {
    case "image":
      return "Images";

    case "pdf":
      return "PDF";

    case "word":
      return "Word";

    case "spreadsheet":
      return "Spreadsheets";

    case "presentation":
      return "Presentations";

    case "archive":
      return "Archives";

    default:
      return "Other";
  }
}