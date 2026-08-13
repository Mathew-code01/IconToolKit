// src/components/navigation/MobileNav.tsx

// src/components/navigation/MobileNav.tsx
// src/components/navigation/MobileNav.tsx

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import { toolCategories } from "./navigation";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({
  open,
  onClose,
}: MobileNavProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    null,
  );

  /*
   * Lock page scrolling while the mobile navigation is open.
   *
   * This effect only synchronizes React state with the browser DOM.
   * It does not update React state, which keeps it compatible with
   * React's set-state-in-effect lint rule.
   */
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

  /*
   * Close the menu and clear the currently expanded category.
   *
   * Keeping this state update inside the user interaction handler
   * avoids calling setState synchronously from an effect.
   */
  const handleClose = () => {
    setExpandedCategory(null);
    onClose();
  };

  const toggleCategory = (href: string) => {
    setExpandedCategory((current) =>
      current === href ? null : href,
    );
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        top-16
        z-40
        bg-[var(--background)]
        lg:hidden
      "
    >
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Menu header */}
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
          <div>
            <p
              className="
                text-sm
                font-semibold
                text-[var(--text)]
              "
            >
              Toolkit
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-[var(--text-muted)]
              "
            >
              Choose a tool category
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
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
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6366F1]
            "
          >
            <X
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Mobile navigation"
          className="
            mx-auto
            w-full
            max-w-2xl
            px-4
            py-5
            sm:px-6
          "
        >
          {/* Generator */}
          <Link
            to="/generator"
            onClick={handleClose}
            className="
              mb-2
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-4
              py-3.5
              text-sm
              font-semibold
              text-[var(--text)]
              transition-colors
              hover:bg-[var(--surface-muted)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6366F1]
            "
          >
            <span>Favicon Generator</span>

            <ChevronRight
              size={17}
              className="text-[var(--text-muted)]"
              aria-hidden="true"
            />
          </Link>

          {/* Categories */}
          <div className="space-y-2">
            {toolCategories.map((category) => {
              const Icon = category.icon;
              const expanded =
                expandedCategory === category.href;

              return (
                <div
                  key={category.href}
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                  "
                >
                  {/* Category trigger */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleCategory(category.href)
                    }
                    aria-expanded={expanded}
                    aria-controls={`mobile-category-${category.href.replace(
                      "/",
                      "",
                    )}`}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      px-4
                      py-3.5
                      text-left
                      transition-colors
                      hover:bg-[var(--surface-muted)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-inset
                      focus-visible:ring-[#6366F1]
                    "
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-[var(--surface-muted)]
                          text-[var(--text-secondary)]
                        "
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>

                      <span>
                        <span
                          className="
                            block
                            text-sm
                            font-semibold
                            text-[var(--text)]
                          "
                        >
                          {category.label}
                        </span>

                        <span
                          className="
                            block
                            text-xs
                            text-[var(--text-muted)]
                          "
                        >
                          {category.description}
                        </span>
                      </span>
                    </span>

                    <ChevronDown
                      size={17}
                      className={`
                        shrink-0
                        text-[var(--text-muted)]
                        transition-transform
                        duration-200
                        ${
                          expanded
                            ? "rotate-180"
                            : ""
                        }
                      `}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Expanded category */}
                  {expanded && (
                    <div
                      id={`mobile-category-${category.href.replace(
                        "/",
                        "",
                      )}`}
                      className="
                        border-t
                        border-[var(--border)]
                        px-4
                        pb-4
                        pt-2
                      "
                    >
                      {/* View all */}
                      <Link
                        to={category.href}
                        onClick={handleClose}
                        className="
                          mb-1
                          flex
                          items-center
                          justify-between
                          rounded-lg
                          px-2
                          py-2
                          text-xs
                          font-semibold
                          text-[#6366F1]
                          transition-colors
                          hover:bg-[var(--surface-muted)]
                        "
                      >
                        <span>
                          View all {category.label} tools
                        </span>

                        <ChevronRight
                          size={14}
                          aria-hidden="true"
                        />
                      </Link>

                      {/* Tools */}
                      {category.tools.map((tool) => (
                        <div
                          key={tool}
                          className="
                            rounded-lg
                            px-2
                            py-2
                            text-xs
                            text-[var(--text-muted)]
                          "
                        >
                          {tool}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom CTA */}
        <div
          className="
            mt-auto
            border-t
            border-[var(--border)]
            p-4
            sm:p-6
          "
        >
          <Link
            to="/generator"
            onClick={handleClose}
            className="
              flex
              h-11
              w-full
              items-center
              justify-center
              rounded-xl
              bg-[#6366F1]
              px-4
              text-sm
              font-semibold
              text-white
              shadow-[0_4px_14px_rgba(99,102,241,0.20)]
              transition-all
              duration-200
              hover:bg-[#4F46E5]
              hover:shadow-[0_6px_18px_rgba(99,102,241,0.25)]
              active:translate-y-px
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6366F1]
              focus-visible:ring-offset-2
            "
          >
            Create an icon
          </Link>

          <p
            className="
              mx-auto
              mt-3
              max-w-md
              text-center
              text-[11px]
              leading-5
              text-[var(--text-muted)]
            "
          >
            Free browser-based tools. No account required.
          </p>
        </div>
      </div>
    </div>
  );
}