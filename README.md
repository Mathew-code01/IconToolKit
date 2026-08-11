# IconToolkit 🛠️

> A free, privacy-first, browser-based toolkit for creating, inspecting, validating, and exporting web and app icons.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**IconToolkit** simplifies digital asset creation for web developers and designers. Unlike traditional favicon generators that require uploading sensitive images to external servers, **IconToolkit processes everything client-side inside the user's browser**.

No servers, no tracking, no rate limits—just instant, high-quality icon generation and live environmental previews.

---

## ✨ Key Features

- 🎨 **Browser-First Image Processing:** Upload PNG, JPG, or SVG images and process them locally using the HTML5 Canvas API.
- ✂️ **Real-Time Icon Editor:** Crop, resize, adjust padding/safe areas, zoom, and modify background colors with immediate feedback.
- 📐 **Automatic Multi-Size Generation:** Automatically generates standard favicon and PWA dimensions:
  - `16x16`, `32x32`, `48x48`, `64x64`, `96x96`, `128x128`, `180x180` (Apple Touch), `192x192` (Android), `512x512`, and `.ico` multi-resolution files.
- 👁️ **Live Contextual Mockups:** Preview icons in realistic environments:
  - Browser tabs (Light & Dark mode)
  - Address bar & Search engine results
  - Mobile Home Screen & PWA app icons
- 🕵️ **Favicon Inspector & Validator:** Inspect existing websites, detect missing sizes, validate manifest entries, and flag small-size readability issues.
- 📦 **Framework-Ready Exports:** Get pre-configured snippet code and `<link>` tags for React, Next.js, Vite, Astro, and plain HTML.

---

## 🏗️ Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Iconography:** Lucide React
- **Architecture:** Client-side execution utilizing Browser APIs (Canvas, Blob, File, Web Workers)

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── common/        # Shared components
│   ├── feedback/      # Modals, toasts, alerts
│   ├── layout/        # AppShell, Footer
│   ├── navigation/    # Header, Logo, Navbars, ThemeToggle
│   └── ui/            # Reusable UI primitives (Button, Input, etc.)
├── pages/
│   ├── About/         # About & project philosophy
│   ├── Docs/          # Usage documentation
│   ├── Generator/     # Editor, Upload, Size Grid, Preview & Export
│   ├── Home/          # Hero, Tools, & Feature previews
│   ├── Inspector/     # Favicon URL Inspector
│   └── Validator/     # Icon quality & health validator
└── utils/             # Canvas & image processing functions