// src/pages/Create/CreateTypographyPanel.tsx

import type { DesignObject } from "./CreatePage";

type Props = {
  object: DesignObject;

  onUpdate: (id: string, updates: Partial<DesignObject>) => void;
};

const FONT_GROUPS = [
  {
    label: "Sans Serif",
    fonts: [
      "Inter",
      "Arial",
      "Helvetica",
      "Verdana",
      "Tahoma",
      "Trebuchet MS",
      "Gill Sans",
      "Calibri",
      "Segoe UI",
      "Century Gothic",
      "Franklin Gothic Medium",
      "Arial Narrow",
      "Lucida Sans Unicode",
    ],
  },
  {
    label: "Modern / UI",
    fonts: [
      "Aptos",
      "Roboto",
      "Open Sans",
      "Lato",
      "Montserrat",
      "Poppins",
      "Nunito",
      "Raleway",
      "Work Sans",
      "DM Sans",
      "Manrope",
      "Outfit",
      "Plus Jakarta Sans",
      "Space Grotesk",
      "Urbanist",
    ],
  },
  {
    label: "Serif",
    fonts: [
      "Georgia",
      "Times New Roman",
      "Times",
      "Garamond",
      "Palatino",
      "Book Antiqua",
      "Baskerville",
      "Didot",
    ],
  },
  {
    label: "Display",
    fonts: [
      "Impact",
      "Haettenschweiler",
      "Copperplate",
      "Rockwell",
      "Cooper Black",
    ],
  },
  {
    label: "Monospace",
    fonts: [
      "Courier New",
      "Courier",
      "Consolas",
      "Monaco",
      "Menlo",
      "Lucida Console",
    ],
  },
];

const INPUT_CLASS = `
  h-9 w-full rounded-lg
  border border-[var(--border)]
  bg-[var(--background)]
  px-2.5
  text-[11px]
  text-[var(--text)]
  outline-none
  transition-colors
  focus:border-[var(--brand)]
  focus:ring-2
  focus:ring-[var(--brand-ring)]
`;

export default function CreateTypographyPanel({ object, onUpdate }: Props) {
  return (
    <div className="border-t border-[var(--border)] pt-5">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Typography
        </label>

        <span className="font-mono text-[9px] text-[var(--text-muted)]">
          TEXT
        </span>
      </div>

      <textarea
        value={object.text ?? ""}
        onChange={(event) =>
          onUpdate(object.id, {
            text: event.target.value,
          })
        }
        rows={3}
        placeholder="Type something..."
        className="
          w-full resize-none rounded-lg
          border border-[var(--border)]
          bg-[var(--background)]
          px-3 py-2.5
          text-xs leading-5
          text-[var(--text)]
          outline-none
          transition-colors
          placeholder:text-[var(--text-muted)]
          focus:border-[var(--brand)]
          focus:ring-2
          focus:ring-[var(--brand-ring)]
        "
      />

      <div className="mt-3">
        <label className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
          Font
        </label>

        <select
          value={object.fontFamily ?? "Inter"}
          onChange={(event) =>
            onUpdate(object.id, {
              fontFamily: event.target.value,
            })
          }
          className={INPUT_CLASS}
        >
          {FONT_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <div
          className="
            mt-2 truncate rounded-lg
            border border-[var(--border)]
            bg-[var(--surface-muted)]
            px-3 py-2
            text-sm text-[var(--text)]
          "
          style={{
            fontFamily: object.fontFamily ?? "Inter",
          }}
        >
          {object.text || "Aa Typography Preview"}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Size
          </span>

          <div className="relative">
            <input
              type="number"
              min={4}
              max={300}
              value={object.fontSize ?? 36}
              onChange={(event) =>
                onUpdate(object.id, {
                  fontSize: Math.min(
                    300,
                    Math.max(4, Number(event.target.value)),
                  ),
                })
              }
              className={`${INPUT_CLASS} pr-8 font-mono`}
            />

            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-muted)]">
              px
            </span>
          </div>
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Weight
          </span>

          <select
            value={object.fontWeight ?? 700}
            onChange={(event) =>
              onUpdate(object.id, {
                fontWeight: Number(event.target.value),
              })
            }
            className={`${INPUT_CLASS} text-[10px]`}
          >
            <option value={300}>Light</option>
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semibold</option>
            <option value={700}>Bold</option>
            <option value={800}>Extra Bold</option>
            <option value={900}>Black</option>
          </select>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Tracking
          </span>

          <input
            type="number"
            step="0.5"
            value={object.letterSpacing ?? 0}
            onChange={(event) =>
              onUpdate(object.id, {
                letterSpacing: Number(event.target.value),
              })
            }
            className={`${INPUT_CLASS} font-mono`}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-[10px] text-[var(--text-muted)]">
            Align
          </span>

          <select
            value={object.textAlign ?? "center"}
            onChange={(event) =>
              onUpdate(object.id, {
                textAlign: event.target.value as "left" | "center" | "right",
              })
            }
            className={`${INPUT_CLASS} text-[10px]`}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
      </div>

      <div className="mt-4">
        <span className="mb-2 block text-[10px] text-[var(--text-muted)]">
          Quick size
        </span>

        <div className="flex flex-wrap gap-1.5">
          {[12, 16, 20, 24, 32, 48, 64, 96].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                onUpdate(object.id, {
                  fontSize: size,
                })
              }
              className={`
                rounded-md border px-2 py-1.5
                font-mono text-[9px]
                transition-colors
                ${
                  object.fontSize === size
                    ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}