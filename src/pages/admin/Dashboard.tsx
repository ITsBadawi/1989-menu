import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../lib/db";
import { motion } from "framer-motion";
import { UtensilsCrossed, FolderKanban, Eye, TrendingUp, Star } from "lucide-react";
import { formatIQD } from "../../lib/utils";

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-base-line bg-base-elevated p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-arBody text-cream-muted">{label}</span>
        <div className={`rounded-lg p-2 ${accent ? "bg-gold/15 text-gold" : "bg-white/5 text-cream-muted"}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-cream">{value}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const items = useLiveQuery(() => db.items.toArray(), []) || [];
  const categories = useLiveQuery(() => db.categories.toArray(), []) || [];
  const views = useLiveQuery(() => db.views.toArray(), []) || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayViews = views.filter((v) => v.timestamp >= today.getTime()).length;

  const topItems = [...items].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-arDisplay text-2xl font-bold text-cream">لوحة التحكم</h1>
        <p className="mt-1 font-arBody text-sm text-cream-muted">نظرة عامة على أداء المطعم</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={UtensilsCrossed} label="إجمالي الأطباق" value={items.length} delay={0} accent />
        <StatCard icon={FolderKanban} label="إجمالي الأصناف" value={categories.length} delay={0.05} />
        <StatCard icon={Eye} label="مشاهدات اليوم" value={todayViews} delay={0.1} />
        <StatCard
          icon={Star}
          label="الأطباق المميزة"
          value={items.filter((i) => i.isFeatured).length}
          delay={0.15}
        />
      </div>

      <div className="rounded-2xl border border-base-line bg-base-elevated p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={17} className="text-gold" />
          <h2 className="font-arDisplay font-bold text-cream">الأكثر مشاهدة</h2>
        </div>
        <div className="space-y-3">
          {topItems.map((item, i) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className="w-5 text-center font-display text-sm text-cream-dim">{i + 1}</span>
              <img src={item.imageUrl} className="h-10 w-10 rounded-lg object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-arBody text-sm font-medium text-cream">{item.nameAr}</p>
                <p className="text-xs text-cream-dim">{formatIQD(item.price)}</p>
              </div>
              <span className="text-xs text-gold-soft">{item.viewCount || 0} مشاهدة</span>
            </div>
          ))}
          {topItems.length === 0 && (
            <p className="text-center text-sm text-cream-dim py-6">لا توجد بيانات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}
