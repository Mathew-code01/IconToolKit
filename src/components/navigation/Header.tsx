// src/components/navigation/Header.tsx

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import DesktopNav from "./DesktopNav";
import HeaderActions from "./HeaderActions";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((current) => !current);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-50
          w-full
          border-b
          border-[var(--header-border)]
          bg-[var(--header-background)]
          backdrop-blur-2xl
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[var(--border)]
            to-transparent
          "
          aria-hidden="true"
        />

        <div
          className="
            mx-auto
            flex
            h-[72px]
            w-full
            max-w-[1440px]
            items-center
            gap-4
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          {/* Brand */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <DesktopNav />
          </div>

          {/* Desktop actions */}
          <div className="ml-auto shrink-0">
            <HeaderActions />
          </div>

          {/* Mobile actions */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="
                inline-flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--text-secondary)]
                shadow-[var(--shadow-xs)]
                transition-all
                duration-200
                hover:border-[var(--border-strong)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--text)]
                active:scale-95
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[var(--background)]
              "
            >
              {mobileOpen ? (
                <X
                  size={19}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  size={19}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-navigation">
        <MobileNav
          open={mobileOpen}
          onClose={closeMobileMenu}
        />
      </div>
    </>
  );
}