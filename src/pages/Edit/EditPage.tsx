// src/pages/Edit/EditPage.tsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  editor: ImageEditorState;
};

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

function createDefaultEditorState(
  width: number,
  height: number,
): ImageEditorState {
  return {
    background: { ...DEFAULT_BACKGROUND },
    padding: { ...DEFAULT_PADDING },
    crop: {
      x: 0,
      y: 0,
      width,
      height,
    },
    resize: {
      width,
      height,
      lockAspectRatio: true,
      mode: "fit",
    },
    rotateFlip: { ...DEFAULT_ROTATE_FLIP },
    roundedCorners: {
      ...DEFAULT_ROUNDED_CORNERS,
    },
  };
}

/* =========================================================
   HELPERS
========================================================= */

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/* =========================================================
   COMPONENT
========================================================= */

export default function EditPage() {
  /* -------------------------------------------------------
     Image
  ------------------------------------------------------- */

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [imageName, setImageName] = useState("Untitled image");

  const [imageType, setImageType] = useState("image/png");

  const [imageWidth, setImageWidth] = useState(0);

  const [imageHeight, setImageHeight] = useState(0);

  const [imageSize, setImageSize] = useState(0);

  /* -------------------------------------------------------
     Editor
  ------------------------------------------------------- */

  const [editor, setEditor] = useState<ImageEditorState>(() =>
    createDefaultEditorState(512, 512),
  );

  const [activeTool, setActiveTool] = useState<EditTool>("image");

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  const [zoom, setZoom] = useState(75);

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const saved = window.localStorage.getItem("icon-toolkit-theme");

    if (saved === "dark" || saved === "light") {
      return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  /* -------------------------------------------------------
     History
  ------------------------------------------------------- */

  const [history, setHistory] = useState<HistoryState[]>([]);

  const [future, setFuture] = useState<HistoryState[]>([]);

  /* -------------------------------------------------------
     Refs
  ------------------------------------------------------- */

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const objectUrlRef = useRef<string | null>(null);

  /* =======================================================
     THEME
  ======================================================= */

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    root.style.colorScheme = theme;

    window.localStorage.setItem("icon-toolkit-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  /* =======================================================
     CURRENT HISTORY SNAPSHOT
  ======================================================= */

  const createSnapshot = useCallback((): HistoryState => {
    return {
      imageUrl,
      imageName,
      imageType,
      imageWidth,
      imageHeight,
      editor: {
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
      },
    };
  }, [imageUrl, imageName, imageType, imageWidth, imageHeight, editor]);

  /* =======================================================
     HISTORY
  ======================================================= */

  const saveHistory = useCallback(() => {
    setHistory((current) => [...current.slice(-49), createSnapshot()]);

    setFuture([]);
  }, [createSnapshot]);

  const undo = useCallback(() => {
    if (!history.length) {
      return;
    }

    const previous = history[history.length - 1];

    setFuture((current) => [createSnapshot(), ...current]);

    setImageUrl(previous.imageUrl);
    setImageName(previous.imageName);
    setImageType(previous.imageType);
    setImageWidth(previous.imageWidth);
    setImageHeight(previous.imageHeight);
    setEditor(previous.editor);

    setHistory((current) => current.slice(0, -1));
  }, [history, createSnapshot]);

  const redo = useCallback(() => {
    if (!future.length) {
      return;
    }

    const next = future[0];

    setHistory((current) => [...current, createSnapshot()]);

    setImageUrl(next.imageUrl);
    setImageName(next.imageName);
    setImageType(next.imageType);
    setImageWidth(next.imageWidth);
    setImageHeight(next.imageHeight);
    setEditor(next.editor);

    setFuture((current) => current.slice(1));
  }, [future, createSnapshot]);

  /* =======================================================
     IMAGE LOADING
  ======================================================= */

  const loadImage = useCallback((file: File) => {
    if (!isImageFile(file)) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);

    objectUrlRef.current = url;

    const image = new Image();

    image.onload = () => {
      setImageUrl(url);
      setImageName(file.name);
      setImageType(file.type || "image/png");
      setImageWidth(image.naturalWidth);
      setImageHeight(image.naturalHeight);
      setImageSize(file.size);

      setEditor(
        createDefaultEditorState(image.naturalWidth, image.naturalHeight),
      );

      setHistory([]);
      setFuture([]);
      setActiveTool("image");
      setZoom(75);
    };

    image.src = url;
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      loadImage(file);
    }

    event.target.value = "";
  };

  /* =======================================================
     DRAG / DROP
  ======================================================= */

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      loadImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  /* =======================================================
     BACKGROUND
  ======================================================= */

  const updateBackground = useCallback(
    (updates: Partial<BackgroundSettings>) => {
      saveHistory();

      setEditor((current) => ({
        ...current,
        background: {
          ...current.background,
          ...updates,
        },
      }));
    },
    [saveHistory],
  );

  /* =======================================================
     PADDING
  ======================================================= */

  const updatePadding = useCallback(
    (updates: Partial<PaddingSettings>) => {
      saveHistory();

      setEditor((current) => ({
        ...current,
        padding: {
          ...current.padding,
          ...updates,
        },
      }));
    },
    [saveHistory],
  );

  /* =======================================================
     RESIZE
  ======================================================= */

  const updateResize = useCallback((updates: Partial<ResizeSettings>) => {
    setEditor((current) => {
      const nextResize = {
        ...current.resize,
        ...updates,
      };

      const changed =
        nextResize.width !== current.resize.width ||
        nextResize.height !== current.resize.height ||
        nextResize.lockAspectRatio !== current.resize.lockAspectRatio ||
        nextResize.mode !== current.resize.mode;

      if (!changed) {
        return current;
      }

      return {
        ...current,
        resize: nextResize,
      };
    });
  }, []);

  /* =======================================================
     ROTATE / FLIP
  ======================================================= */

  const updateRotateFlip = useCallback(
    (updates: Partial<RotateFlipSettings>) => {
      saveHistory();

      setEditor((current) => ({
        ...current,
        rotateFlip: {
          ...current.rotateFlip,
          ...updates,
        },
      }));
    },
    [saveHistory],
  );

  /* =======================================================
     ROUNDED CORNERS
  ======================================================= */

  const updateRoundedCorners = useCallback(
    (updates: Partial<RoundedCornersSettings>) => {
      saveHistory();

      setEditor((current) => ({
        ...current,
        roundedCorners: {
          ...current.roundedCorners,
          ...updates,
        },
      }));
    },
    [saveHistory],
  );

  /* =======================================================
     CROP
  ======================================================= */

  const updateCrop = useCallback((crop: CropSettings | null) => {
    setEditor((current) => ({
      ...current,
      crop,
    }));
  }, []);

  const beginCropInteraction = useCallback(() => {
    saveHistory();
  }, [saveHistory]);

  /* =======================================================
     RESET
  ======================================================= */

  const resetEditor = useCallback(() => {
    if (!imageUrl) {
      return;
    }

    saveHistory();

    setEditor(createDefaultEditorState(imageWidth, imageHeight));

    setZoom(75);
    setActiveTool("image");
  }, [imageUrl, imageWidth, imageHeight, saveHistory]);

  /* =======================================================
     REMOVE IMAGE
  ======================================================= */

  const clearImage = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);

      objectUrlRef.current = null;
    }

    setImageUrl(null);
    setImageName("Untitled image");
    setImageType("image/png");
    setImageWidth(0);
    setImageHeight(0);
    setImageSize(0);

    setEditor(createDefaultEditorState(512, 512));

    setHistory([]);
    setFuture([]);
    setActiveTool("image");
  }, []);

  function loadImageForCanvas(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Unable to load image"));

      image.src = src;
    });
  }

  /* =======================================================
     DOWNLOAD / FINAL COMPOSITE EXPORT
  ======================================================= */

  const handleDownload = useCallback(async () => {
    if (!imageUrl || !imageWidth || !imageHeight) {
      return;
    }

    try {
      const source = await loadImageForCanvas(imageUrl);

      const crop = editor.crop ?? {
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight,
      };

      const cropX = clamp(Math.round(crop.x), 0, Math.max(0, imageWidth - 1));

      const cropY = clamp(Math.round(crop.y), 0, Math.max(0, imageHeight - 1));

      const cropWidth = clamp(Math.round(crop.width), 1, imageWidth - cropX);

      const cropHeight = clamp(Math.round(crop.height), 1, imageHeight - cropY);

      const outputWidth = Math.max(1, Math.round(editor.resize.width));

      const outputHeight = Math.max(1, Math.round(editor.resize.height));

      const canvas = document.createElement("canvas");

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, outputWidth, outputHeight);

      /*
       * =======================================================
       * BACKGROUND
       * =======================================================
       */

      if (editor.background.type === "solid") {
        context.fillStyle = editor.background.color;

        context.fillRect(0, 0, outputWidth, outputHeight);
      }

      if (editor.background.type === "gradient") {
        const angle = (editor.background.gradientAngle * Math.PI) / 180;

        const centerX = outputWidth / 2;
        const centerY = outputHeight / 2;

        const length =
          Math.sqrt(outputWidth * outputWidth + outputHeight * outputHeight) /
          2;

        const x1 = centerX - Math.cos(angle) * length;

        const y1 = centerY - Math.sin(angle) * length;

        const x2 = centerX + Math.cos(angle) * length;

        const y2 = centerY + Math.sin(angle) * length;

        const gradient = context.createLinearGradient(x1, y1, x2, y2);

        gradient.addColorStop(0, editor.background.color);

        gradient.addColorStop(1, editor.background.gradientTo);

        context.fillStyle = gradient;

        context.fillRect(0, 0, outputWidth, outputHeight);
      }

      /*
       * =======================================================
       * PADDING
       * =======================================================
       */

      const paddingLeft = Math.max(0, Math.round(editor.padding.left));

      const paddingRight = Math.max(0, Math.round(editor.padding.right));

      const paddingTop = Math.max(0, Math.round(editor.padding.top));

      const paddingBottom = Math.max(0, Math.round(editor.padding.bottom));

      const availableWidth = Math.max(
        1,
        outputWidth - paddingLeft - paddingRight,
      );

      const availableHeight = Math.max(
        1,
        outputHeight - paddingTop - paddingBottom,
      );

      /*
       * =======================================================
       * RESIZE MODE
       * =======================================================
       */

      let drawWidth: number;
      let drawHeight: number;

      if (editor.resize.mode === "stretch") {
        drawWidth = availableWidth;
        drawHeight = availableHeight;
      } else {
        const scale =
          editor.resize.mode === "fill"
            ? Math.max(availableWidth / cropWidth, availableHeight / cropHeight)
            : Math.min(
                availableWidth / cropWidth,
                availableHeight / cropHeight,
              );

        drawWidth = cropWidth * scale;
        drawHeight = cropHeight * scale;
      }

      /*
       * =======================================================
       * IMAGE POSITION
       * =======================================================
       */

      const centerX =
        paddingLeft + (availableWidth - drawWidth) / 2 + drawWidth / 2;

      const centerY =
        paddingTop + (availableHeight - drawHeight) / 2 + drawHeight / 2;

      /*
       * =======================================================
       * DRAW IMAGE
       * =======================================================
       */

      context.save();

      /*
       * Everything is clipped to the output canvas.
       *
       * This is especially important for Fill mode because
       * Fill intentionally creates an image larger than the
       * available output area.
       */
      context.beginPath();

      context.rect(0, 0, outputWidth, outputHeight);

      context.clip();

      context.translate(centerX, centerY);

      context.rotate((editor.rotateFlip.rotation * Math.PI) / 180);

      context.scale(
        editor.rotateFlip.flipHorizontal ? -1 : 1,
        editor.rotateFlip.flipVertical ? -1 : 1,
      );

      /*
       * =======================================================
       * ROUNDED CORNERS
       * =======================================================
       */

      const radiusPercent = clamp(editor.roundedCorners.radius, 0, 100);

      if (radiusPercent > 0) {
        const radius = Math.min(drawWidth, drawHeight) * (radiusPercent / 100);

        const left = -drawWidth / 2;
        const top = -drawHeight / 2;
        const right = drawWidth / 2;
        const bottom = drawHeight / 2;

        context.beginPath();

        context.moveTo(left + radius, top);

        context.lineTo(right - radius, top);

        context.quadraticCurveTo(right, top, right, top + radius);

        context.lineTo(right, bottom - radius);

        context.quadraticCurveTo(right, bottom, right - radius, bottom);

        context.lineTo(left + radius, bottom);

        context.quadraticCurveTo(left, bottom, left, bottom - radius);

        context.lineTo(left, top + radius);

        context.quadraticCurveTo(left, top, left + radius, top);

        context.closePath();

        context.clip();
      }

      /*
       * =======================================================
       * IMAGE DRAW
       * =======================================================
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
       * =======================================================
       * OUTPUT FORMAT
       * =======================================================
       */

      const outputType =
        imageType === "image/jpeg"
          ? "image/jpeg"
          : imageType === "image/webp"
            ? "image/webp"
            : "image/png";

      /*
       * JPEG cannot contain transparency.
       *
       * Flatten transparent exports against white.
       */

      let exportCanvas = canvas;

      if (
        outputType === "image/jpeg" &&
        editor.background.type === "transparent"
      ) {
        const flattenedCanvas = document.createElement("canvas");

        flattenedCanvas.width = outputWidth;

        flattenedCanvas.height = outputHeight;

        const flattenedContext = flattenedCanvas.getContext("2d");

        if (!flattenedContext) {
          return;
        }

        flattenedContext.fillStyle = "#ffffff";

        flattenedContext.fillRect(0, 0, outputWidth, outputHeight);

        flattenedContext.drawImage(canvas, 0, 0);

        exportCanvas = flattenedCanvas;
      }

      /*
       * =======================================================
       * BLOB
       * =======================================================
       */

      const blob = await new Promise<Blob | null>((resolve) => {
        exportCanvas.toBlob(resolve, outputType, 0.95);
      });

      if (!blob) {
        return;
      }

      /*
       * =======================================================
       * DOWNLOAD
       * =======================================================
       */

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const extension =
        outputType === "image/jpeg"
          ? "jpg"
          : outputType === "image/webp"
            ? "webp"
            : "png";

      const baseName = imageName.replace(/\.[^/.]+$/, "");

      link.download = `${baseName}-${outputWidth}x${outputHeight}.${extension}`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export edited image:", error);
    }
  }, [imageUrl, imageWidth, imageHeight, imageType, imageName, editor]);

  
  /* =======================================================
     ZOOM
  ======================================================= */

  const zoomIn = () => {
    setZoom((current) => clamp(current + 10, 25, 400));
  };

  const zoomOut = () => {
    setZoom((current) => clamp(current - 10, 25, 400));
  };

  const resetZoom = () => {
    setZoom(75);
  };

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        if (isTyping) {
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

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        if (isTyping) {
          return;
        }

        event.preventDefault();
        redo();

        return;
      }

      if (isTyping) {
        return;
      }

      if (event.key === "Escape") {
        setMobileToolsOpen(false);
        return;
      }

      switch (event.key.toLowerCase()) {
        case "1":
          setActiveTool("image");
          break;

        case "2":
          setActiveTool("crop");
          break;

        case "3":
          setActiveTool("resize");
          break;

        case "4":
          setActiveTool("rotate");
          break;

        case "5":
          setActiveTool("background");
          break;

        case "6":
          setActiveTool("remove-background");
          break;

        case "7":
          setActiveTool("corners");
          break;

        case "8":
          setActiveTool("padding");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  /* =======================================================
     CLEANUP OBJECT URL
  ======================================================= */

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  /* =======================================================
     IMAGE INFORMATION
  ======================================================= */

  const imageInfo = useMemo(
    () => ({
      dimensions:
        imageWidth && imageHeight ? `${imageWidth} × ${imageHeight}` : "—",

      format: imageType.replace("image/", "").toUpperCase() || "—",

      size: imageSize > 0 ? formatFileSize(imageSize) : "—",
    }),
    [imageWidth, imageHeight, imageType, imageSize],
  );

  /* =======================================================
     TOOL DEFINITIONS
  ======================================================= */

  const tools = [
    {
      id: "image" as EditTool,
      label: "Image",
      description: "Image overview and editor",
      icon: ImagePlus,
      shortcut: "1",
    },
    {
      id: "crop" as EditTool,
      label: "Crop",
      description: "Crop your image",
      icon: Crop,
      shortcut: "2",
    },
    {
      id: "resize" as EditTool,
      label: "Resize",
      description: "Change dimensions",
      icon: Maximize2,
      shortcut: "3",
    },
    {
      id: "rotate" as EditTool,
      label: "Rotate & Flip",
      description: "Rotate or flip image",
      icon: RotateCw,
      shortcut: "4",
    },
    {
      id: "background" as EditTool,
      label: "Background",
      description: "Edit image background",
      icon: SlidersHorizontal,
      shortcut: "5",
    },
    {
      id: "remove-background" as EditTool,
      label: "Remove Background",
      description: "Remove image background",
      icon: Sparkles,
      shortcut: "6",
    },
    {
      id: "corners" as EditTool,
      label: "Rounded Corners",
      description: "Round image corners",
      icon: MoreHorizontal,
      shortcut: "7",
    },
    {
      id: "padding" as EditTool,
      label: "Padding",
      description: "Add safe area",
      icon: PanelRight,
      shortcut: "8",
    },
  ];

  const activeToolDefinition =
    tools.find((tool) => tool.id === activeTool) ?? tools[0];

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
              saveHistory();
              setImageUrl(nextUrl);
            }}
          />
        );

      case "corners":
        return (
          <RoundedCornersTool
            settings={editor.roundedCorners}
            onChange={updateRoundedCorners}
          />
        );

      case "padding":
        return (
          <PaddingTool settings={editor.padding} onChange={updatePadding} />
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
            background={editor.background}
            padding={editor.padding}
            resize={editor.resize}
            rotateFlip={editor.rotateFlip}
            roundedCorners={editor.roundedCorners}
            zoom={zoom}
            onZoomChange={setZoom}
          />
        );
    }
  };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!imageUrl) {
    return (
      <div
        className="
          flex min-h-[calc(100vh-64px)]
          flex-col overflow-hidden
          bg-[var(--background)]
          text-[var(--text)]
          transition-colors duration-200
        "
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* HEADER */}

        <header
          className="
            flex h-14 shrink-0
            items-center justify-between
            border-b border-[var(--border)]
            bg-[var(--editor-header)]
            px-3 sm:px-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                bg-[var(--brand)]
                text-[11px]
                font-bold
                text-white
              "
            >
              IT
            </div>

            <div>
              <div className="text-xs font-semibold">Edit</div>

              <div
                className="
                  hidden text-[10px]
                  text-[var(--text-muted)]
                  sm:block
                "
              >
                Image editing studio
              </div>
            </div>
          </div>

          <div
            className="
    flex items-center
    gap-1
  "
          >
            <button
              type="button"
              onClick={() => setMobileInspectorOpen(true)}
              className="
      flex h-9
      items-center gap-1.5
      rounded-lg
      border
      border-[var(--border)]
      bg-[var(--surface)]
      px-3
      text-[10px]
      font-medium
      text-[var(--text-secondary)]
      hover:bg-[var(--surface-muted)]
    "
            >
              <SlidersHorizontal size={13} />
              Edit
            </button>

            <button
              type="button"
              onClick={undo}
              disabled={!history.length}
              className="
      flex h-9 w-9
      items-center
      justify-center
      rounded-lg
      text-[var(--text-muted)]
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
      items-center
      justify-center
      rounded-lg
      text-[var(--text-muted)]
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
      items-center
      gap-1.5
      rounded-lg
      bg-[var(--brand)]
      px-3
      text-[10px]
      font-semibold
      text-white
    "
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </header>

        {/* EMPTY WORKSPACE */}

        <main
          className="
            flex min-h-0 flex-1
            items-center justify-center
            overflow-auto
            bg-[var(--editor-workspace)]
            p-4 sm:p-8
          "
        >
          <div
            className="
              w-full max-w-2xl
              rounded-3xl
              border border-dashed
              border-[var(--border-strong)]
              bg-[var(--surface)]
              p-6
              text-center
              shadow-[var(--shadow-lg)]
              transition-colors
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
              Upload a PNG, JPG, WebP, SVG, or another supported image and edit
              it directly in your browser.
            </p>

            <div
              className="
                mt-7 flex flex-col
                items-center justify-center
                gap-2 sm:flex-row
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
                  transition
                  hover:bg-[var(--brand-hover)]
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
                      border
                      border-[var(--border)]
                      bg-[var(--surface-subtle)]
                      p-3
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

  /* =======================================================
     EDITOR
  ======================================================= */

  return (
    <div
      className="
        flex min-h-[calc(100vh-64px)]
        flex-col overflow-hidden
        bg-[var(--background)]
        text-[var(--text)]
        transition-colors duration-200
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
                hidden text-[10px]
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
              transition
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
              transition
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
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-2.5
              text-[10px]
              font-medium
              text-[var(--text-secondary)]
              transition
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            <Upload size={13} />

            <span className="hidden sm:inline">Replace</span>
          </button>

          <button
            type="button"
            onClick={resetEditor}
            title="Reset edits"
            className="
              hidden h-8 w-8
              items-center justify-center
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition
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
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
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
              transition
              hover:bg-[var(--brand-hover)]
            "
          >
            <Download size={13} />

            <span className="hidden sm:inline">Download</span>
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
            border-r
            border-[var(--border)]
            bg-[var(--editor-panel)]
            transition-all
            duration-200
            lg:block
            ${leftPanelOpen ? "w-[220px]" : "w-0 overflow-hidden"}
          `}
        >
          <div
            className="
              flex h-full
              flex-col
            "
          >
            {/* PANEL HEADER */}

            <div
              className="
                flex h-12
                shrink-0
                items-center
                justify-between
                border-b
                border-[var(--border)]
                px-3
              "
            >
              <div
                className="
                  flex items-center gap-2
                "
              >
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

            {/* TOOLS */}

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
                        transition
                        ${
                          active
                            ? "border-[var(--brand)]/25 bg-[var(--brand-light)] text-[var(--text)]"
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
                          ${
                            active
                              ? "bg-[var(--brand)] text-white"
                              : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
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
                          border
                          border-[var(--border)]
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

            {/* PANEL FOOTER */}

            <div
              className="
                shrink-0
                border-t
                border-[var(--border)]
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
                  transition
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
              border
              border-[var(--border)]
              bg-[var(--surface)]/95
              p-1
              shadow-[var(--shadow-lg)]
              backdrop-blur-xl
              sm:top-4
            "
          >
            <button
              type="button"
              title="Toggle left panel"
              onClick={() => setLeftPanelOpen((current) => !current)}
              className="
                hidden h-8 w-8
                items-center
                justify-center
                rounded-lg
                text-[var(--text-muted)]
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                lg:flex
              "
            >
              <PanelLeft size={14} />
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
                transition
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
                transition
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
              onClick={() => {
                const index = tools.findIndex((tool) => tool.id === activeTool);

                const previous = tools[Math.max(0, index - 1)];

                if (previous) {
                  setActiveTool(previous.id);
                }
              }}
              className="
                hidden h-8 w-8
                items-center justify-center
                rounded-lg
                text-[var(--text-muted)]
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                sm:flex
              "
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              title="Next tool"
              onClick={() => {
                const index = tools.findIndex((tool) => tool.id === activeTool);

                const next = tools[Math.min(tools.length - 1, index + 1)];

                if (next) {
                  setActiveTool(next.id);
                }
              }}
              className="
                hidden h-8 w-8
                items-center justify-center
                rounded-lg
                text-[var(--text-muted)]
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
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
              onClick={() => setMobileToolsOpen((current) => !current)}
              className="
                flex h-9
                items-center gap-2
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--surface)]/95
                px-3
                text-[10px]
                font-medium
                shadow-[var(--shadow-md)]
                backdrop-blur-xl
              "
            >
              <activeToolDefinition.icon size={13} />

              {activeToolDefinition.label}

              <ChevronDown size={12} />
            </button>

            {mobileToolsOpen && (
              <div
                className="
                  absolute left-0 top-11
                  w-64
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  p-1.5
                  shadow-[var(--shadow-lg)]
                "
              >
                {tools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        setActiveTool(tool.id);
                        setMobileToolsOpen(false);
                        setMobileInspectorOpen(true);
                      }}
                      className="
                        flex w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-2.5 py-2
                        text-left
                        hover:bg-[var(--surface-muted)]
                      "
                    >
                      <Icon
                        size={14}
                        className="
                          text-[var(--text-muted)]
                        "
                      />

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
              sm:p-12
              lg:p-20
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
              backgroundSize: "var(--editor-grid-size) var(--editor-grid-size)",
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
    border
    border-[var(--canvas-border)]
    bg-[var(--canvas-background)]
    shadow-[0_30px_80px_var(--editor-shadow)]
  "
                style={{
                  width: Math.max(180, editor.resize.width * (zoom / 100)),
                  height: Math.max(180, editor.resize.height * (zoom / 100)),
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
              border-t
              border-[var(--border)]
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

              <span>{activeToolDefinition.label}</span>

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
border-l
border-[var(--border)]
bg-[var(--editor-panel)]
transition-all
duration-200
lg:block
           ${rightPanelOpen ? "w-[280px] xl:w-[320px]" : "w-0 overflow-hidden"}
          `}
        >
          <div
            className="
              flex h-full
              flex-col
            "
          >
            {/* HEADER */}

            <div
              className="
                flex h-12
                shrink-0
                items-center
                justify-between
                border-b
                border-[var(--border)]
                px-4
              "
            >
              <div>
                <div
                  className="
                    text-[10px]
                    font-semibold
                  "
                >
                  {activeToolDefinition.label}
                </div>

                <div
                  className="
                    mt-0.5
                    text-[8px]
                    text-[var(--text-muted)]
                  "
                >
                  {activeToolDefinition.description}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRightPanelOpen((current) => !current)}
                className="
                  flex h-7 w-7
                  items-center justify-center
                  rounded-lg
                  text-[var(--text-muted)]
                  hover:bg-[var(--surface-muted)]
                  hover:text-[var(--text)]
                "
              >
                <PanelRight size={13} />
              </button>
            </div>

            {/* CONTENT */}

            <div
              className="
                min-h-0 flex-1
                overflow-y-auto
              "
            >
              {renderToolContent()}
            </div>

            {/* FOOTER */}

            <div
              className="
                shrink-0
                border-t
                border-[var(--border)]
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
                  transition
                  hover:bg-[var(--brand-hover)]
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
          border-t
          border-[var(--border)]
          bg-[var(--editor-panel)]/95
          px-2
          backdrop-blur-xl
          lg:hidden
        "
      >
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
            hover:bg-[var(--surface-muted)]
            hover:text-[var(--text)]
          "
        >
          <SlidersHorizontal size={14} />
          Tools
        </button>

        <div
          className="
            flex items-center
            gap-1
          "
        >
          <button
            type="button"
            onClick={undo}
            disabled={!history.length}
            className="
              flex h-9 w-9
              items-center
              justify-center
              rounded-lg
              text-[var(--text-muted)]
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
              items-center
              justify-center
              rounded-lg
              text-[var(--text-muted)]
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
              items-center
              gap-1.5
              rounded-lg
              bg-[var(--brand)]
              px-3
              text-[10px]
              font-semibold
              text-white
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
              border-t
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-[0_-20px_60px_rgba(0,0,0,0.2)]
            "
          >
            <div
              className="
                flex h-12
                items-center
                justify-between
                border-b
                border-[var(--border)]
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
                onClick={() => setMobileToolsOpen(false)}
                className="
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-[var(--text-muted)]
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
                      onClick={() => {
                        setActiveTool(tool.id);
                        setMobileToolsOpen(false);
                        setMobileInspectorOpen(true);
                      }}
                      className={`
                        flex items-center
                        gap-2.5
                        rounded-xl
                        border
                        p-3
                        text-left
                        ${
                          active
                            ? "border-[var(--brand)]/25 bg-[var(--brand-light)]"
                            : "border-[var(--border)] bg-[var(--surface)]"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex h-8 w-8
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
                          {tool.shortcut}
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
      xl:hidden
    "
        >
          <button
            type="button"
            aria-label="Close inspector"
            onClick={() => setMobileInspectorOpen(false)}
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
        border-t
        border-[var(--border)]
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
          border-b
          border-[var(--border)]
          px-4
        "
            >
              <div>
                <div className="text-xs font-semibold">
                  {activeToolDefinition.label}
                </div>

                <div className="mt-0.5 text-[8px] text-[var(--text-muted)]">
                  {activeToolDefinition.description}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileInspectorOpen(false)}
                className="
            flex h-8 w-8
            items-center justify-center
            rounded-lg
            text-[var(--text-muted)]
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

      {/* FILE INPUT */}

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
