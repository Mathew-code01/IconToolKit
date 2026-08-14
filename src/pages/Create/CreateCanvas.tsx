// src/pages/Create/CreateCanvas.tsx
// src/pages/Create/CreateCanvas.tsx
import {
  Grid3X3,
  Minus,
  Plus,
  RotateCcw,
  Maximize2,
  MousePointer2,
  Hand,
} from "lucide-react";

import type {
  BackgroundSettings,
  CanvasSize,
  CreateTool,
  DesignObject,
  DesignObjectType,
} from "./CreatePage";

type Props = {
  canvasSize: CanvasSize;
  

  objects: DesignObject[];

  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  activeTool: CreateTool;
  setActiveTool: (tool: CreateTool) => void;

  addObject: (type: DesignObjectType) => void;

  zoom: number;
  setZoom: (zoom: number) => void;

  background: BackgroundSettings;
  setBackground: React.Dispatch<React.SetStateAction<BackgroundSettings>>;
};

export default function CreateCanvas({
  canvasSize,
  objects,
  selectedId,
  setSelectedId,
  activeTool,
  setActiveTool,
  zoom,
  setZoom,
  background,
  setBackground,
}: Props) {
  const scale = zoom / 100;

  const canvasWidth = canvasSize.width * scale;
  const canvasHeight = canvasSize.height * scale;

  const backgroundStyle: React.CSSProperties =
    background.type === "transparent"
      ? {
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }
      : background.type === "gradient"
        ? {
            background: `linear-gradient(${background.gradientAngle}deg, ${background.gradientFrom}, ${background.gradientTo})`,
          }
        : {
            background: background.color,
          };

  const handleCanvasClick = () => {
    setSelectedId(null);

    if (activeTool !== "select") {
      setActiveTool("select");
    }
  };

  const handleZoom = (amount: number) => {
    setZoom(Math.min(400, Math.max(25, zoom + amount)));
  };

  const fitCanvas = () => {
    setZoom(85);
  };

  const isHandTool = activeTool === "pan";

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[var(--background)]">
      {/* =====================================================
          CANVAS TOOLBAR
      ====================================================== */}
      <div
        className="
    absolute left-1/2 top-3 z-40
    flex max-w-[calc(100%-1rem)]
    -translate-x-1/2
    items-center gap-0.5
    overflow-x-auto
    rounded-xl
    border border-[var(--border)]
    bg-[var(--surface)]/95
    p-1
    shadow-xl
    backdrop-blur-xl
    sm:top-4
    sm:gap-1
  "
      >
        <button
          type="button"
          title="Select"
          aria-label="Select tool"
          onClick={() => setActiveTool("select")}
          className={`
            flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
            transition-colors
            ${
              activeTool === "select"
                ? "bg-[var(--surface-muted)] text-[var(--text)]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            }
          `}
        >
          <MousePointer2 size={15} />
        </button>

        <button
          type="button"
          title="Pan / Hand"
          aria-label="Pan tool"
          onClick={() => setActiveTool("pan")}
          className={`
            flex h-8 w-8 items-center justify-center rounded-lg
            transition-colors
            ${
              isHandTool
                ? "bg-[var(--surface-muted)] text-[var(--text)]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            }
          `}
        >
          <Hand size={15} />
        </button>

        <div className="mx-1 h-5 w-px bg-[var(--border)]" />

        <button
          type="button"
          title="Zoom out"
          aria-label="Zoom out"
          onClick={() => handleZoom(-10)}
          disabled={zoom <= 25}
          className="
            flex h-8 w-8 items-center justify-center rounded-lg
            text-[var(--text-muted)] transition-colors
            hover:bg-[var(--surface-muted)] hover:text-[var(--text)]
            disabled:pointer-events-none disabled:opacity-30
          "
        >
          <Minus size={14} />
        </button>

        <button
          type="button"
          title="Reset zoom"
          aria-label={`Current zoom ${zoom} percent`}
          onClick={fitCanvas}
          className="
            min-w-12 rounded-lg px-2 py-1
            text-center font-mono text-[10px]
            text-[var(--text-secondary)]
            transition-colors
            hover:bg-[var(--surface-muted)] hover:text-[var(--text)]
          "
        >
          {zoom}%
        </button>

        <button
          type="button"
          title="Zoom in"
          aria-label="Zoom in"
          onClick={() => handleZoom(10)}
          disabled={zoom >= 400}
          className="
            flex h-8 w-8 items-center justify-center rounded-lg
            text-[var(--text-muted)] transition-colors
            hover:bg-[var(--surface-muted)] hover:text-[var(--text)]
            disabled:pointer-events-none disabled:opacity-30
          "
        >
          <Plus size={14} />
        </button>

        <button
          type="button"
          title="Fit canvas"
          aria-label="Fit canvas"
          onClick={fitCanvas}
          className="
            hidden h-8 w-8 items-center justify-center rounded-lg
            text-[var(--text-muted)] transition-colors
            hover:bg-[var(--surface-muted)] hover:text-[var(--text)]
            sm:flex
          "
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* =====================================================
          WORKSPACE
      ====================================================== */}
      <div
        className={`
          relative min-h-0 flex-1 overflow-auto
          ${isHandTool ? "cursor-grab active:cursor-grabbing" : ""}
        `}
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_100%)]" />

        {/* ===================================================
            DESIGN AREA
        ==================================================== */}
        <div
          className="relative flex min-h-full min-w-full items-center justify-center p-6 sm:p-12 lg:p-20"
          style={{
            minWidth: Math.max(
              0,
              canvasWidth + (window.innerWidth < 640 ? 48 : 160),
            ),
            minHeight: Math.max(
              0,
              canvasHeight + (window.innerWidth < 640 ? 48 : 160),
            ),
          }}
          onClick={handleCanvasClick}
        >
          {/* Canvas shadow */}
          <div
            className="relative shrink-0"
            style={{
              width: canvasWidth,
              height: canvasHeight,
            }}
          >
            <div
              className="
    absolute -inset-3
    rounded-[4px]
    bg-[var(--editor-shadow)]
    blur-xl
  "
            />
            <div
              className="relative h-full w-full overflow-hidden rounded-[2px] border border-black/20 shadow-[0_30px_80px_var(--editor-shadow)]"
              style={backgroundStyle}
              onClick={(event) => {
                event.stopPropagation();
                handleCanvasClick();
              }}
            >
              {/* Canvas coordinate indicator */}
              <div
                className="
  pointer-events-none
  absolute left-2 top-2 z-10
  rounded-md
  bg-[var(--surface-muted)]/80
  px-1.5 py-1
  font-mono text-[8px]
  text-[var(--text-muted)]
  shadow-sm
