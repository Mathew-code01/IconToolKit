// src/pages/Developer/DeveloperPage.tsx

export default function DeveloperPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-[#6366F1]">Developer</p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text)]">
        Developer tools
      </h1>

      <p className="mt-4 text-[var(--text-secondary)]">
        Generate favicon HTML, manifest files, framework snippets, and
        downloadable asset packages.
      </p>
    </section>
  );
}