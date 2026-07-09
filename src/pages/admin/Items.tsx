import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../lib/db";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Sparkles, CheckSquare, Square } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";
import { ItemFormModal } from "../../components/admin/ItemFormModal";
import { Modal } from "../../components/ui/Modal";
import { formatIQD } from "../../lib/utils";
import type { MenuItem } from "../../types";
import { motion } from "framer-motion";

export default function Items() {
  const items = useLiveQuery(() => db.items.orderBy("sortOrder").toArray(), []) || [];
  const categories = useLiveQuery(() => db.categories.orderBy("sortOrder").toArray(), []) || [];

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  const [bulkCategoryId, setBulkCategoryId] = useState("");

  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query.trim() ||
        item.nameAr.includes(query) ||
        item.nameEn.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.categoryId === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [items, query, categoryFilter]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setModalOpen(true);
  };

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await db.items.delete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleBulkDelete = async () => {
    await db.items.bulkDelete(Array.from(selected));
    setSelected(new Set());
    setBulkDeleteOpen(false);
  };

  const handleBulkCategory = async () => {
    if (!bulkCategoryId) return;
    await Promise.all(
      Array.from(selected).map((id) => db.items.update(id, { categoryId: bulkCategoryId }))
    );
    setSelected(new Set());
    setBulkCategoryOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-arDisplay text-2xl font-bold text-cream">الأطباق</h1>
          <p className="mt-1 font-arBody text-sm text-cream-muted">{items.length} طبق إجمالاً</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          طبق جديد
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3.5 text-cream-dim" />
          <Input className="ps-9" placeholder="ابحث عن طبق..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl bg-base-elevated border border-base-line px-4 py-2.5 text-sm text-cream outline-none focus:border-gold/60"
        >
          <option value="all">كل الأصناف</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr}
            </option>
          ))}
        </select>
      </div>

      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3"
        >
          <span className="text-sm text-gold-soft">{selected.size} محدد</span>
          <Button size="sm" variant="outline" onClick={() => setBulkCategoryOpen(true)}>
            نقل إلى صنف
          </Button>
          <Button size="sm" variant="danger" onClick={() => setBulkDeleteOpen(true)}>
            حذف المحدد
          </Button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-cream-dim hover:text-cream">
            إلغاء التحديد
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl border bg-base-elevated transition-colors ${
                isSelected ? "border-gold" : "border-base-line"
              }`}
            >
              <button
                onClick={() => toggleSelect(item.id)}
                className="absolute top-2.5 start-2.5 z-10 rounded-md bg-black/60 p-1 text-cream backdrop-blur"
              >
                {isSelected ? <CheckSquare size={16} className="text-gold" /> : <Square size={16} />}
              </button>
              {item.isFeatured && (
                <span className="absolute top-2.5 end-2.5 z-10 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-base">
                  <Sparkles size={10} /> مميز
                </span>
              )}
              <div className="aspect-video overflow-hidden">
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-3.5">
                <p className="truncate font-arDisplay font-bold text-cream">{item.nameAr}</p>
                <p className="truncate text-xs text-cream-dim">{catMap.get(item.categoryId)?.nameAr}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-gold-soft">{formatIQD(item.price)}</span>
                  <span className={`text-[10px] ${item.isAvailable ? "text-green-400" : "text-rust"}`}>
                    {item.isAvailable ? "متوفر" : "غير متوفر"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-xs text-cream-muted hover:bg-gold/15 hover:text-gold transition-colors"
                  >
                    <Pencil size={13} /> تعديل
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-1.5 text-xs text-cream-muted hover:bg-rust/15 hover:text-rust transition-colors"
                  >
                    <Trash2 size={13} /> حذف
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-base-line py-16 text-center text-cream-dim">
          لا توجد أطباق مطابقة
        </div>
      )}

      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        editing={editing}
        maxSortOrder={items.length}
      />

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="تأكيد الحذف" size="sm">
        <p className="text-sm text-cream-muted font-arBody mb-5">
          سيتم حذف "{deleteTarget?.nameAr}" نهائياً.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteTarget(null)}>إلغاء</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>حذف</Button>
        </div>
      </Modal>

      <Modal open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} title="حذف عناصر متعددة" size="sm">
        <p className="text-sm text-cream-muted font-arBody mb-5">سيتم حذف {selected.size} طبق نهائياً.</p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setBulkDeleteOpen(false)}>إلغاء</Button>
          <Button variant="danger" className="flex-1" onClick={handleBulkDelete}>حذف الكل</Button>
        </div>
      </Modal>

      <Modal open={bulkCategoryOpen} onClose={() => setBulkCategoryOpen(false)} title="نقل إلى صنف آخر" size="sm">
        <select
          value={bulkCategoryId}
          onChange={(e) => setBulkCategoryId(e.target.value)}
          className="w-full rounded-xl bg-base-elevated border border-base-line px-4 py-2.5 text-sm text-cream outline-none focus:border-gold/60 mb-5"
        >
          <option value="">اختر صنف</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nameAr}</option>
          ))}
        </select>
        <Button className="w-full" onClick={handleBulkCategory}>نقل</Button>
      </Modal>
    </div>
  );
}