"
              >
                {canvasSize.width} × {canvasSize.height}
              </div>

              {/* Objects */}
              {objects.map((object) => {
                if (!object.visible) {
                  return null;
                }

                const isSelected = object.id === selectedId;

                const objectStyle: React.CSSProperties = {
                  position: "absolute",
                  left: object.x * scale,
                  top: object.y * scale,
                  width: object.width * scale,
                  height: object.height * scale,
                  transform: `rotate(${object.rotation}deg)`,
                  opacity: object.opacity,
                  boxSizing: "border-box",
                  cursor: object.locked ? "not-allowed" : "move",
                  userSelect: "none",
                };

                const selectionStyle: React.CSSProperties = isSelected
                  ? {
                      outline: `${Math.max(1, 1 / scale)}px solid var(--accent, #6366F1)`,
                      outlineOffset: 4,
                    }
                  : {};

                /* Circle */
                if (object.type === "circle") {
                  return (
                    <div
                      key={object.id}
                      style={{
                        ...objectStyle,
                        ...selectionStyle,
                        borderRadius: "50%",
                        background: object.fill,
                        border:
                          object.strokeWidth > 0
                            ? `${object.strokeWidth * scale}px solid ${object.stroke}`
                            : undefined,
                      }}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!object.locked) {
                          setSelectedId(object.id);
                        }
                      }}
                    >
                      {isSelected && <SelectionHandles />}
                    </div>
                  );
                }

                /* Line */
                if (object.type === "line") {
                  return (
                    <div
                      key={object.id}
                      style={{
                        ...objectStyle,
                        ...selectionStyle,
                        height: Math.max(1, object.height * scale),
                        background: object.fill,
                        borderRadius: 999,
                      }}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!object.locked) {
                          setSelectedId(object.id);
                        }
                      }}
                    >
                      {isSelected && <SelectionHandles />}
                    </div>
                  );
                }

                /* Text */
                if (object.type === "text") {
                  return (
                    <div
                      key={object.id}
                      style={{
                        ...objectStyle,
                        ...selectionStyle,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          object.textAlign === "right"
                            ? "flex-end"
                            : object.textAlign === "center"
                              ? "center"
                              : "flex-start",
                        color: object.fill,
                        fontFamily: object.fontFamily ?? "Inter, sans-serif",
                        fontSize: (object.fontSize ?? 36) * scale,
                        fontWeight: object.fontWeight ?? 700,
                        letterSpacing: (object.letterSpacing ?? 0) * scale,
                        textAlign: object.textAlign ?? "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        userSelect: "none",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!object.locked) {
                          setSelectedId(object.id);
                        }
                      }}
                    >
                      {object.text}

                      {isSelected && <SelectionHandles />}
                    </div>
                  );
                }

                /* Image */
                if (object.type === "image") {
                  return (
                    <div
                      key={object.id}
                      style={{
                        ...objectStyle,
                        ...selectionStyle,
                        overflow: "hidden",
                        borderRadius: object.radius * scale,
                        background: "var(--surface-muted)",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!object.locked) {
                          setSelectedId(object.id);
                        }
                      }}
                    >
                      {object.imageSrc ? (
                        <img
                          src={object.imageSrc}
                          alt=""
                          draggable={false}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div
                          className="
  flex h-full w-full
  items-center justify-center
  text-[10px]
  text-[var(--text-muted)]
"
                        >
                          Image
                        </div>
                      )}

                      {isSelected && <SelectionHandles />}
                    </div>
                  );
                }

                /* Rectangle */
                return (
                  <div
                    key={object.id}
                    style={{
                      ...objectStyle,
                      ...selectionStyle,
                      background: object.fill,
                      border:
                        object.strokeWidth > 0
                          ? `${object.strokeWidth * scale}px solid ${object.stroke}`
                          : undefined,
                      borderRadius: object.radius * scale,
                    }}
                    onClick={(event) => {
                      event.stopPropagation();

                      if (!object.locked) {
                        setSelectedId(object.id);
                      }
                    }}
                  >
                    {isSelected && <SelectionHandles />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM STATUS BAR
      ====================================================== */}
      <div
        className="
          flex h-9 shrink-0 items-center justify-between
          border-t border-[var(--border)]
          bg-[var(--surface)]
          px-3
        "
      >
        <div className="flex items-center gap-2 text-[9px] text-[var(--text-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span>Design workspace</span>

          <span className="hidden sm:inline">•</span>

          <span className="hidden sm:inline">
            {objects.length} {objects.length === 1 ? "layer" : "layers"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Reset zoom"
            onClick={() => setZoom(85)}
            className="
              flex h-7 items-center gap-1.5 rounded-md px-2
              text-[9px] text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-muted)] hover:text-[var(--text)]
            "
          >
            <RotateCcw size={11} />
            Reset
          </button>

          <button
            type="button"
            title="Toggle transparency grid"
            onClick={() =>
              setBackground((current) => ({
                ...current,
                type: current.type === "transparent" ? "solid" : "transparent",
              }))
            }
            className={`
              flex h-7 items-center gap-1.5 rounded-md px-2
              text-[9px] transition-colors
              ${
                background.type === "transparent"
                  ? "bg-[var(--surface-muted)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
              }
            `}
          >
            <Grid3X3 size={11} />
            Grid
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SELECTION HANDLES
============================================================ */

function SelectionHandles() {
  const handleClass =
    "absolute h-2 w-2 rounded-[2px] border border-white bg-[var(--accent,#6366F1)] shadow-sm";

  return (
    <>
      <span className={`${handleClass} -left-1 -top-1`} />
      <span className={`${handleClass} -right-1 -top-1`} />
      <span className={`${handleClass} -bottom-1 -left-1`} />
      <span className={`${handleClass} -bottom-1 -right-1`} />

      <span className="absolute left-1/2 top-[-18px] h-4 w-px -translate-x-1/2 bg-[var(--accent,#6366F1)]" />

      <span className="absolute left-1/2 top-[-22px] h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-[var(--accent,#6366F1)]" />
    </>
  );
}