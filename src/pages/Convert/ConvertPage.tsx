// src/pages/Convert/ConvertPage.tsx
// src/pages/Convert/ConvertPage.tsx

// src/pages/Convert/ConvertPage.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ConvertFile,
  ConvertFormat,
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
  previewConversion,
} from "./convertEngine";

function createId(): string {
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

function createDefaultSettings(
  sourceFormat?: ConvertFormat,
): ConvertSettingsState {
  let outputFormat: ConvertFormat;

  switch (sourceFormat) {
    case "webp":
    case "svg":
    case "ico":
    case "pdf":
      outputFormat = "png";
      break;

    case "png":
    case "jpg":
    case "bmp":
    case "gif":
    case "tiff":
    default:
      outputFormat = "webp";
      break;
  }

  return {
    ...DEFAULT_SETTINGS,
    outputFormat,
    icoSizes: [...DEFAULT_SETTINGS.icoSizes],
  };
}

function createPreviewUrl(file: File): string | null {
  const fileName =
    file.name.toLowerCase();

  const isImage =
    file.type.startsWith("image/");

  const isSvg =
    fileName.endsWith(".svg");

  const isPdf =
    file.type === "application/pdf" ||
    fileName.endsWith(".pdf");

  if (isImage || isSvg || isPdf) {
    return URL.createObjectURL(file);
  }

  return null;
}

function revokeUrl(url: string | null | undefined): void {
  if (!url) {
    return;
  }

  try {
    URL.revokeObjectURL(url);
  } catch {
    // Ignore already-revoked URLs.
  }
}

function revokePreview(item: ConvertFile): void {
  revokeUrl(item.previewUrl);

  revokeUrl(item.result?.downloadUrl);

  revokeUrl(item.preview.previewUrl);
}

export default function ConvertPage() {
  const [files, setFiles] =
    useState<ConvertFile[]>([]);

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
    useState<AbortController | null>(
      null,
    );

    const conversionControllerRef = useRef<AbortController | null>(null);


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

  
  

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const selectedFile = useMemo(
    () => files.find((item) => item.id === selectedFileId) ?? files[0],
    [files, selectedFileId],
  );

  /*
   * Preview generation has its own AbortControllers.
   *
   * This MUST be inside the component because
   * useRef is a React hook.
   */
  const previewControllers = useRef(
    new Map<string, AbortController>(),
  );

  const filesRef = useRef<ConvertFile[]>([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  /*
   * Prevents an old async preview from updating
   * the component after the component unmounts.
   */
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const controllers = previewControllers.current;

    return () => {
      mountedRef.current = false;

      controllers.forEach((controller) => {
        controller.abort();
      });

      controllers.clear();
    };
  }, []);

  const updateSettings = useCallback(
    (
      patch: Partial<ConvertSettingsState>,
    ) => {
      setSettings((current) => ({
        ...current,
        ...patch,
      }));

      /*
       * Keep the per-file settings synchronized
       * with the active workspace settings.
       */
      setFiles((current) =>
        current.map((item) => {
          const nextSettings = {
            ...item.settings,
            ...patch,
          };

          /*
           * Any settings change invalidates the
           * existing generated preview.
           */
          revokeUrl(
            item.preview.previewUrl,
          );

          return {
            ...item,

            settings: nextSettings,

            preview: {
              ...item.preview,

              outputFormat:
                nextSettings.outputFormat,

              outputWidth:
                nextSettings.resizeEnabled
                  ? (
                      nextSettings.width ??
                      item.width
                    )
                  : item.width,

              outputHeight:
                nextSettings.resizeEnabled
                  ? (
                      nextSettings.height ??
                      item.height
                    )
                  : item.height,

              outputSize: null,

              previewUrl: null,

              sizeEstimated: false,

              status: "idle",

              error: null,
            },
          };
        }),
      );
    },
    [],
  );

  const resetSettings =
    useCallback(() => {
      const nextSettings: ConvertSettingsState =
        {
          ...DEFAULT_SETTINGS,
          icoSizes: [
            ...DEFAULT_SETTINGS.icoSizes,
          ],
        };

      setSettings(nextSettings);

      setFiles((current) =>
        current.map((item) => {
          revokeUrl(
            item.preview.previewUrl,
          );

          const fileSettings =
            createDefaultSettings(
              item.sourceFormat,
            );

          return {
            ...item,

            settings: fileSettings,

            preview: {
              ...item.preview,

              outputFormat:
                fileSettings.outputFormat,

              outputWidth: item.width,

              outputHeight: item.height,

              outputSize: null,

              previewUrl: null,

              sizeEstimated: false,

              status: "idle",

              error: null,
            },
          };
        }),
      );
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

        try {
          const dimensions =
            await getFileDimensions(file);

          const fileSettings =
            createDefaultSettings(
              sourceFormat,
            );

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

            settings: fileSettings,

            preview: {
              sourceSize: file.size,

              sourceWidth:
                dimensions.width,

              sourceHeight:
                dimensions.height,

              outputSize: null,

              outputWidth:
                dimensions.width,

              outputHeight:
                dimensions.height,

              sourceFormat,

              outputFormat:
                fileSettings.outputFormat,

              sizeEstimated: false,

              previewUrl: null,

              status: "idle",

              error: null,
            },
          });
        } catch {
          /*
           * Dimension detection is intentionally
           * non-fatal. The engine can still attempt
           * the conversion later.
           */
          const fileSettings =
            createDefaultSettings(
              sourceFormat,
            );

          next.push({
            id: createId(),

            file,

            sourceFormat,

            sourceLabel:
              FORMAT_LABELS[sourceFormat],

            previewUrl:
              createPreviewUrl(file),

            width: null,

            height: null,

            status: "queued",

            progress: 0,

            error: null,

            result: null,

            settings: fileSettings,

            preview: {
              sourceSize: file.size,

              sourceWidth: null,

              sourceHeight: null,

              outputSize: null,

              outputWidth: null,

              outputHeight: null,

              sourceFormat,

              outputFormat:
                fileSettings.outputFormat,

              sizeEstimated: false,

              previewUrl: null,

              status: "idle",

              error: null,
            },
          });
        }
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
       * Select a sensible output format when
       * the first file enters the workspace.
       */
      setFiles((current) => {
        /*
         * This callback runs after the previous
         * queued files have been appended.
         *
         * The global settings are adjusted
         * separately below, so this state update
         * only returns the current collection.
         */
        return current;
      });

      /*
       * We use the state that existed before this
       * add operation to determine whether this
       * was the first file.
       */
      setSettings((current) => {
        /*
         * If files already existed, preserve the
         * user's current settings.
         *
         * The actual first-file detection is handled
         * by the queued files effect below.
         */
        return current;
      });
    },
    [],
  );

  /*
   * When the first file is added, choose a sensible
   * output format.
   */
  
  /*
   * Keep every queued item's settings synchronized
   * with the global workspace settings.
   *
   * This is useful because the conversion engine receives
   * the global settings, while ConvertFile also stores its
   * own settings for previews/results.
   */

  const removeFile = useCallback(
    (id: string) => {
      setFiles((current) => {
        const item = current.find(
          (entry) =>
            entry.id === id,
        );

        if (item) {
          previewControllers.current
            .get(item.id)
            ?.abort();

          previewControllers.current.delete(
            item.id,
          );

          revokePreview(item);
        }

        return current.filter(
          (entry) =>
            entry.id !== id,
        );
      });
    },
    [],
  );

  const clearQueue = useCallback(() => {
    previewControllers.current.forEach(
      (controller) => {
        controller.abort();
      },
    );

    previewControllers.current.clear();

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
            (item) =>
              item.id === id,
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

        const copy = [
          ...current,
        ];

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

  const generatePreview =
    useCallback(
      async (
        item: ConvertFile,
        previewSettings: ConvertSettingsState,
      ) => {
        const previous =
          previewControllers.current.get(
            item.id,
          );

        previous?.abort();

        const controller =
          new AbortController();

        previewControllers.current.set(
          item.id,
          controller,
        );

        setFiles((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,

                  preview: {
                    ...entry.preview,

                    status:
                      "generating",

                    error: null,
                  },
                }
              : entry,
          ),
        );

        try {
          const result =
            await previewConversion(
              item,
              previewSettings,
              {
                signal:
                  controller.signal,
              },
            );

          if (
            controller.signal
              .aborted ||
            !mountedRef.current
          ) {
            revokeUrl(
              result.previewUrl,
            );

            return;
          }

          /*
           * Only replace the preview if this is
           * still the current controller for the item.
           */
          const currentController =
            previewControllers.current.get(
              item.id,
            );

          if (
            currentController !==
            controller
          ) {
            revokeUrl(
              result.previewUrl,
            );

            return;
          }

          setFiles((current) =>
            current.map((entry) => {
              if (
                entry.id !== item.id
              ) {
                return entry;
              }

              revokeUrl(
                entry.preview
                  .previewUrl,
              );

              return {
                ...entry,

                preview: {
                  ...entry.preview,

                  outputSize:
                    result.size,

                  outputWidth:
                    result.width,

                  outputHeight:
                    result.height,

                  previewUrl:
                    result.previewUrl,

                  status: "ready",

                  sizeEstimated: true,

                  error: null,
                },
              };
            }),
          );
        } catch (error) {
          if (
            controller.signal
              .aborted ||
            !mountedRef.current
          ) {
            return;
          }

          const message =
            error instanceof Error
              ? error.message
              : "Preview generation failed.";

          setFiles((current) =>
            current.map((entry) =>
              entry.id === item.id
                ? {
                    ...entry,

                    preview: {
                      ...entry.preview,

                      status: "error",

                      error: message,
                    },
                  }
                : entry,
            ),
          );
        } finally {
          if (
            previewControllers.current.get(
              item.id,
            ) === controller
          ) {
            previewControllers.current.delete(
              item.id,
            );
          }
        }
      },
      [],
    );

  /*
   * Automatically generate a preview for the
   * currently selected/first file whenever its
   * settings change.
   */
  useEffect(() => {
    if (!selectedFile || converting) {
      return;
    }

    const timer = window.setTimeout(() => {
      void generatePreview(selectedFile, selectedFile.settings);
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [selectedFile, converting, generatePreview]);

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

      /*
       * Abort any currently running previews.
       */
      previewControllers.current.forEach(
        (previewController) => {
          previewController.abort();
        },
      );

      setFiles((current) =>
        current.map((item) => {
          revokeUrl(
            item.result?.downloadUrl,
          );

          return {
            ...item,

            status: "queued",

            progress: 0,

            error: null,

            result: null,
          };
        }),
      );

      let completed = 0;

      try {
        for (const item of files) {
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

                    status:
                      "processing",

                    progress: 0,

                    error: null,
                  }
                : entry,
            ),
          );

          try {
            const result = await convertFile(
              item,
              item.settings,
              ({ progress }) => {
                if (controller.signal.aborted) {
                  return;
                }

                setFiles((current) =>
                  current.map((entry) =>
                    entry.id === item.id
                      ? {
                          ...entry,

                          progress: Math.max(0, Math.min(100, progress)),
                        }
                      : entry,
                  ),
                );

                const overall =
                  ((completed + progress / 100) / files.length) * 100;

                setOverallProgress(
                  Math.round(Math.max(0, Math.min(100, overall))),
                );
              },
              {
                signal: controller.signal,
              },
            );

            if (
              controller.signal
                .aborted
            ) {
              revokeUrl(
                result.downloadUrl,
              );

              break;
            }

            setFiles((current) =>
              current.map(
                (entry) =>
                  entry.id ===
                  item.id
                    ? {
                        ...entry,

                        status:
                          "success",

                        progress: 100,

                        result,
                      }
                    : entry,
              ),
            );

            const historyItem: ConvertHistoryItem = {
              id: createId(),

              sourceName: item.file.name,

              outputName: result.fileName,

              sourceFormat: item.sourceFormat,

              outputFormat: item.settings.outputFormat,

              size: result.size,

              createdAt: Date.now(),
            };

            addConversionHistory(
              historyItem,
            );
          } catch (error) {
            if (
              controller.signal
                .aborted
            ) {
              break;
            }

            const message =
              error instanceof Error
                ? error.message
                : "Conversion failed.";

            setFiles((current) =>
              current.map(
                (entry) =>
                  entry.id ===
                  item.id
                    ? {
                        ...entry,

                        status:
                          "error",

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
      } finally {
        
  setConverting(false);

  conversionControllerRef.current = null;

  setConversionController(null);
      }
    },
    [
      files,
      converting,
    ],
  );

  const cancelConversion =
    useCallback(() => {
      conversionController?.abort();
    }, [conversionController]);

  const downloadFile =
    useCallback(
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

        anchor.rel = "noopener";

        document.body.appendChild(
          anchor,
        );

        anchor.click();

        anchor.remove();
      },
      [],
    );

  const downloadAll =
    useCallback(
      async () => {
        const successful =
          files.filter(
            (item) =>
              item.result,
          );

        if (
          !successful.length
        ) {
          return;
        }

        try {
          const {
            default: JSZip,
          } = await import(
            "jszip"
          );

          const zip =
            new JSZip();

          successful.forEach(
            (item) => {
              if (!item.result) {
                return;
              }

              zip.file(
                item.result
                  .fileName,
                item.result.blob,
              );
            },
          );

          const blob =
            await zip.generateAsync(
              {
                type: "blob",

                compression:
                  "DEFLATE",

                compressionOptions: {
                  level: 6,
                },
              },
            );

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
            "icon-toolkit-converted.zip";

          anchor.rel = "noopener";

          document.body.appendChild(
            anchor,
          );

          anchor.click();

          anchor.remove();

          window.setTimeout(
            () => {
              revokeUrl(url);
            },
            1000,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not create the ZIP archive.";

          setErrorMessage(message);
        }
      },
      [files],
    );

  /*
   * Clean everything when this page unmounts.
   */
  useEffect(() => {
    const controllers = previewControllers.current;

    return () => {
      conversionController?.abort();

      controllers.forEach((controller) => {
        controller.abort();
      });

      controllers.clear();

      filesRef.current.forEach(revokePreview);
    };
  }, [conversionController]);

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
                Convert images, SVG artwork and icon assets between common
                formats directly in your browser.
              </p>
            </div>

            {files.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:flex">
                <Stat label="Files" value={files.length} />

                <Stat label="Done" value={successfulCount} />

                <Stat label="Errors" value={failedCount} />
              </div>
            ) : null}
          </div>
        </header>

        <ConvertUploader onFiles={addFiles} disabled={converting} />

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
                selectedFileId={selectedFileId}
                onSelect={setSelectedFileId}
                onRemove={removeFile}
                onMove={moveFile}
                onClear={clearQueue}
              />

              <ConvertPreview item={selectedFile} />

              <ConvertProgress
                active={converting}
                progress={overallProgress}
                completed={completedCount}
                total={files.length}
              />

              <ConvertResults files={files} />

              <ConvertExport
                files={files}
                onDownload={downloadFile}
                onDownloadAll={downloadAll}
              />
            </div>

            <aside className="min-w-0">
              <div className="xl:sticky xl:top-6">
                <ConvertSettings
                  files={files}
                  settings={settings}
                  onChange={updateSettings}
                  onReset={resetSettings}
                />

                {converting ? (
                  <button
                    type="button"
                    onClick={cancelConversion}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-subtle)]"
                  >
                    Cancel conversion
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={convert}
                    disabled={!files.length}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Convert {files.length}{" "}
                    {files.length === 1 ? "file" : "files"}
                  </button>
                )}

                <p className="mt-2 text-center text-[10px] leading-4 text-[var(--text-muted)]">
                  Files are processed locally in your browser whenever the
                  browser supports the selected format.
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
                Common conversion workflows are built directly into the
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