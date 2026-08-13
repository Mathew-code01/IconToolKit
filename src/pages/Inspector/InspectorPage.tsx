// src/pages/Inspector/InspectorPage.tsx

export default function InspectPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-[#6366F1]">Inspect</p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text)]">
        Inspect icons and images
      </h1>

      <p className="mt-4 text-[var(--text-secondary)]">
        Inspect favicons, image metadata, dimensions, transparency, websites,
        and PWA assets.
      </p>
    </section>
  );
}