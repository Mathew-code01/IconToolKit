// src/pages/Generator/CropEditor.tsx
// src/pages/Generator/CropEditor.tsx
// src/pages/Generator/CropEditor.tsx

// src/pages/Generator/CropEditor.tsx

import {
  Crosshair,
  Maximize2,
  Move,
  RotateCcw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

type AspectRatio =
  | "free"
  | "1:1"
  | "4:3"
  | "16:9"
  | "3:4"
  | "9:16";

type InteractionMode =
  | "move"
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "e"
  | "s"
  | "w";

interface CropEditorProps {
  imageUrl: string;
  crop: CropSettings;
  onChange: (crop: CropSettings) => void;
  disabled?: boolean;
}

interface InteractionState {
  mode: InteractionMode;
  startX: number;
  startY: number;
  startCrop: CropSettings;
  imageRect: DOMRect;
}

interface ContainerSize {
  width: number;
  height: number;
}

const MIN_CROP = 3;

const ASPECT_RATIOS: readonly [AspectRatio, string][] = [
  ["free", "Free"],
  ["1:1", "1:1"],
  ["4:3", "4:3"],
  ["16:9", "16:9"],
  ["3:4", "3:4"],
  ["9:16", "9:16"],
];

const clamp = (
  value: number,
  min: number,
  max: number,
): number => Math.max(min, Math.min(max, value));

function normalizeCrop(
  crop: CropSettings,
): CropSettings {
  const width = clamp(
    crop.width,
    MIN_CROP,
    100,
  );

  const height = clamp(
    crop.height,
    MIN_CROP,
    100,
  );

  return {
    width,
    height,
    x: clamp(
      crop.x,
      0,
      100 - width,
    ),
    y: clamp(
      crop.y,
      0,
      100 - height,
    ),
  };
}

function getImageRect(
  container: DOMRect,
  naturalWidth: number,
  naturalHeight: number,
) {
  if (
    !naturalWidth ||
    !naturalHeight ||
    !container.width ||
    !container.height
  ) {
    return {
      left: 0,
      top: 0,
      width: container.width,
      height: container.height,
    };
  }

  const imageRatio =
    naturalWidth / naturalHeight;

  const containerRatio =
    container.width / container.height;

  if (imageRatio > containerRatio) {
    const width = container.width;
    const height =
      width / imageRatio;

    return {
      left: 0,
      top:
        (container.height - height) /
        2,
      width,
      height,
    };
  }

  const height = container.height;
  const width =
    height * imageRatio;

  return {
    left:
      (container.width - width) /
      2,
    top: 0,
    width,
    height,
  };
}

function getAspectRatio(
  value: AspectRatio,
): number | null {
  switch (value) {
    case "1:1":
      return 1;

    case "4:3":
      return 4 / 3;

    case "16:9":
      return 16 / 9;

    case "3:4":
      return 3 / 4;

    case "9:16":
      return 9 / 16;

    default:
      return null;
  }
}

export default function CropEditor({
  imageUrl,
  crop,
  onChange,
  disabled = false,
}: CropEditorProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const interactionRef =
    useRef<InteractionState | null>(null);

  const [imageSize, setImageSize] =
    useState({
      width: 0,
      height: 0,
    });

  const [containerSize, setContainerSize] =
    useState<ContainerSize>({
      width: 0,
      height: 0,
    });

  const [aspectRatio, setAspectRatio] =
    useState<AspectRatio>("free");

  const [dragging, setDragging] =
    useState(false);

  const [showGrid, setShowGrid] =
    useState(true);

  const naturalWidth =
    imageSize.width;

  const naturalHeight =
    imageSize.height;

  const handleImageLoad =
    useCallback(
      (
        event: React.SyntheticEvent<HTMLImageElement>,
      ) => {
        const image =
          event.currentTarget;

        setImageSize({
          width:
            image.naturalWidth,
          height:
            image.naturalHeight,
        });
      },
      [],
    );

  const updateContainerSize =
    useCallback(() => {
      const container =
        containerRef.current;

      if (!container) {
        return;
      }

      const rect =
        container.getBoundingClientRect();

      setContainerSize({
        width: rect.width,
        height: rect.height,
      });
    }, []);

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    updateContainerSize();

    const observer =
      new ResizeObserver(() => {
        updateContainerSize();
      });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [
    updateContainerSize,
  ]);

  const changeCrop = useCallback(
    (next: CropSettings) => {
      onChange(
        normalizeCrop(next),
      );
    },
    [onChange],
  );

  const getCurrentImageRect =
    useCallback(() => {
      const container =
        containerRef.current;

      if (!container) {
        return null;
      }

      const containerRect =
        container.getBoundingClientRect();

      const rendered =
        getImageRect(
          containerRect,
          naturalWidth,
          naturalHeight,
        );

      return new DOMRect(
        containerRect.left +
          rendered.left,
        containerRect.top +
          rendered.top,
        rendered.width,
        rendered.height,
      );
    }, [
      naturalWidth,
      naturalHeight,
    ]);

  const startInteraction =
    useCallback(
      (
        event: PointerEvent<HTMLElement>,
        mode: InteractionMode,
      ) => {
        if (disabled) {
          return;
        }

        const imageRect =
          getCurrentImageRect();

        if (
          !imageRect ||
          imageRect.width <= 0 ||
          imageRect.height <= 0
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        interactionRef.current = {
          mode,
          startX: event.clientX,
          startY: event.clientY,
          startCrop: {
            ...crop,
          },
          imageRect,
        };

        setDragging(true);
      },
      [
        crop,
        disabled,
        getCurrentImageRect,
      ],
    );

  const updateInteraction =
    useCallback(
      (event: globalThis.PointerEvent) => {
        const interaction =
          interactionRef.current;

        if (!interaction) {
          return;
        }

        const {
          mode,
          startX,
          startY,
          startCrop,
          imageRect,
        } = interaction;

        if (
          imageRect.width <= 0 ||
          imageRect.height <= 0
        ) {
          return;
        }

        const dx =
          ((event.clientX - startX) /
            imageRect.width) *
          100;

        const dy =
          ((event.clientY - startY) /
            imageRect.height) *
          100;

        const next = {
          ...startCrop,
        };

        const ratio =
          getAspectRatio(
            aspectRatio,
          );

        /*
         * -------------------------------------------------
         * FREEFORM CROP
         * -------------------------------------------------
         */
        if (!ratio) {
          switch (mode) {
            case "move":
              next.x = clamp(
                startCrop.x + dx,
                0,
                100 - startCrop.width,
              );

              next.y = clamp(
                startCrop.y + dy,
                0,
                100 - startCrop.height,
              );
              break;

            case "e":
              next.width = clamp(
                startCrop.width + dx,
                MIN_CROP,
                100 - startCrop.x,
              );
              break;

            case "w": {
              const newX =
                clamp(
                  startCrop.x + dx,
                  0,
                  startCrop.x +
                    startCrop.width -
                    MIN_CROP,
                );

              next.x = newX;

              next.width =
                startCrop.width +
                (startCrop.x -
                  newX);

              break;
            }

            case "s":
              next.height = clamp(
                startCrop.height + dy,
                MIN_CROP,
                100 - startCrop.y,
              );
              break;

            case "n": {
              const newY =
                clamp(
                  startCrop.y + dy,
                  0,
                  startCrop.y +
                    startCrop.height -
                    MIN_CROP,
                );

              next.y = newY;

              next.height =
                startCrop.height +
                (startCrop.y -
                  newY);

              break;
            }

            case "se":
              next.width = clamp(
                startCrop.width + dx,
                MIN_CROP,
                100 - startCrop.x,
              );

              next.height = clamp(
                startCrop.height + dy,
                MIN_CROP,
                100 - startCrop.y,
              );
              break;

            case "sw": {
              const newX =
                clamp(
                  startCrop.x + dx,
                  0,
                  startCrop.x +
                    startCrop.width -
                    MIN_CROP,
                );

              next.x = newX;

              next.width =
                startCrop.width +
                (startCrop.x -
                  newX);

              next.height = clamp(
                startCrop.height + dy,
                MIN_CROP,
                100 - startCrop.y,
              );

              break;
            }

            case "ne": {
              next.width = clamp(
                startCrop.width + dx,
                MIN_CROP,
                100 - startCrop.x,
              );

              const newY =
                clamp(
                  startCrop.y + dy,
                  0,
                  startCrop.y +
                    startCrop.height -
                    MIN_CROP,
                );

              next.y = newY;

              next.height =
                startCrop.height +
                (startCrop.y -
                  newY);

              break;
            }

            case "nw": {
              const newX =
                clamp(
                  startCrop.x + dx,
                  0,
                  startCrop.x +
                    startCrop.width -
                    MIN_CROP,
                );

              const newY =
                clamp(
                  startCrop.y + dy,
                  0,
                  startCrop.y +
                    startCrop.height -
                    MIN_CROP,
                );

              next.x = newX;
              next.y = newY;

              next.width =
                startCrop.width +
                (startCrop.x -
                  newX);

              next.height =
                startCrop.height +
                (startCrop.y -
                  newY);

              break;
            }
          }

          changeCrop(next);
          return;
        }

        /*
         * -------------------------------------------------
         * ASPECT-RATIO CROP
         * -------------------------------------------------
         *
         * Crop values are percentages of the source image.
         * Therefore the source-image ratio must be included.
         */
        if (
          !naturalWidth ||
          !naturalHeight
        ) {
          return;
        }

        const sourceRatio =
          naturalWidth /
          naturalHeight;

        const percentRatio =
          ratio / sourceRatio;

        /*
         * These variables are deliberately declared without
         * initial assignments. Each control-flow branch below
         * assigns all four values before they are used.
         */
        let width: number;
        let height: number;
        let x: number;
        let y: number;

        const usesHorizontal =
          mode === "e" ||
          mode === "w" ||
          mode === "ne" ||
          mode === "se" ||
          mode === "nw" ||
          mode === "sw";

        if (usesHorizontal) {
          const delta =
            mode.includes("w")
              ? -dx
              : dx;

          const maxWidth =
            mode.includes("w")
              ? startCrop.x +
                startCrop.width
              : 100 - startCrop.x;

          width = clamp(
            startCrop.width +
              delta,
            MIN_CROP,
            maxWidth,
          );

          height =
            width / percentRatio;
        } else {
          const delta =
            mode.includes("n")
              ? -dy
              : dy;

          const maxHeight =
            mode.includes("n")
              ? startCrop.y +
                startCrop.height
              : 100 - startCrop.y;

          height = clamp(
            startCrop.height +
              delta,
            MIN_CROP,
            maxHeight,
          );

          width =
            height * percentRatio;
        }

        /*
         * Keep the crop inside the image.
         */
        if (
          width > 100 ||
          height > 100
        ) {
          const scale =
            Math.min(
              100 / width,
              100 / height,
            );

          width *= scale;
          height *= scale;
        }

        /*
         * Anchor the correct horizontal edge.
         */
        if (
          mode === "nw" ||
          mode === "w" ||
          mode === "sw"
        ) {
          x =
            startCrop.x +
            startCrop.width -
            width;
        } else if (
          mode === "ne" ||
          mode === "e" ||
          mode === "se"
        ) {
          x = startCrop.x;
        } else {
          x =
            startCrop.x +
            (startCrop.width -
              width) /
              2;
        }

        /*
         * Anchor the correct vertical edge.
         */
        if (
          mode === "nw" ||
          mode === "n" ||
          mode === "ne"
        ) {
          y =
            startCrop.y +
            startCrop.height -
            height;
        } else if (
          mode === "sw" ||
          mode === "s" ||
          mode === "se"
        ) {
          y = startCrop.y;
        } else {
          y =
            startCrop.y +
            (startCrop.height -
              height) /
              2;
        }

        changeCrop({
          x,
          y,
          width,
          height,
        });
      },
      [
        aspectRatio,
        changeCrop,
        naturalHeight,
        naturalWidth,
      ],
    );

  const endInteraction =
    useCallback(() => {
      interactionRef.current =
        null;

      setDragging(false);
    }, []);

  useEffect(() => {
    window.addEventListener(
      "pointermove",
      updateInteraction,
    );

    window.addEventListener(
      "pointerup",
      endInteraction,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        updateInteraction,
      );

      window.removeEventListener(
        "pointerup",
        endInteraction,
      );
    };
  }, [
    updateInteraction,
    endInteraction,
  ]);

  const centerCrop = useCallback(() => {
    if (disabled) {
      return;
    }

    changeCrop({
      ...crop,
      x:
        (100 - crop.width) /
        2,
      y:
        (100 - crop.height) /
        2,
    });
  }, [
    changeCrop,
    crop,
    disabled,
  ]);

  const resetCrop = useCallback(() => {
    if (disabled) {
      return;
    }

    setAspectRatio("free");

    changeCrop({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  }, [
    changeCrop,
    disabled,
  ]);

  const applyAspectRatio =
    useCallback(
      (nextRatio: AspectRatio) => {
        if (disabled) {
          return;
        }

        setAspectRatio(
          nextRatio,
        );

        if (
          nextRatio === "free"
        ) {
          return;
        }

        const ratio =
          getAspectRatio(
            nextRatio,
          );

        if (
          !ratio ||
          !naturalWidth ||
          !naturalHeight
        ) {
          return;
        }

        const sourceRatio =
          naturalWidth /
          naturalHeight;

        const percentRatio =
          ratio / sourceRatio;

        let width =
          crop.width;

        let height =
          width /
          percentRatio;

        if (height > 100) {
          height = 100;

          width =
            height *
            percentRatio;
        }

        if (width > 100) {
          width = 100;

          height =
            width /
            percentRatio;
        }

        changeCrop(
          normalizeCrop({
            width,
            height,
            x:
              crop.x +
              (crop.width -
                width) /
                2,
            y:
              crop.y +
              (crop.height -
                height) /
                2,
          }),
        );
      },
      [
        crop,
        changeCrop,
        disabled,
        naturalHeight,
        naturalWidth,
      ],
    );

  const nudge = useCallback(
    (
      dx: number,
      dy: number,
    ) => {
      if (disabled) {
        return;
      }

      changeCrop({
        ...crop,
        x: crop.x + dx,
        y: crop.y + dy,
      });
    },
    [
      changeCrop,
      crop,
      disabled,
    ],
  );

  const handleKeyDown =
    useCallback(
      (
        event: React.KeyboardEvent<HTMLDivElement>,
      ) => {
        if (disabled) {
          return;
        }

        const step =
          event.shiftKey
            ? 2
            : 0.5;

        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            nudge(-step, 0);
            break;

          case "ArrowRight":
            event.preventDefault();
            nudge(step, 0);
            break;

          case "ArrowUp":
            event.preventDefault();
            nudge(0, -step);
            break;

          case "ArrowDown":
            event.preventDefault();
            nudge(0, step);
            break;

          case "Home":
            event.preventDefault();
            centerCrop();
            break;

          case "Escape":
            event.preventDefault();
            endInteraction();
            break;
        }
      },
      [
        centerCrop,
        disabled,
        endInteraction,
        nudge,
      ],
    );

  /*
   * IMPORTANT:
   *
   * Do not read containerRef.current during render.
   * containerSize is updated by ResizeObserver inside an effect.
   */
  const containerRect =
    new DOMRect(
      0,
      0,
      containerSize.width,
      containerSize.height,
    );

  const renderedImage =
    getImageRect(
      containerRect,
      naturalWidth,
      naturalHeight,
    );

  const cropStyle = {
    left:
      renderedImage.left +
      (crop.x / 100) *
        renderedImage.width,

    top:
      renderedImage.top +
      (crop.y / 100) *
        renderedImage.height,

    width:
      (crop.width / 100) *
      renderedImage.width,

    height:
      (crop.height / 100) *
      renderedImage.height,
  };

  const cropPixels =
    naturalWidth &&
    naturalHeight
      ? {
          width: Math.round(
            naturalWidth *
              (crop.width / 100),
          ),
          height: Math.round(
            naturalHeight *
              (crop.height / 100),
          ),
        }
      : null;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-1">
          {ASPECT_RATIOS.map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() =>
                  applyAspectRatio(
                    value,
                  )
                }
                className={[
                  "rounded-lg px-2.5 py-1.5",
                  "text-[11px] font-medium",
                  "transition-all duration-150",
                  "focus:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#6366F1]/30",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-50",
                  aspectRatio ===
                  value
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm ring-1 ring-black/[0.04]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface)]/70",
                ].join(" ")}
              >
                {label}
              </button>
            ),
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            disabled={disabled}
            onClick={centerCrop}
            title="Center crop"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Crosshair
              size={13}
            />
            Center
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={resetCrop}
            title="Reset crop"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw
              size={13}
            />
          </button>
        </div>
      </div>

      {/* Crop canvas */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={[
          "relative aspect-square",
          "overflow-hidden rounded-2xl",
          "border border-black/10",
          "bg-[#101010]",
          "outline-none",
          "touch-none",
          "select-none",
          "shadow-[0_12px_40px_rgba(0,0,0,0.12)]",
          "focus-visible:ring-2",
          "focus-visible:ring-[#6366F1]/30",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--surface)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.055),transparent_68%)]" />

        <img
          src={imageUrl}
          alt="Crop source"
          draggable={false}
          onLoad={handleImageLoad}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* Outside-crop dim */}
        <div className="pointer-events-none absolute inset-0 bg-black/55" />

        {/* Actual crop */}
        <div
          className="absolute overflow-visible"
          style={{
            left: cropStyle.left,
            top: cropStyle.top,
            width: cropStyle.width,
            height: cropStyle.height,
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[4px] border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.56)]">
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              className="absolute max-w-none"
              style={{
                width: `${100 / crop.width}%`,
                height: `${100 / crop.height}%`,
                left: `${-(crop.x / crop.width) * 100}%`,
                top: `${-(crop.y / crop.height) * 100}%`,
              }}
            />

            {/* Rule-of-thirds grid */}
            {showGrid && (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/3 top-0 h-full border-l border-white/30" />
                <div className="absolute left-2/3 top-0 h-full border-l border-white/30" />
                <div className="absolute left-0 top-1/3 w-full border-t border-white/30" />
                <div className="absolute left-0 top-2/3 w-full border-t border-white/30" />

                <div className="absolute left-1/2 top-0 h-full border-l border-white/10" />
                <div className="absolute left-0 top-1/2 w-full border-t border-white/10" />
              </div>
            )}
          </div>

          {/* Move area */}
          <button
            type="button"
            aria-label="Move crop"
            disabled={disabled}
            onPointerDown={(event) =>
              startInteraction(
                event,
                "move",
              )
            }
            onDoubleClick={
              centerCrop
            }
            className="absolute inset-0 z-10 cursor-move disabled:cursor-default"
          />

          {/* Corner handles */}
          {(
            [
              [
                "nw",
                "left-[-6px] top-[-6px] cursor-nwse-resize",
              ],
              [
                "ne",
                "right-[-6px] top-[-6px] cursor-nesw-resize",
              ],
              [
                "sw",
                "left-[-6px] bottom-[-6px] cursor-nesw-resize",
              ],
              [
                "se",
                "right-[-6px] bottom-[-6px] cursor-nwse-resize",
              ],
            ] as const
          ).map(
            ([mode, classes]) => (
              <button
                key={mode}
                type="button"
                aria-label={`Resize crop ${mode}`}
                disabled={disabled}
                onPointerDown={(
                  event,
                ) =>
                  startInteraction(
                    event,
                    mode,
                  )
                }
                className={[
                  "absolute z-30",
                  "h-3.5 w-3.5",
                  "rounded-[4px]",
                  "border-2 border-white",
                  "bg-white",
                  "shadow-[0_1px_5px_rgba(0,0,0,.45)]",
                  "transition-transform",
                  "hover:scale-110",
                  classes,
                ].join(" ")}
              />
            ),
          )}

          {/* Edge handles */}
          {(
            [
              [
                "n",
                "left-1/2 top-[-4px] -translate-x-1/2 cursor-ns-resize",
              ],
              [
                "e",
                "right-[-4px] top-1/2 -translate-y-1/2 cursor-ew-resize",
              ],
              [
                "s",
                "bottom-[-4px] left-1/2 -translate-x-1/2 cursor-ns-resize",
              ],
              [
                "w",
                "left-[-4px] top-1/2 -translate-y-1/2 cursor-ew-resize",
              ],
            ] as const
          ).map(
            ([mode, classes]) => (
              <button
                key={mode}
                type="button"
                aria-label={`Resize crop ${mode}`}
                disabled={disabled}
                onPointerDown={(
                  event,
                ) =>
                  startInteraction(
                    event,
                    mode,
                  )
                }
                className={[
                  "absolute z-30",
                  "h-2.5 w-2.5",
                  "rounded-full",
                  "border border-white",
                  "bg-white",
                  "shadow-[0_1px_4px_rgba(0,0,0,.45)]",
                  "transition-transform",
                  "hover:scale-125",
                  classes,
                ].join(" ")}
              />
            ),
          )}

          {/* Size indicator */}
          {dragging && (
            <div className="pointer-events-none absolute left-1/2 top-3 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[10px] font-medium text-white shadow-xl backdrop-blur-md">
              {cropPixels
                ? `${cropPixels.width} × ${cropPixels.height}px`
                : `${Math.round(crop.width)}% × ${Math.round(crop.height)}%`}
            </div>
          )}
        </div>

        {/* Canvas controls */}
        <div className="absolute bottom-3 left-3 right-3 z-40 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[9px] font-medium text-white/80 shadow-lg backdrop-blur-md">
            Drag to reposition
          </span>

          <button
            type="button"
            onClick={() =>
              setShowGrid(
                (value) =>
                  !value,
              )
            }
            className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[9px] font-medium text-white/80 shadow-lg backdrop-blur-md transition hover:bg-black/70"
          >
            {showGrid
              ? "Hide grid"
              : "Show grid"}
          </button>
        </div>
      </div>

      {/* Crop information */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Position
          </p>

          <p className="mt-1 text-[11px] font-semibold tabular-nums text-[var(--text)]">
            {Math.round(crop.x)}% ·{" "}
            {Math.round(crop.y)}%
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Crop
          </p>

          <p className="mt-1 text-[11px] font-semibold tabular-nums text-[var(--text)]">
            {cropPixels
              ? `${cropPixels.width} × ${cropPixels.height}`
              : "—"}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Ratio
          </p>

          <p className="mt-1 text-[11px] font-semibold text-[var(--text)]">
            {aspectRatio ===
            "free"
              ? "Free"
              : aspectRatio}
          </p>
        </div>
      </div>

      {/* Keyboard help */}
      <div className="flex items-center justify-between gap-3 text-[10px] text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <Move size={11} />
          Drag to reposition
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Maximize2 size={11} />
          Drag handles to resize
        </span>

        <span className="hidden sm:inline">
          Arrow keys · Shift = faster
        </span>
      </div>
    </div>
  );
}