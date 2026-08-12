// src/pages/Generator/PreviewPanel.tsx
// src/pages/Generator/PreviewPanel.tsx

import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  Info,
  Laptop,
  Lock,
  Maximize2,
  Minimize2,
  Minus,
  Monitor,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Smartphone,
  Star,
  Sun,
  Moon,
  Tablet,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { EditorSettings } from "./EditorPanel";

/* ============================================================================
 * Types
 * ==========================================================================*/

type PreviewMode =
  | "chrome-tab"
  | "safari-tab"
  | "macos-tab"
  | "windows-taskbar"
  | "chrome-shortcut"
  | "ios-home-screen"
  | "android-home-screen"
  | "pwa-launch";

type PreviewGroupId = "browser" | "desktop" | "mobile" | "app";

type Appearance = "light" | "dark";

interface PreviewPanelProps {
  imageUrl: string | null;
  hasImage: boolean;
  imageWidth: number;
  imageHeight: number;
  settings: EditorSettings;

  siteName: string;
  shortName: string;
  description: string;
}

interface PreviewTheme {
  appearance: Appearance;
  bg: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  control: string;
  controlHover: string;
  accent: string;
  accentSoft: string;
}

/* ============================================================================
 * Preview theme tokens — the ONLY place light/dark preview colors live.
 * Every simulated platform below reads from this object; nothing guesses.
 * ==========================================================================*/

const LIGHT_THEME: PreviewTheme = {
  appearance: "light",
  bg: "#e9ecf2",
  surface: "#ffffff",
  surfaceElevated: "#ffffff",
  surfaceMuted: "#f3f4f7",
  border: "#e2e5eb",
  borderStrong: "#cfd3db",
  text: "#0f1420",
  textMuted: "#6b7280",
  textSubtle: "#9aa0ab",
  control: "#f1f2f5",
  controlHover: "#e5e7eb",
  accent: "#6366F1",
  accentSoft: "rgba(99,102,241,0.12)",
};

const DARK_THEME: PreviewTheme = {
  appearance: "dark",
  bg: "#07080c",
  surface: "#15171e",
  surfaceElevated: "#1c1f29",
  surfaceMuted: "#101218",
  border: "#262a35",
  borderStrong: "#363c4a",
  text: "#f2f3f5",
  textMuted: "#9198a8",
  textSubtle: "#666d7d",
  control: "#1c1f29",
  controlHover: "#252936",
  accent: "#8184f5",
  accentSoft: "rgba(129,132,245,0.16)",
};

function getTheme(appearance: Appearance): PreviewTheme {
  return appearance === "dark" ? DARK_THEME : LIGHT_THEME;
}

/* ============================================================================
 * Mode / group metadata
 * ==========================================================================*/

const GROUPS: {
  id: PreviewGroupId;
  label: string;
  icon: typeof Monitor;
  modes: { id: PreviewMode; label: string }[];
}[] = [
  {
    id: "browser",
    label: "Browser",
    icon: Globe2,
    modes: [
      { id: "chrome-tab", label: "Chrome" },
      { id: "safari-tab", label: "Safari" },
      { id: "macos-tab", label: "macOS" },
    ],
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: Laptop,
    modes: [
      { id: "windows-taskbar", label: "Windows taskbar" },
      { id: "chrome-shortcut", label: "Installed shortcut" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    modes: [
      { id: "ios-home-screen", label: "iOS Home" },
      { id: "android-home-screen", label: "Android Home" },
    ],
  },
  {
    id: "app",
    label: "App",
    icon: Tablet,
    modes: [{ id: "pwa-launch", label: "PWA launch" }],
  },
];

function groupOf(mode: PreviewMode): PreviewGroupId {
  const group = GROUPS.find((item) =>
    item.modes.some((entry) => entry.id === mode),
  );
  return group?.id ?? "browser";
}

/* ============================================================================
 * Utilities
 * ==========================================================================*/

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function displaySiteName(siteName: string) {
  return siteName.trim() || "My Website";
}

function displayShortName(shortName: string, siteName: string) {
  return shortName.trim() || siteName.trim() || "My Website";
}

/* ============================================================================
 * Shared simulation primitives — all theme-driven
 * ==========================================================================*/

function IconGlyph({
  imageUrl,
  size = 64,
  radius = "22%",
  theme,
  className = "",
}: {
  imageUrl: string | null;
  size?: number;
  radius?: string;
  theme: PreviewTheme;
  className?: string;
}) {
  if (!imageUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          borderColor: theme.borderStrong,
          color: theme.textSubtle,
          backgroundColor: theme.surfaceMuted,
        }}
        className={`flex shrink-0 items-center justify-center border border-dashed text-[9px] ${className}`}
      >
        Icon
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt=""
      draggable={false}
      style={{ width: size, height: size, borderRadius: radius }}
      className={`shrink-0 object-cover ${className}`}
    />
  );
}

