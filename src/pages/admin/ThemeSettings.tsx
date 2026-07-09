import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../lib/db";
import { useState } from "react";
import { Label, Switch } from "../../components/ui/Field";
import { Check } from "lucide-react";

const PRESET_COLORS = ["#c9a227", "#d4a574", "#a8562f", "#4a7c59", "#3f6fb0", "#8b5cf6"];

export default function ThemeSettings() {
  const restaurant = useLiveQuery(() => db.restaurant.get("main"), []);
  const [saved, setSaved] = useState(false);

  if (!restaurant) return null;

  const update = async (patch: Partial<typeof restaurant>) => {
    await db.restaurant.update("main", patch);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-arDisplay text-2xl font-bold text-cream">المظهر</h1>
        <p className="mt-1 font-arBody text-sm text-cream-muted">تخصيص شكل المنيو للزبائن</p>
      </div>

      <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-4">
        <Label>اللون الرئيسي</Label>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => update({ themeColor: color })}
              className="relative h-11 w-11 rounded-full border-2 transition-transform hover:scale-110"
              style={{ backgroundColor: color, borderColor: restaurant.themeColor === color ? "#fff" : "transparent" }}
            >
              {restaurant.themeColor === color && (
                <Check size={16} className="absolute inset-0 m-auto text-white drop-shadow" />
              )}
            </button>
          ))}
          <label className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-dashed border-base-line text-[10px] text-cream-dim">
            مخصص
            <input
              type="color"
              value={restaurant.themeColor}
              onChange={(e) => update({ themeColor: e.target.value })}
              className="sr-only"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-4">
        <Label>الوضع الافتراضي</Label>
        <Switch
          checked={restaurant.defaultDarkMode}
          onChange={(v) => update({ defaultDarkMode: v })}
          label={restaurant.defaultDarkMode ? "الوضع الداكن مفعّل" : "الوضع الفاتح مفعّل"}
        />
      </section>

      <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-4">
        <Label>حجم الخط: {Math.round(restaurant.fontScale * 100)}%</Label>
        <input
          type="range"
          min={0.85}
          max={1.25}
          step={0.05}
          value={restaurant.fontScale}
          onChange={(e) => update({ fontScale: Number(e.target.value) })}
          className="w-full accent-gold"
        />
      </section>

      {saved && (
        <p className="flex items-center gap-1.5 text-sm text-green-400">
          <Check size={14} /> تم تحديث المظهر
        </p>
      )}
    </div>
  );
}
