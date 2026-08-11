// src/components/navigation/MobileNav.tsx

// src/components/navigation/MobileNav.tsx

import { useEffect } from "react";
import { X } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

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

export default function MobileNav({
  open,
  onClose,
}: MobileNavProps) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        top-[61px]
        z-40
        bg-[var(--background)]
        md:hidden
      "
    >
      <div
        className="
          flex
          h-full
          flex-col
          overflow-y-auto
        "
      >
        {/* Mobile menu header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--border)]
            px-4
            py-3
            sm:px-6
          "
        >
          <span
            className="
              text-sm
              font-semibold
              text-[var(--text)]
            "
          >
            Menu
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-secondary)]
              transition-colors
              duration-200
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6366F1]
              focus-visible:ring-offset-2
            "
          >
            <X
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Navigation links */}
        <nav
          aria-label="Mobile navigation"
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            py-5
            sm:px-6
          "
        >
          <div className="flex flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="
                  rounded-xl
                  px-4
                  py-3.5
                  text-base
                  font-medium
                  text-[var(--text-secondary)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface-muted)]
                  hover:text-[var(--text)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#6366F1]
                "
              >
                {item.label}
              </a>
            ))}

            {/* Divider */}
            <div
              className="
                my-4
                h-px
                bg-[var(--border)]
              "
              aria-hidden="true"
            />

            {/* Primary CTA */}
            <a
              href="/generator"
              onClick={onClose}
              className="
                mt-1
                flex
                h-11
                items-center
                justify-center
                rounded-xl
                bg-[#6366F1]
                px-4
                text-sm
                font-semibold
                text-white
                shadow-[0_2px_8px_rgba(99,102,241,0.2)]
                transition-all
                duration-200
                hover:bg-[#4F46E5]
                hover:shadow-[0_4px_12px_rgba(99,102,241,0.28)]
                active:translate-y-px
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#6366F1]
                focus-visible:ring-offset-2
              "
            >
              Create icon
            </a>
          </div>
        </nav>

        {/* Bottom description */}
        <div
          className="
            mt-auto
            border-t
            border-[var(--border)]
            px-4
            py-5
            sm:px-6
          "
        >
          <p
            className="
              mx-auto
              max-w-7xl
              text-xs
              leading-5
              text-[var(--text-muted)]
            "
          >
            A free browser-first toolkit for creating,
            editing, previewing, validating, and exporting
            icons.
          </p>
        </div>
      </div>
    </div>
  );
}