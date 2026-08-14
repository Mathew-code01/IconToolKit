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
        <div
          className="
            mb-1 flex h-7 w-7 items-center justify-center
            rounded-lg
            bg-[var(--surface-muted)]
            text-[9px] font-semibold
            text-[var(--text-muted)]
          "
        >
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
                  ? "bg-[var(--toolbar-active)] text-[var(--toolbar-active-text)] shadow-lg shadow-indigo-500/20"
                  : "text-[var(--toolbar-icon)] hover:bg-[var(--toolbar-hover)] hover:text-[var(--toolbar-icon-hover)]"
              }
            `}
          >
            <Icon size={17} strokeWidth={1.8} />

            {!mobile && (
              <span
                className="
                  pointer-events-none absolute left-[54px] z-[200]
                  hidden min-w-max items-center gap-3
                  rounded-lg
                  border border-[var(--tooltip-border)]
                  bg-[var(--tooltip-background)]
                  px-3 py-2
                  text-[11px]
                  text-[var(--tooltip-text)]
                  shadow-2xl
                  group-hover:flex
                "
              >
                <span>{tool.label}</span>

                <kbd
                  className="
                    rounded
                    bg-[var(--surface-muted)]
                    px-1.5 py-0.5
                    font-mono text-[9px]
                    text-[var(--text-muted)]
                  "
                >
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
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              text-[var(--text-muted)]
              transition
              hover:bg-[var(--toolbar-hover)]
              hover:text-[var(--toolbar-icon-hover)]
            "
          >
            <Eraser size={17} strokeWidth={1.8} />
          </button>
        </>
      )}
    </div>
  );
}

export default CreateToolbar;