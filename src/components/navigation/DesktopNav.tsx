// src/components/navigation/DesktopNav.tsx

// src/components/navigation/DesktopNav.tsx
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { primaryNavigation, toolCategories } from "./navigation";

export default function DesktopNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 lg:flex"
    >
      {/* Tools mega menu */}
      <div className="group relative">
        <button
          type="button"
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-lg
            px-3
            text-sm
            font-medium
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
          Tools
          <ChevronDown
            size={15}
            strokeWidth={2}
            className="
              transition-transform
              duration-200
              group-hover:rotate-180
            "
            aria-hidden="true"
          />
        </button>

        {/* Mega menu */}
        <div
          className="
            invisible
            absolute
            left-1/2
            top-full
            z-[70]
            w-[760px]
            -translate-x-1/2
            translate-y-2
            pt-3
            opacity-0
            transition-all
            duration-150
            group-hover:visible
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            "
          >
            {/* Header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[var(--border)]
                px-5
                py-4
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
                  Everything you need to work with digital assets.
                </p>
              </div>

              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                  text-[#6366F1]
                  hover:underline
                "
              >
                View all tools
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-3 gap-px bg-[var(--border)]">
              {toolCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <NavLink
                    key={category.href}
                    to={category.href}
                    className="
                      group/category
                      bg-[var(--surface)]
                      p-4
                      transition-colors
                      duration-150
                      hover:bg-[var(--surface-muted)]
                    "
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[var(--surface-muted)]
                          text-[var(--text-secondary)]
                          transition-colors
                          group-hover/category:bg-[#6366F1]/10
                          group-hover/category:text-[#6366F1]
                        "
                      >
                        <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                      </span>

                      <span className="min-w-0">
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
                            mt-0.5
                            block
                            text-[11px]
                            leading-4
                            text-[var(--text-muted)]
                          "
                        >
                          {category.description}
                        </span>
                      </span>
                    </div>

                    <div className="mt-3 space-y-1">
                      {category.tools.slice(0, 4).map((tool) => (
                        <span
                          key={tool}
                          className="
                            block
                            truncate
                            text-xs
                            text-[var(--text-muted)]
                          "
                        >
                          {tool}
                        </span>
                      ))}

                      {category.tools.length > 4 && (
                        <span
                          className="
                            block
                            pt-0.5
                            text-xs
                            font-medium
                            text-[#6366F1]
                          "
                        >
                          + {category.tools.length - 4} more
                        </span>
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Primary routes */}
      {primaryNavigation.map((item) => {
        if (!item.href) {
          return null;
        }

        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => `
              inline-flex
              h-9
              items-center
              rounded-lg
              px-3
              text-sm
              font-medium
              transition-colors
              duration-200
              ${
                isActive
                  ? "bg-[var(--surface-muted)] text-[var(--text)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
              }
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6366F1]
              focus-visible:ring-offset-2
            `}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}