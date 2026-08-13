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

import type {
  CreateTool,
  DesignObjectType,
} from "./CreatePage";

type Props = {
  activeTool: CreateTool;
  onToolChange: (tool: CreateTool) => void;
  onAddObject: (type: DesignObjectType) => void;
};

const tools: Array<{
  id: CreateTool;
  label: string;
  icon: typeof MousePointer2;
  type?: DesignObjectType;
}> = [
  {
    id: "select",
    label: "Select",
    icon: MousePointer2,
  },
  {
    id: "rectangle",
    label: "Rectangle",
    icon: Square,
    type: "rectangle",
  },
  {
    id: "circle",
    label: "Circle",
    icon: Circle,
    type: "circle",
  },
  {
    id: "line",
    label: "Line",
    icon: Slash,
    type: "line",
  },
  {
    id: "text",
    label: "Text",
    icon: Type,
    type: "text",
  },
  {
    id: "draw",
    label: "Draw",
    icon: Pencil,
  },
  {
    id: "image",
    label: "Image",
    icon: ImagePlus,
  },
];

export function CreateToolbar({
  activeTool,
  onToolChange,
  onAddObject,
}: Props) {
  return (
    <div className="flex h-full flex-row items-center justify-center gap-1.5 p-2 lg:flex-col lg:justify-start lg:gap-2 lg:py-4">
      <div className="hidden pb-2 lg:block">
        <div className="mx-auto h-px w-8 bg-[var(--border)]" />
      </div>

      {tools.map((tool) => {
        const Icon = tool.icon;
        const active = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={active}
            onClick={() => {
              onToolChange(tool.id);

              if (tool.type) {
                onAddObject(tool.type);
              }
            }}
            className={`
              group relative flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl transition-all duration-150
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6366F1]
              focus-visible:ring-offset-2
              ${
                active
                  ? "bg-[#6366F1] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
              }
            `}
          >
            <Icon
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span className="pointer-events-none absolute left-12 z-50 hidden whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-medium text-[var(--text)] shadow-lg lg:group-hover:block">
              {tool.label}
            </span>
          </button>
        );
      })}

      <div className="hidden lg:block lg:flex-1" />

      <button
        type="button"
        title="Clear selection"
        aria-label="Clear selection"
        onClick={() => onToolChange("select")}
        className="hidden h-10 w-10 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text)] lg:flex"
      >
        <Eraser
          size={17}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

export default CreateToolbar;