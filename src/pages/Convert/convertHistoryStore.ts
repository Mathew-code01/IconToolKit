// src/pages/Convert/convertHistoryStore.ts

import type { ConvertHistoryItem } from "./ConvertTypes";

export const CONVERT_HISTORY_STORAGE_KEY = "icon-toolkit-convert-history";

export function readConversionHistory(): ConvertHistoryItem[] {
  try {
    const value = localStorage.getItem(CONVERT_HISTORY_STORAGE_KEY);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as ConvertHistoryItem[];
  } catch {
    return [];
  }
}

export function addConversionHistory(item: ConvertHistoryItem): void {
  try {
    const current = readConversionHistory();

    const next = [
      item,
      ...current.filter((entry) => entry.id !== item.id),
    ].slice(0, 20);

    localStorage.setItem(CONVERT_HISTORY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Local history is optional.
  }
}

export function clearConversionHistory(): void {
  try {
    localStorage.removeItem(CONVERT_HISTORY_STORAGE_KEY);
  } catch {
    // Optional storage.
  }
}