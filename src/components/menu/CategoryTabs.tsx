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
    <div
      className={cn(
        "z-40 border-b border-base-line bg-base/90 backdrop-blur-md transition-shadow",
        sticky && "sticky top-0 shadow-lg shadow-black/30"
      )}
    >
      <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto no-scrollbar px-5 py-3">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2 text-sm font-arBody font-medium transition-colors",
                isActive ? "text-base" : "text-cream-muted hover:text-cream"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  transition={{ type: "spring", damping: 24, stiffness: 300 }}
                />
              )}
              <span className="relative">
                {lang === "ar" ? cat.nameAr : cat.nameEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
