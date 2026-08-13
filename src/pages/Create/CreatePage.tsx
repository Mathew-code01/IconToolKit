// src/pages/Create/CreatePage.tsx

// src/pages/Create/CreatePage.tsx

// src/pages/Create/CreatePage.tsx

import { useCallback, useMemo, useState } from "react";
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
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(INITIAL_CANVAS);

  const [objects, setObjects] =
    useState<DesignObject[]>(INITIAL_OBJECTS);

  const [background, setBackground] =
    useState<BackgroundSettings>(INITIAL_BACKGROUND);

  const [selectedId, setSelectedId] =
    useState<string | null>("brand-text");

  const [activeTool, setActiveTool] =
    useState<CreateTool>("select");

  const [zoom, setZoom] = useState(85);

  const [history, setHistory] =
    useState<DesignObject[][]>([]);

  const [future, setFuture] =
    useState<DesignObject[][]>([]);

  const selectedObject = useMemo(
    () =>
      objects.find(
        (object) => object.id === selectedId,
      ) ?? null,
    [objects, selectedId],
  );

  const commitObjects = useCallback(
    (nextObjects: DesignObject[]) => {
      setHistory((previous) => [
        ...previous.slice(-39),
        cloneObjects(objects),
      ]);

      setObjects(nextObjects);
      setFuture([]);
    },
    [objects],
  );

  const updateObject = useCallback(
    (
      id: string,
      updates: Partial<DesignObject>,
    ) => {
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
      const next = objects.filter(
        (object) => object.id !== id,
      );

      commitObjects(next);
      setSelectedId(null);
    },
    [objects, commitObjects],
  );

  const duplicateObject = useCallback(
    (id: string) => {
      const source = objects.find(
        (object) => object.id === id,
      );

      if (!source) return;

      const duplicate: DesignObject = {
        ...source,
        id: createId("object"),
        name: `${source.name} Copy`,
        x: source.x + 20,
        y: source.y + 20,
      };

      commitObjects([...objects, duplicate]);
      setSelectedId(duplicate.id);
    },
    [objects, commitObjects],
  );

  const addObject = useCallback(
    (type: DesignObjectType) => {
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

        x: canvasSize.width / 2 - 80,
        y: canvasSize.height / 2 - 80,

        width: type === "line" ? 160 : 160,
        height: type === "line" ? 4 : 160,

        rotation: 0,
        opacity: 1,

        fill:
          type === "text"
            ? "#111827"
            : "#6366F1",

        stroke: "transparent",
        strokeWidth: 0,

        radius:
          type === "rectangle"
            ? 24
            : 0,

        visible: true,
        locked: false,

        ...(type === "text"
          ? {
              text: "Your Icon",
              fontFamily: "Inter",
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

      commitObjects([
        ...objects,
        object,
      ]);

      setSelectedId(object.id);
      setActiveTool("select");
    },
    [canvasSize, objects, commitObjects],
  );

  const moveLayer = useCallback(
    (
      id: string,
      direction: "up" | "down",
    ) => {
      const index = objects.findIndex(
        (object) => object.id === id,
      );

      if (index === -1) return;

      const next = [...objects];

      const targetIndex =
        direction === "up"
          ? index + 1
          : index - 1;

      if (
        targetIndex < 0 ||
        targetIndex >= next.length
      ) {
        return;
      }

      [next[index], next[targetIndex]] = [
        next[targetIndex],
        next[index],
      ];

      commitObjects(next);
    },
    [objects, commitObjects],
  );

  const undo = useCallback(() => {
    if (!history.length) return;

    const previous =
      history[history.length - 1];

    setFuture((current) => [
      cloneObjects(objects),
      ...current,
    ]);

    setObjects(
      cloneObjects(previous),
    );

    setHistory((current) =>
      current.slice(0, -1),
    );
  }, [history, objects]);

  const redo = useCallback(() => {
    if (!future.length) return;

    const next = future[0];

    setHistory((current) => [
      ...current,
      cloneObjects(objects),
    ]);

    setObjects(
      cloneObjects(next),
    );

    setFuture((current) =>
      current.slice(1),
    );
  }, [future, objects]);

  const resetDesign = useCallback(() => {
    setHistory((previous) => [
      ...previous,
      cloneObjects(objects),
    ]);

    setObjects(
      cloneObjects(INITIAL_OBJECTS),
    );

    setBackground(
      INITIAL_BACKGROUND,
    );

    setSelectedId("brand-text");
    setZoom(85);
    setFuture([]);
  }, [objects]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--background)] text-[var(--text)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1] text-xs font-bold text-white">
              IT
            </div>

            <div>
              <div className="text-sm font-semibold">
                Create
              </div>

              <div className="hidden text-[11px] text-[var(--text-muted)] sm:block">
                Icon & logo design studio
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-muted)] sm:inline-flex">
              {canvasSize.width} ×{" "}
              {canvasSize.height}
            </span>

            <CreateExport
              canvasSize={canvasSize}
              objects={objects}
              background={background}
            />
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-4">
        <div className="grid min-h-[calc(100vh-112px)] grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] lg:grid-cols-[72px_minmax(0,1fr)_320px]">

          {/* Toolbar */}
          <aside className="border-b border-[var(--border)] bg-[var(--surface)] lg:border-b-0 lg:border-r">
            <CreateToolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              onAddObject={addObject}
            />
          </aside>

          {/* Canvas */}
          <main className="min-h-[680px] bg-[var(--background)]">
            <CreateCanvas
              canvasSize={canvasSize}
              setCanvasSize={setCanvasSize}
              objects={objects}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              activeTool={activeTool}
              zoom={zoom}
              setZoom={setZoom}
              background={background}
              setBackground={setBackground}
            />
          </main>

          {/* Properties / Layers */}
          <aside className="border-t border-[var(--border)] bg-[var(--surface)] lg:border-l lg:border-t-0">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto">

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
                />

              </div>

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
      </div>
    </div>
  );
}