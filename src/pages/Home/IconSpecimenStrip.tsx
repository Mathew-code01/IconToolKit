// src/pages/Home/IconSpecimenStrip.tsx

const SPECIMEN_SIZES = [16, 24, 32, 48, 64, 96, 128, 192, 256, 512] as const;

/*
 * Visual sizes are compressed rather than drawn to true scale —
 * a literal 512px box would break the layout. This is a spec sheet,
 * not a ruler: the label carries the truth, the box carries the read.
 */
const VISUAL_PX: Record<number, number> = {
  16: 16,
  24: 20,
  32: 25,
  48: 31,
  64: 37,
  96: 43,
  128: 49,
  192: 55,
  256: 61,
  512: 70,
};

interface IconSpecimenStripProps {
  className?: string;
}

export default function IconSpecimenStrip({
  className = "",
}: IconSpecimenStripProps) {
  return (
    <div
      className={`
        flex
        items-end
        divide-x
        divide-[var(--border)]
        overflow-x-auto
        ${className}
      `}
    >
      {SPECIMEN_SIZES.map((size) => {
        const box = VISUAL_PX[size];

        return (
          <div
            key={size}
            className="
              flex
              shrink-0
              flex-col
              items-center
              gap-3
              px-4
              first:pl-0
              last:pr-0
            "
          >
            <div className="flex h-[70px] w-full items-end justify-center">
              <div
                className="
                  flex
                  items-center
                  justify-center
                  rounded-[5px]
                  bg-[#6366F1]
                "
                style={{ width: box, height: box }}
              >
                <span
                  className="font-semibold text-white"
                  style={{ fontSize: Math.max(box * 0.4, 7) }}
                >
                  I
                </span>
              </div>
            </div>

            <span
              className="
                font-mono
                text-[10px]
                tracking-tight
                text-[var(--text-muted)]
              "
            >
              {size}×{size}
            </span>
          </div>
        );
      })}
    </div>
  );
}
