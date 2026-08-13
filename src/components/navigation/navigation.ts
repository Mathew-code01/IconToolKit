// src/components/navigation/navigation.ts

import {
  AppWindow,
  Code2,
  FileImage,
  Gauge,
  ImageIcon,
  ScanSearch,
  WandSparkles,
} from "lucide-react";

export interface ToolCategory {
  label: string;
  description: string;
  href: string;
  icon: typeof ImageIcon;
  tools: string[];
}

export const toolCategories: ToolCategory[] = [
  {
    label: "Create",
    description: "Generate icons and digital assets",
    href: "/create",
    icon: WandSparkles,
    tools: [
      "Favicon & Web Icons",
      "App Icons",
      "PWA Icons",
      "Social / OG Images",
    ],
  },
  {
    label: "Edit",
    description: "Modify and prepare your images",
    href: "/edit",
    icon: ImageIcon,
    tools: [
      "Remove Background",
      "Add / Change Background",
      "Crop",
      "Resize",
      "Rotate / Flip",
      "Rounded Corners",
      "Add Padding",
      "Image Editor",
    ],
  },
  {
    label: "Convert",
    description: "Convert between image formats",
    href: "/convert",
    icon: FileImage,
    tools: [
      "PNG → JPG",
      "JPG → PNG",
      "PNG / JPG → WebP",
      "WebP → PNG / JPG",
      "SVG → PNG",
      "Image → ICO",
      "Image → PDF",
      "PDF → Image",
    ],
  },
  {
    label: "Optimize",
    description: "Reduce size without sacrificing quality",
    href: "/optimize",
    icon: Gauge,
    tools: [
      "Compress Image",
      "Resize & Compress",
      "Convert + Compress",
      "Quality vs File Size",
    ],
  },
  {
    label: "Inspect",
    description: "Analyze icons, images and websites",
    href: "/inspect",
    icon: ScanSearch,
    tools: [
      "Favicon Inspector",
      "Image Metadata",
      "Image Dimensions",
      "Color / Transparency",
      "Website Icon Checker",
      "PWA Icon Validator",
    ],
  },
  {
    label: "Developer",
    description: "Generate production-ready code",
    href: "/developer",
    icon: Code2,
    tools: [
      "HTML Favicon Generator",
      "manifest.json Generator",
      "<link> Tag Generator",
      "Framework Snippets",
      "ZIP Asset Pack",
    ],
  },
];

export const primaryNavigation = [
  {
    label: "Generator",
    href: "/generator",
    icon: AppWindow,
  },
  {
    label: "Docs",
    href: "/docs",
  },
];