function DeviceStatusBar({
  light,
  className = "",
}: {
  light: boolean;
  className?: string;
}) {
  const color = light ? "#0f1420" : "#ffffff";

  return (
    <div
      className={`flex h-7 items-center justify-between px-5 text-[10px] font-semibold ${className}`}
      style={{ color }}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Wifi size={11} strokeWidth={2.5} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="h-2.5 w-4 rounded-[2px] border" style={{ borderColor: color }} />
      </div>
    </div>
  );
}

function TrafficLights() {
  return (
    <div className="flex gap-[6px]">
      <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
    </div>
  );
}

/* ============================================================================
 * Chrome — browser tab
 * ==========================================================================*/

function ChromePreview({
  theme,
  imageUrl,
  siteName,
  shortName,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
}) {
  const title = displaySiteName(siteName);
  const short = displayShortName(shortName, siteName);

  return (
    <div
      className="w-full max-w-[560px] overflow-hidden rounded-xl border shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      style={{ borderColor: theme.border, backgroundColor: theme.surface }}
    >
      {/* Tab strip */}
      <div style={{ backgroundColor: theme.surfaceMuted }}>
        <div className="flex h-10 items-center gap-2 px-2.5">
          <TrafficLights />

          <div className="ml-1 flex flex-1 items-center gap-1.5 overflow-hidden">
            <div
              className="flex h-7 max-w-[220px] items-center gap-2 rounded-t-lg px-3"
              style={{ backgroundColor: theme.surface }}
            >
              <IconGlyph imageUrl={imageUrl} size={14} radius="3px" theme={theme} />
              <span
                className="max-w-[130px] truncate text-[10px] font-medium"
                style={{ color: theme.text }}
              >
                {title}
              </span>
              <X size={10} style={{ color: theme.textSubtle }} aria-hidden="true" />
            </div>

            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-sm"
              style={{ color: theme.textSubtle }}
              aria-hidden="true"
            >
              +
            </span>
          </div>

          <button
            type="button"
            aria-label="Browser menu"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded hover:brightness-95"
            style={{ color: theme.textMuted }}
          >
            <MoreHorizontal size={15} />
          </button>
        </div>

        {/* Address bar */}
        <div className="flex h-11 items-center gap-2.5 px-3 pb-2.5">
          <ChevronLeft size={15} style={{ color: theme.textSubtle }} aria-hidden="true" />
          <ChevronRight size={15} style={{ color: theme.textSubtle }} aria-hidden="true" />
          <RefreshCw size={12} style={{ color: theme.textMuted }} aria-hidden="true" />

          <div
            className="flex h-7 flex-1 items-center gap-2 rounded-full px-3"
            style={{ backgroundColor: theme.surface }}
          >
            <Lock size={10} style={{ color: theme.textSubtle }} aria-hidden="true" />
            <IconGlyph imageUrl={imageUrl} size={14} radius="3px" theme={theme} />
            <span className="truncate text-[10px]" style={{ color: theme.textMuted }}>
              yourwebsite.com
            </span>
          </div>

          <Star size={14} style={{ color: theme.textSubtle }} aria-hidden="true" />
        </div>
      </div>

      {/* Content — the point of this preview is the tab, so keep this quiet */}
      <div
        className="flex min-h-[280px] items-center justify-center p-10"
        style={{ backgroundColor: theme.surface }}
      >
        <div className="flex items-center gap-4">
          <IconGlyph imageUrl={imageUrl} size={40} theme={theme} />
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: theme.text }}>
              {short}
            </p>
            <p className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
              This favicon is shown at 16×16 in the live tab above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * Safari — browser tab
 * ==========================================================================*/

