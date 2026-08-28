// src/pages/Edit/EditPage.tsx

// src/pages/Edit/EditPage.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import {
  ArrowDownToLine,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crop,
  Download,
  ImagePlus,
  Maximize2,
  Minus,
  Moon,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  Plus,
  Redo2,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Undo2,
  Upload,
  X,
} from "lucide-react";

import BackgroundRemover from "./BackgroundRemover";
import BackgroundEditor from "./BackgroundEditor";
import CropTool, { CropOverlay } from "./CropTool";
import ResizeTool from "./ResizeTool";
import RotateFlipTool from "./RotateFlipTool";
import RoundedCornersTool from "./RoundedCornersTool";
import PaddingTool from "./PaddingTool";
import ImageEditorTool from "./ImageEditorTool";

/* =========================================================
   TYPES
========================================================= */

export type EditTool =
  | "image"
  | "crop"
  | "resize"
  | "rotate"
  | "background"
  | "remove-background"
  | "corners"
  | "padding";

export type BackgroundType = "transparent" | "solid" | "gradient";

export type BackgroundSettings = {
  type: BackgroundType;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
};

export type PaddingSettings = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  linked: boolean;
};

export type CropSettings = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ResizeMode = "fit" | "fill" | "stretch";

export type ResizeSettings = {
  width: number;
  height: number;
  lockAspectRatio: boolean;
  mode: ResizeMode;
};

export type RotateFlipSettings = {
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
};

export type RoundedCornersSettings = {
  radius: number;
};

export type ImageEditorState = {
  background: BackgroundSettings;
  padding: PaddingSettings;
  crop: CropSettings | null;
  resize: ResizeSettings;
  rotateFlip: RotateFlipSettings;
  roundedCorners: RoundedCornersSettings;
};

type HistoryState = {
  imageUrl: string | null;
  imageName: string;
  imageType: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  editor: ImageEditorState;
};

type ExportState = {
  status: "idle" | "exporting" | "success" | "error";
  message?: string;
};

type DropState = "idle" | "active" | "invalid";

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_HISTORY = 50;

const MIN_ZOOM = 25;

const MAX_ZOOM = 400;

const DEFAULT_ZOOM = 75;

const MIN_CANVAS_SIZE = 180;

const DEFAULT_IMAGE_WIDTH = 512;

const DEFAULT_IMAGE_HEIGHT = 512;

const SUPPORTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/avif",
];

const THEME_STORAGE_KEY = "icon-toolkit-theme";

/* =========================================================
   DEFAULTS
========================================================= */

const DEFAULT_BACKGROUND: BackgroundSettings = {
  type: "transparent",
  color: "#ffffff",
  gradientFrom: "#6366f1",
  gradientTo: "#8b5cf6",
  gradientAngle: 135,
};

const DEFAULT_PADDING: PaddingSettings = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  linked: true,
};

const DEFAULT_ROTATE_FLIP: RotateFlipSettings = {
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
};

const DEFAULT_ROUNDED_CORNERS: RoundedCornersSettings = {
  radius: 0,
};

/* =========================================================
   FACTORIES
========================================================= */

function createDefaultEditorState(
  width: number,
  height: number,
): ImageEditorState {
  const safeWidth = Math.max(1, Math.round(width));

  const safeHeight = Math.max(1, Math.round(height));

  return {
    background: {
      ...DEFAULT_BACKGROUND,
    },

    padding: {
      ...DEFAULT_PADDING,
    },

    crop: {
      x: 0,
      y: 0,
      width: safeWidth,
      height: safeHeight,
    },

    resize: {
      width: safeWidth,
      height: safeHeight,
      lockAspectRatio: true,
      mode: "fit",
    },

    rotateFlip: {
      ...DEFAULT_ROTATE_FLIP,
    },

    roundedCorners: {
      ...DEFAULT_ROUNDED_CORNERS,
    },
  };
}

function cloneEditorState(editor: ImageEditorState): ImageEditorState {
  return {
    background: {
      ...editor.background,
    },

    padding: {
      ...editor.padding,
    },

    crop: editor.crop
      ? {
          ...editor.crop,
        }
      : null,

    resize: {
      ...editor.resize,
    },

    rotateFlip: {
      ...editor.rotateFlip,
    },

    roundedCorners: {
      ...editor.roundedCorners,
    },
  };
}

/* =========================================================
   HELPERS
========================================================= */

function isImageFile(file: File): boolean {
  if (!file.type) {
    return false;
  }

  return (
    file.type.startsWith("image/") &&
    (SUPPORTED_IMAGE_TYPES.includes(file.type) ||
      file.type.startsWith("image/"))
  );
}

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function normalizeRotation(rotation: number): number {
  const normalized = ((rotation % 360) + 360) % 360;

  return normalized === 360 ? 0 : normalized;
}

function getOutputExtension(type: string): string {
  switch (type) {
    case "image/jpeg":
      return "jpg";

    case "image/webp":
      return "webp";

    case "image/png":
    default:
      return "png";
  }
}

function getExportMimeType(imageType: string): string {
  if (imageType === "image/jpeg") {
    return "image/jpeg";
  }

  if (imageType === "image/webp") {
    return "image/webp";
  }

  return "image/png";
}

function createDownloadName(
  imageName: string,
  width: number,
  height: number,
  extension: string,
): string {
  const baseName =
    imageName
      .replace(/\.[^/.]+$/, "")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .trim() || "edited-image";

  return `${baseName}-${width}x${height}.${extension}`;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

function getImageDimensions(
  image: HTMLImageElement,
): {
  width: number;
  height: number;
} {
  return {
    width: Math.max(
      1,
      image.naturalWidth || image.width || DEFAULT_IMAGE_WIDTH,
    ),

    height: Math.max(
      1,
      image.naturalHeight || image.height || DEFAULT_IMAGE_HEIGHT,
    ),
  };
}

function createRoundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const safeRadius = Math.min(
    Math.max(0, radius),
    Math.min(Math.abs(width), Math.abs(height)) / 2,
  );

  context.beginPath();

  context.moveTo(x + safeRadius, y);

  context.lineTo(x + width - safeRadius, y);

  context.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + safeRadius,
  );

  context.lineTo(x + width, y + height - safeRadius);

  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height,
  );

  context.lineTo(x + safeRadius, y + height);

  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - safeRadius,
  );

  context.lineTo(x, y + safeRadius);

  context.quadraticCurveTo(x, y, x + safeRadius, y);

  context.closePath();
}

function loadImageForCanvas(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Unable to load image for export."));
    };

    image.src = src;
  });
}

/* =========================================================
   COMPONENT
========================================================= */

