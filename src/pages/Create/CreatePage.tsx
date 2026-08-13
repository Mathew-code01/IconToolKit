// src/pages/Create/CreatePage.tsx

import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateToolbar } from "./CreateToolbar";
import CreateCanvas from "./CreateCanvas";
import CreateLayers from "./CreateLayers";
import CreateProperties from "./CreateProperties";
import CreateHistory from "./CreateHistory";
import CreateExport from "./CreateExport";

export type CanvasSize = {
  width: number;
  height: number;
};

export type CreateTool =
  | "select"
  | "pan"
  | "rectangle"
  | "circle"
  | "line"
  | "text"
  | "draw"
  | "image";

export type DesignObjectType =
  | "rectangle"
  | "circle"
  | "text"
  | "line"
  | "image";

export type DesignObject = {
  id: string;
  type: DesignObjectType;
  name: string;

  x: number;
  y: number;
  width: number;
  height: number;

  rotation: number;
  opacity: number;

  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;

  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right";

  imageSrc?: string;

  visible: boolean;
  locked: boolean;
};

export type BackgroundSettings = {
  type: "solid" | "gradient" | "transparent";
  color: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
};

const INITIAL_CANVAS: CanvasSize = {
  width: 512,
  height: 512,
};

const INITIAL_OBJECTS: DesignObject[] = [
  {
    id: "background-shape",
    type: "circle",
    name: "Main Shape",
    x: 106,
    y: 106,
    width: 300,
    height: 300,
    rotation: 0,
    opacity: 1,
    fill: "#6366F1",
    stroke: "transparent",
    strokeWidth: 0,
    radius: 0,
    visible: true,
    locked: false,
  },
  {
    id: "brand-text",
    type: "text",
    name: "Brand Name",
    x: 136,
    y: 218,
    width: 240,
    height: 72,
    rotation: 0,
    opacity: 1,
    fill: "#FFFFFF",
    stroke: "transparent",
    strokeWidth: 0,
    radius: 0,
    text: "IT",
    fontFamily: "Inter",
    fontSize: 64,
    fontWeight: 800,
    letterSpacing: -2,
    textAlign: "center",
    visible: true,
    locked: false,
  },
];

