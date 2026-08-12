// src/pages/Generator/UploadPanel.tsx
// src/pages/Generator/EditorPanel.tsx

import {
  ChevronDown,
  Crop,
  Layers,
  Move,
  PaintBucket,
  RectangleHorizontal,
  Redo2,
  RotateCcw,
  RotateCw,
  Shapes,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import { useId, useState, type ReactNode } from "react";

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

const BACKGROUND_PRESETS = ["#ffffff", "#0f1420", "#6366f1", "#f4f4f5"];
const BORDER_PRESETS = ["#ffffff", "#0f1420", "#6366f1", "#e5e7eb"];
const GRADIENT_FROM_PRESETS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981"];
const GRADIENT_TO_PRESETS = ["#8b5cf6", "#f472b6", "#fbbf24", "#34d399"];

/* ============================================================================
 * Accordion — real height transition, proper aria wiring
 * ==========================================================================*/

function Accordion({
  id,
  title,
  description,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  description: string;
  icon: typeof Crop;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 rounded-lg py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
              open
                ? "bg-[#6366F1]/10 text-[#6366F1]"
                : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
            }`}
          >
            <Icon size={15} aria-hidden="true" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[var(--text)]">
              {title}
            </span>
            <span className="mt-0.5 block truncate text-[10px] text-[var(--text-muted)]">
              {description}
            </span>
          </span>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="py-5 pl-11 pr-0.5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * Segmented control — shared by fit / background mode / shape presets
 * ==========================================================================*/

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  columns,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  columns?: number;
}) {
  return (
    <div
      role="radiogroup"
      className="grid gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-1"
      style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0,1fr))` }}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`rounded-lg px-2 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 ${
              active
                ? "bg-[var(--surface)] text-[#6366F1] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================================
 * Range — filled track + custom thumb, no extra dependency
 * ==========================================================================*/

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  disabled,
  onChange,
  suffix = "%",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled: boolean;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  const id = useId();
  const percent = clampPercent(((value - min) / (max - min)) * 100);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-[var(--text-secondary)]">
          {label}
        </label>

        <span className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-[var(--text)]">
          {value}
          {suffix}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={`${value}${suffix}`}
        style={{
          backgroundImage: `linear-gradient(to right, #6366F1 ${percent}%, var(--border) ${percent}%)`,
        }}
        className="
          mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full
          outline-none transition
          disabled:cursor-not-allowed disabled:opacity-40
          focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:border
          [&::-webkit-slider-thumb]:border-black/5
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.3)]
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:duration-150
          hover:[&::-webkit-slider-thumb]:scale-110
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border
          [&::-moz-range-thumb]:border-black/5
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.3)]
        "
      />
    </div>
  );
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

/* ============================================================================
 * Color field — swatch, hex input, presets
 * ==========================================================================*/

