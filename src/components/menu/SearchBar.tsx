import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { MenuItem } from "../../types";
import { AnimatePresence, motion } from "framer-motion";
import { formatIQD } from "../../lib/utils";

export function SearchBar({
  items,
  lang,
  onSelect,
}: {
  items: MenuItem[];
  lang: "ar" | "en";
  onSelect: (item: MenuItem) => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return items
      .filter(
        (i) =>
          i.nameAr.toLowerCase().includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          i.ingredients.some((ing) => ing.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, items]);

  return (
    <div className="relative mx-auto w-full max-w-lg px-5">
      <div className="relative">
        <Search
          size={17}
          className="absolute top-1/2 -translate-y-1/2 start-4 text-cream-dim pointer-events-none"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={lang === "ar" ? "ابحث عن طبق..." : "Search a dish..."}
          className="w-full rounded-full border border-base-line bg-base-elevated py-3 ps-11 pe-10 text-sm text-cream placeholder:text-cream-dim outline-none focus:border-gold/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute top-1/2 -translate-y-1/2 end-3 text-cream-dim hover:text-cream"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-base-line bg-base-soft shadow-2xl"
          >
            {suggestions.map((item) => (
              <button
                key={item.id}
                onMouseDown={() => {
                  onSelect(item);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-start hover:bg-white/5 transition-colors"
              >
                <img
                  src={item.imageUrl}
                  className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                  alt=""
                />
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-medium text-cream font-arBody">
                    {lang === "ar" ? item.nameAr : item.nameEn}
                  </span>
                </span>
                <span className="text-xs text-gold-soft flex-shrink-0">
                  {formatIQD(item.price)}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
