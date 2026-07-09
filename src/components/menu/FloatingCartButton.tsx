import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../store/cart";

export function FloatingCartButton({ lang }: { lang: "ar" | "en" }) {
  const { toggle, count } = useCart();
  const total = count();

  return (
    <AnimatePresence>
      {total > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="fixed bottom-6 end-6 z-50 flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 shadow-gold shadow-2xl"
        >
          <ShoppingBag size={19} className="text-base" />
          <span className="font-arBody text-sm font-bold text-base">
            {lang === "ar" ? "اطلب الآن" : "View Order"}
          </span>
          <motion.span
            key={total}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-base px-1 text-[11px] font-bold text-gold"
          >
            {total}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
