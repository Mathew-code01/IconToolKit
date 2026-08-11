// src/components/navigation/DesktopNav.tsx

// src/components/navigation/DesktopNav.tsx

const navigation = [
  {
    label: "Create",
    href: "/generator",
  },
  {
    label: "Inspect",
    href: "/inspector",
  },
  {
    label: "Validate",
    href: "/validator",
  },
  {
    label: "Docs",
    href: "/docs",
  },
];

export default function DesktopNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 md:flex"
    >
      {navigation.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="
            rounded-lg
            px-3 py-2
            text-sm
            font-medium
            text-[var(--text-secondary)]
            transition-colors duration-200
            hover:bg-[var(--surface-muted)]
            hover:text-[var(--text)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#6366F1]
            focus-visible:ring-offset-2
          "
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}