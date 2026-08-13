// src/pages/Create/CreateCanvas.tsx
// src/pages/Create/CreateCanvas.tsx

import {
  Grid3X3,
  Minus,
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import type {
  BackgroundSettings,
  CanvasSize,
  CreateTool,
  DesignObject,
} from "./CreatePage";

type Props = {
  canvasSize: CanvasSize;
  setCanvasSize: React.Dispatch<
    React.SetStateAction<CanvasSize>
  >;

  objects: DesignObject[];

  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  activeTool: CreateTool;

  zoom: number;
  setZoom: (zoom: number) => void;

  background: BackgroundSettings;

  setBackground: React.Dispatch<
    React.SetStateAction<BackgroundSettings>
  >;
};

export default function CreateCanvas({
  canvasSize,
  setCanvasSize,
  objects,
  selectedId,
  setSelectedId,
  zoom,
  setZoom,
  background,
  setBackground,
}: Props) {
  const scale = zoom / 100;

  const backgroundStyle: React.CSSProperties =
    background.type === "transparent"
      ? {
          backgroundImage:
            "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",

          backgroundSize:
            "20px 20px",

          backgroundPosition:
            "0 0, 0 10px, 10px -10px, -10px 0px",
        }
      : background.type === "gradient"
        ? {
            background: `linear-gradient(${background.gradientAngle}deg, ${background.gradientFrom}, ${background.gradientTo})`,
          }
        : {
            background:
              background.color,
          };

  return (
    <div className="flex h-full min-h-[680px] flex-col">

      {/* Canvas toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-3">

        <div className="flex items-center gap-2">

          <button
            type="button"
            aria-label="Zoom out"
            onClick={() =>
              setZoom(
                Math.max(
                  25,
                  zoom - 10,
                ),
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
          >
            <ZoomOut
              size={15}
            />
          </button>

          <span className="min-w-12 text-center font-mono text-[11px] font-medium text-[var(--text-secondary)]">
            {zoom}%
          </span>

          <button
            type="button"
            aria-label="Zoom in"
            onClick={() =>
              setZoom(
                Math.min(
                  200,
                  zoom + 10,
                ),
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
          >
            <ZoomIn
              size={15}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              setZoom(85)
            }
            className="ml-1 hidden h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] sm:flex"
          >
            <RotateCcw
              size={13}
            />

            Reset
          </button>
        </div>

        {/* Canvas dimensions */}
        <div className="flex items-center gap-2">

          <label className="hidden items-center gap-1.5 text-[10px] text-[var(--text-muted)] sm:flex">
            W

            <input
              type="number"
              min={16}
              value={canvasSize.width}
              onChange={(event) =>
                setCanvasSize({
                  ...canvasSize,
                  width: Math.max(
                    16,
                    Number(
                      event.target.value,
                    ),
                  ),
                })
              }
              className="h-7 w-16 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[11px] text-[var(--text)] outline-none transition-colors focus:border-[#6366F1]"
            />
          </label>

          <label className="hidden items-center gap-1.5 text-[10px] text-[var(--text-muted)] sm:flex">
            H

            <input
              type="number"
              min={16}
              value={canvasSize.height}
              onChange={(event) =>
                setCanvasSize({
                  ...canvasSize,
                  height: Math.max(
                    16,
                    Number(
                      event.target.value,
                    ),
                  ),
                })
              }
              className="h-7 w-16 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[11px] text-[var(--text)] outline-none transition-colors focus:border-[#6366F1]"
            />
          </label>

          <button
            type="button"
            onClick={() =>
              setBackground(
                (current) => ({
                  ...current,

                  type:
                    current.type ===
                    "transparent"
                      ? "solid"
                      : "transparent",
                }),
              )
            }
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <Grid3X3
              size={13}
            />

            Grid
          </button>
        </div>
      </div>

      {/* Canvas workspace */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-8">

        {/* Workspace grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize:
              "24px 24px",
          }}
        />

        {/* Actual design canvas */}
        <div
          className="relative shrink-0 shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
          style={{
            width:
              canvasSize.width *
              scale,

            height:
              canvasSize.height *
              scale,

            transformOrigin:
              "center",
          }}
          onClick={() =>
            setSelectedId(null)
          }
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={backgroundStyle}
          >
            {objects.map(
              (object) => {
                if (
                  !object.visible
                ) {
                  return null;
                }

                const isSelected =
                  object.id ===
                  selectedId;

                const objectStyle: React.CSSProperties =
                  {
                    position:
                      "absolute",

                    left:
                      object.x *
                      scale,

                    top:
                      object.y *
                      scale,

                    width:
                      object.width *
                      scale,

                    height:
                      object.height *
                      scale,

                    transform: `rotate(${object.rotation}deg)`,

                    opacity:
                      object.opacity,

                    boxSizing:
                      "border-box",

                    cursor:
                      object.locked
                        ? "not-allowed"
                        : "pointer",
                  };

                /*
                 * Circle
                 */
                if (
                  object.type ===
                  "circle"
                ) {
                  return (
                    <div
                      key={
                        object.id
                      }
                      style={{
                        ...objectStyle,

                        borderRadius:
                          "50%",

                        background:
                          object.fill,

                        border:
                          object.strokeWidth >
                          0
                            ? `${object.strokeWidth}px solid ${object.stroke}`
                            : undefined,

                        outline:
                          isSelected
                            ? `${Math.max(
                                1,
                                1 /
                                  scale,
                              )}px solid #6366F1`
                            : undefined,

                        outlineOffset:
                          4,
                      }}
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();

                        if (
                          !object.locked
                        ) {
                          setSelectedId(
                            object.id,
                          );
                        }
                      }}
                    />
                  );
                }

                /*
                 * Line
                 */
                if (
                  object.type ===
                  "line"
                ) {
                  return (
                    <div
                      key={
                        object.id
                      }
                      style={{
                        ...objectStyle,

                        height:
                          Math.max(
                            1,
                            object.height *
                              scale,
                          ),

                        background:
                          object.fill,

                        borderRadius:
                          999,

                        outline:
                          isSelected
                            ? "1px solid #6366F1"
                            : undefined,
                      }}
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();

                        if (
                          !object.locked
                        ) {
                          setSelectedId(
                            object.id,
                          );
                        }
                      }}
                    />
                  );
                }

                /*
                 * Text
                 */
                if (
                  object.type ===
                  "text"
                ) {
                  return (
                    <div
                      key={
                        object.id
                      }
                      style={{
                        ...objectStyle,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          object.textAlign ===
                          "right"
                            ? "flex-end"
                            : object.textAlign ===
                                "center"
                              ? "center"
                              : "flex-start",

                        color:
                          object.fill,

                        fontFamily:
                          object.fontFamily ??
                          "Inter, sans-serif",

                        fontSize:
                          (object.fontSize ??
                            36) *
                          scale,

                        fontWeight:
                          object.fontWeight ??
                          700,

                        letterSpacing:
                          (object.letterSpacing ??
                            0) *
                          scale,

                        textAlign:
                          object.textAlign ??
                          "center",

                        whiteSpace:
                          "nowrap",

                        outline:
                          isSelected
                            ? "1px solid #6366F1"
                            : undefined,

                        outlineOffset:
                          4,

                        userSelect:
                          "none",
                      }}
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();

                        if (
                          !object.locked
                        ) {
                          setSelectedId(
                            object.id,
                          );
                        }
                      }}
                    >
                      {object.text}
                    </div>
                  );
                }

                /*
                 * Image
                 */
                if (
                  object.type ===
                  "image"
                ) {
                  return (
                    <div
                      key={
                        object.id
                      }
                      style={{
                        ...objectStyle,

                        overflow:
                          "hidden",

                        borderRadius:
                          object.radius *
                          scale,

                        outline:
                          isSelected
                            ? "1px solid #6366F1"
                            : undefined,

                        outlineOffset:
                          4,
                      }}
                      onClick={(
                        event,
                      ) => {
                        event.stopPropagation();

                        if (
                          !object.locked
                        ) {
                          setSelectedId(
                            object.id,
                          );
                        }
                      }}
                    >
                      {object.imageSrc ? (
                        <img
                          src={
                            object.imageSrc
                          }
                          alt=""
                          draggable={
                            false
                          }
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] text-xs text-[var(--text-muted)]">
                          Image
                        </div>
                      )}
                    </div>
                  );
                }

                /*
                 * Rectangle
                 */
                return (
                  <div
                    key={
                      object.id
                    }
                    style={{
                      ...objectStyle,

                      background:
                        object.fill,

                      border:
                        object.strokeWidth >
                        0
                          ? `${object.strokeWidth * scale}px solid ${object.stroke}`
                          : undefined,

                      borderRadius:
                        object.radius *
                        scale,

                      outline:
                        isSelected
                          ? "1px solid #6366F1"
                          : undefined,

                      outlineOffset:
                        4,
                    }}
                    onClick={(
                      event,
                    ) => {
                      event.stopPropagation();

                      if (
                        !object.locked
                      ) {
                        setSelectedId(
                          object.id,
                        );
                      }
                    }}
                  />
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Canvas footer */}
      <div className="flex h-10 shrink-0 items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-3">

        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          Local design workspace
        </div>

        <div className="flex items-center gap-1">

          <button
            type="button"
            aria-label="Zoom out"
            onClick={() =>
              setZoom(
                Math.max(
                  25,
                  zoom - 10,
                ),
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-muted)]"
          >
            <Minus
              size={13}
            />
          </button>

          <button
            type="button"
            aria-label="Zoom in"
            onClick={() =>
              setZoom(
                Math.min(
                  200,
                  zoom + 10,
                ),
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-muted)]"
          >
            <Plus
              size={13}
            />
          </button>

        </div>
      </div>
    </div>
  );
}