// src/pages/Create/CreateToolbar.tsx
// src/pages/Create/CreateToolbar.tsx

import {
  Circle,
  Eraser,
  ImagePlus,
  MousePointer2,
  Pencil,
  Slash,
  Square,
  Type,
} from "lucide-react";

import type { CreateTool, DesignObjectType } from "./CreatePage";

type Props = {
  activeTool: CreateTool;
  onToolChange: (tool: CreateTool) => void;
  onAddObject: (type: DesignObjectType) => void;
  mobile?: boolean;
};

type ToolDefinition = {
  id: CreateTool;
  label: string;
  shortcut: string;
  icon: typeof MousePointer2;
  type?: DesignObjectType;
};

const tools: ToolDefinition[] = [
  {
    id: "select",
    label: "Select",
    shortcut: "V",
    icon: MousePointer2,
  },
  {
    id: "rectangle",
    label: "Rectangle",
    shortcut: "R",
    icon: Square,
    type: "rectangle",
  },
  {
    id: "circle",
    label: "Ellipse",
    shortcut: "O",
    icon: Circle,
    type: "circle",
  },
  {
    id: "line",
    label: "Line",
    shortcut: "L",
    icon: Slash,
    type: "line",
  },
  {
    id: "text",
    label: "Text",
    shortcut: "T",
    icon: Type,
    type: "text",
  },
  {
    id: "draw",
    label: "Pen",
    shortcut: "P",
    icon: Pencil,
  },
  {
    id: "image",
    label: "Image",
    shortcut: "I",
    icon: ImagePlus,
  },
];

export function CreateToolbar({
  activeTool,
  onToolChange,
  onAddObject,
  mobile = false,
}: Props) {
  const handleToolClick = (tool: ToolDefinition) => {
    /*
     * Shape tools create an object immediately,
     * but the toolbar does NOT stay stuck on that tool.
     *
     * This prevents the old behaviour where selecting
     * a tool feels like the tool is permanently active.
     */
    if (tool.type) {
      onAddObject(tool.type);
      return;
    }

    onToolChange(tool.id);
  };

  return (
    <div
      className={
        mobile
          ? "flex items-center gap-1 px-2"
          : "flex h-full flex-col items-center gap-2 py-3"
      }
    >
      {!mobile && (
        <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-[9px] font-semibold text-white/30">
          ⌘
        </div>
      )}

      {tools.map((tool) => {
        const Icon = tool.icon;

        const active = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            title={`${tool.label} (${tool.shortcut})`}
            aria-label={`${tool.label} (${tool.shortcut})`}
            aria-pressed={active}
            onClick={() => handleToolClick(tool)}
            className={`
              group relative flex h-10 w-10 shrink-0
              items-center justify-center rounded-xl
              transition-all duration-150
              ${
                active
                  ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-500/20"
                  : "text-white/45 hover:bg-white/[0.06] hover:text-white"
              }
            `}
          >
            <Icon size={17} strokeWidth={1.8} />

            {!mobile && (
              <span className="pointer-events-none absolute left-[54px] z-[200] hidden min-w-max items-center gap-3 rounded-lg border border-white/10 bg-[#1b1e26] px-3 py-2 text-[11px] text-white shadow-2xl group-hover:flex">
                <span>{tool.label}</span>

                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/50">
                  {tool.shortcut}
                </kbd>
              </span>
            )}
          </button>
        );
      })}

      {!mobile && (
        <>
          <div className="flex-1" />

          <button
            type="button"
            title="Clear selection (Escape)"
            aria-label="Clear selection"
            onClick={() => onToolChange("select")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Eraser size={17} strokeWidth={1.8} />
          </button>
        </>
      )}
    </div>
  );
}

export default CreateToolbar;