function SafariPreview({
  theme,
  imageUrl,
  siteName,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
}) {
  const title = displaySiteName(siteName);

  return (
    <div
      className="w-full max-w-[560px] overflow-hidden rounded-xl border shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      style={{ borderColor: theme.border, backgroundColor: theme.surface }}
    >
      <div className="border-b px-3 pt-2.5" style={{ borderColor: theme.border, backgroundColor: theme.surfaceMuted }}>
        <div className="flex items-center gap-2 pb-2.5">
          <TrafficLights />

          <div
            className="mx-auto flex w-[60%] items-center justify-center gap-2 rounded-lg px-4 py-1.5"
            style={{ backgroundColor: theme.control }}
          >
            <Lock size={10} style={{ color: theme.textSubtle }} aria-hidden="true" />
            <IconGlyph imageUrl={imageUrl} size={14} radius="3px" theme={theme} />
            <span className="truncate text-[10px] font-medium" style={{ color: theme.text }}>
              {title}
            </span>
          </div>

          <button
            type="button"
            aria-label="Show tabs"
            className="flex h-7 w-7 items-center justify-center rounded"
            style={{ color: theme.textMuted }}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="flex min-h-[300px] items-center justify-center" style={{ backgroundColor: theme.surface }}>
        <div className="text-center">
          <IconGlyph imageUrl={imageUrl} size={72} theme={theme} className="mx-auto" />
          <p className="mt-4 text-sm font-semibold" style={{ color: theme.text }}>
            {title}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: theme.textMuted }}>
            Safari tab favicon
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * macOS — window chrome / dock identity
 * ==========================================================================*/

