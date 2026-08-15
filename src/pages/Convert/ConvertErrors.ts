// src/pages/Convert/ConvertErrors.ts

export class ConversionCancelledError extends Error {
  constructor(message = "Conversion cancelled.") {
    super(message);
    this.name = "ConversionCancelledError";
  }
}

export function isAbortError(error: unknown): boolean {
  return (
    error instanceof ConversionCancelledError ||
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }
}