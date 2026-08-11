// src/pages/Generator/GeneratorPage.tsx
import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";

import UploadPanel from "./UploadPanel";
import EditorPanel, { type EditorSettings } from "./EditorPanel";
import PreviewPanel from "./PreviewPanel";
import SizeGrid, { type GeneratedIcon } from "./SizeGrid";
import ExportPanel from "./ExportPanel";

const ICON_SIZES = [16, 32, 48, 64, 96, 128, 144, 152, 180, 192, 256, 384, 512];

const ICO_SIZES = [16, 32, 48, 64, 128, 256];

const DEFAULT_SETTINGS: EditorSettings = {
  padding: 10,
  scale: 100,
  background: "transparent",
  fit: "contain",
  positionX: 50,
  positionY: 50,
};

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

  // Background
  if (settings.background === "transparent") {
    context.clearRect(0, 0, size, size);
  } else {
    context.fillStyle = settings.background;
    context.fillRect(0, 0, size, size);
  }

  const padding = Math.max(0, Math.min(45, settings.padding));

  const availableSize = size * (1 - padding / 100) * (1 - padding / 100);

  const imageRatio = image.naturalWidth / image.naturalHeight;

  let drawWidth = availableSize;
  let drawHeight = availableSize;

  if (settings.fit === "contain") {
    if (imageRatio > 1) {
      drawHeight = availableSize / imageRatio;
    } else {
      drawWidth = availableSize * imageRatio;
    }
  }

  if (settings.fit === "cover") {
    if (imageRatio > 1) {
      drawWidth = availableSize * imageRatio;
    } else {
      drawHeight = availableSize / imageRatio;
    }
  }

  const scale = settings.scale / 100;

  drawWidth *= scale;
  drawHeight *= scale;

  const centerX = size / 2;
  const centerY = size / 2;

  const offsetX = ((settings.positionX - 50) / 100) * size;

  const offsetY = ((settings.positionY - 50) / 100) * size;

  const x = centerX - drawWidth / 2 + offsetX;

  const y = centerY - drawHeight / 2 + offsetY;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(image, x, y, drawWidth, drawHeight);

  return canvas.toDataURL("image/png");
}

function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";

  const binary = atob(base64);

  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function createIcoFile(icons: GeneratedIcon[]): Blob {
  const selectedIcons = icons.filter((icon) => ICO_SIZES.includes(icon.size));

  const pngData = selectedIcons.map((icon) => ({
    size: icon.size,
    bytes: dataUrlToUint8Array(icon.dataUrl),
  }));

  const headerSize = 6;
  const directorySize = 16 * pngData.length;

  let offset = headerSize + directorySize;

  const totalSize =
    offset + pngData.reduce((total, item) => total + item.bytes.length, 0);

  const buffer = new ArrayBuffer(totalSize);

  const view = new DataView(buffer);

  // ICO header
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, pngData.length, true);

  let directoryOffset = 6;

  for (const item of pngData) {
    const dimension = item.size >= 256 ? 0 : item.size;

    view.setUint8(directoryOffset, dimension);

    view.setUint8(directoryOffset + 1, dimension);

    // Color palette
    view.setUint8(directoryOffset + 2, 0);

    // Reserved
    view.setUint8(directoryOffset + 3, 0);

    // Color planes
    view.setUint16(directoryOffset + 4, 1, true);

    // Bits per pixel
    view.setUint16(directoryOffset + 6, 32, true);

    // PNG byte length
    view.setUint32(directoryOffset + 8, item.bytes.length, true);

    // PNG offset
    view.setUint32(directoryOffset + 12, offset, true);

    directoryOffset += 16;

    offset += item.bytes.length;
  }

  const output = new Uint8Array(buffer);

  let dataOffset = headerSize + directorySize;

  for (const item of pngData) {
    output.set(item.bytes, dataOffset);

    dataOffset += item.bytes.length;
  }

  return new Blob([output], { type: "image/x-icon" });
}

function createSvgExport(
  image: HTMLImageElement,
  settings: EditorSettings,
): string {
  const pngDataUrl = drawIcon(image, 512, settings);

  return `<?xml version="1.0" encoding="UTF-8"?>
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
    preserveAspectRatio="none"
  />
</svg>`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const bytes = dataUrlToUint8Array(dataUrl);

  const blob = new Blob([bytes], { type: "image/png" });

  downloadBlob(blob, filename);
}