function ColorField({
  label,
  value,
  disabled,
  onChange,
  presets,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  presets?: string[];
}) {
  const id = useId();

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor={id}
          className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[var(--border)] shadow-sm"
          style={{ backgroundColor: value }}
        >
          <input
            id={id}
            type="color"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </label>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[var(--text)]">{label}</p>

          <input
            value={value}
            disabled={disabled}
            spellCheck={false}
            onChange={(event) => onChange(event.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-[var(--text-secondary)] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
            aria-label={`${label} hex value`}
          />
        </div>
      </div>

      {presets && presets.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {presets.map((preset) => {
            const active = value.toLowerCase() === preset.toLowerCase();

            return (
              <button
                key={preset}
                type="button"
                disabled={disabled}
                onClick={() => onChange(preset)}
                title={preset}
                aria-label={`Use color ${preset}`}
                className={`h-6 w-6 shrink-0 rounded-full border transition-transform duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${
                  active
                    ? "border-[#6366F1] ring-2 ring-[#6366F1] ring-offset-2 ring-offset-[var(--surface-muted)]"
                    : "border-[var(--border)]"
                }`}
                style={{ backgroundColor: preset }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * Toggle switch
 * ==========================================================================*/

function Switch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "bg-[#6366F1]" : "bg-[var(--border-strong)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ============================================================================
 * Main panel
 * ==========================================================================*/

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
      crop: { x: 0, y: 0, width: 100, height: 100 },
    });
  };

  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-opacity ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
              <SlidersHorizontal size={14} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[var(--text)]">Editor</h2>
              <p className="mt-0.5 text-[10px] leading-4 text-[var(--text-muted)]">
                Adjust your icon visually.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={disabled}
            title="Reset all edits"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reset
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled || !canUndo}
            onClick={onUndo}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          >
            <Undo2 size={14} aria-hidden="true" />
            Undo
          </button>

          <button
            type="button"
            disabled={disabled || !canRedo}
            onClick={onRedo}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          >
            <Redo2 size={14} aria-hidden="true" />
            Redo
          </button>
        </div>
      </div>

      <div className="px-4">
        {/* Crop */}
        <Accordion
          id="crop"
          title="Crop"
          description="Choose exactly which part of the image to use."
          icon={Crop}
          open={openSection === "crop"}
          onToggle={() => toggle("crop")}
        >
          {imageUrl ? (
            <CropEditor
              imageUrl={imageUrl}
              crop={settings.crop}
              disabled={disabled}
              onChange={(crop) => onChange({ crop })}
            />
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              Upload an image to start cropping.
            </p>
          )}
        </Accordion>

        {/* Transform */}
        <Accordion
          id="transform"
          title="Transform"
          description="Rotate, scale, zoom, and position."
          icon={Move}
          open={openSection === "transform"}
          onToggle={() => toggle("transform")}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={onRotateLeft}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Rotate left
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={onRotateRight}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            >
              <RotateCw size={14} aria-hidden="true" />
              Rotate right
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Fit</span>
              <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                How the image fills its safe area.
              </p>
              <div className="mt-2">
                <SegmentedControl
                  options={[
                    { value: "contain", label: "Contain" },
                    { value: "cover", label: "Cover" },
                  ]}
                  value={settings.fit}
                  disabled={disabled}
                  onChange={(fit) => onChange({ fit })}
                />
              </div>
            </div>

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

        {/* Background */}
        <Accordion
          id="background"
          title="Background"
          description="Transparent, solid, or gradient."
          icon={PaintBucket}
          open={openSection === "background"}
          onToggle={() => toggle("background")}
        >
          <SegmentedControl
            options={[
              { value: "transparent", label: "Transparent" },
              { value: "solid", label: "Solid" },
              { value: "gradient", label: "Gradient" },
            ]}
            value={settings.backgroundMode}
            disabled={disabled}
            onChange={(backgroundMode) => onChange({ backgroundMode })}
          />

          {settings.backgroundMode === "solid" && (
            <div className="mt-4">
              <ColorField
                label="Background color"
                value={settings.background}
                disabled={disabled}
                presets={BACKGROUND_PRESETS}
                onChange={(value) => onChange({ background: value })}
              />
            </div>
          )}

          {settings.backgroundMode === "gradient" && (
            <div className="mt-4 space-y-4">
              <ColorField
                label="Start color"
                value={settings.gradientFrom}
                disabled={disabled}
                presets={GRADIENT_FROM_PRESETS}
                onChange={(value) => onChange({ gradientFrom: value })}
              />

              <ColorField
                label="End color"
                value={settings.gradientTo}
                disabled={disabled}
                presets={GRADIENT_TO_PRESETS}
                onChange={(value) => onChange({ gradientTo: value })}
              />

              <Range
                label="Angle"
                value={settings.gradientAngle}
                min={0}
                max={360}
                disabled={disabled}
                onChange={(value) => onChange({ gradientAngle: value })}
                suffix="°"
              />
            </div>
          )}
        </Accordion>

        {/* Shape */}
        <Accordion
          id="shape"
          title="Shape"
          description="Control the icon corners."
          icon={Shapes}
          open={openSection === "shape"}
          onToggle={() => toggle("shape")}
        >
          <SegmentedControl
            options={[
              { value: "square", label: "Square" },
              { value: "rounded", label: "Rounded" },
              { value: "circle", label: "Circle" },
            ]}
            value={
              settings.borderRadius === 0
                ? "square"
                : settings.borderRadius >= 50
                  ? "circle"
                  : "rounded"
            }
            disabled={disabled}
            onChange={(preset) =>
              onChange({
                borderRadius: preset === "square" ? 0 : preset === "circle" ? 50 : 20,
              })
            }
          />

          <div className="mt-4">
            <Range
              label="Corner radius"
              value={settings.borderRadius}
              min={0}
              max={50}
              disabled={disabled}
              onChange={(value) => onChange({ borderRadius: value })}
              suffix="%"
            />
          </div>
        </Accordion>

        {/* Border */}
        <Accordion
          id="border"
          title="Border"
          description="Add a clean outline around the icon."
          icon={RectangleHorizontal}
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
              onChange={(value) => onChange({ borderWidth: value })}
              suffix="px"
            />

            <ColorField
              label="Border color"
              value={settings.borderColor}
              disabled={disabled}
              presets={BORDER_PRESETS}
              onChange={(value) => onChange({ borderColor: value })}
            />
          </div>
        </Accordion>

        {/* Shadow */}
        <Accordion
          id="shadow"
          title="Shadow"
          description="Add depth without making the icon heavy."
          icon={Layers}
          open={openSection === "shadow"}
          onToggle={() => toggle("shadow")}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text)]">Enable shadow</span>
            <Switch
              checked={settings.shadow}
              disabled={disabled}
              onChange={(shadow) => onChange({ shadow })}
              label="Enable shadow"
            />
          </div>

          {settings.shadow && (
            <div className="mt-5 space-y-4">
              <Range
                label="Blur"
                value={settings.shadowBlur}
                min={0}
                max={60}
                disabled={disabled}
                onChange={(value) => onChange({ shadowBlur: value })}
                suffix="px"
              />

              <Range
                label="Opacity"
                value={settings.shadowOpacity}
                min={0}
                max={80}
                disabled={disabled}
                onChange={(value) => onChange({ shadowOpacity: value })}
                suffix="%"
              />

              <Range
                label="Horizontal offset"
                value={settings.shadowOffsetX}
                min={-30}
                max={30}
                disabled={disabled}
                onChange={(value) => onChange({ shadowOffsetX: value })}
                suffix="px"
              />

              <Range
                label="Vertical offset"
                value={settings.shadowOffsetY}
                min={-30}
                max={30}
                disabled={disabled}
                onChange={(value) => onChange({ shadowOffsetY: value })}
                suffix="px"
              />
            </div>
          )}
        </Accordion>
      </div>

      {/* Bottom padding so the last accordion's content isn't flush with the card edge */}
      <div className="h-1" />
    </section>
  );
}