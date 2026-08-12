// src/pages/Generator/UploadPanel.tsx
import { ChevronDown, Redo2, RotateCcw, RotateCw, Undo2 } from "lucide-react";
import { useState } from "react";

import CropEditor, { type CropSettings } from "./CropEditor";

export type EditorBackgroundMode = "transparent" | "solid" | "gradient";

export interface EditorSettings {
  padding: number;
  scale: number;

  backgroundMode: EditorBackgroundMode;
  background: string;

  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;

  fit: "contain" | "cover";

  positionX: number;
  positionY: number;

  zoom: number;
  rotation: number;

  borderRadius: number;

  borderWidth: number;
  borderColor: string;

  shadow: boolean;
  shadowBlur: number;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;

  crop: CropSettings;
}

interface EditorPanelProps {
  settings: EditorSettings;
  imageUrl: string | null;

  onChange: (updates: Partial<EditorSettings>) => void;

  disabled?: boolean;

  onUndo: () => void;
  onRedo: () => void;

  canUndo: boolean;
  canRedo: boolean;

  onRotateLeft: () => void;
  onRotateRight: () => void;
}

const DEFAULT_SETTINGS: Omit<EditorSettings, "crop"> = {
  padding: 10,
  scale: 100,

  backgroundMode: "transparent",
  background: "#ffffff",

  gradientFrom: "#6366f1",
  gradientTo: "#8b5cf6",
  gradientAngle: 135,

  fit: "contain",

  positionX: 50,
  positionY: 50,

  zoom: 100,
  rotation: 0,

  borderRadius: 20,

  borderWidth: 0,
  borderColor: "#ffffff",

  shadow: false,
  shadowBlur: 20,
  shadowOpacity: 25,
  shadowOffsetX: 0,
  shadowOffsetY: 8,
};

