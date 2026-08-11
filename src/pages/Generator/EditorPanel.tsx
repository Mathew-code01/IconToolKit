// src/pages/Generator/UploadPanel.tsx
import {  RotateCcw, RotateCw, Redo2, Undo2 } from "lucide-react";

export type EditorBackgroundMode = "transparent" | "solid" | "gradient";

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorSettings {
  padding: number;
  scale: number;

  backgroundMode: "transparent" | "solid" | "gradient";

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

  onChange: (updates: Partial<EditorSettings>) => void;

  disabled?: boolean;

  onUndo: () => void;
  onRedo: () => void;

  canUndo: boolean;
  canRedo: boolean;

  onRotateLeft: () => void;
  onRotateRight: () => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
      {children}
    </p>
  );
}

export default function EditorPanel({
  settings,
  onChange,
  disabled = false,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRotateLeft,
  onRotateRight,
}: EditorPanelProps) {
  const reset = () => {
    onChange({
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
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text)]">Editor</h2>

          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Fine-tune every part of your icon.
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

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={disabled || !canUndo}
          onClick={onUndo}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium hover:bg-[var(--surface-muted)] disabled:opacity-40"
        >
          <Undo2 size={14} />
          Undo
        </button>

        <button
          type="button"
          disabled={disabled || !canRedo}
          onClick={onRedo}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium hover:bg-[var(--surface-muted)] disabled:opacity-40"
        >
          <Redo2 size={14} />
          Redo
        </button>
      </div>

      <div className="mt-6 space-y-7">
        {/* CROP */}
        <div>
          <SectionTitle>Crop</SectionTitle>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              {
                label: "Full image",
                crop: {
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                },
              },
              {
                label: "Center",
                crop: {
                  x: 15,
                  y: 15,
                  width: 70,
                  height: 70,
                },
              },
              {
                label: "Square",
                crop: {
                  x: 10,
                  y: 0,
                  width: 80,
                  height: 100,
                },
              },
              {
                label: "Tight",
                crop: {
                  x: 20,
                  y: 20,
                  width: 60,
                  height: 60,
                },
              },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    crop: preset.crop,
                  })
                }
                className="rounded-lg border border-[var(--border)] px-2 py-2 text-xs font-medium hover:bg-[var(--surface-muted)]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <Range
              label="Crop X"
              value={settings.crop.x}
              min={0}
              max={80}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  crop: {
                    ...settings.crop,
                    x: value,
                    width: Math.min(settings.crop.width, 100 - value),
                  },
                })
              }
            />

            <Range
              label="Crop Y"
              value={settings.crop.y}
              min={0}
              max={80}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  crop: {
                    ...settings.crop,
                    y: value,
                    height: Math.min(settings.crop.height, 100 - value),
                  },
                })
              }
            />

            <Range
              label="Crop width"
              value={settings.crop.width}
              min={20}
              max={100}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  crop: {
                    ...settings.crop,
                    width: Math.min(value, 100 - settings.crop.x),
                  },
                })
              }
            />

            <Range
              label="Crop height"
              value={settings.crop.height}
              min={20}
              max={100}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  crop: {
                    ...settings.crop,
                    height: Math.min(value, 100 - settings.crop.y),
                  },
                })
              }
            />
          </div>
        </div>

        {/* TRANSFORM */}
        <div>
          <SectionTitle>Transform</SectionTitle>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={onRotateLeft}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium hover:bg-[var(--surface-muted)]"
            >
              <RotateCcw size={14} />
              90° left
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onRotateRight}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium hover:bg-[var(--surface-muted)]"
            >
              <RotateCw size={14} />
              90° right
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <Range
              label="Rotation"
              value={settings.rotation}
              min={0}
              max={360}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  rotation: value,
                })
              }
              suffix="°"
            />

            <Range
              label="Zoom"
              value={settings.zoom}
              min={50}
              max={200}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  zoom: value,
                })
              }
              suffix="%"
            />

            <Range
              label="Scale"
              value={settings.scale}
              min={50}
              max={160}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  scale: value,
                })
              }
              suffix="%"
            />
          </div>
        </div>

        {/* POSITION */}
        <div>
          <SectionTitle>Position</SectionTitle>

          <div className="mt-3 space-y-4">
            <Range
              label="Horizontal"
              value={settings.positionX}
              min={0}
              max={100}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  positionX: value,
                })
              }
              suffix="%"
            />

            <Range
              label="Vertical"
              value={settings.positionY}
              min={0}
              max={100}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  positionY: value,
                })
              }
              suffix="%"
            />

            <Range
              label="Safe area"
              value={settings.padding}
              min={0}
              max={45}
              disabled={disabled}
              onChange={(value) =>
                onChange({
                  padding: value,
                })
              }
              suffix="%"
            />
          </div>
        </div>

        {/* BACKGROUND */}
        <div>
          <SectionTitle>Background</SectionTitle>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              {
                id: "transparent",
                label: "Clear",
              },
              {
                id: "solid",
                label: "Solid",
              },
              {
                id: "gradient",
                label: "Gradient",
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    backgroundMode: item.id as EditorBackgroundMode,
                  })
                }
                className={`rounded-lg border px-2 py-2 text-xs font-medium ${
                  settings.backgroundMode === item.id
                    ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]"
                    : "border-[var(--border)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {settings.backgroundMode === "solid" && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
              <input
                type="color"
                value={settings.background}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    background: event.target.value,
                  })
                }
                className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
              />

              <div>
                <p className="text-xs font-semibold">Color</p>

                <p className="text-[10px] uppercase text-[var(--text-muted)]">
                  {settings.background}
                </p>
              </div>
            </div>
          )}

          {settings.backgroundMode === "gradient" && (
            <div className="mt-4 space-y-4">
              <ColorField
                label="Start"
                value={settings.gradientFrom}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    gradientFrom: value,
                  })
                }
              />

              <ColorField
                label="End"
                value={settings.gradientTo}
                disabled={disabled}
                onChange={(value) =>
                  onChange({
                    gradientTo: value,
                  })
                }
              />

              <Range
                label="Gradient angle"
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
        </div>

        {/* SHAPE */}
        <div>
          <SectionTitle>Shape</SectionTitle>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              {
                label: "Square",
                value: 0,
              },
              {
                label: "Rounded",
                value: 20,
              },
              {
                label: "Circle",
                value: 50,
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    borderRadius: item.value,
                  })
                }
                className="rounded-lg border border-[var(--border)] px-2 py-2 text-xs font-medium hover:bg-[var(--surface-muted)]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Range
              label="Border radius"
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
        </div>

        {/* BORDER */}
        <div>
          <SectionTitle>Border</SectionTitle>

          <div className="mt-4 space-y-4">
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
        </div>

        {/* SHADOW */}
        <div>
          <div className="flex items-center justify-between">
            <SectionTitle>Shadow</SectionTitle>

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
            <div className="mt-4 space-y-4">
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
                label="Horizontal"
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
                label="Vertical"
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
        </div>
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
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
      <input
        type="color"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
      />

      <div>
        <p className="text-xs font-semibold text-[var(--text)]">{label}</p>

        <p className="text-[10px] uppercase text-[var(--text-muted)]">
          {value}
        </p>
      </div>
    </div>
  );
}