export default function EditPage() {
  /* =======================================================
     IMAGE STATE
  ======================================================= */

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [imageName, setImageName] = useState("Untitled image");

  const [imageType, setImageType] = useState("image/png");

  const [imageWidth, setImageWidth] = useState(0);

  const [imageHeight, setImageHeight] = useState(0);

  const [imageSize, setImageSize] = useState(0);

  /* =======================================================
     EDITOR STATE
  ======================================================= */

  const [editor, setEditor] = useState<ImageEditorState>(() =>
    createDefaultEditorState(
      DEFAULT_IMAGE_WIDTH,
      DEFAULT_IMAGE_HEIGHT,
    ),
  );

  const [activeTool, setActiveTool] = useState<EditTool>("image");

  /* =======================================================
     UI STATE
  ======================================================= */

  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const [mobileInspectorOpen, setMobileInspectorOpen] =
    useState(false);

  const [dropState, setDropState] = useState<DropState>("idle");

  const [exportState, setExportState] = useState<ExportState>({
    status: "idle",
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    try {
      const saved = window.localStorage.getItem(
        THEME_STORAGE_KEY,
      );

      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch {
      // Ignore storage failures.
    }

    try {
      return window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  /* =======================================================
     HISTORY
  ======================================================= */

  const [history, setHistory] = useState<HistoryState[]>([]);

  const [future, setFuture] = useState<HistoryState[]>([]);

  /*
   * Crop interactions are continuous. We only want one
   * history entry when the user begins manipulating the crop,
   * not one entry for every pointer movement.
   */
  const cropHistoryPendingRef = useRef(false);

  /*
   * Used for operations such as sliders where the child
   * component may update the parent repeatedly.
   */
  const interactionHistoryPendingRef = useRef(false);

  /* =======================================================
     REFS
  ======================================================= */

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const objectUrlRef = useRef<string | null>(null);

  const exportResetTimerRef = useRef<number | null>(null);

  /* =======================================================
     THEME
  ======================================================= */

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    root.style.colorScheme = theme;

    try {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        theme,
      );
    } catch {
      // Ignore storage failures.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark",
    );
  }, []);

  /* =======================================================
     SNAPSHOT
  ======================================================= */

  const createSnapshot = useCallback((): HistoryState => {
    return {
      imageUrl,
      imageName,
      imageType,
      imageWidth,
      imageHeight,
      imageSize,
      editor: cloneEditorState(editor),
    };
  }, [
    imageUrl,
    imageName,
    imageType,
    imageWidth,
    imageHeight,
    imageSize,
    editor,
  ]);

  /* =======================================================
     HISTORY HELPERS
  ======================================================= */

  const pushHistorySnapshot = useCallback(
    (snapshot: HistoryState) => {
      setHistory((current) => [
        ...current.slice(-(MAX_HISTORY - 1)),
        snapshot,
      ]);

      setFuture([]);
    },
    [],
  );

  const saveHistory = useCallback(() => {
    pushHistorySnapshot(createSnapshot());
  }, [createSnapshot, pushHistorySnapshot]);

  const restoreSnapshot = useCallback(
    (snapshot: HistoryState) => {
      setImageUrl(snapshot.imageUrl);

      setImageName(snapshot.imageName);

      setImageType(snapshot.imageType);

      setImageWidth(snapshot.imageWidth);

      setImageHeight(snapshot.imageHeight);

      setImageSize(snapshot.imageSize);

      setEditor(cloneEditorState(snapshot.editor));
    },
    [],
  );

  const undo = useCallback(() => {
    if (history.length === 0) {
      return;
    }

    const previous = history[history.length - 1];

    const current = createSnapshot();

    setFuture((items) => [
      current,
      ...items.slice(0, MAX_HISTORY - 1),
    ]);

    restoreSnapshot(previous);

    setHistory((items) => items.slice(0, -1));

    cropHistoryPendingRef.current = false;

    interactionHistoryPendingRef.current = false;
  }, [
    history,
    createSnapshot,
    restoreSnapshot,
  ]);

  const redo = useCallback(() => {
    if (future.length === 0) {
      return;
    }

    const next = future[0];

    const current = createSnapshot();

    setHistory((items) => [
      ...items.slice(-(MAX_HISTORY - 1)),
      current,
    ]);

    restoreSnapshot(next);

    setFuture((items) => items.slice(1));

    cropHistoryPendingRef.current = false;

    interactionHistoryPendingRef.current = false;
  }, [
    future,
    createSnapshot,
    restoreSnapshot,
  ]);

  /* =======================================================
     IMAGE URL CLEANUP
  ======================================================= */

  const revokeCurrentObjectUrl = useCallback(() => {
    if (!objectUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(objectUrlRef.current);

    objectUrlRef.current = null;
  }, []);

  /* =======================================================
     IMAGE LOADING
  ======================================================= */

  const loadImage = useCallback(
    (file: File) => {
      if (!isImageFile(file)) {
        setDropState("invalid");

        return;
      }

      /*
       * Clear any previous export state.
       */
      setExportState({
        status: "idle",
      });

      /*
       * Revoke the previous object URL before creating a new
       * one. This prevents memory from accumulating when users
       * repeatedly replace images.
       */
      revokeCurrentObjectUrl();

      const url = URL.createObjectURL(file);

      objectUrlRef.current = url;

      const image = new Image();

      image.onload = () => {
        const { width, height } = getImageDimensions(image);

        setImageUrl(url);

        setImageName(file.name || "Untitled image");

        setImageType(file.type || "image/png");

        setImageWidth(width);

        setImageHeight(height);

        setImageSize(file.size);

        setEditor(
          createDefaultEditorState(width, height),
        );

        setHistory([]);

        setFuture([]);

        setActiveTool("image");

        setZoom(DEFAULT_ZOOM);

        setDropState("idle");

        setMobileToolsOpen(false);

        setMobileInspectorOpen(false);

        cropHistoryPendingRef.current = false;

        interactionHistoryPendingRef.current = false;
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);

        if (objectUrlRef.current === url) {
          objectUrlRef.current = null;
        }

        setDropState("invalid");

        setExportState({
          status: "error",
          message: "This image could not be loaded.",
        });
      };

      image.src = url;
    },
    [revokeCurrentObjectUrl],
  );

  /* =======================================================
     FILE INPUT
  ======================================================= */

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        loadImage(file);
      }

      /*
       * Reset the input so selecting the same image twice in a
       * row still triggers onChange.
       */
      event.target.value = "";
    },
    [loadImage],
  );

  /* =======================================================
     DRAG / DROP
  ======================================================= */

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      event.dataTransfer.dropEffect = "copy";

      if (event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];

        setDropState(
          isImageFile(file) ? "active" : "invalid",
        );
      }
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      /*
       * Prevent nested elements from constantly toggling the
       * drop state while the cursor moves inside the editor.
       */
      if (event.currentTarget === event.target) {
        setDropState("idle");
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      setDropState("idle");

      const file = event.dataTransfer.files?.[0];

      if (file) {
        loadImage(file);
      }
    },
    [loadImage],
  );

  /* =======================================================
     BACKGROUND
  ======================================================= */

  const updateBackground = useCallback(
    (updates: Partial<BackgroundSettings>) => {
      if (!interactionHistoryPendingRef.current) {
        saveHistory();

        interactionHistoryPendingRef.current = true;
      }

      setEditor((current) => {
        const nextBackground = {
          ...current.background,
          ...updates,
        };

        const changed =
          nextBackground.type !== current.background.type ||
          nextBackground.color !== current.background.color ||
          nextBackground.gradientFrom !==
            current.background.gradientFrom ||
          nextBackground.gradientTo !==
            current.background.gradientTo ||
          nextBackground.gradientAngle !==
            current.background.gradientAngle;

        if (!changed) {
          return current;
        }

        return {
          ...current,
          background: nextBackground,
        };
      });
    },
    [saveHistory],
  );

  /* =======================================================
     PADDING
  ======================================================= */

  const updatePadding = useCallback(
    (updates: Partial<PaddingSettings>) => {
      if (!interactionHistoryPendingRef.current) {
        saveHistory();

        interactionHistoryPendingRef.current = true;
      }

      setEditor((current) => {
        const nextPadding = {
          ...current.padding,
          ...updates,
        };

        const changed =
          nextPadding.top !== current.padding.top ||
          nextPadding.right !== current.padding.right ||
          nextPadding.bottom !== current.padding.bottom ||
          nextPadding.left !== current.padding.left ||
          nextPadding.linked !== current.padding.linked;

        if (!changed) {
          return current;
        }

        return {
          ...current,
          padding: nextPadding,
        };
      });
    },
    [saveHistory],
  );

  /* =======================================================
     RESIZE
  ======================================================= */

  const updateResize = useCallback(
    (updates: Partial<ResizeSettings>) => {
      setEditor((current) => {
        const nextResize = {
          ...current.resize,
          ...updates,
        };

        const nextWidth = clamp(
          Math.round(nextResize.width),
          1,
          10000,
        );

        const nextHeight = clamp(
          Math.round(nextResize.height),
          1,
          10000,
        );

        const changed =
          nextWidth !== current.resize.width ||
          nextHeight !== current.resize.height ||
          nextResize.lockAspectRatio !==
            current.resize.lockAspectRatio ||
          nextResize.mode !== current.resize.mode;

        if (!changed) {
          return current;
        }

        if (!interactionHistoryPendingRef.current) {
          saveHistory();

          interactionHistoryPendingRef.current = true;
        }

        return {
          ...current,
          resize: {
            ...nextResize,
            width: nextWidth,
            height: nextHeight,
          },
        };
      });
    },
    [saveHistory],
  );

  /* =======================================================
     ROTATE / FLIP
  ======================================================= */

  const updateRotateFlip = useCallback(
    (updates: Partial<RotateFlipSettings>) => {
      setEditor((current) => {
        const nextRotateFlip = {
          ...current.rotateFlip,
          ...updates,
        };

        const normalizedRotation = normalizeRotation(
          nextRotateFlip.rotation,
        );

        const changed =
          normalizedRotation !==
            normalizeRotation(current.rotateFlip.rotation) ||
          nextRotateFlip.flipHorizontal !==
            current.rotateFlip.flipHorizontal ||
          nextRotateFlip.flipVertical !==
            current.rotateFlip.flipVertical;

        if (!changed) {
          return current;
        }

        if (!interactionHistoryPendingRef.current) {
          saveHistory();

          interactionHistoryPendingRef.current = true;
        }

        return {
          ...current,
          rotateFlip: {
            ...nextRotateFlip,
            rotation: normalizedRotation,
          },
        };
      });
    },
    [saveHistory],
  );

  /* =======================================================
     ROUNDED CORNERS
  ======================================================= */

  const updateRoundedCorners = useCallback(
    (updates: Partial<RoundedCornersSettings>) => {
      if (!interactionHistoryPendingRef.current) {
        saveHistory();

        interactionHistoryPendingRef.current = true;
      }

      setEditor((current) => {
        const nextRadius = clamp(
          Number(updates.radius ?? current.roundedCorners.radius),
          0,
          100,
        );

        if (
          nextRadius === current.roundedCorners.radius
        ) {
          return current;
        }

        return {
          ...current,

          roundedCorners: {
            ...current.roundedCorners,

            ...updates,

            radius: nextRadius,
          },
        };
      });
    },
    [saveHistory],
  );

  /* =======================================================
     INTERACTION COMMIT
  ======================================================= */

  const commitInteractionHistory = useCallback(() => {
    interactionHistoryPendingRef.current = false;
  }, []);

  /* =======================================================
     CROP
  ======================================================= */

  const updateCrop = useCallback(
    (crop: CropSettings | null) => {
      setEditor((current) => {
        if (!crop) {
          if (current.crop === null) {
            return current;
          }

          return {
            ...current,
            crop: null,
          };
        }

        const safeCrop: CropSettings = {
          x: clamp(
            Math.round(crop.x),
            0,
            Math.max(0, imageWidth - 1),
          ),

          y: clamp(
            Math.round(crop.y),
            0,
            Math.max(0, imageHeight - 1),
          ),

          width: clamp(
            Math.round(crop.width),
            1,
            Math.max(1, imageWidth),
          ),

          height: clamp(
            Math.round(crop.height),
            1,
            Math.max(1, imageHeight),
          ),
        };

        const maxWidth = Math.max(
          1,
          imageWidth - safeCrop.x,
        );

        const maxHeight = Math.max(
          1,
          imageHeight - safeCrop.y,
        );

        safeCrop.width = Math.min(
          safeCrop.width,
          maxWidth,
        );

        safeCrop.height = Math.min(
          safeCrop.height,
          maxHeight,
        );

        const changed =
          !current.crop ||
          current.crop.x !== safeCrop.x ||
          current.crop.y !== safeCrop.y ||
          current.crop.width !== safeCrop.width ||
          current.crop.height !== safeCrop.height;

        if (!changed) {
          return current;
        }

        return {
          ...current,
          crop: safeCrop,
        };
      });
    },
    [imageWidth, imageHeight],
  );

  const beginCropInteraction = useCallback(() => {
    if (!cropHistoryPendingRef.current) {
      saveHistory();

      cropHistoryPendingRef.current = true;
    }
  }, [saveHistory]);

  const endCropInteraction = useCallback(() => {
    cropHistoryPendingRef.current = false;
  }, []);

  /* =======================================================
     RESET
  ======================================================= */

  const resetEditor = useCallback(() => {
    if (!imageUrl) {
      return;
    }

    saveHistory();

    setEditor(
      createDefaultEditorState(
        imageWidth || DEFAULT_IMAGE_WIDTH,
        imageHeight || DEFAULT_IMAGE_HEIGHT,
      ),
    );

    setZoom(DEFAULT_ZOOM);

    setActiveTool("image");

    setExportState({
      status: "idle",
    });

    cropHistoryPendingRef.current = false;

    interactionHistoryPendingRef.current = false;
  }, [
    imageUrl,
    imageWidth,
    imageHeight,
    saveHistory,
  ]);

  /* =======================================================
     CLEAR IMAGE
  ======================================================= */

  const clearImage = useCallback(() => {
    revokeCurrentObjectUrl();

    setImageUrl(null);

    setImageName("Untitled image");

    setImageType("image/png");

    setImageWidth(0);

    setImageHeight(0);

    setImageSize(0);

    setEditor(
      createDefaultEditorState(
        DEFAULT_IMAGE_WIDTH,
        DEFAULT_IMAGE_HEIGHT,
      ),
    );

    setHistory([]);

    setFuture([]);

    setActiveTool("image");

    setZoom(DEFAULT_ZOOM);

    setExportState({
      status: "idle",
    });

    setMobileToolsOpen(false);

    setMobileInspectorOpen(false);

    cropHistoryPendingRef.current = false;

    interactionHistoryPendingRef.current = false;
  }, [revokeCurrentObjectUrl]);

  /* =======================================================
     EXPORT
  ======================================================= */

  const handleDownload = useCallback(async () => {
    if (
      !imageUrl ||
      imageWidth <= 0 ||
      imageHeight <= 0
    ) {
      return;
    }

    if (exportState.status === "exporting") {
      return;
    }

    setExportState({
      status: "exporting",
      message: "Preparing export…",
    });

    try {
      const source = await loadImageForCanvas(imageUrl);

      const sourceWidth = Math.max(
        1,
        source.naturalWidth || imageWidth,
      );

      const sourceHeight = Math.max(
        1,
        source.naturalHeight || imageHeight,
      );

      /*
       * -------------------------------------------------------
       * CROP
       * -------------------------------------------------------
       */

      const crop = editor.crop ?? {
        x: 0,
        y: 0,
        width: sourceWidth,
        height: sourceHeight,
      };

      const cropX = clamp(
        Math.round(crop.x),
        0,
        Math.max(0, sourceWidth - 1),
      );

      const cropY = clamp(
        Math.round(crop.y),
        0,
        Math.max(0, sourceHeight - 1),
      );

      const cropWidth = clamp(
        Math.round(crop.width),
        1,
        Math.max(1, sourceWidth - cropX),
      );

      const cropHeight = clamp(
        Math.round(crop.height),
        1,
        Math.max(1, sourceHeight - cropY),
      );

      /*
       * -------------------------------------------------------
       * OUTPUT DIMENSIONS
       * -------------------------------------------------------
       */

      const outputWidth = clamp(
        Math.round(editor.resize.width),
        1,
        10000,
      );

      const outputHeight = clamp(
        Math.round(editor.resize.height),
        1,
        10000,
      );

      const canvas = document.createElement("canvas");

      canvas.width = outputWidth;

      canvas.height = outputHeight;

      const context = canvas.getContext("2d", {
        alpha: true,
      });

      if (!context) {
        throw new Error(
          "Your browser does not support canvas export.",
        );
      }

      context.clearRect(
        0,
        0,
        outputWidth,
        outputHeight,
      );

      /*
       * -------------------------------------------------------
       * BACKGROUND
       * -------------------------------------------------------
       */

      if (editor.background.type === "solid") {
        context.fillStyle =
          editor.background.color || "#ffffff";

        context.fillRect(
          0,
          0,
          outputWidth,
          outputHeight,
        );
      }

      if (editor.background.type === "gradient") {
        const angle =
          (editor.background.gradientAngle * Math.PI) /
          180;

        const centerX = outputWidth / 2;

        const centerY = outputHeight / 2;

        const length =
          Math.sqrt(
            outputWidth * outputWidth +
              outputHeight * outputHeight,
          ) / 2;

        const x1 =
          centerX - Math.cos(angle) * length;

        const y1 =
          centerY - Math.sin(angle) * length;

        const x2 =
          centerX + Math.cos(angle) * length;

        const y2 =
          centerY + Math.sin(angle) * length;

        const gradient =
          context.createLinearGradient(
            x1,
            y1,
            x2,
            y2,
          );

        gradient.addColorStop(
          0,
          editor.background.gradientFrom ||
            editor.background.color ||
            "#6366f1",
        );

        gradient.addColorStop(
          1,
          editor.background.gradientTo ||
            "#8b5cf6",
        );

        context.fillStyle = gradient;

        context.fillRect(
          0,
          0,
          outputWidth,
          outputHeight,
        );
      }

      /*
       * -------------------------------------------------------
       * PADDING
       * -------------------------------------------------------
       */

      const paddingLeft = clamp(
        Math.round(editor.padding.left),
        0,
        outputWidth,
      );

      const paddingRight = clamp(
        Math.round(editor.padding.right),
        0,
        outputWidth,
      );

      const paddingTop = clamp(
        Math.round(editor.padding.top),
        0,
        outputHeight,
      );

      const paddingBottom = clamp(
        Math.round(editor.padding.bottom),
        0,
        outputHeight,
      );

      const availableWidth = Math.max(
        1,
        outputWidth -
          paddingLeft -
          paddingRight,
      );

      const availableHeight = Math.max(
        1,
        outputHeight -
          paddingTop -
          paddingBottom,
      );

      /*
       * -------------------------------------------------------
       * RESIZE MODE
       * -------------------------------------------------------
       */

      let drawWidth: number;

      let drawHeight: number;

      if (editor.resize.mode === "stretch") {
        drawWidth = availableWidth;

        drawHeight = availableHeight;
      } else {
        const scale =
          editor.resize.mode === "fill"
            ? Math.max(
                availableWidth / cropWidth,
                availableHeight / cropHeight,
              )
            : Math.min(
                availableWidth / cropWidth,
                availableHeight / cropHeight,
              );

        drawWidth = cropWidth * scale;

        drawHeight = cropHeight * scale;
      }

      /*
       * -------------------------------------------------------
       * CENTER
       * -------------------------------------------------------
       */

      const centerX =
        paddingLeft +
        (availableWidth - drawWidth) / 2 +
        drawWidth / 2;

      const centerY =
        paddingTop +
        (availableHeight - drawHeight) / 2 +
        drawHeight / 2;

      /*
       * -------------------------------------------------------
       * IMAGE TRANSFORM
       * -------------------------------------------------------
       */

      context.save();

      /*
       * Keep all transformed content inside the output.
       */
      context.beginPath();

      context.rect(
        0,
        0,
        outputWidth,
        outputHeight,
      );

      context.clip();

      context.translate(centerX, centerY);

      context.rotate(
        (normalizeRotation(
          editor.rotateFlip.rotation,
        ) *
          Math.PI) /
          180,
      );

      context.scale(
        editor.rotateFlip.flipHorizontal ? -1 : 1,
        editor.rotateFlip.flipVertical ? -1 : 1,
      );

      /*
       * -------------------------------------------------------
       * ROUNDED CORNERS
       * -------------------------------------------------------
       */

      const radiusPercent = clamp(
        editor.roundedCorners.radius,
        0,
        100,
      );

      if (radiusPercent > 0) {
        const radius =
          Math.min(drawWidth, drawHeight) *
          (radiusPercent / 100);

        createRoundedRectPath(
          context,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight,
          radius,
        );

        context.clip();
      }

      /*
       * -------------------------------------------------------
       * DRAW IMAGE
       * -------------------------------------------------------
       */

      context.imageSmoothingEnabled = true;

      context.imageSmoothingQuality = "high";

      context.drawImage(
        source,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight,
      );

      context.restore();

      /*
       * -------------------------------------------------------
       * OUTPUT FORMAT
       * -------------------------------------------------------
       */

      const outputType =
        getExportMimeType(imageType);

      /*
       * JPEG has no alpha channel.
       *
       * Flatten transparent backgrounds against white.
       */
      let exportCanvas: HTMLCanvasElement = canvas;

      if (
        outputType === "image/jpeg" &&
        editor.background.type ===
          "transparent"
      ) {
        const flattenedCanvas =
          document.createElement("canvas");

        flattenedCanvas.width = outputWidth;

        flattenedCanvas.height = outputHeight;

        const flattenedContext =
          flattenedCanvas.getContext("2d");

        if (!flattenedContext) {
          throw new Error(
            "Unable to prepare JPEG export.",
          );
        }

        flattenedContext.fillStyle = "#ffffff";

        flattenedContext.fillRect(
          0,
          0,
          outputWidth,
          outputHeight,
        );

        flattenedContext.drawImage(
          canvas,
          0,
          0,
        );

        exportCanvas = flattenedCanvas;
      }

      /*
       * -------------------------------------------------------
       * BLOB
       * -------------------------------------------------------
       */

      const blob = await new Promise<Blob | null>(
        (resolve) => {
          exportCanvas.toBlob(
            resolve,
            outputType,
            0.95,
          );
        },
      );

      if (!blob) {
        throw new Error(
          "The browser could not create the exported image.",
        );
      }

      /*
       * -------------------------------------------------------
       * DOWNLOAD
       * -------------------------------------------------------
       */

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = createDownloadName(
        imageName,
        outputWidth,
        outputHeight,
        getOutputExtension(outputType),
      );

      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      link.remove();

      /*
       * Give the browser enough time to begin the download
       * before releasing the temporary object URL.
       */
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setExportState({
        status: "success",
        message: "Export complete",
      });

      if (exportResetTimerRef.current) {
        window.clearTimeout(
          exportResetTimerRef.current,
        );
      }

      exportResetTimerRef.current =
        window.setTimeout(() => {
          setExportState({
            status: "idle",
          });
        }, 1800);
    } catch (error) {
      console.error(
        "Failed to export edited image:",
        error,
      );

      setExportState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Export failed.",
      });

      if (exportResetTimerRef.current) {
        window.clearTimeout(
          exportResetTimerRef.current,
        );
      }

      exportResetTimerRef.current =
        window.setTimeout(() => {
          setExportState({
            status: "idle",
          });
        }, 3000);
    }
  }, [
    imageUrl,
    imageWidth,
    imageHeight,
    imageType,
    imageName,
    editor,
    exportState.status,
  ]);

  /* =======================================================
     ZOOM
  ======================================================= */

  const zoomIn = useCallback(() => {
    setZoom((current) =>
      clamp(current + 10, MIN_ZOOM, MAX_ZOOM),
    );
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) =>
      clamp(current - 10, MIN_ZOOM, MAX_ZOOM),
    );
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
  }, []);

  /* =======================================================
     TOOL SELECTION
  ======================================================= */

  const selectTool = useCallback(
    (tool: EditTool) => {
      setActiveTool(tool);

      /*
       * Selecting a tool should close the mobile tool picker
       * but leave the inspector available when appropriate.
       */
      setMobileToolsOpen(false);
    },
    [],
  );

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: globalThis.KeyboardEvent,
    ) => {
      const typing = isTypingTarget(
        event.target,
      );

      /*
       * Undo
       */
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z"
      ) {
        if (typing) {
          return;
        }

        event.preventDefault();

        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }

        return;
      }

      /*
       * Redo
       */
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "y"
      ) {
        if (typing) {
          return;
        }

        event.preventDefault();

        redo();

        return;
      }

      /*
       * Escape
       */
      if (event.key === "Escape") {
        setMobileToolsOpen(false);

        setMobileInspectorOpen(false);

        setDropState("idle");

        return;
      }

      if (typing) {
        return;
      }

      /*
       * Number shortcuts
       */
      switch (event.key) {
        case "1":
          selectTool("image");
          break;

        case "2":
          selectTool("crop");
          break;

        case "3":
          selectTool("resize");
          break;

        case "4":
          selectTool("rotate");
          break;

        case "5":
          selectTool("background");
          break;

        case "6":
          selectTool("remove-background");
          break;

        case "7":
          selectTool("corners");
          break;

        case "8":
          selectTool("padding");
          break;

        default:
          break;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    undo,
    redo,
    selectTool,
  ]);

  /* =======================================================
     MOBILE BODY LOCK
  ======================================================= */

  useEffect(() => {
    const shouldLock =
      mobileToolsOpen ||
      mobileInspectorOpen;

    if (!shouldLock) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    mobileToolsOpen,
    mobileInspectorOpen,
  ]);

  /* =======================================================
     GLOBAL CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      revokeCurrentObjectUrl();

      if (exportResetTimerRef.current) {
        window.clearTimeout(
          exportResetTimerRef.current,
        );
      }
    };
  }, [revokeCurrentObjectUrl]);

  /* =======================================================
     IMAGE INFORMATION
  ======================================================= */

  const imageInfo = useMemo(
    () => ({
      dimensions:
        imageWidth > 0 &&
        imageHeight > 0
          ? `${imageWidth} × ${imageHeight}`
          : "—",

      format:
        imageType
          .replace("image/", "")
          .toUpperCase() || "—",

      size:
        imageSize > 0
          ? formatFileSize(imageSize)
          : "—",
    }),
    [
      imageWidth,
      imageHeight,
      imageType,
      imageSize,
    ],
  );

  /* =======================================================
     TOOL DEFINITIONS
  ======================================================= */

  const tools = useMemo(
    () => [
      {
        id: "image" as EditTool,
        label: "Image",
        description:
          "Image overview and editor",
        icon: ImagePlus,
        shortcut: "1",
      },

      {
        id: "crop" as EditTool,
        label: "Crop",
        description:
          "Crop your image",
        icon: Crop,
        shortcut: "2",
      },

      {
        id: "resize" as EditTool,
        label: "Resize",
        description:
          "Change dimensions",
        icon: Maximize2,
        shortcut: "3",
      },

      {
        id: "rotate" as EditTool,
        label: "Rotate & Flip",
        description:
          "Rotate or flip image",
        icon: RotateCw,
        shortcut: "4",
      },

      {
        id: "background" as EditTool,
        label: "Background",
        description:
          "Edit image background",
        icon: SlidersHorizontal,
        shortcut: "5",
      },

      {
        id: "remove-background" as EditTool,
        label: "Remove Background",
        description:
          "Remove image background",
        icon: Sparkles,
        shortcut: "6",
      },

      {
        id: "corners" as EditTool,
        label: "Rounded Corners",
        description:
          "Round image corners",
        icon: MoreHorizontal,
        shortcut: "7",
      },

      {
        id: "padding" as EditTool,
        label: "Padding",
        description:
          "Add safe area",
        icon: PanelRight,
        shortcut: "8",
      },
    ],
    [],
  );

  const activeToolDefinition =
    tools.find(
      (tool) => tool.id === activeTool,
    ) ?? tools[0];

  /* =======================================================
     TOOL NAVIGATION
  ======================================================= */

  const goToPreviousTool = useCallback(() => {
    const index = tools.findIndex(
      (tool) => tool.id === activeTool,
    );

    if (index <= 0) {
      return;
    }

    const previous = tools[index - 1];

    if (previous) {
      selectTool(previous.id);
    }
  }, [
    tools,
    activeTool,
    selectTool,
  ]);

  const goToNextTool = useCallback(() => {
    const index = tools.findIndex(
      (tool) => tool.id === activeTool,
    );

    if (
      index < 0 ||
      index >= tools.length - 1
    ) {
      return;
    }

    const next = tools[index + 1];

    if (next) {
      selectTool(next.id);
    }
  }, [
    tools,
    activeTool,
    selectTool,
  ]);

  /* =======================================================
     TOOL CONTENT
  ======================================================= */

  const renderToolContent = () => {
    switch (activeTool) {
      case "crop":
        return (
          <CropTool
            imageUrl={imageUrl}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            crop={editor.crop}
            onChange={updateCrop}
          />
        );

      case "resize":
        return (
          <ResizeTool
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            resize={editor.resize}
            onChange={updateResize}
          />
        );

      case "rotate":
        return (
          <RotateFlipTool
            settings={editor.rotateFlip}
            onChange={updateRotateFlip}
          />
        );

      case "background":
        return (
          <BackgroundEditor
            settings={editor.background}
            onChange={updateBackground}
          />
        );

      case "remove-background":
        return (
          <BackgroundRemover
            imageUrl={imageUrl}
            onChange={(nextUrl) => {
              if (!nextUrl) {
                return;
              }

              saveHistory();

              setImageUrl(nextUrl);

              /*
               * The resulting URL may not be an object URL
               * owned by this component, so we intentionally
               * don't overwrite objectUrlRef here.
               */
              setExportState({
                status: "idle",
              });
            }}
          />
        );

      case "corners":
        return (
          <RoundedCornersTool
            settings={
              editor.roundedCorners
            }
            onChange={
              updateRoundedCorners
            }
          />
        );

      case "padding":
        return (
          <PaddingTool
            settings={editor.padding}
            onChange={updatePadding}
          />
        );

      case "image":
      default:
        return (
          <ImageEditorTool
            imageUrl={imageUrl}
            imageName={imageName}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            imageType={imageType}
            background={
              editor.background
            }
            padding={editor.padding}
            crop={editor.crop}
            resize={editor.resize}
            rotateFlip={
              editor.rotateFlip
            }
            roundedCorners={
              editor.roundedCorners
            }
            zoom={zoom}
            onZoomChange={setZoom}
          />
        );
    }
  };

  /* =======================================================
     PHASE 2 CONTINUES HERE
  ======================================================= */

  // The complete UI/rendering section is provided in Phase 2.
  // It starts with:
  //
  // return (...);
  //
  // and includes:
  //
  // - Empty upload state
  // - Production editor header
  // - Left tool panel
  // - Workspace toolbar
  // - Canvas
  // - Crop overlay
  // - Status bar
  // - Right inspector
  // - Mobile bottom navigation
  // - Mobile tool drawer
  // - Mobile inspector drawer
  // - Drag/drop visual state
  // - Export loading state
  // - Motion transitions
  // - Accessibility refinements
  //
  // =========================================================
  // IMPORTANT:
  // Do not add another `export default function EditPage()`.
  // Phase 2 continues inside this same component.
  // =========================================================

 
  /* =========================================================
     TOOL DEFINITIONS
  ========================================================= */



  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!imageUrl) {
    return (
      <div
        className="
          flex min-h-[calc(100vh-64px)]
          flex-col overflow-hidden
          bg-[var(--background)]
          text-[var(--text)]
          transition-colors duration-300
        "
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* ===================================================
            EMPTY HEADER
        =================================================== */}

        <header
          className="
            flex h-14 shrink-0
            items-center justify-between
            border-b border-[var(--border)]
            bg-[var(--editor-header)]/95
            px-3
            backdrop-blur-xl
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                bg-[var(--brand)]
                text-[11px]
                font-bold
                text-white
                shadow-[var(--shadow-sm)]
              "
            >
              IT
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold">
                Edit
              </div>

              <div
                className="
                  hidden truncate
                  text-[10px]
                  text-[var(--text-muted)]
                  sm:block
                "
              >
                Image editing studio
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--text-muted)]
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
              "
            >
              {theme === "dark" ? (
                <Sun size={14} />
              ) : (
                <Moon size={14} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileInspectorOpen(true)}
              className="
                flex h-9
                items-center gap-1.5
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                px-3
                text-[10px]
                font-medium
                text-[var(--text-secondary)]
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-[var(--surface-muted)]
              "
            >
              <SlidersHorizontal size={13} />

              <span className="hidden sm:inline">
                Edit
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled
              className="
                flex h-9
                items-center gap-1.5
                rounded-lg
                bg-[var(--brand)]
                px-3
                text-[10px]
                font-semibold
                text-white
                opacity-50
              "
            >
              <Download size={13} />
              <span className="hidden sm:inline">
                Export
              </span>
            </button>
          </div>
        </header>

        {/* ===================================================
            EMPTY WORKSPACE
        =================================================== */}

        <main
          className="
            relative flex min-h-0 flex-1
            items-center justify-center
            overflow-auto
            bg-[var(--editor-workspace)]
            p-4 sm:p-8
          "
        >
          <div
            className="
              pointer-events-none
              absolute inset-0
              opacity-40
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  var(--editor-grid) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  var(--editor-grid) 1px,
                  transparent 1px
                )
              `,
              backgroundSize:
                "var(--editor-grid-size) var(--editor-grid-size)",
            }}
          />

          <div
            className="
              relative z-10
              w-full max-w-2xl
              rounded-3xl
              border border-dashed
              border-[var(--border-strong)]
              bg-[var(--surface)]/95
              p-6
              text-center
              shadow-[var(--shadow-lg)]
              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[var(--shadow-xl)]
              sm:p-10
            "
          >
            <div
              className="
                mx-auto mb-5
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-[var(--brand-light)]
                text-[var(--brand)]
                shadow-[var(--shadow-sm)]
              "
            >
              <ImagePlus size={28} />
            </div>

            <h1
              className="
                text-xl font-semibold
                tracking-tight
                sm:text-2xl
              "
            >
              Edit your image
            </h1>

            <p
              className="
                mx-auto mt-2
                max-w-md
                text-sm
                leading-6
                text-[var(--text-muted)]
              "
            >
              Upload an image and edit it directly in your
              browser. Your image stays on your device.
            </p>

            <div
              className="
                mt-7 flex flex-col
                items-center justify-center
                gap-3
                sm:flex-row
              "
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  flex h-10
                  w-full sm:w-auto
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--brand)]
                  px-5
                  text-xs
                  font-semibold
                  text-white
                  shadow-[var(--shadow-md)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--brand-hover)]
                  hover:shadow-[var(--shadow-lg)]
                  active:translate-y-0
                "
              >
                <Upload size={15} />
                Choose image
              </button>

              <span
                className="
                  text-[10px]
                  text-[var(--text-disabled)]
                "
              >
                or drag & drop here
              </span>
            </div>

            <div
              className="
                mt-8 grid
                grid-cols-2
                gap-2
                text-left
                sm:grid-cols-4
              "
            >
              {[
                ["PNG", "Transparent images"],
                ["JPG", "Photos"],
                ["WEBP", "Modern web images"],
                ["SVG", "Vector graphics"],
              ].map(([format, description]) => (
                <div
                  key={format}
                  className="
                    rounded-xl
                    border border-[var(--border)]
                    bg-[var(--surface-subtle)]
                    p-3
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:border-[var(--border-strong)]
                  "
                >
                  <div
                    className="
                      text-[10px]
                      font-semibold
                      text-[var(--text)]
                    "
                  >
                    {format}
                  </div>

                  <div
                    className="
                      mt-1
                      text-[9px]
                      leading-4
                      text-[var(--text-muted)]
                    "
                  >
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  /* =========================================================
     EDITOR
  ========================================================= */

  return (
    <div
      className="
        flex min-h-[calc(100vh-64px)]
        flex-col overflow-hidden
        bg-[var(--background)]
        text-[var(--text)]
        transition-colors duration-300
      "
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className="
          z-[100]
          flex h-14 shrink-0
          items-center
          justify-between
          gap-2
          border-b
          border-[var(--border)]
          bg-[var(--editor-header)]/95
          px-2
          backdrop-blur-xl
          sm:px-4
        "
      >
        {/* LEFT */}

        <div
          className="
            flex min-w-0
            items-center gap-2
          "
        >
          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              bg-[var(--brand)]
              text-[11px]
              font-bold
              text-white
              shadow-[var(--shadow-sm)]
            "
          >
            IT
          </div>

          <div className="min-w-0">
            <div
              className="
                truncate text-xs
                font-semibold
              "
            >
              Edit
            </div>

            <div
              className="
                hidden max-w-[180px]
                truncate
                text-[10px]
                text-[var(--text-muted)]
                sm:block
              "
            >
              {imageName}
            </div>
          </div>

          <div
            className="
              hidden h-5 w-px
              bg-[var(--border)]
              md:block
            "
          />

          <div
            className="
              hidden items-center gap-2
              text-[9px]
              text-[var(--text-muted)]
              md:flex
            "
          >
            <span>{imageInfo.dimensions}</span>
            <span>•</span>
            <span>{imageInfo.format}</span>
            <span>•</span>
            <span>{imageInfo.size}</span>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex shrink-0
            items-center gap-1
            sm:gap-2
          "
        >
          <button
            type="button"
            title="Undo"
            aria-label="Undo"
            onClick={undo}
            disabled={!history.length}
            className="
              hidden h-8 w-8
              items-center justify-center
              rounded-lg
              text-[var(--text-muted)]
              transition-all duration-200
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
              disabled:pointer-events-none
              disabled:opacity-30
              sm:flex
            "
          >
            <Undo2 size={15} />
          </button>

          <button
            type="button"
            title="Redo"
            aria-label="Redo"
            onClick={redo}
            disabled={!future.length}
            className="
              hidden h-8 w-8
              items-center justify-center
              rounded-lg
              text-[var(--text-muted)]
              transition-all duration-200
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
              disabled:pointer-events-none
              disabled:opacity-30
              sm:flex
            "
          >
            <Redo2 size={15} />
          </button>

          <div
            className="
              hidden h-5 w-px
              bg-[var(--border)]
              sm:block
            "
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="
              flex h-8
              items-center gap-1.5
              rounded-lg
              border border-[var(--border)]
              bg-[var(--surface)]
              px-2.5
              text-[10px]
              font-medium
              text-[var(--text-secondary)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            <Upload size={13} />

            <span className="hidden sm:inline">
              Replace
            </span>
          </button>

          <button
            type="button"
            onClick={resetEditor}
            title="Reset edits"
            className="
              hidden h-8 w-8
              items-center justify-center
              rounded-lg
              border border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
              sm:flex
            "
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              border border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            {theme === "dark" ? (
              <Sun size={14} />
            ) : (
              <Moon size={14} />
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="
              flex h-8
              items-center gap-1.5
              rounded-lg
              bg-[var(--brand)]
              px-2.5
              text-[10px]
              font-semibold
              text-white
              shadow-[var(--shadow-sm)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[var(--brand-hover)]
              hover:shadow-[var(--shadow-md)]
              active:translate-y-0
            "
          >
            <Download size={13} />

            <span className="hidden sm:inline">
              Download
            </span>
          </button>
        </div>
      </header>

      {/* ===================================================
          BODY
      =================================================== */}

      <div
        className="
          relative flex min-h-0
          flex-1 overflow-hidden
        "
      >
        {/* =================================================
            LEFT TOOL PANEL
        ================================================= */}

        <aside
          className={`
            hidden shrink-0
            border-r border-[var(--border)]
            bg-[var(--editor-panel)]
            lg:block
            transition-[width]
            duration-300
            ease-out
            ${
              leftPanelOpen
                ? "w-[220px]"
                : "w-0 overflow-hidden"
            }
          `}
        >
          <div className="flex h-full flex-col">
            <div
              className="
                flex h-12 shrink-0
                items-center
                justify-between
                border-b border-[var(--border)]
                px-3
              "
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={14}
                  className="text-[var(--text-muted)]"
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                  "
                >
                  Edit tools
                </span>
              </div>
            </div>

            <div
              className="
                min-h-0 flex-1
                overflow-y-auto
                p-2
              "
            >
              <div className="space-y-1">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const active = activeTool === tool.id;

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setActiveTool(tool.id)}
                      className={`
                        group flex w-full
                        items-center gap-2.5
                        rounded-xl
                        border px-2.5 py-2
                        text-left
                        transition-all duration-200
                        hover:-translate-y-[1px]
                        ${
                          active
                            ? "border-[var(--brand)]/25 bg-[var(--brand-light)] text-[var(--text)] shadow-[var(--shadow-sm)]"
                            : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex h-8 w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all duration-200
                          ${
                            active
                              ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                              : "bg-[var(--surface-muted)] text-[var(--text-muted)] group-hover:text-[var(--text)]"
                          }
                        `}
                      >
                        <Icon size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className="
                            truncate
                            text-[10px]
                            font-medium
                          "
                        >
                          {tool.label}
                        </div>

                        <div
                          className="
                            mt-0.5 truncate
                            text-[8px]
                            text-[var(--text-muted)]
                          "
                        >
                          {tool.description}
                        </div>
                      </div>

                      <kbd
                        className="
                          hidden rounded
                          border border-[var(--border)]
                          bg-[var(--surface)]
                          px-1.5 py-0.5
                          font-mono
                          text-[8px]
                          text-[var(--text-muted)]
                          xl:block
                        "
                      >
                        {tool.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="
                shrink-0
                border-t border-[var(--border)]
                p-2
              "
            >
              <button
                type="button"
                onClick={clearImage}
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-3 py-2
                  text-[9px]
                  text-[var(--text-muted)]
                  transition-all duration-200
                  hover:bg-[var(--error-bg)]
                  hover:text-[var(--error)]
                "
              >
                <X size={12} />
                Remove image
              </button>
            </div>
          </div>
        </aside>

        {/* =================================================
            CENTER WORKSPACE
        ================================================= */}

        <main
          className="
            relative min-w-0
            flex-1 overflow-hidden
            bg-[var(--editor-workspace)]
          "
        >
          {/* TOP WORKSPACE TOOLBAR */}

          <div
            className="
              absolute left-1/2 top-3
              z-50
              flex -translate-x-1/2
              items-center gap-1
              rounded-xl
              border border-[var(--border)]
              bg-[var(--surface)]/95
              p-1
              shadow-[var(--shadow-lg)]
              backdrop-blur-xl
              sm:top-4
            "
          >
            <button
              type="button"
              title={
                leftPanelOpen
                  ? "Hide tools panel"
                  : "Show tools panel"
              }
              aria-label={
                leftPanelOpen
                  ? "Hide tools panel"
                  : "Show tools panel"
              }
              onClick={() =>
                setLeftPanelOpen((current) => !current)
              }
              className="
                hidden h-8 w-8
                items-center justify-center
                rounded-lg
                text-[var(--text-muted)]
                transition-all duration-200
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                lg:flex
              "
            >
              <PanelLeft size={14} />
            </button>

            <button
              type="button"
              title={
                rightPanelOpen
                  ? "Hide properties panel"
                  : "Show properties panel"
              }
              aria-label={
                rightPanelOpen
                  ? "Hide properties panel"
                  : "Show properties panel"
              }
              onClick={() =>
                setRightPanelOpen((current) => !current)
              }
              className={`
                hidden h-8 w-8
                items-center justify-center
                rounded-lg
                transition-all duration-200
                lg:flex
                ${
                  rightPanelOpen
                    ? "text-[var(--brand)] hover:bg-[var(--brand-light)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                }
              `}
            >
              <PanelRight size={14} />
            </button>

            <div
              className="
                hidden h-5 w-px
                bg-[var(--border)]
                lg:block
              "
            />

            <button
              type="button"
              title="Zoom out"
              onClick={zoomOut}
              disabled={zoom <= 25}
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                text-[var(--text-muted)]
                transition-all duration-200
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                disabled:opacity-30
              "
            >
              <Minus size={14} />
            </button>

            <button
              type="button"
              title="Reset zoom"
              onClick={resetZoom}
              className="
                min-w-12 rounded-lg
                px-2 py-1
                text-center
                font-mono
                text-[9px]
                text-[var(--text-secondary)]
                transition-colors
                hover:bg-[var(--surface-muted)]
              "
            >
              {zoom}%
            </button>

            <button
              type="button"
              title="Zoom in"
              onClick={zoomIn}
              disabled={zoom >= 400}
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                text-[var(--text-muted)]
                transition-all duration-200
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                disabled:opacity-30
              "
            >
              <Plus size={14} />
            </button>

            <div
              className="
                hidden h-5 w-px
                bg-[var(--border)]
                sm:block
              "
            />

            <button
              type="button"
              title="Previous tool"
              onClick={goToPreviousTool}
              disabled={activeTool === tools[0].id}
              className="
                hidden h-8 w-8
                items-center justify-center
                rounded-lg
                text-[var(--text-muted)]
                transition-all duration-200
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                disabled:opacity-30
                sm:flex
              "
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              title="Next tool"
              onClick={goToNextTool}
              disabled={
                activeTool === tools[tools.length - 1].id
              }
              className="
                hidden h-8 w-8
                items-center justify-center
                rounded-lg
                text-[var(--text-muted)]
                transition-all duration-200
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                disabled:opacity-30
                sm:flex
              "
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* MOBILE TOOL SELECTOR */}

          <div
            className="
              absolute
              left-3 top-16
              z-40
              lg:hidden
            "
          >
            <button
              type="button"
              onClick={() =>
                setMobileToolsOpen((current) => !current)
              }
              className="
                flex h-9
                items-center gap-2
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]/95
                px-3
                text-[10px]
                font-medium
                shadow-[var(--shadow-md)]
                backdrop-blur-xl
                transition-all duration-200
                active:scale-[0.98]
              "
            >
              <activeToolDefinition.icon size={13} />

              <span className="max-w-[130px] truncate">
                {activeToolDefinition.label}
              </span>

              <ChevronDown size={12} />
            </button>

            {mobileToolsOpen && (
              <div
                className="
                  absolute left-0 top-11
                  w-64
                  overflow-hidden
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                  p-1.5
                  shadow-[var(--shadow-lg)]
                  backdrop-blur-xl
                "
              >
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const active = activeTool === tool.id;

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => selectTool(tool.id)}
                      className={`
                        flex w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-2.5 py-2
                        text-left
                        transition-colors
                        ${
                          active
                            ? "bg-[var(--brand-light)] text-[var(--brand)]"
                            : "hover:bg-[var(--surface-muted)]"
                        }
                      `}
                    >
                      <Icon size={14} />

                      <span
                        className="
                          flex-1
                          text-[10px]
                        "
                      >
                        {tool.label}
                      </span>

                      <kbd
                        className="
                          font-mono
                          text-[8px]
                          text-[var(--text-disabled)]
                        "
                      >
                        {tool.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CANVAS */}

          <div
            className="
              flex h-full
              min-h-0
              items-center
              justify-center
              overflow-auto
              p-6
              pb-16
              sm:p-12
              sm:pb-16
              lg:p-20
              lg:pb-20
            "
            style={{
              backgroundColor: "var(--editor-workspace)",
              backgroundImage: `
                linear-gradient(
                  var(--editor-grid) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  var(--editor-grid) 1px,
                  transparent 1px
                )
              `,
              backgroundSize:
                "var(--editor-grid-size) var(--editor-grid-size)",
            }}
          >
            <div
              className="
                relative
                flex
                min-h-full
                min-w-full
                items-center
                justify-center
              "
            >
              <div
                className="
                  relative
                  shrink-0
                  overflow-hidden
                  rounded-[4px]
                  border border-[var(--canvas-border)]
                  bg-[var(--canvas-background)]
                  shadow-[0_30px_80px_var(--editor-shadow)]
                  transition-[width,height]
                  duration-200
                  ease-out
                "
                style={{
                  width: Math.max(
                    180,
                    editor.resize.width * (zoom / 100),
                  ),
                  height: Math.max(
                    180,
                    editor.resize.height * (zoom / 100),
                  ),
                }}
              >
                <ImageEditorTool
                  imageUrl={imageUrl}
                  imageName={imageName}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                  imageType={imageType}
                  background={editor.background}
                  padding={editor.padding}
                  resize={editor.resize}
                  crop={editor.crop}
                  rotateFlip={editor.rotateFlip}
                  roundedCorners={editor.roundedCorners}
                  zoom={zoom}
                  onZoomChange={setZoom}
                  previewOnly
                />

                {activeTool === "crop" && (
                  <CropOverlay
                    imageUrl={imageUrl}
                    imageWidth={imageWidth}
                    imageHeight={imageHeight}
                    crop={editor.crop}
                    zoom={zoom}
                    onChange={updateCrop}
                    onInteractionStart={beginCropInteraction}
                  />
                )}
              </div>
            </div>
          </div>

          {/* STATUS BAR */}

          <div
            className="
              absolute
              bottom-0 left-0 right-0
              z-30
              flex h-9
              items-center
              justify-between
              border-t border-[var(--border)]
              bg-[var(--surface)]/95
              px-3
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex items-center
                gap-2
                text-[9px]
                text-[var(--text-muted)]
              "
            >
              <span
                className="
                  h-1.5 w-1.5
                  rounded-full
                  bg-[var(--success)]
                "
              />

              <span>
                {activeToolDefinition.label}
              </span>

              <span>•</span>

              <span>{imageInfo.dimensions}</span>
            </div>

            <div
              className="
                hidden items-center
                gap-3
                text-[9px]
                text-[var(--text-muted)]
                sm:flex
              "
            >
              <span>Zoom {zoom}%</span>
              <span>{imageInfo.format}</span>
            </div>
          </div>
        </main>

        {/* =================================================
            RIGHT TOOL INSPECTOR
        ================================================= */}

        <aside
          className={`
            hidden shrink-0
            border-l border-[var(--border)]
            bg-[var(--editor-panel)]
            lg:block
            transition-[width]
            duration-300
            ease-out
            ${
              rightPanelOpen
                ? "w-[280px] xl:w-[320px]"
                : "w-0 overflow-hidden"
            }
          `}
        >
          <div className="flex h-full flex-col">
            <div
              className="
                flex h-12 shrink-0
                items-center
                justify-between
                border-b border-[var(--border)]
                px-4
              "
            >
              <div className="min-w-0">
                <div
                  className="
                    truncate
                    text-[10px]
                    font-semibold
                  "
                >
                  {activeToolDefinition.label}
                </div>

                <div
                  className="
                    mt-0.5 truncate
                    text-[8px]
                    text-[var(--text-muted)]
                  "
                >
                  {activeToolDefinition.description}
                </div>
              </div>
            </div>

            <div
              className="
                min-h-0 flex-1
                overflow-y-auto
              "
            >
              {renderToolContent()}
            </div>

            <div
              className="
                shrink-0
                border-t border-[var(--border)]
                bg-[var(--editor-panel-alt)]
                p-3
              "
            >
              <div
                className="
                  mb-2 flex
                  items-center
                  justify-between
                  text-[8px]
                  text-[var(--text-muted)]
                "
              >
                <span>Original</span>
                <span>{imageInfo.dimensions}</span>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="
                  flex h-9 w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[var(--brand)]
                  text-[10px]
                  font-semibold
                  text-white
                  shadow-[var(--shadow-sm)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--brand-hover)]
                  hover:shadow-[var(--shadow-md)]
                  active:translate-y-0
                "
              >
                <ArrowDownToLine size={13} />
                Export image
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ===================================================
          MOBILE BOTTOM BAR
      =================================================== */}

      <div
        className="
          flex h-14
          shrink-0
          items-center
          justify-between
          border-t border-[var(--border)]
          bg-[var(--editor-panel)]/95
          px-2
          backdrop-blur-xl
          lg:hidden
        "
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMobileToolsOpen(true)}
            className="
              flex h-9
              items-center gap-2
              rounded-lg
              px-3
              text-[10px]
              text-[var(--text-muted)]
              transition-all duration-200
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            <SlidersHorizontal size={14} />
            Tools
          </button>

          <button
            type="button"
            onClick={() => setMobileInspectorOpen(true)}
            className="
              flex h-9
              items-center gap-2
              rounded-lg
              border border-[var(--border)]
              bg-[var(--surface)]
              px-3
              text-[10px]
              font-medium
              text-[var(--text-secondary)]
              transition-all duration-200
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            <PanelRight size={14} />
            Edit
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            disabled={!history.length}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-muted)]
              disabled:opacity-30
            "
          >
            <Undo2 size={14} />
          </button>

          <button
            type="button"
            onClick={redo}
            disabled={!future.length}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-muted)]
              disabled:opacity-30
            "
          >
            <Redo2 size={14} />
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="
              flex h-9
              items-center gap-1.5
              rounded-lg
              bg-[var(--brand)]
              px-3
              text-[10px]
              font-semibold
              text-white
              shadow-[var(--shadow-sm)]
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* ===================================================
          MOBILE TOOL PANEL
      =================================================== */}

      {mobileToolsOpen && (
        <div
          className="
            fixed inset-0
            z-[500]
            lg:hidden
          "
        >
          <button
            type="button"
            aria-label="Close tools"
            onClick={() => setMobileToolsOpen(false)}
            className="
              absolute inset-0
              bg-black/40
              backdrop-blur-sm
            "
          />

          <aside
            className="
              absolute
              bottom-0 left-0 right-0
              max-h-[78vh]
              overflow-hidden
              rounded-t-2xl
              border-t border-[var(--border)]
              bg-[var(--surface)]
              shadow-[0_-20px_60px_rgba(0,0,0,0.2)]
            "
          >
            <div
              className="
                flex h-12
                items-center
                justify-between
                border-b border-[var(--border)]
                px-4
              "
            >
              <span
                className="
                  text-xs
                  font-semibold
                "
              >
                Edit tools
              </span>

              <button
                type="button"
                onClick={() =>
                  setMobileToolsOpen(false)
                }
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  text-[var(--text-muted)]
                  transition-colors
                  hover:bg-[var(--surface-muted)]
                "
              >
                <X size={15} />
              </button>
            </div>

            <div
              className="
                max-h-[calc(78vh-48px)]
                overflow-y-auto
                p-3
              "
            >
              <div
                className="
                  grid grid-cols-2
                  gap-2
                "
              >
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const active = activeTool === tool.id;

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => selectTool(tool.id)}
                      className={`
                        flex items-center
                        gap-2.5
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition-all duration-200
                        ${
                          active
                            ? "border-[var(--brand)]/25 bg-[var(--brand-light)] shadow-[var(--shadow-sm)]"
                            : "border-[var(--border)] bg-[var(--surface)] hover:-translate-y-0.5 hover:bg-[var(--surface-muted)]"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex h-8 w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          ${
                            active
                              ? "bg-[var(--brand)] text-white"
                              : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                          }
                        `}
                      >
                        <Icon size={14} />
                      </div>

                      <div className="min-w-0">
                        <div
                          className="
                            truncate
                            text-[10px]
                            font-medium
                          "
                        >
                          {tool.label}
                        </div>

                        <div
                          className="
                            mt-0.5
                            text-[8px]
                            text-[var(--text-muted)]
                          "
                        >
                          Shortcut {tool.shortcut}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ===================================================
          MOBILE TOOL INSPECTOR
      =================================================== */}

      {mobileInspectorOpen && (
        <div
          className="
            fixed inset-0
            z-[450]
            lg:hidden
          "
        >
          <button
            type="button"
            aria-label="Close inspector"
            onClick={() =>
              setMobileInspectorOpen(false)
            }
            className="
              absolute inset-0
              bg-black/40
              backdrop-blur-sm
            "
          />

          <aside
            className="
              absolute
              bottom-0 left-0 right-0
              max-h-[82vh]
              overflow-hidden
              rounded-t-2xl
              border-t border-[var(--border)]
              bg-[var(--surface)]
              shadow-[0_-20px_60px_rgba(0,0,0,0.25)]
            "
          >
            <div
              className="
                flex h-12
                shrink-0
                items-center
                justify-between
                border-b border-[var(--border)]
                px-4
              "
            >
              <div className="min-w-0">
                <div
                  className="
                    truncate
                    text-xs
                    font-semibold
                  "
                >
                  {activeToolDefinition.label}
                </div>

                <div
                  className="
                    mt-0.5 truncate
                    text-[8px]
                    text-[var(--text-muted)]
                  "
                >
                  {activeToolDefinition.description}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileInspectorOpen(false)
                }
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center justify-center
                  rounded-lg
                  text-[var(--text-muted)]
                  transition-colors
                  hover:bg-[var(--surface-muted)]
                "
              >
                <X size={15} />
              </button>
            </div>

            <div
              className="
                max-h-[calc(82vh-48px)]
                overflow-y-auto
              "
            >
              {renderToolContent()}
            </div>
          </aside>
        </div>
      )}

      {/* ===================================================
          FILE INPUT
      =================================================== */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}