function Accordion({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-[var(--text)]">
            {title}
          </span>

          <span className="mt-0.5 block text-[10px] text-[var(--text-muted)]">
            {description}
          </span>
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

export default function EditorPanel({
  settings,
  imageUrl,
  onChange,
  disabled = false,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRotateLeft,
  onRotateRight,
}: EditorPanelProps) {
  const [openSection, setOpenSection] = useState("crop");

  const toggle = (section: string) => {
    setOpenSection((current) => (current === section ? "" : section));
  };

  const reset = () => {
    onChange({
      ...DEFAULT_SETTINGS,
      crop: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    });
  };

  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text)]">Editor</h2>

            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              Adjust your icon visually.
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled || !canUndo}
            onClick={onUndo}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium hover:bg-[var(--surface-muted)] disabled:opacity-40"
          >
            <Undo2 size={14} />
            Undo
          </button>

          <button
            type="button"
            disabled={disabled || !canRedo}
            onClick={onRedo}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium hover:bg-[var(--surface-muted)] disabled:opacity-40"
          >
            <Redo2 size={14} />
            Redo
          </button>
        </div>
      </div>

      <div className="px-4">
        <Accordion
          title="Crop"
          description="Choose exactly which part of the image to use."
          open={openSection === "crop"}
          onToggle={() => toggle("crop")}
        >
          {imageUrl && (
            <CropEditor
              imageUrl={imageUrl}
              crop={settings.crop}
              disabled={disabled}
              onChange={(crop) => onChange({ crop })}
            />
          )}
        </Accordion>

        <Accordion
          title="Transform"
          description="Rotate, scale, zoom and position."
          open={openSection === "transform"}
          onToggle={() => toggle("transform")}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={onRotateLeft}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-medium hover:bg-[var(--surface-muted)]"
            >
              <RotateCcw size={14} />
              Rotate left
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onRotateRight}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-medium hover:bg-[var(--surface-muted)]"
            >
              <RotateCw size={14} />
              Rotate right
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <Range
              label="Rotation"
              value={settings.rotation}
              min={0}
              max={360}
              disabled={disabled}
              onChange={(value) => onChange({ rotation: value })}
              suffix="°"
            />

            <Range
              label="Zoom"
              value={settings.zoom}
              min={50}
              max={200}
              disabled={disabled}
              onChange={(value) => onChange({ zoom: value })}
              suffix="%"
            />

            <Range
              label="Scale"
              value={settings.scale}
              min={50}
              max={160}
              disabled={disabled}
              onChange={(value) => onChange({ scale: value })}
              suffix="%"
            />

            <Range
              label="Horizontal position"
              value={settings.positionX}
              min={0}
              max={100}
              disabled={disabled}
              onChange={(value) => onChange({ positionX: value })}
              suffix="%"
            />

            <Range
              label="Vertical position"
              value={settings.positionY}
              min={0}
              max={100}
              disabled={disabled}
              onChange={(value) => onChange({ positionY: value })}
              suffix="%"
            />

            <Range
              label="Safe area"
              value={settings.padding}
              min={0}
              max={45}
              disabled={disabled}
              onChange={(value) => onChange({ padding: value })}
              suffix="%"
            />
          </div>
        </Accordion>

        <Accordion
          title="Background"
          description="Transparent, solid or gradient."
          open={openSection === "background"}
          onToggle={() => toggle("background")}
        >
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["transparent", "Transparent"],
                ["solid", "Solid"],
                ["gradient", "Gradient"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    backgroundMode: id,
                  })
                }
                className={`rounded-lg border px-2 py-2.5 text-xs font-medium ${
                  settings.backgroundMode === id
                    ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]"
                    : "border-[var(--border)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {settings.backgroundMode === "solid" && (
            <div className="mt-4">
              <ColorField
                label="Background color"
                value={settings.background}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    background: value,
                  })
                }
              />
            </div>
          )}

          {settings.backgroundMode === "gradient" && (
            <div className="mt-4 space-y-4">
              <ColorField
                label="Start color"
                value={settings.gradientFrom}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    gradientFrom: value,
                  })
                }
              />

              <ColorField
                label="End color"
                value={settings.gradientTo}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    gradientTo: value,
                  })
                }
              />

              <Range
                label="Angle"
                value={settings.gradientAngle}
                min={0}
                max={360}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    gradientAngle: value,
                  })
                }
                suffix="°"
              />
            </div>
          )}
        </Accordion>

        <Accordion
          title="Shape"
          description="Control the icon corners."
          open={openSection === "shape"}
          onToggle={() => toggle("shape")}
        >
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Square", 0],
              ["Rounded", 20],
              ["Circle", 50],
            ].map(([label, value]) => (
              <button
                key={String(label)}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    borderRadius: Number(value),
                  })
                }
                className="rounded-lg border border-[var(--border)] px-2 py-2.5 text-xs font-medium hover:bg-[var(--surface-muted)]"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Range
              label="Corner radius"
              value={settings.borderRadius}
              min={0}
              max={50}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  borderRadius: value,
                })
              }
              suffix="%"
            />
          </div>
        </Accordion>

        <Accordion
          title="Border"
          description="Add a clean outline around the icon."
          open={openSection === "border"}
          onToggle={() => toggle("border")}
        >
          <div className="space-y-4">
            <Range
              label="Width"
              value={settings.borderWidth}
              min={0}
              max={20}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  borderWidth: value,
                })
              }
              suffix="px"
            />

            <ColorField
              label="Border color"
              value={settings.borderColor}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  borderColor: value,
                })
              }
            />
          </div>
        </Accordion>

        <Accordion
          title="Shadow"
          description="Add depth without making the icon heavy."
          open={openSection === "shadow"}
          onToggle={() => toggle("shadow")}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text)]">
              Enable shadow
            </span>

            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                onChange({
                  shadow: !settings.shadow,
                })
              }
              className={`h-6 w-11 rounded-full p-1 transition ${
                settings.shadow ? "bg-[#6366F1]" : "bg-[var(--border-strong)]"
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                  settings.shadow ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {settings.shadow && (
            <div className="mt-5 space-y-4">
              <Range
                label="Blur"
                value={settings.shadowBlur}
                min={0}
                max={60}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    shadowBlur: value,
                  })
                }
                suffix="px"
              />

              <Range
                label="Opacity"
                value={settings.shadowOpacity}
                min={0}
                max={80}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    shadowOpacity: value,
                  })
                }
                suffix="%"
              />

              <Range
                label="Horizontal offset"
                value={settings.shadowOffsetX}
                min={-30}
                max={30}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    shadowOffsetX: value,
                  })
                }
                suffix="px"
              />

              <Range
                label="Vertical offset"
                value={settings.shadowOffsetY}
                min={-30}
                max={30}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    shadowOffsetY: value,
                  })
                }
                suffix="px"
              />
            </div>
          )}
        </Accordion>
      </div>
    </section>
  );
}

function Range({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
  suffix = "%",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--text-secondary)]">
          {label}
        </label>

        <span className="text-[10px] text-[var(--text-muted)]">
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-[#6366F1]"
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
        />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[var(--text)]">{label}</p>

          <input
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1.5 font-mono text-[10px] uppercase text-[var(--text-secondary)] outline-none focus:border-[#6366F1]"
          />
        </div>
      </div>
    </div>
  );
}