export default function GeneratorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [fileName, setFileName] = useState("icon");

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [sourceFormat, setSourceFormat] = useState<string>("image/png");

  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);

  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);

  const updateSettings = (updates: Partial<EditorSettings>) => {
    setSettings((current) => ({
      ...current,
      ...updates,
    }));
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    const nextUrl = URL.createObjectURL(file);

    const nextImage = new Image();

    nextImage.onload = () => {
      setImage(nextImage);
    };

    nextImage.src = nextUrl;

    setImageUrl(nextUrl);

    setSourceFormat(file.type || "image/png");

    const cleanName = file.name.replace(/\.[^/.]+$/, "").trim();

    setFileName(cleanName || "icon");

    setGeneratedIcons([]);
  };

  const handleRemoveImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(null);
    setImage(null);
    setGeneratedIcons([]);
    setFileName("icon");
    setSourceFormat("image/png");
    setSettings(DEFAULT_SETTINGS);
  };

  const generateIcons = () => {
    if (!image) {
      return;
    }

    setIsGenerating(true);

    requestAnimationFrame(() => {
      const icons = ICON_SIZES.map((size) => ({
        size,
        dataUrl: drawIcon(image, size, settings),
      }));

      setGeneratedIcons(icons);

      setIsGenerating(false);
    });
  };

  const previewUrl = useMemo(() => {
    if (!image) {
      return null;
    }

    return drawIcon(image, 512, settings);
  }, [image, settings]);

  const svgContent = useMemo(() => {
    if (!image) {
      return null;
    }

    return createSvgExport(image, settings);
  }, [image, settings]);

  const htmlSnippet = useMemo(() => {
    return `<link rel="icon" href="/icons/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/icons/icon-48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png">`;
  }, []);

  const manifestSnippet = useMemo(() => {
    return `{
  "name": "Your App",
  "short_name": "Your App",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "display": "standalone"
}`;
  }, []);

  const handleDownloadIcon = (size: number) => {
    const icon = generatedIcons.find((item) => item.size === size);

    if (!icon) {
      return;
    }

    downloadDataUrl(icon.dataUrl, `${fileName}-${size}x${size}.png`);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) {
      return;
    }

    const blob = new Blob([svgContent], { type: "image/svg+xml" });

    downloadBlob(blob, `${fileName}.svg`);
  };

  const handleDownloadIco = () => {
    if (generatedIcons.length === 0) {
      return;
    }

    const ico = createIcoFile(generatedIcons);

    downloadBlob(ico, `${fileName}.ico`);
  };

  const handleDownloadZip = async () => {
    if (generatedIcons.length === 0 && !svgContent) {
      return;
    }

    const zip = new JSZip();

    const iconsFolder = zip.folder("icons");

    if (!iconsFolder) {
      return;
    }

    generatedIcons.forEach((icon) => {
      const bytes = dataUrlToUint8Array(icon.dataUrl);

      iconsFolder.file(`${fileName}-${icon.size}x${icon.size}.png`, bytes);
    });

    if (svgContent) {
      iconsFolder.file(`${fileName}.svg`, svgContent);
    }

    if (generatedIcons.length > 0) {
      const ico = createIcoFile(generatedIcons);

      const icoBytes = new Uint8Array(await ico.arrayBuffer());

      iconsFolder.file(`${fileName}.ico`, icoBytes);
    }

    zip.file("index.html-snippet.txt", htmlSnippet);

    zip.file("manifest.json", manifestSnippet);

    zip.file(
      "README.txt",
      `Generated with IconToolkit.

Files:
- PNG icon sizes
- SVG icon
- ICO favicon
- HTML installation snippet
- Web App Manifest snippet

All assets were generated locally in your browser.
`,
    );

    const blob = await zip.generateAsync({
      type: "blob",
    });

    downloadBlob(blob, `${fileName}-icon-set.zip`);
  };

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="min-h-full">
      {/* Page header */}
      <section className="border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6366F1]">
              Icon Generator
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-4xl">
              Create your icon set.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              Upload an image, adjust it for icon use, preview the result, and
              generate the sizes you need.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
              <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
                Browser-based
              </span>

              <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
                No account
              </span>

              <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
                PNG
              </span>

              <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
                SVG
              </span>

              <span className="rounded-full border border-[var(--border)] px-3 py-1.5">
                ICO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          {/* Left */}
          <div className="space-y-6">
            <UploadPanel
              imageUrl={imageUrl}
              fileName={fileName}
              sourceFormat={sourceFormat}
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveImage}
            />

            <EditorPanel
              settings={settings}
              onChange={updateSettings}
              disabled={!image}
            />
          </div>

          {/* Center */}
          <div className="min-w-0">
            <PreviewPanel
              imageUrl={previewUrl}
              hasImage={Boolean(image)}
              imageWidth={image?.naturalWidth ?? 0}
              imageHeight={image?.naturalHeight ?? 0}
            />
          </div>

          {/* Right */}
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

        {/* Generated sizes */}
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