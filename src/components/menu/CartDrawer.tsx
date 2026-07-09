import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, PhoneCall } from "lucide-react";
import { useCart } from "../../store/cart";
import type { MenuItem } from "../../types";
import { formatIQD } from "../../lib/utils";
import { useMemo, useState } from "react";
import { Button } from "../ui/Button";

export function CartDrawer({
  items,
  lang,
}: {
  items: MenuItem[];
  lang: "ar" | "en";
}) {
  const { isOpen, close, lines, addItem, decrement, removeItem, clear } = useCart();
  const [waiterCalled, setWaiterCalled] = useState(false);

  const itemsMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const total = lines.reduce((sum, l) => {
    const item = itemsMap.get(l.itemId);
    return sum + (item ? item.price * l.qty : 0);
  }, 0);

  const callWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: lang === "ar" ? -420 : 420 }}
            animate={{ x: 0 }}
            exit={{ x: lang === "ar" ? -420 : 420 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 bottom-0 z-[95] flex w-full max-w-md flex-col border-base-line bg-base-soft shadow-2xl
              end-0 border-s"
          >
            <div className="flex items-center justify-between border-b border-base-line px-5 py-4">
              <h2 className="flex items-center gap-2 font-arDisplay text-lg font-bold text-cream">
                <ShoppingBag size={19} className="text-gold" />
                {lang === "ar" ? "طلبك" : "Your Order"}
              </h2>
              <button
                onClick={close}
                className="rounded-full p-1.5 text-cream-muted hover:bg-white/5 hover:text-cream"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-cream-dim">
                  <ShoppingBag size={40} className="mb-3 opacity-40" />
                  <p className="font-arBody text-sm">
                    {lang === "ar" ? "السلة فارغة حالياً" : "Your cart is empty"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {lines.map((line) => {
                    const item = itemsMap.get(line.itemId);
                    if (!item) return null;
                    return (
                      <motion.li
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        key={line.itemId}
                        className="flex gap-3 rounded-xl border border-base-line bg-base-elevated p-2.5"
                      >
                        <img
                          src={item.imageUrl}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          alt=""
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate font-arBody text-sm font-semibold text-cream">
                              {lang === "ar" ? item.nameAr : item.nameEn}
                            </p>
                            <button
                              onClick={() => removeItem(line.itemId)}
                              className="shrink-0 text-cream-dim hover:text-rust"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-gold-soft">
                            {formatIQD(item.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2.5">
                            <button
                              onClick={() => decrement(line.itemId)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-base-line text-cream hover:bg-gold hover:text-base transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-sm text-cream">
                              {line.qty}
                            </span>
                            <button
                              onClick={() => addItem(line.itemId)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-base-line text-cream hover:bg-gold hover:text-base transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-base-line px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-arBody text-sm text-cream-muted">
                    {lang === "ar" ? "الإجمالي" : "Total"}
                  </span>
                  <span className="font-display text-xl font-bold text-gold">
                    {formatIQD(total)}
                  </span>
                </div>
                <Button className="w-full" size="lg" onClick={callWaiter}>
                  <PhoneCall size={16} />
                  {waiterCalled
                    ? lang === "ar"
                      ? "تم استدعاء النادل ✓"
                      : "Waiter is on the way ✓"
                    : lang === "ar"
                    ? "نادِ النادل لتأكيد الطلب"
                    : "Call waiter to confirm"}
                </Button>
                <button
                  onClick={clear}
                  className="w-full text-center text-xs text-cream-dim hover:text-rust transition-colors"
                >
                  {lang === "ar" ? "إفراغ السلة" : "Clear cart"}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
