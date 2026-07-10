import { motion } from "framer-motion";
import type { Category } from "../../types";
import { cn } from "../../lib/utils";

export function CategoryTabs({
  categories,
  active,
  onChange,
  lang,
  sticky,
}: {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
  lang: "ar" | "en";
  sticky?: boolean;
}) {
  return (
    <nav
      className={cn(
        "z-40 flex gap-1 overflow-x-auto border-b border-base-line bg-base/90 px-4 py-3 backdrop-blur",
        sticky && "sticky top-0"
      )}
    >
      {categories.map((c) => {
        const isActive = c.id === active;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="relative shrink-0 px-4 py-2 font-arBody text-sm transition-colors"
          >
            <span className={isActive ? "text-gold-bright" : "text-cream-dim"}>
              {lang === "ar" ? c.nameAr : c.nameEn}
            </span>
            {isActive && (
              <motion.div
                layoutId="tab-underline"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-gold"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
