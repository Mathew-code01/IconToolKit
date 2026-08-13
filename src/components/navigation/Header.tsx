// src/components/navigation/Header.tsx

// src/components/navigation/Header.tsx
import { Menu, X } from "lucide-react";
import { useState } from "react";

import HeaderActions from "./HeaderActions";
import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((current) => !current);
  };

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-50
          w-full
          border-b
          border-[var(--border)]
          bg-[var(--background)]/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-[1440px]
            items-center
            justify-between
            gap-6
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          {/* Brand */}
          <Logo />

          {/* Desktop navigation */}
          <div className="flex min-w-0 flex-1 justify-center">
            <DesktopNav />
          </div>

          {/* Desktop actions */}
          <HeaderActions />

          {/* Mobile actions */}
          <div
            className="
              flex
              items-center
              gap-2
              lg:hidden
            "
          >
            <ThemeToggle />

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--text-secondary)]
                transition-all
                duration-200
                hover:border-[var(--border-strong)]
                hover:bg-[var(--surface-muted)]
                hover:text-[var(--text)]
                active:scale-95
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#6366F1]
                focus-visible:ring-offset-2
              "
            >
              {mobileOpen ? (
                <X size={18} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Menu size={18} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div id="mobile-navigation">
        <MobileNav open={mobileOpen} onClose={closeMobileMenu} />
      </div>
    </>
  );
}