const INITIAL_BACKGROUND: BackgroundSettings = {
  type: "solid",
  color: "#F8FAFC",
  gradientFrom: "#6366F1",
  gradientTo: "#8B5CF6",
  gradientAngle: 135,
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneObjects(objects: DesignObject[]) {
  return objects.map((object) => ({ ...object }));
}

export default function CreatePage() {
  const [canvasSize] = useState<CanvasSize>(INITIAL_CANVAS);

  const [objects, setObjects] = useState<DesignObject[]>(INITIAL_OBJECTS);

  const [background, setBackground] =
    useState<BackgroundSettings>(INITIAL_BACKGROUND);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [activeTool, setActiveTool] = useState<CreateTool>("select");

  const [zoom, setZoom] = useState(85);

  const [history, setHistory] = useState<DesignObject[][]>([]);

  const [future, setFuture] = useState<DesignObject[][]>([]);

  const selectedObject = useMemo(
    () => objects.find((object) => object.id === selectedId) ?? null,
    [objects, selectedId],
  );

  const commitObjects = useCallback(
    (nextObjects: DesignObject[]) => {
      setHistory((previous) => [...previous.slice(-49), cloneObjects(objects)]);

      setObjects(nextObjects);
      setFuture([]);
    },
    [objects],
  );

  const updateObject = useCallback(
    (id: string, updates: Partial<DesignObject>) => {
      const next = objects.map((object) =>
        object.id === id
          ? {
              ...object,
              ...updates,
            }
          : object,
      );

      commitObjects(next);
    },
    [objects, commitObjects],
  );

  const deleteObject = useCallback(
    (id: string) => {
      const next = objects.filter((object) => object.id !== id);

      commitObjects(next);

      if (selectedId === id) {
        setSelectedId(null);
      }
    },
    [objects, commitObjects, selectedId],
  );

  const duplicateObject = useCallback(
    (id: string) => {
      const source = objects.find((object) => object.id === id);

      if (!source) return;

      const duplicate: DesignObject = {
        ...source,
        id: createId("object"),
        name: `${source.name} Copy`,
        x: source.x + 24,
        y: source.y + 24,
      };

      commitObjects([...objects, duplicate]);

      setSelectedId(duplicate.id);
      setActiveTool("select");
    },
    [objects, commitObjects],
  );

  const addObject = useCallback(
    (type: DesignObjectType) => {
      const centerX = canvasSize.width / 2 - 80;

      const centerY = canvasSize.height / 2 - 80;

      const object: DesignObject = {
        id: createId(type),

        type,

        name:
          type === "text"
            ? "Text"
            : type === "circle"
              ? "Circle"
              : type === "line"
                ? "Line"
                : type === "image"
                  ? "Image"
                  : "Rectangle",

        x: centerX,
        y: centerY,

        width: type === "line" ? 180 : type === "text" ? 220 : 160,

        height: type === "line" ? 4 : type === "text" ? 64 : 160,

        rotation: 0,
        opacity: 1,

        fill: type === "text" ? "#111827" : "#6366F1",

        stroke: "transparent",
        strokeWidth: 0,

        radius: type === "rectangle" ? 24 : 0,

        visible: true,
        locked: false,

        ...(type === "text"
          ? {
              text: "Your Text",
              fontFamily: "Inter, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: -1,
              textAlign: "center" as const,
            }
          : {}),

        ...(type === "image"
          ? {
              imageSrc: undefined,
            }
          : {}),
      };

      commitObjects([...objects, object]);

      setSelectedId(object.id);

      /*
       * Important:
       * Clicking a shape tool creates ONE object,
       * then immediately returns to Select.
       *
       * The toolbar itself no longer creates objects.
       */
      setActiveTool("select");
    },
    [canvasSize, objects, commitObjects],
  );

  const moveLayer = useCallback(
    (id: string, direction: "up" | "down") => {
      const index = objects.findIndex((object) => object.id === id);

      if (index === -1) return;

      const targetIndex = direction === "up" ? index + 1 : index - 1;

      if (targetIndex < 0 || targetIndex >= objects.length) {
        return;
      }

      const next = [...objects];

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

      commitObjects(next);
    },
    [objects, commitObjects],
  );

  const bringToFront = useCallback(
    (id: string) => {
      const object = objects.find((item) => item.id === id);

      if (!object) return;

      commitObjects([...objects.filter((item) => item.id !== id), object]);
    },
    [objects, commitObjects],
  );

  const sendToBack = useCallback(
    (id: string) => {
      const object = objects.find((item) => item.id === id);

      if (!object) return;

      commitObjects([object, ...objects.filter((item) => item.id !== id)]);
    },
    [objects, commitObjects],
  );

  const undo = useCallback(() => {
    if (!history.length) return;

    const previous = history[history.length - 1];

    setFuture((current) => [cloneObjects(objects), ...current]);

    setObjects(cloneObjects(previous));

    setHistory((current) => current.slice(0, -1));
  }, [history, objects]);

  const redo = useCallback(() => {
    if (!future.length) return;

    const next = future[0];

    setHistory((current) => [...current, cloneObjects(objects)]);

    setObjects(cloneObjects(next));

    setFuture((current) => current.slice(1));
  }, [future, objects]);

  const resetDesign = useCallback(() => {
    setHistory((previous) => [...previous, cloneObjects(objects)]);

    setObjects(cloneObjects(INITIAL_OBJECTS));

    setBackground(INITIAL_BACKGROUND);

    setSelectedId(null);
    setActiveTool("select");
    setZoom(85);
    setFuture([]);
  }, [objects]);

  /*
   * Keyboard shortcuts.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }

        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (isTyping) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedId) {
          deleteObject(selectedId);
        }

        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();

        if (selectedId) {
          duplicateObject(selectedId);
        }

        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;

        case "r":
          setActiveTool("rectangle");
          break;

        case "o":
          setActiveTool("circle");
          break;

        case "l":
          setActiveTool("line");
          break;

        case "t":
          setActiveTool("text");
          break;

        case "p":
          setActiveTool("draw");
          break;

        case "i":
          setActiveTool("image");
          break;

        case "escape":
          setSelectedId(null);
          setActiveTool("select");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, undo, redo, deleteObject, duplicateObject]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col overflow-hidden bg-[#0f1117] text-[var(--text)]">
      {/* =====================================================
          EDITOR HEADER
      ====================================================== */}
      <header className="sticky top-0 z-[100] h-14 shrink-0 border-b border-white/[0.08] bg-[#111318]/95 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6366F1] text-[11px] font-bold text-white shadow-lg shadow-indigo-500/20">
              IT
            </div>

            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-white">
                Create
              </div>

              <div className="hidden truncate text-[10px] text-white/40 sm:block">
                Icon & logo design studio
              </div>
            </div>

            <div className="hidden h-5 w-px bg-white/10 md:block" />

            <div className="hidden items-center gap-2 text-[10px] text-white/40 md:flex">
              <span>{objects.length} layers</span>

              <span>•</span>

              <span>
                {canvasSize.width} × {canvasSize.height}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Undo"
              onClick={undo}
              disabled={!history.length}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:flex"
            >
              ↶
            </button>

            <button
              type="button"
              title="Redo"
              onClick={redo}
              disabled={!future.length}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:flex"
            >
              ↷
            </button>

            <CreateExport
              canvasSize={canvasSize}
              objects={objects}
              background={background}
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          EDITOR
      ====================================================== */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* LEFT TOOLBAR */}
        <aside className="sticky left-0 top-14 z-50 hidden h-[calc(100vh-120px)] w-[68px] shrink-0 border-r border-white/[0.07] bg-[#15171d] lg:block">
          <CreateToolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onAddObject={addObject}
          />
        </aside>

        {/* CENTER WORKSPACE */}
        <main className="relative min-w-0 flex-1 overflow-hidden bg-[#0c0e13]">
          <CreateCanvas
            canvasSize={canvasSize}
            
            objects={objects}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            addObject={addObject}
            zoom={zoom}
            setZoom={setZoom}
            background={background}
            setBackground={setBackground}
          />
        </main>

        {/* RIGHT INSPECTOR */}
        <aside className="sticky right-0 top-14 z-50 hidden h-[calc(100vh-120px)] w-[320px] shrink-0 overflow-hidden border-l border-white/[0.07] bg-[#15171d] xl:flex xl:flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CreateProperties
              object={selectedObject}
              onUpdate={updateObject}
              onDelete={deleteObject}
              onDuplicate={duplicateObject}
            />

            <CreateLayers
              objects={objects}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMove={moveLayer}
              onUpdate={updateObject}
              onDelete={deleteObject}
              onBringToFront={bringToFront}
              onSendToBack={sendToBack}
            />
          </div>

          <div className="shrink-0 border-t border-white/[0.07] bg-[#111318]">
            <CreateHistory
              canUndo={history.length > 0}
              canRedo={future.length > 0}
              onUndo={undo}
              onRedo={redo}
              onReset={resetDesign}
            />
          </div>
        </aside>
      </div>

      {/* MOBILE TOOLBAR */}
      <div className="sticky bottom-0 z-[100] flex h-14 shrink-0 items-center justify-center border-t border-white/[0.08] bg-[#15171d]/95 backdrop-blur-xl lg:hidden">
        <CreateToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onAddObject={addObject}
          mobile
        />
      </div>
    </div>
  );
}