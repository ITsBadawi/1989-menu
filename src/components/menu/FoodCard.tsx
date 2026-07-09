import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import type { MenuItem } from "../../types";
import { formatIQD } from "../../lib/utils";
import { StarRating } from "./StarRating";
import { useCart } from "../../store/cart";
import { useState } from "react";

export function FoodCard({
  item,
  lang,
  index,
}: {
  item: MenuItem;
  lang: "ar" | "en";
  index: number;
}) {
  const addItem = useCart((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(item.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-base-line bg-base-elevated"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.imageUrl}
          alt={lang === "ar" ? item.nameAr : item.nameEn}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-elevated via-transparent to-transparent" />

        {item.isFeatured && (
          <span className="absolute top-3 start-3 flex items-center gap-1 rounded-full bg-gold/95 px-2.5 py-1 text-[11px] font-bold text-base shadow-gold">
            <Sparkles size={12} />
            {lang === "ar" ? "توصية الشيف" : "Chef's Pick"}
          </span>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
            <span className="rounded-full border border-cream/30 px-4 py-1.5 text-xs font-medium text-cream">
              {lang === "ar" ? "غير متوفر حالياً" : "Currently unavailable"}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-arDisplay text-lg font-bold text-cream leading-snug">
            {lang === "ar" ? item.nameAr : item.nameEn}
          </h3>
          <span className="shrink-0 font-display text-sm font-semibold text-gold-soft">
            {formatIQD(item.price)}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 font-arBody text-sm text-cream-muted">
          {lang === "ar" ? item.descriptionAr : item.descriptionEn}
        </p>

        {item.rating !== undefined && (
          <div className="mt-2.5">
            <StarRating rating={item.rating} count={item.ratingCount} />
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={!item.isAvailable}
          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-gold py-2.5 text-sm font-bold text-base transition-all duration-200 hover:bg-gold-bright active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <motion.span
            animate={justAdded ? { rotate: [0, 90, 0], scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="flex"
          >
            <Plus size={16} />
          </motion.span>
          {justAdded
            ? lang === "ar"
              ? "أُضيف ✓"
              : "Added ✓"
            : lang === "ar"
            ? "أضف للطلب"
            : "Add to order"}
        </button>
      </div>
    </motion.article>
  );
}
