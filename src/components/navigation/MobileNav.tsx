// src/components/navigation/MobileNav.tsx

import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { primaryNavigation, toolCategories } from "./navigation";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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

  const handleClose = () => {
    setExpandedCategory(null);
    onClose();
  };

  const toggleCategory = (href: string) => {
    setExpandedCategory((current) => (current === href ? null : href));
  };

  if (!open) {
    return null;
  }

  return (
    <div
      id="mobile-navigation"
      className="
        fixed
        inset-x-0
        bottom-0
        top-[72px]
        z-40
        bg-[var(--background)]
        lg:hidden
      "
    >
      <div
        className="
          absolute
          inset-0
          overflow-y-auto
        "
      >
        {/* Background glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-64
            w-[80%]
            -translate-x-1/2
            bg-[var(--brand-gradient-soft)]
            opacity-80
            blur-3xl
          "
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-full w-full max-w-2xl flex-col">
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[var(--border)]
              px-4
              py-4
              sm:px-6
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[var(--brand)]
                  "
                  aria-hidden="true"
                />

                <p
                  className="
                    text-sm
                    font-bold
                    text-[var(--text)]
                  "
                >
                  IconToolkit
                </p>
              </div>

              <p
                className="
                  mt-1
                  text-xs
                  text-[var(--text-muted)]
                "
              >
                Digital asset tools for creators and developers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close navigation menu"
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
                hover:border-[var(--border-strong)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--text)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
              "
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Mobile navigation"
            className="
              flex-1
              px-4
              py-5
              sm:px-6
            "
          >
            {/* Primary links */}
            <div className="mb-5 grid grid-cols-2 gap-2">
              {primaryNavigation.map((item) => {
                if (!item.href) {
                  return null;
                }

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleClose}
                    className="
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
                      shadow-[var(--shadow-xs)]
                      transition-all
                      hover:border-[var(--border-brand)]
                      hover:bg-[var(--surface-brand)]
                      hover:text-[var(--brand)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--brand)]
                    "
                  >
                    <span>{item.label}</span>

                    <ChevronRight
                      size={16}
                      className="text-[var(--text-subtle)]"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>

            {/* Section heading */}
            <div className="mb-3">
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[var(--text-subtle)]
                "
              >
                Tool categories
              </p>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              {toolCategories.map((category) => {
                const Icon = category.icon;

                const expanded = expandedCategory === category.href;

                const categoryId = `mobile-category-${category.href
                  .replace(/\//g, "-")
                  .replace(/^-/, "")}`;

                return (
                  <div
                    key={category.href}
                    className="
                      overflow-hidden
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      shadow-[var(--shadow-xs)]
                    "
                  >
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.href)}
                      aria-expanded={expanded}
                      aria-controls={categoryId}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-3.5
                        text-left
                        transition-colors
                        hover:bg-[var(--surface-hover)]
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-inset
                        focus-visible:ring-[var(--brand)]
                      "
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-[var(--border)]
                            bg-[var(--surface-muted)]
                            text-[var(--text-secondary)]
                          "
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>

                        <span className="min-w-0">
                          <span
                            className="
                              block
                              text-sm
                              font-bold
                              text-[var(--text)]
                            "
                          >
                            {category.label}
                          </span>

                          <span
                            className="
                              mt-0.5
                              block
                              truncate
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
                          ml-3
                          shrink-0
                          text-[var(--text-subtle)]
                          transition-transform
                          duration-200
                          ${expanded ? "rotate-180 text-[var(--brand)]" : ""}
                        `}
                        aria-hidden="true"
                      />
                    </button>

                    {expanded && (
                      <div
                        id={categoryId}
                        className="
                          border-t
                          border-[var(--border)]
                          bg-[var(--surface-subtle)]
                          px-4
                          pb-4
                          pt-3
                        "
                      >
                        <Link
                          to={category.href}
                          onClick={handleClose}
                          className="
                            mb-2
                            flex
                            items-center
                            justify-between
                            rounded-lg
                            border
                            border-[var(--border-brand)]
                            bg-[var(--surface-brand)]
                            px-3
                            py-2.5
                            text-xs
                            font-bold
                            text-[var(--brand)]
                          "
                        >
                          <span>View all {category.label}</span>

                          <ChevronRight size={14} aria-hidden="true" />
                        </Link>

                        <div className="grid grid-cols-1 gap-0.5">
                          {category.tools.map((tool) => (
                            <div
                              key={tool}
                              className="
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-xs
                                  text-[var(--text-muted)]
                                "
                            >
                              {tool}
                            </div>
                          ))}
                        </div>
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
              sticky
              bottom-0
              border-t
              border-[var(--border)]
              bg-[var(--header-background)]
              p-4
              backdrop-blur-xl
              sm:p-6
            "
          >
            <Link
              to="/generator"
              onClick={handleClose}
              className="
                group
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--brand-gradient)]
                text-sm
                font-bold
                text-white
                shadow-[var(--shadow-brand)]
                transition-all
                hover:-translate-y-px
                active:translate-y-0
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[var(--background)]
              "
            >
              Create an icon
              <ChevronRight
                size={16}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                "
                aria-hidden="true"
              />
            </Link>

            <p
              className="
                mt-3
                text-center
                text-[11px]
                text-[var(--text-subtle)]
              "
            >
              Free browser-based tools · No account required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}