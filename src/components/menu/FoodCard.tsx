import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "../../types";
import { formatIQD } from "../../lib/utils";
import { useCart } from "../../store/cart";

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

  const entryNo = String(index + 1).padStart(3, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-lg border border-base-line bg-base-elevated"
    >
      {/* رقم القيد - يظهر متل ختم */}
      <motion.span
        initial={{ opacity: 0, scale: 1.6, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + index * 0.03, duration: 0.4, ease: "backOut" }}
        className="absolute top-3 start-3 z-10 rounded-full border border-gold/40 bg-base/70 px-2 py-0.5 font-stamp text-[10px] tracking-widest text-gold-bright backdrop-blur"
      >
        {entryNo}
      </motion.span>

      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={lang === "ar" ? item.nameAr : item.nameEn}
          loading="lazy"
          className="h-full w-full object-cover saturate-[0.25] sepia-[0.35] contrast-[1.05] brightness-90
            transition-all duration-700 ease-out
            group-hover:saturate-100 group-hover:sepia-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-elevated via-transparent to-transparent" />

        <span className="absolute bottom-3 end-3 rounded border border-gold/30 bg-base/85 px-2.5 py-1 font-stamp text-xs tracking-wide text-gold-bright backdrop-blur">
          {formatIQD(item.price)}
        </span>

        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-[1px]">
            <span className="rotate-[-6deg] rounded border border-rust/50 px-3 py-1 font-stamp text-[11px] tracking-widest text-rust">
              {lang === "ar" ? "مسحوب من السجل" : "OUT OF STOCK"}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-arDisplay text-lg font-bold text-cream leading-snug">
          {lang === "ar" ? item.nameAr : item.nameEn}
        </h3>

        <div className="brass-rule my-2 w-8" />

        <p className="line-clamp-2 font-arBody text-sm text-cream-muted">
          {lang === "ar" ? item.descriptionAr : item.descriptionEn}
        </p>

        <button
          onClick={handleAdd}
          disabled={!item.isAvailable}
          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-full border border-gold/50 py-2.5 text-sm font-bold text-gold-bright transition-all duration-200 hover:bg-gold hover:text-base active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <motion.span
            animate={justAdded ? { rotate: [0, 90, 0], scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Plus size={16} />
          </motion.span>
          {justAdded ? (lang === "ar" ? "أُضيف ✓" : "Added ✓") : lang === "ar" ? "أضف للطلب" : "Add to order"}
        </button>
      </div>
    </motion.article>
  );
}
