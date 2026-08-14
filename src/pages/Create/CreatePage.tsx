// src/pages/Create/CreatePage.tsx
// src/pages/Create/CreatePage.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Moon,
  PanelRight,
  Sun,
  X,
} from "lucide-react";

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

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("icon-toolkit-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function CreatePage() {
  const [canvasSize] = useState<CanvasSize>(INITIAL_CANVAS);

  const [objects, setObjects] =
    useState<DesignObject[]>(INITIAL_OBJECTS);

  const [background, setBackground] =
    useState<BackgroundSettings>(INITIAL_BACKGROUND);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [activeTool, setActiveTool] =
    useState<CreateTool>("select");

  const [zoom, setZoom] = useState(85);

  const [history, setHistory] =
    useState<DesignObject[][]>([]);

  const [future, setFuture] =
    useState<DesignObject[][]>([]);

  /*
   * Theme
   */
  const [theme, setTheme] = useState<"light" | "dark">(
    getInitialTheme,
  );

  /*
   * Mobile/tablet properties drawer.
   */
  const [propertiesOpen, setPropertiesOpen] =
    useState(false);

  /*
   * Layers drawer is optional on smaller screens.
   */
  const [layersOpen, setLayersOpen] =
    useState(false);

  const selectedObject = useMemo(
    () =>
      objects.find(
        (object) => object.id === selectedId,
      ) ?? null,
    [objects, selectedId],
  );

  const handleSelectObject = useCallback((id: string | null) => {
    setSelectedId(id);

    if (!id) {
      setPropertiesOpen(false);
      return;
    }

    if (window.innerWidth < 1280) {
      setPropertiesOpen(true);
    }
  }, []);

  /*
   * Apply theme to the document.
   *
   * Your index.css already uses:
   * html.dark
   * .dark
   */
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    root.style.colorScheme = theme;

    window.localStorage.setItem(
      "icon-toolkit-theme",
      theme,
    );
  }, [theme]);

  /*
   * Toggle theme.
   */
  const toggleTheme = useCallback(() => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark",
    );
  }, []);

  /*
   * Keep mobile properties in sync with selection.
   *
   * If an object is selected on a smaller screen,
   * automatically reveal the properties drawer.
   */
 

  /*
   * Commit object changes.
   */
  const commitObjects = useCallback(
    (nextObjects: DesignObject[]) => {
      setHistory((previous) => [
        ...previous.slice(-49),
        cloneObjects(objects),
      ]);

      setObjects(nextObjects);
      setFuture([]);
    },
    [objects],
  );

  /*
   * Update object.
   */
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

  /*
   * Delete object.
   */
  const deleteObject = useCallback(
    (id: string) => {
      const next = objects.filter(
        (object) => object.id !== id,
      );

      commitObjects(next);

      if (selectedId === id) {
        setSelectedId(null);
        setPropertiesOpen(false);
      }
    },
    [
      objects,
      commitObjects,
      selectedId,
    ],
  );

  /*
   * Duplicate object.
   */
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
        x: source.x + 24,
        y: source.y + 24,
      };

      commitObjects([
        ...objects,
        duplicate,
      ]);

      setSelectedId(duplicate.id);
      setActiveTool("select");
      setPropertiesOpen(true);
    },
    [objects, commitObjects],
  );

  /*
   * Add object.
   */
  const addObject = useCallback(
    (type: DesignObjectType) => {
      const centerX =
        canvasSize.width / 2 - 80;

      const centerY =
        canvasSize.height / 2 - 80;

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

        width:
          type === "line"
            ? 180
            : type === "text"
              ? 220
              : 160,

        height:
          type === "line"
            ? 4
            : type === "text"
              ? 64
              : 160,

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
              text: "Your Text",
              fontFamily:
                "Inter, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: -1,
              textAlign:
                "center" as const,
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

      /*
       * Open properties on smaller screens.
       */
      if (window.innerWidth < 1280) {
        setPropertiesOpen(true);
      }
    },
    [
      canvasSize,
      objects,
      commitObjects,
    ],
  );

  /*
   * Move layer.
   */
  const moveLayer = useCallback(
    (
      id: string,
      direction: "up" | "down",
    ) => {
      const index = objects.findIndex(
        (object) => object.id === id,
      );

      if (index === -1) return;

      const targetIndex =
        direction === "up"
          ? index + 1
          : index - 1;

      if (
        targetIndex < 0 ||
        targetIndex >= objects.length
      ) {
        return;
      }

      const next = [...objects];

      [
        next[index],
        next[targetIndex],
      ] = [
        next[targetIndex],
        next[index],
      ];

      commitObjects(next);
    },
    [objects, commitObjects],
  );

  /*
   * Bring to front.
   */
  const bringToFront = useCallback(
    (id: string) => {
      const object = objects.find(
        (item) => item.id === id,
      );

      if (!object) return;

      commitObjects([
        ...objects.filter(
          (item) => item.id !== id,
        ),
        object,
      ]);
    },
    [objects, commitObjects],
  );

  /*
   * Send to back.
   */
  const sendToBack = useCallback(
    (id: string) => {
      const object = objects.find(
        (item) => item.id === id,
      );

      if (!object) return;

      commitObjects([
        object,
        ...objects.filter(
          (item) => item.id !== id,
        ),
      ]);
    },
    [objects, commitObjects],
  );

  /*
   * Undo.
   */
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

  /*
   * Redo.
   */
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

  /*
   * Reset.
   */
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

    setSelectedId(null);
    setPropertiesOpen(false);
    setLayersOpen(false);
    setActiveTool("select");
    setZoom(85);
    setFuture([]);
  }, [objects]);

  /*
   * Keyboard shortcuts.
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const target =
        event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      /*
       * Undo / redo.
       */
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();

        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }

        return;
      }

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        redo();
        return;
      }

      /*
       * Escape closes drawers first.
       */
      if (event.key === "Escape") {
        if (propertiesOpen) {
          setPropertiesOpen(false);
          return;
        }

        if (layersOpen) {
          setLayersOpen(false);
          return;
        }

        setSelectedId(null);
        setActiveTool("select");

        return;
      }

      if (isTyping) return;

      /*
       * Delete.
       */
      if (
        event.key === "Delete" ||
        event.key === "Backspace"
      ) {
        if (selectedId) {
          deleteObject(selectedId);
        }

        return;
      }

      /*
       * Duplicate.
       */
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();

        if (selectedId) {
          duplicateObject(selectedId);
        }

        return;
      }

      /*
       * Tools.
       */
      switch (
        event.key.toLowerCase()
      ) {
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
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
  }, [
    selectedId,
    propertiesOpen,
    layersOpen,
    undo,
    redo,
    deleteObject,
    duplicateObject,
  ]);

  return (
    <div
      className="
        flex min-h-[calc(100vh-64px)]
        flex-col overflow-hidden
        bg-[var(--background)]
        text-[var(--text)]
        transition-colors duration-200
      "
    >
      {/* =====================================================
          EDITOR HEADER
      ====================================================== */}

      <header
        className="
          sticky top-0 z-[100]
          h-14 shrink-0
          border-b border-[var(--border)]
          bg-[var(--editor-header)]/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex h-full min-w-0
            items-center justify-between
            gap-2 px-2 sm:px-4
          "
        >
          {/* BRAND / DOCUMENT INFO */}

          <div
            className="
              flex min-w-0 items-center
              gap-2 sm:gap-3
            "
          >
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                bg-[var(--brand)]
                text-[11px] font-bold
                text-white
                shadow-[var(--shadow-md)]
              "
            >
              IT
            </div>

            <div className="min-w-0">
              <div
                className="
                  truncate text-xs
                  font-semibold
                  text-[var(--text)]
                "
              >
                Create
              </div>

              <div
                className="
                  hidden truncate
                  text-[10px]
                  text-[var(--text-muted)]
                  sm:block
                "
              >
                Icon & logo design studio
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
                text-[10px]
                text-[var(--text-muted)]
                md:flex
              "
            >
              <span>{objects.length} layers</span>

              <span>•</span>

              <span>
                {canvasSize.width} × {canvasSize.height}
              </span>
            </div>
          </div>

          {/* HEADER ACTIONS */}

          <div
            className="
              flex shrink-0
              items-center gap-1
              sm:gap-2
            "
          >
            {/* UNDO */}

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
                border border-transparent
                text-[var(--text-muted)]
                transition-all
                hover:border-[var(--border)]
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                disabled:pointer-events-none
                disabled:opacity-30
                sm:flex
              "
            >
              <ChevronLeft size={16} />
            </button>

            {/* REDO */}

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
                border border-transparent
                text-[var(--text-muted)]
                transition-all
                hover:border-[var(--border)]
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                disabled:pointer-events-none
                disabled:opacity-30
                sm:flex
              "
            >
              <ChevronRight size={16} />
            </button>

            {/* MOBILE PROPERTIES */}

            {selectedObject && (
              <button
                type="button"
                title="Open properties"
                aria-label="Open properties"
                onClick={() => setPropertiesOpen(true)}
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  border border-[var(--border)]
                  bg-[var(--surface)]
                  text-[var(--text-muted)]
                  transition-all
                  hover:bg-[var(--surface-muted)]
                  hover:text-[var(--text)]
                  xl:hidden
                "
              >
                <PanelRight size={15} />
              </button>
            )}

            {/* THEME TOGGLE */}

            <button
              type="button"
              title={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              onClick={toggleTheme}
              className="
                relative flex h-8 w-8
                items-center justify-center
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--text-muted)]
                shadow-[var(--shadow-sm)]
                transition-all
                hover:border-[var(--border-strong)]
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
              "
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
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
          EDITOR BODY
      ====================================================== */}

      <div
        className="
          relative flex min-h-0
          flex-1 overflow-hidden
        "
      >
        {/* ===================================================
            LEFT TOOLBAR
        =================================================== */}

        <aside
          className="
            sticky left-0 top-14 z-50
            hidden h-full w-[68px]
            shrink-0
            border-r border-[var(--border)]
            bg-[var(--editor-panel)]
            lg:block
          "
        >
          <CreateToolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onAddObject={addObject}
          />
        </aside>

        {/* ===================================================
            CENTER WORKSPACE
        =================================================== */}

        <main
          className="
            relative min-h-0 min-w-0
            flex-1 overflow-hidden
            bg-[var(--editor-workspace)]
            transition-colors duration-200
          "
        >
          <CreateCanvas
            canvasSize={canvasSize}
            objects={objects}
            selectedId={selectedId}
            setSelectedId={handleSelectObject}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            addObject={addObject}
            zoom={zoom}
            setZoom={setZoom}
            background={background}
            setBackground={setBackground}
          />
        </main>

        {/* ===================================================
            DESKTOP RIGHT INSPECTOR
        =================================================== */}

        <aside
          className="
            sticky right-0 top-14 z-50
            hidden h-full w-[320px]
            shrink-0 overflow-hidden
            border-l border-[var(--border)]
            bg-[var(--editor-panel)]
            xl:flex xl:flex-col
          "
        >
          <div
            className="
              min-h-0 flex-1
              overflow-y-auto
            "
          >
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

          <div
            className="
              shrink-0
              border-t border-[var(--border)]
              bg-[var(--editor-panel-alt)]
            "
          >
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

      {/* =====================================================
          MOBILE TOOLBAR
      ====================================================== */}

      <div
        className="
          sticky bottom-0 z-[100]
          flex h-14 shrink-0
          items-center justify-center
          border-t border-[var(--border)]
          bg-[var(--editor-panel)]/95
          px-2
          backdrop-blur-xl
          lg:hidden
        "
      >
        <div className="flex items-center gap-1">
          <CreateToolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onAddObject={addObject}
            mobile
          />

          {/* MOBILE PROPERTIES BUTTON */}

          {selectedObject && (
            <button
              type="button"
              onClick={() => setPropertiesOpen(true)}
              className="
                ml-1 flex h-10
                items-center gap-2
                rounded-xl
                border border-[var(--border)]
                bg-[var(--surface)]
                px-3
                text-[11px]
                font-medium
                text-[var(--text-secondary)]
                shadow-[var(--shadow-sm)]
                transition-all
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
              "
            >
              <PanelRight size={15} />

              <span className="hidden sm:inline">Properties</span>
            </button>
          )}

          {/* MOBILE LAYERS BUTTON */}

          <button
            type="button"
            onClick={() => setLayersOpen(true)}
            className="
              ml-1 flex h-10
              items-center justify-center
              rounded-xl
              border border-[var(--border)]
              bg-[var(--surface)]
              px-3
              text-[11px]
              font-medium
              text-[var(--text-secondary)]
              shadow-[var(--shadow-sm)]
              transition-all
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
            aria-label="Open layers"
          >
            Layers
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE PROPERTIES DRAWER
      ====================================================== */}

      {propertiesOpen && (
        <div
          className="
            fixed inset-0 z-[300]
            xl:hidden
          "
        >
          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close properties"
            onClick={() => setPropertiesOpen(false)}
            className="
              absolute inset-0
              bg-black/40
              backdrop-blur-[2px]
            "
          />

          {/* DRAWER */}

          <aside
            className="
              absolute right-0 top-0
              flex h-full
              w-[min(92vw,380px)]
              flex-col
              border-l
              border-[var(--border)]
              bg-[var(--editor-panel)]
              text-[var(--text)]
              shadow-2xl
              animate-in
              slide-in-from-right
              duration-200
            "
          >
            {/* DRAWER HEADER */}

            <div
              className="
                flex h-14
                shrink-0
                items-center
                justify-between
                border-b
                border-[var(--border)]
                bg-[var(--editor-header)]
                px-4
              "
            >
              <div>
                <div
                  className="
                    text-xs
                    font-semibold
                    text-[var(--text)]
                  "
                >
                  Edit object
                </div>

                <div
                  className="
                    mt-0.5
                    text-[10px]
                    text-[var(--text-muted)]
                  "
                >
                  Properties & appearance
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPropertiesOpen(false)}
                className="
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  border border-[var(--border)]
                  text-[var(--text-muted)]
                  transition
                  hover:bg-[var(--surface-muted)]
                  hover:text-[var(--text)]
                "
                aria-label="Close properties"
              >
                <X size={16} />
              </button>
            </div>

            {/* CONTENT */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
              "
            >
              <CreateProperties
                object={selectedObject}
                onUpdate={updateObject}
                onDelete={(id) => {
                  deleteObject(id);
                  setPropertiesOpen(false);
                }}
                onDuplicate={duplicateObject}
              />
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
              <button
                type="button"
                onClick={() => setPropertiesOpen(false)}
                className="
                  flex h-9 w-full
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--brand)]
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-[var(--brand-hover)]
                "
              >
                Done
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================
          MOBILE LAYERS DRAWER
      ====================================================== */}

      {layersOpen && (
        <div
          className="
            fixed inset-0 z-[300]
            xl:hidden
          "
        >
          <button
            type="button"
            aria-label="Close layers"
            onClick={() => setLayersOpen(false)}
            className="
              absolute inset-0
              bg-black/40
              backdrop-blur-[2px]
            "
          />

          <aside
            className="
              absolute right-0 top-0
              flex h-full
              w-[min(92vw,380px)]
              flex-col
              border-l
              border-[var(--border)]
              bg-[var(--editor-panel)]
              shadow-2xl
            "
          >
            <div
              className="
                flex h-14
                shrink-0
                items-center
                justify-between
                border-b
                border-[var(--border)]
                bg-[var(--editor-header)]
                px-4
              "
            >
              <div>
                <div
                  className="
                    text-xs font-semibold
                    text-[var(--text)]
                  "
                >
                  Layers
                </div>

                <div
                  className="
                    mt-0.5 text-[10px]
                    text-[var(--text-muted)]
                  "
                >
                  {objects.length} layers
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLayersOpen(false)}
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  border border-[var(--border)]
                  text-[var(--text-muted)]
                  hover:bg-[var(--surface-muted)]
                "
                aria-label="Close layers"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="
                min-h-0 flex-1
                overflow-y-auto
              "
            >
              <CreateLayers
                objects={objects}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setLayersOpen(false);
                  setPropertiesOpen(true);
                }}
                onMove={moveLayer}
                onUpdate={updateObject}
                onDelete={deleteObject}
                onBringToFront={bringToFront}
                onSendToBack={sendToBack}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}