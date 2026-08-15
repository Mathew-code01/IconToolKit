// src/pages/Convert/ConvertPage.tsx
// src/pages/Convert/ConvertPage.tsx

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type {
  ConvertFile,
  ConvertHistoryItem,
  ConvertSettingsState,
} from "./ConvertTypes";

import {
  FORMAT_LABELS,
  getFormatFromFile,
} from "./ConvertToolRegistry";

import ConvertUploader from "./ConvertUploader";
import ConvertQueue from "./ConvertQueue";
import ConvertSettings from "./ConvertSettings";
import ConvertPreview from "./ConvertPreview";
import ConvertProgress from "./ConvertProgress";
import ConvertResults from "./ConvertResults";
import ConvertExport from "./ConvertExport";
import ConvertHistory from "./ConvertHistory";

import { addConversionHistory } from "./convertHistoryStore";

import {
  convertFile,
  getFileDimensions,
} from "./convertEngine";

function createId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

const DEFAULT_SETTINGS: ConvertSettingsState = {
  outputFormat: "webp",

  quality: 90,

  resizeEnabled: false,
  width: null,
  height: null,
  keepAspectRatio: true,

  backgroundEnabled: false,
  backgroundColor: "#ffffff",

  preserveTransparency: true,

  dpi: 96,

  fileNameMode: "original",
  customFileName: "",
  suffix: "-converted",

  icoSizes: [
    16,
    32,
    48,
    64,
    128,
    256,
  ],

  pdfPageSize: "auto",
  pdfOrientation: "portrait",
};

function createPreviewUrl(file: File) {
  const fileName = file.name.toLowerCase();

  const isImage = file.type.startsWith("image/");
  const isSvg = fileName.endsWith(".svg");
  const isPdf = file.type === "application/pdf" || fileName.endsWith(".pdf");

  if (isImage || isSvg || isPdf) {
    return URL.createObjectURL(file);
  }

  return null;
}

function revokePreview(item: ConvertFile) {
  if (item.previewUrl) {
    URL.revokeObjectURL(item.previewUrl);
  }

  if (item.result?.downloadUrl) {
    URL.revokeObjectURL(
      item.result.downloadUrl,
    );
  }
}

