import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../lib/db";
import { useEffect, useRef, useState } from "react";
import { Input, Label, Textarea, Switch } from "../../components/ui/Field";
import { ImageUpload } from "../../components/ui/ImageUpload";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2, Download, Upload, Check } from "lucide-react";
import type { Restaurant } from "../../types";

export default function RestaurantSettings() {
  const restaurant = useLiveQuery(() => db.restaurant.get("main"), []);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  const { register, control, handleSubmit, reset } = useForm<Restaurant>({
    defaultValues: restaurant,
  });

  useEffect(() => {
    if (restaurant) reset(restaurant);
  }, [restaurant, reset]);

  const phonesArray = useFieldArray({ control, name: "phones" });
  const socialsArray = useFieldArray({ control, name: "socials" });
  const hoursArray = useFieldArray({ control, name: "hours" });

  const onSubmit = async (values: Restaurant) => {
    await db.restaurant.put({ ...values, id: "main" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    const [categories, items, restaurantData] = await Promise.all([
      db.categories.toArray(),
      db.items.toArray(),
      db.restaurant.toArray(),
    ]);
    const backup = { categories, items, restaurant: restaurantData, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `1989-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.categories) {
      await db.categories.clear();
      await db.categories.bulkAdd(data.categories);
    }
    if (data.items) {
      await db.items.clear();
      await db.items.bulkAdd(data.items);
    }
    if (data.restaurant?.[0]) {
      await db.restaurant.put(data.restaurant[0]);
    }
    alert("تم استيراد النسخة الاحتياطية بنجاح");
  };

  if (!restaurant) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-arDisplay text-2xl font-bold text-cream">إعدادات المطعم</h1>
        <p className="mt-1 font-arBody text-sm text-cream-muted">بيانات المطعم الأساسية والتواصل</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-4">
          <h2 className="font-arDisplay font-bold text-cream">الهوية</h2>
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <ImageUpload value={field.value} onChange={field.onChange} circular aspect={1} label="الشعار" />
            )}
          />
          <div>
            <Label>اسم المطعم</Label>
            <Input {...register("name")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>نبذة عنا (عربي)</Label>
              <Textarea rows={3} {...register("about")} />
            </div>
            <div>
              <Label>About Us (English)</Label>
              <Textarea rows={3} {...register("aboutEn")} />
            </div>
          </div>
          <div>
            <Label>وصف SEO</Label>
            <Textarea rows={2} {...register("seoDescription")} />
          </div>
        </section>

        <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-4">
          <h2 className="font-arDisplay font-bold text-cream">الموقع والعنوان</h2>
          <div>
            <Label>العنوان الكامل</Label>
            <Input {...register("address")} />
          </div>
          <div>
            <Label>رابط خرائط Google (embed)</Label>
            <Input {...register("mapEmbedUrl")} dir="ltr" />
          </div>
          {restaurant.mapEmbedUrl && (
            <div className="overflow-hidden rounded-xl border border-base-line">
              <iframe src={restaurant.mapEmbedUrl} className="h-56 w-full" loading="lazy" title="map" />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-arDisplay font-bold text-cream">أرقام الهاتف</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => phonesArray.append({ number: "", isWhatsapp: false, label: "" })}
            >
              <Plus size={14} /> إضافة رقم
            </Button>
          </div>
          {phonesArray.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto_auto] items-center">
              <Input placeholder="+964 770 000 0000" dir="ltr" {...register(`phones.${i}.number`)} />
              <Input placeholder="التسمية (رئيسي، توصيل...)" {...register(`phones.${i}.label`)} />
              <Controller
                control={control}
                name={`phones.${i}.isWhatsapp`}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} label="واتساب" />
                )}
              />
              <button type="button" onClick={() => phonesArray.remove(i)} className="text-cream-dim hover:text-rust p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-arDisplay font-bold text-cream">التواصل الاجتماعي</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => socialsArray.append({ platform: "instagram", url: "" })}
            >
              <Plus size={14} /> إضافة
            </Button>
          </div>
          {socialsArray.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
              <select
                {...register(`socials.${i}.platform`)}
                className="rounded-xl bg-base-soft border border-base-line px-3 py-2.5 text-sm text-cream outline-none"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </select>
              <Input placeholder="https://" dir="ltr" {...register(`socials.${i}.url`)} />
              <button type="button" onClick={() => socialsArray.remove(i)} className="text-cream-dim hover:text-rust p-2">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-3">
          <h2 className="font-arDisplay font-bold text-cream">ساعات العمل</h2>
          {hoursArray.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <span className="text-sm text-cream-muted">{field.day}</span>
              <Input type="time" {...register(`hours.${i}.open`)} />
              <Input type="time" {...register(`hours.${i}.close`)} />
              <Controller
                control={control}
                name={`hours.${i}.isClosed`}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} label="مغلق" />
                )}
              />
            </div>
          ))}
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg">
            {saved ? <Check size={16} /> : null}
            {saved ? "تم الحفظ" : "حفظ الإعدادات"}
          </Button>
        </div>
      </form>

      <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-3">
        <h2 className="font-arDisplay font-bold text-cream">النسخ الاحتياطي</h2>
        <p className="text-sm text-cream-muted font-arBody">
          صدّر بياناتك كملف JSON أو استوردها لاستعادة نسخة سابقة
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download size={15} /> تصدير نسخة احتياطية
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload size={15} /> استيراد نسخة احتياطية
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = "";
            }}
          />
        </div>
      </section>
    </div>
  );
}
