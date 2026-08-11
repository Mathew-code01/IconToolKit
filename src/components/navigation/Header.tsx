// src/components/navigation/Header.tsx


// src/components/navigation/Header.tsx

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobileMenu = () => {
    setMobileOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Brand */}
        <Logo />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          <a
            href="/generator"
            className="
              inline-flex
              h-9
              items-center
              justify-center
              rounded-lg
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

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={mobileOpen ? closeMobileMenu : openMobileMenu}
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
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
            {mobileOpen ? (
              <X
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <Menu
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div id="mobile-navigation">
        <MobileNav
          open={mobileOpen}
          onClose={closeMobileMenu}
        />
      </div>
    </header>
  );
}