export default function ConvertPage() {
  const [files, setFiles] = useState<
    ConvertFile[]
  >([]);

  const [settings, setSettings] =
    useState<ConvertSettingsState>(
      DEFAULT_SETTINGS,
    );

  const [converting, setConverting] =
    useState(false);

  const [
    conversionController,
    setConversionController,
  ] =
    useState<AbortController | null>(null);

  const [
    overallProgress,
    setOverallProgress,
  ] = useState(0);

  const [
    completedCount,
    setCompletedCount,
  ] = useState(0);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const updateSettings = useCallback(
    (
      patch: Partial<ConvertSettingsState>,
    ) => {
      setSettings((current) => ({
        ...current,
        ...patch,
      }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings({
      ...DEFAULT_SETTINGS,
      icoSizes: [
        ...DEFAULT_SETTINGS.icoSizes,
      ],
    });
  }, []);

  const addFiles = useCallback(
    async (incoming: File[]) => {
      setErrorMessage(null);

      const next: ConvertFile[] = [];

      for (const file of incoming) {
        const sourceFormat =
          getFormatFromFile(file);

        if (!sourceFormat) {
          continue;
        }

        const dimensions =
          await getFileDimensions(file);

        next.push({
          id: createId(),
          file,
          sourceFormat,
          sourceLabel:
            FORMAT_LABELS[sourceFormat],
          previewUrl:
            createPreviewUrl(file),
          width: dimensions.width,
          height: dimensions.height,
          status: "queued",
          progress: 0,
          error: null,
          result: null,
        });
      }

      if (!next.length) {
        setErrorMessage(
          "No supported files were found.",
        );

        return;
      }

      setFiles((current) => [
        ...current,
        ...next,
      ]);

      /*
       * Set a sensible output format when
       * the first file is added.
       */
      if (files.length === 0) {
        const firstFormat =
          next[0]?.sourceFormat;

        if (
          firstFormat === "png" ||
          firstFormat === "jpg"
        ) {
          setSettings((current) => ({
            ...current,
            outputFormat:
              firstFormat === "png"
                ? "webp"
                : "png",
          }));
        }

        if (firstFormat === "webp") {
          setSettings((current) => ({
            ...current,
            outputFormat: "png",
          }));
        }

        if (firstFormat === "svg") {
          setSettings((current) => ({
            ...current,
            outputFormat: "png",
          }));
        }

        if (firstFormat === "ico") {
          setSettings((current) => ({
            ...current,
            outputFormat: "png",
          }));
        }

        if (firstFormat === "pdf") {
          setSettings((current) => ({
            ...current,
            outputFormat: "png",
          }));
        }
      }
    },
    [files.length],
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((current) => {
        const item = current.find(
          (entry) => entry.id === id,
        );

        if (item) {
          revokePreview(item);
        }

        return current.filter(
          (entry) => entry.id !== id,
        );
      });
    },
    [],
  );

  const clearQueue = useCallback(() => {
    files.forEach(revokePreview);

    setFiles([]);
    setErrorMessage(null);
    setOverallProgress(0);
    setCompletedCount(0);
  }, [files]);

  const moveFile = useCallback(
    (
      id: string,
      direction: "up" | "down",
    ) => {
      setFiles((current) => {
        const index =
          current.findIndex(
            (item) => item.id === id,
          );

        if (index < 0) {
          return current;
        }

        const target =
          direction === "up"
            ? index - 1
            : index + 1;

        if (
          target < 0 ||
          target >= current.length
        ) {
          return current;
        }

        const copy = [...current];

        [
          copy[index],
          copy[target],
        ] = [
          copy[target],
          copy[index],
        ];

        return copy;
      });
    },
    [],
  );

  const convert = useCallback(
    async () => {
      if (
        !files.length ||
        converting
      ) {
        return;
      }

      const controller =
        new AbortController();

      setConversionController(
        controller,
      );

      setConverting(true);
      setErrorMessage(null);
      setCompletedCount(0);
      setOverallProgress(0);

      setFiles((current) =>
        current.map((item) => ({
          ...item,
          status: "queued",
          progress: 0,
          error: null,
          result: null,
        })),
      );

      let completed = 0;

      for (const item of files) {
        if (
          controller.signal.aborted
        ) {
          break;
        }

        setFiles((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status:
                    "processing",
                  progress: 0,
                }
              : entry,
          ),
        );

        try {
          const result =
            await convertFile(
              item,
              settings,
              ({ progress }) => {
                if (
                  controller.signal
                    .aborted
                ) {
                  return;
                }

                setFiles(
                  (current) =>
                    current.map(
                      (entry) =>
                        entry.id ===
                        item.id
                          ? {
                              ...entry,
                              progress,
                            }
                          : entry,
                    ),
                );

                const overall =
                  ((completed +
                    progress / 100) /
                    files.length) *
                  100;

                setOverallProgress(
                  Math.round(
                    overall,
                  ),
                );
              },
              {
                signal:
                  controller.signal,
              },
            );

          setFiles((current) =>
            current.map((entry) =>
              entry.id === item.id
                ? {
                    ...entry,
                    status: "success",
                    progress: 100,
                    result,
                  }
                : entry,
            ),
          );

          const historyItem: ConvertHistoryItem =
            {
              id: createId(),
              sourceName:
                item.file.name,
              outputName:
                result.fileName,
              sourceFormat:
                item.sourceFormat,
              outputFormat:
                settings.outputFormat,
              size: result.size,
              createdAt: Date.now(),
            };

          addConversionHistory(
            historyItem,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Conversion failed.";

          if (
            controller.signal
              .aborted
          ) {
            break;
          }

          setFiles((current) =>
            current.map((entry) =>
              entry.id === item.id
                ? {
                    ...entry,
                    status: "error",
                    progress: 0,
                    error: message,
                  }
                : entry,
            ),
          );
        }

        completed += 1;

        setCompletedCount(
          completed,
        );

        setOverallProgress(
          Math.round(
            (completed /
              files.length) *
              100,
          ),
        );
      }

      setConverting(false);
      setConversionController(
        null,
      );
    },
    [
      files,
      converting,
      settings,
    ],
  );

  const downloadFile = useCallback(
    (item: ConvertFile) => {
      if (!item.result) {
        return;
      }

      const anchor =
        document.createElement(
          "a",
        );

      anchor.href =
        item.result.downloadUrl;

      anchor.download =
        item.result.fileName;

      document.body.appendChild(
        anchor,
      );

      anchor.click();

      anchor.remove();
    },
    [],
  );

  const downloadAll = useCallback(
    async () => {
      const successful =
        files.filter(
          (item) => item.result,
        );

      if (!successful.length) {
        return;
      }

      const {
        default: JSZip,
      } = await import(
        "jszip"
      );

      const zip = new JSZip();

      successful.forEach((item) => {
        if (!item.result) {
          return;
        }

        zip.file(
          item.result.fileName,
          item.result.blob,
        );
      });

      const blob =
        await zip.generateAsync({
          type: "blob",
        });

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement(
          "a",
        );

      anchor.href = url;
      anchor.download =
        "icon-toolkit-converted.zip";

      document.body.appendChild(
        anchor,
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(url);
    },
    [files],
  );

  const successfulCount =
    useMemo(
      () =>
        files.filter(
          (item) =>
            item.status ===
            "success",
        ).length,
      [files],
    );

  const failedCount =
    useMemo(
      () =>
        files.filter(
          (item) =>
            item.status ===
            "error",
        ).length,
      [files],
    );

  const firstFile = files[0];

  return (
    <main className="min-h-screen w-full bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />

                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Convert
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                Convert your files
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
                Convert images, SVG artwork
                and icon assets between
                common formats directly in
                your browser.
              </p>
            </div>

            {files.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:flex">
                <Stat
                  label="Files"
                  value={files.length}
                />

                <Stat
                  label="Done"
                  value={
                    successfulCount
                  }
                />

                <Stat
                  label="Errors"
                  value={failedCount}
                />
              </div>
            ) : null}
          </div>
        </header>

        <ConvertUploader
          onFiles={addFiles}
          disabled={converting}
        />

        {errorMessage ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {errorMessage}
          </div>
        ) : null}

        {files.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-5">
              <ConvertQueue
                files={files}
                onRemove={removeFile}
                onMove={moveFile}
                onClear={clearQueue}
              />

              <ConvertPreview
                item={firstFile}
              />

              <ConvertProgress
                active={converting}
                progress={
                  overallProgress
                }
                completed={
                  completedCount
                }
                total={files.length}
              />

              <ConvertResults
                files={files}
              />

              <ConvertExport
                files={files}
                onDownload={
                  downloadFile
                }
                onDownloadAll={
                  downloadAll
                }
              />
            </div>

            <aside className="min-w-0">
              <div className="xl:sticky xl:top-6">
                <ConvertSettings
                  files={files}
                  settings={settings}
                  onChange={
                    updateSettings
                  }
                  onReset={
                    resetSettings
                  }
                />

                {converting ? (
                  <button
                    type="button"
                    onClick={() =>
                      conversionController?.abort()
                    }
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-subtle)]"
                  >
                    Cancel conversion
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={convert}
                    disabled={
                      !files.length
                    }
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Convert{" "}
                    {files.length}{" "}
                    {files.length ===
                    1
                      ? "file"
                      : "files"}
                  </button>
                )}

                <p className="mt-2 text-center text-[10px] leading-4 text-[var(--text-muted)]">
                  Files are processed
                  locally in your
                  browser whenever the
                  browser supports the
                  selected format.
                </p>
              </div>
            </aside>
          </div>
        ) : null}

        <div className="mt-6">
          <ConvertHistory />
        </div>

        {files.length === 0 ? (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-[var(--text)]">
                What you can convert
              </h2>

              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Common conversion
                workflows are built
                directly into the
                workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                title="Raster images"
                description="PNG, JPG, WebP, AVIF and common bitmap formats."
              />

              <FeatureCard
                title="SVG artwork"
                description="Rasterize SVG files into PNG, JPG, WebP or ICO."
              />

              <FeatureCard
                title="Icon files"
                description="Create multi-size ICO files and extract ICO images."
              />

              <FeatureCard
                title="PDF documents"
                description="Create image-based PDF documents from your assets."
              />

              <FeatureCard
                title="Batch conversion"
                description="Queue multiple files and process them together."
              />

              <FeatureCard
                title="Browser-first"
                description="Your supported files stay on your device during processing."
              />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-[70px] rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-center">
      <p className="text-sm font-bold text-[var(--text)]">
        {value}
      </p>

      <p className="text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <h3 className="text-xs font-semibold text-[var(--text)]">
        {title}
      </h3>

      <p className="mt-1.5 text-[11px] leading-5 text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}