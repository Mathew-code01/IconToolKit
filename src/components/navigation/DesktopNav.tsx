// src/components/navigation/DesktopNav.tsx

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { primaryNavigation, toolCategories } from "./navigation";

export default function DesktopNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="
        flex
        items-center
        gap-1
      "
    >
      {/* Tools */}
      <div className="group relative">
        <button
          type="button"
          className="
            inline-flex
            h-10
            items-center
            gap-1.5
            rounded-xl
            border
            border-transparent
            px-3
            text-[13px]
            font-semibold
            text-[var(--nav-text)]
            transition-all
            duration-200
            hover:border-[var(--border)]
            hover:bg-[var(--nav-hover)]
            hover:text-[var(--nav-text-hover)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--brand)]
          "
        >
          Tools
          <ChevronDown
            size={14}
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
            z-[100]
            w-[820px]
            -translate-x-1/2
            translate-y-3
            pt-3
            opacity-0
            transition-all
            duration-200
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
              bg-[var(--surface-raised)]
              shadow-[var(--shadow-xl)]
            "
          >
            {/* Mega menu header */}
            <div
              className="
                relative
                overflow-hidden
                border-b
                border-[var(--border)]
                px-6
                py-5
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-0
                  h-32
                  w-64
                  bg-[var(--brand-gradient-soft)]
                  blur-3xl
                "
                aria-hidden="true"
              />

              <div className="relative flex items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-[var(--brand)]
                        shadow-[0_0_12px_var(--brand)]
                      "
                      aria-hidden="true"
                    />

                    <p
                      className="
                        text-[13px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-[var(--text)]
                      "
                    >
                      IconToolkit Tools
                    </p>
                  </div>

                  <p
                    className="
                      mt-1.5
                      max-w-lg
                      text-xs
                      leading-5
                      text-[var(--text-muted)]
                    "
                  >
                    Create, edit, convert, optimize and inspect digital assets
                    from one browser-first toolkit.
                  </p>
                </div>

                <Link
                  to="/"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-[var(--text-secondary)]
                    transition-all
                    hover:border-[var(--border-brand)]
                    hover:bg-[var(--surface-brand)]
                    hover:text-[var(--brand)]
                  "
                >
                  View all tools
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div
              className="
                grid
                grid-cols-3
                gap-px
                bg-[var(--border)]
              "
            >
              {toolCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <NavLink
                    key={category.href}
                    to={category.href}
                    className="
                      group/category
                      bg-[var(--surface)]
                      p-5
                      transition-all
                      duration-200
                      hover:bg-[var(--surface-hover)]
                    "
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[var(--border)]
                          bg-[var(--surface-muted)]
                          text-[var(--text-secondary)]
                          transition-all
                          duration-200
                          group-hover/category:border-[var(--border-brand)]
                          group-hover/category:bg-[var(--surface-brand)]
                          group-hover/category:text-[var(--brand)]
                        "
                      >
                        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                      </span>

                      <span className="min-w-0">
                        <span
                          className="
                            block
                            text-sm
                            font-bold
                            tracking-[-0.01em]
                            text-[var(--text)]
                          "
                        >
                          {category.label}
                        </span>

                        <span
                          className="
                            mt-1
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

                    <div className="mt-4 space-y-1.5">
                      {category.tools.slice(0, 4).map((tool) => (
                        <span
                          key={tool}
                          className="
                              flex
                              items-center
                              gap-2
                              text-[11px]
                              text-[var(--text-muted)]
                            "
                        >
                          <span
                            className="
                                h-1
                                w-1
                                shrink-0
                                rounded-full
                                bg-[var(--border-strong)]
                              "
                            aria-hidden="true"
                          />

                          <span className="truncate">{tool}</span>
                        </span>
                      ))}

                      {category.tools.length > 4 && (
                        <span
                          className="
                            block
                            pt-1
                            text-[11px]
                            font-semibold
                            text-[var(--brand)]
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
              h-10
              items-center
              rounded-xl
              border
              px-3
              text-[13px]
              font-semibold
              transition-all
              duration-200

              ${
                isActive
                  ? `
                    border-[var(--border-brand)]
                    bg-[var(--nav-active)]
                    text-[var(--nav-active-text)]
                  `
                  : `
                    border-transparent
                    text-[var(--nav-text)]
                    hover:border-[var(--border)]
                    hover:bg-[var(--nav-hover)]
                    hover:text-[var(--nav-text-hover)]
                  `
              }

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--brand)]
            `}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}