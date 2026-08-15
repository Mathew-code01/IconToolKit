// src/pages/Convert/ConvertProgress.tsx

interface ConvertProgressProps {
  progress: number;
  active: boolean;
  total: number;
  completed: number;
}

export default function ConvertProgress({
  progress,
  active,
  total,
  completed,
}: ConvertProgressProps) {
  if (!active) return null;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[var(--text)]">
            Converting files
          </p>

          <p className="mt-1 text-[10px] text-[var(--text-muted)]">
            {completed} of {total} completed
          </p>
        </div>

        <span className="text-xs font-semibold text-[var(--brand)]">
          {progress}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full rounded-full bg-[var(--brand)] transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
