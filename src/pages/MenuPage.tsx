import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { db } from "../lib/db";
import { Hero } from "../components/menu/Hero";
import { SearchBar } from "../components/menu/SearchBar";
import { CategoryTabs } from "../components/menu/CategoryTabs";
import { FoodCard } from "../components/menu/FoodCard";
import { CartDrawer } from "../components/menu/CartDrawer";
import { FloatingCartButton } from "../components/menu/FloatingCartButton";
import { MenuFooter } from "../components/menu/MenuFooter";
import { useUI } from "../store/ui";
import { Languages, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function MenuPage() {
  const { lang, toggleLang } = useUI();
  const allCategories = useLiveQuery(() => db.categories.orderBy("sortOrder").toArray(), []);
  const visibleCategories = useMemo(
    () => (allCategories || []).filter((c) => c.isVisible),
    [allCategories]
  );
  const items = useLiveQuery(() => db.items.orderBy("sortOrder").toArray(), []);
  const restaurant = useLiveQuery(() => db.restaurant.get("main"), []);

  const [active, setActive] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrollingProgrammatically = useRef(false);

  useEffect(() => {
    if (!active && visibleCategories.length > 0) {
      setActive(visibleCategories[0].id);
    }
  }, [visibleCategories, active]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const handleTabChange = (id: string) => {
    setActive(id);
    isScrollingProgrammatically.current = true;
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => (isScrollingProgrammatically.current = false), 700);
  };

  useEffect(() => {
    const handler = () => {
      if (isScrollingProgrammatically.current) return;
      let closest: { id: string; dist: number } | null = null;
      for (const cat of visibleCategories) {
        const el = sectionRefs.current[cat.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - 140);
        if (!closest || dist < closest.dist) closest = { id: cat.id, dist };
      }
      if (closest) setActive(closest.id);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [visibleCategories]);

  const handleSelectSearch = (item: { categoryId: string; id: string }) => {
    handleTabChange(item.categoryId);
    setTimeout(() => {
      document
        .getElementById(`item-${item.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);
  };

  if (!items || !allCategories) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <div className="fixed top-4 z-50 flex items-center gap-2 end-4">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 rounded-full border border-base-line bg-base-soft/90 backdrop-blur px-3 py-2 text-xs font-medium text-cream-muted hover:text-gold hover:border-gold/40 transition-colors"
        >
          <Languages size={14} />
          {lang === "ar" ? "EN" : "AR"}
        </button>
        <Link
          to="/admin"
          className="flex items-center gap-1.5 rounded-full border border-base-line bg-base-soft/90 backdrop-blur px-3 py-2 text-xs font-medium text-cream-muted hover:text-gold hover:border-gold/40 transition-colors"
        >
          <ShieldCheck size={14} />
        </Link>
      </div>

      <Hero restaurant={restaurant} lang={lang} />

      <div className="sticky top-0 z-40 space-y-3 bg-base/95 backdrop-blur-md pb-3 pt-3">
        <SearchBar items={items} lang={lang} onSelect={handleSelectSearch} />
        <CategoryTabs
          categories={visibleCategories}
          active={active}
          onChange={handleTabChange}
          lang={lang}
          sticky={false}
        />
      </div>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <AnimatePresence>
          {visibleCategories.map((cat) => {
            const catItems = items.filter((i) => i.categoryId === cat.id);
            if (catItems.length === 0) return null;
            return (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                ref={(el) => {
                  sectionRefs.current[cat.id] = el;
                }}
                className="mb-12 scroll-mt-32"
              >
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="font-arDisplay text-2xl font-bold text-cream">
                    {lang === "ar" ? cat.nameAr : cat.nameEn}
                  </h2>
                  <div className="motif-divider flex-1" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {catItems.map((item, idx) => (
                    <div key={item.id} id={`item-${item.id}`}>
                      <FoodCard item={item} lang={lang} index={idx} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </AnimatePresence>

        {visibleCategories.length === 0 && (
          <div className="py-24 text-center text-cream-dim font-arBody">
            {lang === "ar" ? "لا توجد أصناف متاحة حالياً" : "No categories available right now"}
          </div>
        )}
      </main>

      <MenuFooter restaurant={restaurant} lang={lang} />

      <CartDrawer items={items} lang={lang} />
      <FloatingCartButton lang={lang} />
    </div>
  );
}
