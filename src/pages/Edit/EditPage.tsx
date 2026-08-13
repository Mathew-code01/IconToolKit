// src/pages/Edit/EditPage.tsx

export default function EditPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-[#6366F1]">Edit</p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text)]">
        Edit images
      </h1>

      <p className="mt-4 text-[var(--text-secondary)]">
        Crop, resize, remove backgrounds, add backgrounds, rotate, add padding,
        and more.
      </p>
    </section>
  );
}