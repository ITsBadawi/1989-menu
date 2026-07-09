import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../lib/db";
import { useState } from "react";
import { Plus, GripVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Label } from "../../components/ui/Field";
import { Reorder } from "framer-motion";
import type { Category } from "../../types";

export default function Categories() {
  const categories = useLiveQuery(() => db.categories.orderBy("sortOrder").toArray(), []) || [];
  const items = useLiveQuery(() => db.items.toArray(), []) || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [localOrder, setLocalOrder] = useState<Category[]>([]);

  const list = localOrder.length === categories.length ? localOrder : categories;

  const openAdd = () => {
    setEditing(null);
    setNameAr("");
    setNameEn("");
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setNameAr(cat.nameAr);
    setNameEn(cat.nameEn);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!nameAr.trim() || !nameEn.trim()) return;
    if (editing) {
      await db.categories.update(editing.id, { nameAr, nameEn });
    } else {
      await db.categories.add({
        id: crypto.randomUUID(),
        nameAr,
        nameEn,
        sortOrder: categories.length,
        isVisible: true,
        createdAt: Date.now(),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await db.categories.delete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const toggleVisibility = async (cat: Category) => {
    await db.categories.update(cat.id, { isVisible: !cat.isVisible });
  };

  const handleReorder = async (newOrder: Category[]) => {
    setLocalOrder(newOrder);
    await Promise.all(
      newOrder.map((cat, idx) => db.categories.update(cat.id, { sortOrder: idx }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-arDisplay text-2xl font-bold text-cream">الأصناف</h1>
          <p className="mt-1 font-arBody text-sm text-cream-muted">
            اسحب لإعادة الترتيب، أو أضف صنف جديد
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} />
          صنف جديد
        </Button>
      </div>

      <Reorder.Group axis="y" values={list} onReorder={handleReorder} className="space-y-3">
        {list.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          return (
            <Reorder.Item
              key={cat.id}
              value={cat}
              className="flex items-center gap-3 rounded-2xl border border-base-line bg-base-elevated p-4"
            >
              <GripVertical size={18} className="cursor-grab text-cream-dim shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-arDisplay font-bold text-cream">{cat.nameAr}</p>
                <p className="text-xs text-cream-dim">{cat.nameEn} · {count} طبق</p>
              </div>
              <button
                onClick={() => toggleVisibility(cat)}
                className={`rounded-lg p-2 transition-colors ${cat.isVisible ? "text-gold" : "text-cream-dim"}`}
                title={cat.isVisible ? "مرئي" : "مخفي"}
              >
                {cat.isVisible ? <Eye size={17} /> : <EyeOff size={17} />}
              </button>
              <button onClick={() => openEdit(cat)} className="rounded-lg p-2 text-cream-muted hover:text-gold">
                <Pencil size={16} />
              </button>
              <button onClick={() => setDeleteTarget(cat)} className="rounded-lg p-2 text-cream-muted hover:text-rust">
                <Trash2 size={16} />
              </button>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-base-line py-16 text-center text-cream-dim">
          لا توجد أصناف بعد
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "تعديل الصنف" : "صنف جديد"} size="sm">
        <div className="space-y-4">
          <div>
            <Label>الاسم بالعربية</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="فطور صباحي" />
          </div>
          <div>
            <Label>الاسم بالإنجليزية</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Breakfast" />
          </div>
          <Button className="w-full" onClick={handleSave}>حفظ</Button>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="تأكيد الحذف" size="sm">
        <p className="text-sm text-cream-muted font-arBody mb-5">
          سيتم حذف صنف "{deleteTarget?.nameAr}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteTarget(null)}>إلغاء</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>حذف</Button>
        </div>
      </Modal>
    </div>
  );
}
