// src/pages/Home/PreviewSection.tsx

// src/pages/Home/PreviewSection.tsx

import { Monitor, Smartphone } from "lucide-react";
import IconSpecimenStrip from "./IconSpecimenStrip";

export default function PreviewSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#6366F1]">
            [ Live previews ]
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-4xl">
            See your icon before you ship it.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            Check different sizes and see how the same icon appears in the
            places your users actually encounter it.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          {/* Browser */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <Monitor size={16} className="text-[var(--text-muted)]" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                Browser
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-strong)]" />
                </div>

                <div className="ml-2 flex flex-1 items-center gap-2 rounded-md bg-[var(--background)] px-2 py-1">
                  <div className="h-4 w-4 rounded bg-[#6366F1]" />
                  <div className="h-2 w-28 rounded bg-[var(--border)]" />
                </div>
              </div>

              <div className="flex h-36 items-center justify-center bg-[var(--background)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366F1] shadow-[0_8px_24px_rgba(99,102,241,0.2)]">
                  <span className="text-xl font-bold text-white">I</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-[var(--text-muted)]" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                Mobile
              </span>
            </div>

            <div className="mt-5 flex h-40 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)]">
              <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#6366F1] shadow-[0_8px_24px_rgba(99,102,241,0.2)]">
                <span className="text-2xl font-bold text-white">I</span>
              </div>
            </div>
          </div>
        </div>

        {/* Size specimen — the signature motif closes the loop from the hero */}
        <div className="mx-auto mt-5 max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">
              Size specimen
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <IconSpecimenStrip />
          </div>

          <p className="mt-5 text-xs leading-5 text-[var(--text-muted)]">
            Every generated size, labeled in pixels — from a 16×16 favicon up
            to a 512×512 app icon.
          </p>
        </div>
      </div>
    </section>
  );
}