function MacOSPreview({
  theme,
  imageUrl,
  siteName,
  shortName,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
}) {
  const title = displaySiteName(siteName);
  const short = displayShortName(shortName, siteName);

  return (
    <div
      className="w-full max-w-[560px] overflow-hidden rounded-xl border shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      style={{ borderColor: theme.border, backgroundColor: theme.surface }}
    >
      <div className="px-3 pt-2.5" style={{ backgroundColor: theme.surfaceMuted }}>
        <div className="flex items-end gap-1">
          <TrafficLights />

          <div
            className="ml-3 flex items-center gap-2 rounded-t-lg px-4 py-2"
            style={{ backgroundColor: theme.surface }}
          >
            <IconGlyph imageUrl={imageUrl} size={14} radius="3px" theme={theme} />
            <span className="max-w-[150px] truncate text-[10px] font-medium" style={{ color: theme.text }}>
              {title}
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-h-[210px] items-center justify-center" style={{ backgroundColor: theme.surface }}>
        <div className="text-center">
          <IconGlyph imageUrl={imageUrl} size={64} theme={theme} className="mx-auto" />
          <p className="mt-3 text-sm font-semibold" style={{ color: theme.text }}>
            {title}
          </p>
        </div>
      </div>

      {/* Dock strip */}
      <div className="border-t p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceMuted }}>
        <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-wide" style={{ color: theme.textSubtle }}>
          Dock
        </p>
        <div
          className="flex w-fit items-end gap-3 rounded-2xl px-3 py-2"
          style={{ backgroundColor: theme.surfaceElevated, border: `1px solid ${theme.border}` }}
        >
          <IconGlyph imageUrl={imageUrl} size={40} theme={theme} />
          <span className="flex h-10 w-10 items-center justify-center rounded-[11px]" style={{ backgroundColor: theme.control }}>
            <Globe2 size={18} style={{ color: theme.textMuted }} aria-hidden="true" />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-[11px]" style={{ backgroundColor: theme.control }}>
            <Laptop size={18} style={{ color: theme.textMuted }} aria-hidden="true" />
          </span>
        </div>
        <p className="mt-2 truncate text-[9px]" style={{ color: theme.textMuted }}>
          {short}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
 * Windows taskbar
 * ==========================================================================*/

function WindowsTaskbarPreview({
  theme,
  imageUrl,
  siteName,
  shortName,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
}) {
  const title = displaySiteName(siteName);
  const short = displayShortName(shortName, siteName);

  return (
    <div
      className="w-full max-w-[560px] overflow-hidden rounded-xl border shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      style={{ borderColor: theme.border, backgroundColor: theme.bg }}
    >
      <div className="flex min-h-[220px] items-end p-6">
        <div className="w-full text-center text-[10px]" style={{ color: theme.textSubtle }}>
          Desktop
        </div>
      </div>

      {/* Taskbar */}
      <div
        className="flex items-center gap-2 border-t px-3 py-2.5"
        style={{ borderColor: theme.border, backgroundColor: theme.surfaceElevated }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md"
          style={{ backgroundColor: theme.control }}
          aria-hidden="true"
        >
          <div className="grid grid-cols-2 gap-[2px]">
            <span className="h-[6px] w-[6px]" style={{ backgroundColor: theme.text }} />
            <span className="h-[6px] w-[6px]" style={{ backgroundColor: theme.text }} />
            <span className="h-[6px] w-[6px]" style={{ backgroundColor: theme.text }} />
            <span className="h-[6px] w-[6px]" style={{ backgroundColor: theme.text }} />
          </div>
        </span>

        <div
          className="flex h-9 w-32 items-center gap-2 rounded-full px-3"
          style={{ backgroundColor: theme.control }}
        >
          <Search size={13} style={{ color: theme.textMuted }} aria-hidden="true" />
          <span className="text-[9px]" style={{ color: theme.textMuted }}>
            Search
          </span>
        </div>

        {/* Pinned + active site icon (with tooltip preview) */}
        <div className="group relative">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-md ring-1"
            style={{ backgroundColor: theme.accentSoft, ["--tw-ring-color" as string]: theme.accent }}
          >
            <IconGlyph imageUrl={imageUrl} size={22} radius="4px" theme={theme} />
          </span>
          <span
            className="absolute left-1/2 top-0 h-[3px] w-4 -translate-x-1/2 -translate-y-2 rounded-full"
            style={{ backgroundColor: theme.accent }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-40 -translate-x-1/2 rounded-lg p-3 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            style={{ backgroundColor: theme.surfaceElevated, border: `1px solid ${theme.border}` }}
          >
            <IconGlyph imageUrl={imageUrl} size={36} theme={theme} />
            <p className="mt-2 truncate text-[10px] font-semibold" style={{ color: theme.text }}>
              {short}
            </p>
            <p className="mt-0.5 truncate text-[9px]" style={{ color: theme.textMuted }}>
              {title}
            </p>
          </div>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-md" style={{ backgroundColor: theme.control }}>
          <Globe2 size={16} style={{ color: theme.textMuted }} aria-hidden="true" />
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-md" style={{ backgroundColor: theme.control }}>
          <Laptop size={16} style={{ color: theme.textMuted }} aria-hidden="true" />
        </span>

        <div className="ml-auto flex items-center gap-2.5" style={{ color: theme.textMuted }}>
          <Wifi size={13} aria-hidden="true" />
          <span className="text-[9px]">9:41 PM</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * Chrome shortcut / installed web app
 * ==========================================================================*/

function ShortcutTile({
  theme,
  imageUrl,
  label,
  active = false,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: active ? theme.accentSoft : theme.surface,
          border: `1px solid ${active ? theme.accent : theme.border}`,
        }}
      >
        {active ? (
          <IconGlyph imageUrl={imageUrl} size={50} theme={theme} />
        ) : (
          <Globe2 size={22} style={{ color: theme.textSubtle }} aria-hidden="true" />
        )}
      </div>
      <p className="mt-2 truncate text-[9px] font-medium" style={{ color: active ? theme.text : theme.textMuted }}>
        {label}
      </p>
    </div>
  );
}

function ChromeShortcutPreview({
  theme,
  imageUrl,
  siteName,
  shortName,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
}) {
  const title = displaySiteName(siteName);
  const short = displayShortName(shortName, siteName);

  return (
    <div className="w-full max-w-[480px]">
      <div
        className="rounded-2xl border p-7"
        style={{ borderColor: theme.border, backgroundColor: theme.bg }}
      >
        <div className="grid grid-cols-4 gap-6">
          <ShortcutTile theme={theme} imageUrl={imageUrl} label={short} active />
          <ShortcutTile theme={theme} imageUrl={null} label="Chrome" />
          <ShortcutTile theme={theme} imageUrl={null} label="Files" />
          <ShortcutTile theme={theme} imageUrl={null} label="Mail" />
        </div>
      </div>

      <div
        className="mt-3 flex items-center gap-4 rounded-xl border p-4"
        style={{ borderColor: theme.border, backgroundColor: theme.surface }}
      >
        <IconGlyph imageUrl={imageUrl} size={48} theme={theme} />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold" style={{ color: theme.text }}>
            {short}
          </p>
          <p className="mt-1 text-[10px]" style={{ color: theme.textMuted }}>
            Shortcut label · full name: {title}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * iOS Home Screen
 * ==========================================================================*/

function IOSPreview({
  theme,
  imageUrl,
  siteName,
  shortName,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
}) {
  const title = displaySiteName(siteName);
  const short = displayShortName(shortName, siteName);
  const light = theme.appearance === "light";

  const wallpaper = light
    ? "linear-gradient(180deg,#dbeafe 0%,#bfdbfe 45%,#93c5fd 100%)"
    : "linear-gradient(180deg,#0b1220 0%,#151b2e 55%,#1c2440 100%)";

  const labelColor = "#ffffff";

  return (
    <div
      className="w-[252px] overflow-hidden rounded-[38px] border-[6px] shadow-2xl"
      style={{ borderColor: light ? "#111318" : "#000000", backgroundColor: "#000000" }}
    >
      <div className="relative overflow-hidden rounded-[30px]" style={{ backgroundImage: wallpaper }}>
        <DeviceStatusBar light={false} />

        <div
          className="absolute left-1/2 top-[9px] h-[22px] w-[92px] -translate-x-1/2 rounded-full"
          style={{ backgroundColor: "#000000" }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-4 gap-x-3 gap-y-5 px-4 pb-6 pt-8">
          <div className="text-center">
            <IconGlyph imageUrl={imageUrl} size={44} radius="22%" theme={theme} className="mx-auto" />
            <p className="mt-1 truncate text-[8px] font-medium" style={{ color: labelColor }}>
              {short}
            </p>
          </div>

          {["Safari", "Mail", "Maps", "Files", "Music", "Notes", "Photos"].map((label) => (
            <div key={label} className="text-center">
              <div
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-[22%]"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              >
                <Globe2 size={17} style={{ color: "rgba(255,255,255,0.6)" }} aria-hidden="true" />
              </div>
              <p className="mt-1 truncate text-[8px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Dock */}
        <div
          className="mx-3 mb-4 rounded-[26px] p-2.5"
          style={{ backgroundColor: "rgba(255,255,255,0.16)", backdropFilter: "blur(6px)" }}
        >
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-[22%]"
                style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
              >
                <Globe2 size={16} style={{ color: "rgba(255,255,255,0.65)" }} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        <p className="pb-2 text-center text-[8px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {title} — Home Screen
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
 * Android Home Screen
 * ==========================================================================*/

function AndroidPreview({
  theme,
  imageUrl,
  siteName,
  shortName,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
}) {
  const title = displaySiteName(siteName);
  const short = displayShortName(shortName, siteName);
  const light = theme.appearance === "light";

  const wallpaper = light
    ? "linear-gradient(180deg,#ede9fe 0%,#ddd6fe 40%,#c4b5fd 100%)"
    : "linear-gradient(180deg,#0f0a1e 0%,#1a1330 50%,#241a42 100%)";

  return (
    <div
      className="w-[252px] overflow-hidden rounded-[30px] border-[5px] shadow-2xl"
      style={{ borderColor: light ? "#1f2430" : "#000000", backgroundColor: "#000000" }}
    >
      <div className="relative min-h-[440px] overflow-hidden" style={{ backgroundImage: wallpaper }}>
        <DeviceStatusBar light={false} />

        <div className="grid grid-cols-4 gap-x-3 gap-y-6 px-4 pb-6 pt-6">
          <div className="text-center">
            <IconGlyph imageUrl={imageUrl} size={42} radius="26%" theme={theme} className="mx-auto" />
            <p className="mt-1 truncate text-[8px] font-medium text-white">{short}</p>
          </div>

          {["Chrome", "Gmail", "Maps", "Photos", "Music", "Settings", "Files"].map((label) => (
            <div key={label} className="text-center">
              <div className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white/18">
                <Globe2 size={16} className="text-white/60" aria-hidden="true" />
              </div>
              <p className="mt-1 truncate text-[8px] text-white/80">{label}</p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 left-4 right-4 rounded-[24px] bg-white/16 p-2.5 backdrop-blur">
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white/22"
              >
                <Globe2 size={15} className="text-white/70" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/70" />
      </div>

      <span className="sr-only">{title} Android Home Screen</span>
    </div>
  );
}

/* ============================================================================
 * PWA launch
 * ==========================================================================*/

function PwaLaunchPreview({
  theme,
  imageUrl,
  siteName,
  shortName,
  description,
}: {
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
  description: string;
}) {
  const title = displaySiteName(siteName);
  const short = displayShortName(shortName, siteName);

  return (
    <div
      className="w-full max-w-[420px] overflow-hidden rounded-2xl border shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      style={{ borderColor: theme.border, backgroundColor: theme.surface }}
    >
      <div
        className="flex h-10 items-center justify-between border-b px-4"
        style={{ borderColor: theme.border, backgroundColor: theme.surfaceMuted }}
      >
        <div className="flex items-center gap-2">
          <IconGlyph imageUrl={imageUrl} size={16} radius="4px" theme={theme} />
          <span className="text-[10px] font-semibold" style={{ color: theme.text }}>
            {short}
          </span>
        </div>
        <span className="text-[9px]" style={{ color: theme.textSubtle }}>
          Installed app
        </span>
      </div>

      <div
        className="flex min-h-[320px] flex-col items-center justify-center gap-5 p-8 text-center"
        style={{ backgroundColor: theme.surfaceMuted }}
      >
        <IconGlyph imageUrl={imageUrl} size={104} theme={theme} />

        <div>
          <h3 className="text-lg font-bold" style={{ color: theme.text }}>
            {title}
          </h3>
          <p className="mt-1.5 text-[11px] leading-5" style={{ color: theme.textMuted }}>
            {description || "Your installed web application"}
          </p>
        </div>

        <div
          className="flex w-full max-w-[260px] items-center gap-3 rounded-xl p-3 text-left"
          style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
        >
          <IconGlyph imageUrl={imageUrl} size={38} theme={theme} />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold" style={{ color: theme.text }}>
              {short}
            </p>
            <p className="mt-0.5 text-[9px]" style={{ color: theme.textSubtle }}>
              From manifest.json
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * Canvas switch
 * ==========================================================================*/

function PreviewCanvas({
  mode,
  theme,
  imageUrl,
  siteName,
  shortName,
  description,
}: {
  mode: PreviewMode;
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
  description: string;
}) {
  switch (mode) {
    case "chrome-tab":
      return <ChromePreview theme={theme} imageUrl={imageUrl} siteName={siteName} shortName={shortName} />;
    case "safari-tab":
      return <SafariPreview theme={theme} imageUrl={imageUrl} siteName={siteName} />;
    case "macos-tab":
      return <MacOSPreview theme={theme} imageUrl={imageUrl} siteName={siteName} shortName={shortName} />;
    case "windows-taskbar":
      return <WindowsTaskbarPreview theme={theme} imageUrl={imageUrl} siteName={siteName} shortName={shortName} />;
    case "chrome-shortcut":
      return <ChromeShortcutPreview theme={theme} imageUrl={imageUrl} siteName={siteName} shortName={shortName} />;
    case "ios-home-screen":
      return <IOSPreview theme={theme} imageUrl={imageUrl} siteName={siteName} shortName={shortName} />;
    case "android-home-screen":
      return <AndroidPreview theme={theme} imageUrl={imageUrl} siteName={siteName} shortName={shortName} />;
    case "pwa-launch":
      return (
        <PwaLaunchPreview
          theme={theme}
          imageUrl={imageUrl}
          siteName={siteName}
          shortName={shortName}
          description={description}
        />
      );
    default:
      return null;
  }
}

/* ============================================================================
 * Chrome (app UI) — header, group tabs, toolbar
 * ==========================================================================*/

function PreviewHeader() {
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
        <Monitor size={14} aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-[var(--text)]">Preview</h2>
        <p className="mt-0.5 text-[11px] leading-4 text-[var(--text-muted)]">
          See exactly where this icon appears — browser tabs, shortcuts,
          taskbars, and home screens.
        </p>
      </div>
    </div>
  );
}

function PreviewGroupTabs({
  activeGroup,
  onSelect,
}: {
  activeGroup: PreviewGroupId;
  onSelect: (group: PreviewGroupId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Preview platform category"
      className="grid grid-cols-4 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-1"
    >
      {GROUPS.map((group) => {
        const Icon = group.icon;
        const active = group.id === activeGroup;

        return (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(group.id)}
            className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-muted)] ${
              active
                ? "bg-[var(--surface)] text-[#6366F1] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Icon size={14} aria-hidden="true" />
            {group.label}
          </button>
        );
      })}
    </div>
  );
}

function PreviewModeChips({
  activeGroup,
  mode,
  onSelect,
}: {
  activeGroup: PreviewGroupId;
  mode: PreviewMode;
  onSelect: (mode: PreviewMode) => void;
}) {
  const group = GROUPS.find((item) => item.id === activeGroup) ?? GROUPS[0];

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${group.label} preview options`}>
      {group.modes.map((entry) => {
        const active = entry.id === mode;

        return (
          <button
            key={entry.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(entry.id)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] ${
              active
                ? "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

function PreviewToolbar({
  appearance,
  onAppearanceChange,
  zoom,
  onZoomChange,
  expanded,
  onExpandedChange,
}: {
  appearance: Appearance;
  onAppearanceChange: (value: Appearance) => void;
  zoom: number;
  onZoomChange: (value: number) => void;
  expanded: boolean;
  onExpandedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {/* Appearance */}
      <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-1">
        <button
          type="button"
          onClick={() => onAppearanceChange("light")}
          aria-pressed={appearance === "light"}
          aria-label="Preview in light appearance"
          title="Light appearance"
          className={`rounded-md p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
            appearance === "light" ? "bg-[var(--surface)] text-[var(--text)] shadow-sm" : "text-[var(--text-muted)]"
          }`}
        >
          <Sun size={13} />
        </button>
        <button
          type="button"
          onClick={() => onAppearanceChange("dark")}
          aria-pressed={appearance === "dark"}
          aria-label="Preview in dark appearance"
          title="Dark appearance"
          className={`rounded-md p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
            appearance === "dark" ? "bg-[var(--surface)] text-[var(--text)] shadow-sm" : "text-[var(--text-muted)]"
          }`}
        >
          <Moon size={13} />
        </button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-1">
        <button
          type="button"
          onClick={() => onZoomChange(clamp(zoom - 10, 50, 150))}
          disabled={zoom <= 50}
          aria-label="Zoom out preview"
          title="Zoom out"
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface)] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
        >
          <Minus size={12} />
        </button>

        <button
          type="button"
          onClick={() => onZoomChange(100)}
          title="Reset zoom"
          className="min-w-[38px] rounded-md px-1 text-center text-[10px] font-semibold text-[var(--text)] hover:bg-[var(--surface)]"
        >
          {zoom}%
        </button>

        <button
          type="button"
          onClick={() => onZoomChange(clamp(zoom + 10, 50, 150))}
          disabled={zoom >= 150}
          aria-label="Zoom in preview"
          title="Zoom in"
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface)] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Expand */}
      <button
        type="button"
        onClick={() => onExpandedChange(!expanded)}
        aria-label={expanded ? "Exit expanded preview" : "Expand preview"}
        title={expanded ? "Exit expanded preview" : "Expand preview"}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
      >
        {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
      </button>
    </div>
  );
}

/* ============================================================================
 * Viewport — scales the simulation, never lets it overflow the page
 * ==========================================================================*/

function PreviewViewport({
  mode,
  theme,
  imageUrl,
  siteName,
  shortName,
  description,
  zoom,
}: {
  mode: PreviewMode;
  theme: PreviewTheme;
  imageUrl: string | null;
  siteName: string;
  shortName: string;
  description: string;
  zoom: number;
}) {
  return (
    <div
      className="overflow-x-auto overflow-y-hidden rounded-2xl border"
      style={{ borderColor: theme.border, backgroundColor: theme.bg }}
    >
      <div className="flex min-h-[420px] items-center justify-center px-6 py-8">
        <div
          className="motion-reduce:transition-none transition-transform duration-150"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
        >
          <PreviewCanvas
            mode={mode}
            theme={theme}
            imageUrl={imageUrl}
            siteName={siteName}
            shortName={shortName}
            description={description}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * Main panel
 * ==========================================================================*/

export default function PreviewPanel({
  imageUrl,
  hasImage,
  imageWidth,
  imageHeight,
  settings,
  siteName,
  shortName,
  description,
}: PreviewPanelProps) {
  const [mode, setMode] = useState<PreviewMode>("chrome-tab");
  const [activeGroup, setActiveGroup] = useState<PreviewGroupId>("browser");
  const [appearance, setAppearance] = useState<Appearance>("light");
  const [zoom, setZoom] = useState(100);
  const [expanded, setExpanded] = useState(false);

  const theme = useMemo(() => getTheme(appearance), [appearance]);

  const sourceDimensions = useMemo(() => {
    if (!imageWidth || !imageHeight) return "—";
    return `${imageWidth} × ${imageHeight}`;
  }, [imageWidth, imageHeight]);

  const selectGroup = (group: PreviewGroupId) => {
    setActiveGroup(group);
    const firstMode = GROUPS.find((item) => item.id === group)?.modes[0]?.id;
    if (firstMode) setMode(firstMode);
  };

  const selectMode = (nextMode: PreviewMode) => {
    setMode(nextMode);
    setActiveGroup(groupOf(nextMode));
  };

  useEffect(() => {
    if (!expanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  const body = (
    <>
      {/* Categories + specific modes */}
      <div className="mt-4 space-y-3">
        <PreviewGroupTabs activeGroup={activeGroup} onSelect={selectGroup} />
        <PreviewModeChips activeGroup={activeGroup} mode={mode} onSelect={selectMode} />
      </div>

      {/* Toolbar */}
      <div className="mt-4">
        <PreviewToolbar
          appearance={appearance}
          onAppearanceChange={setAppearance}
          zoom={zoom}
          onZoomChange={setZoom}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      </div>

      {/* Viewport */}
      <div className="mt-3">
        {!hasImage ? (
          <div
            className="flex min-h-[420px] items-center justify-center rounded-2xl border p-8"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-muted)" }}
          >
            <div className="max-w-xs text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1]/10 text-[#6366F1]">
                <Monitor size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">
                Your preview appears here
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Upload an icon to see it in a real browser tab, taskbar, and
                home-screen context.
              </p>
            </div>
          </div>
        ) : (
          <PreviewViewport
            mode={mode}
            theme={theme}
            imageUrl={imageUrl}
            siteName={siteName}
            shortName={shortName}
            description={description}
            zoom={zoom}
          />
        )}
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Source</p>
          <p className="mt-1 text-[10px] font-semibold text-[var(--text)]">{sourceDimensions}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Icon zoom</p>
          <p className="mt-1 text-[10px] font-semibold text-[var(--text)]">{settings.zoom}%</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Appearance</p>
          <p className="mt-1 text-[10px] font-semibold capitalize text-[var(--text)]">{appearance}</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <Info size={13} className="mt-0.5 shrink-0 text-[#6366F1]" aria-hidden="true" />
        <p className="text-[10px] leading-4 text-[var(--text-muted)]">
          Every preview uses your generated icon directly, and dark
          appearance recolors the simulated platform, not just this panel.
        </p>
      </div>
    </>
  );

  return (
    <section className="lg:sticky lg:top-5 lg:self-start">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        <PreviewHeader />
        {body}
      </div>

      {/* Expanded overlay */}
      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded icon preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <PreviewHeader />
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close expanded preview"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              >
                <X size={15} />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}
    </section>
  );
}