import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../ui/Modal";
import { Input, Label, FieldError, Textarea, Switch } from "../ui/Field";
import { TagInput } from "../ui/TagInput";
import { ImageUpload } from "../ui/ImageUpload";
import { Button } from "../ui/Button";
import type { Category, MenuItem } from "../../types";
import { db } from "../../lib/db";
import { useEffect } from "react";

const schema = z.object({
  nameAr: z.string().min(2, "مطلوب - حرفين على الأقل"),
  nameEn: z.string().min(2, "Required - min 2 characters"),
  descriptionAr: z.string().min(3, "مطلوب"),
  descriptionEn: z.string().min(3, "Required"),
  ingredients: z.array(z.string()),
  price: z.number().positive("يجب أن يكون السعر أكبر من صفر"),
  categoryId: z.string().min(1, "اختر صنف"),
  imageUrl: z.string().min(1, "الصورة مطلوبة"),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function ItemFormModal({
  open,
  onClose,
  categories,
  editing,
  maxSortOrder,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  editing: MenuItem | null;
  maxSortOrder: number;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: "",
      nameEn: "",
      descriptionAr: "",
      descriptionEn: "",
      ingredients: [],
      price: 0,
      categoryId: categories[0]?.id || "",
      imageUrl: "",
      isAvailable: true,
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              nameAr: editing.nameAr,
              nameEn: editing.nameEn,
              descriptionAr: editing.descriptionAr,
              descriptionEn: editing.descriptionEn,
              ingredients: editing.ingredients,
              price: editing.price,
              categoryId: editing.categoryId,
              imageUrl: editing.imageUrl,
              isAvailable: editing.isAvailable,
              isFeatured: editing.isFeatured,
            }
          : {
              nameAr: "",
              nameEn: "",
              descriptionAr: "",
              descriptionEn: "",
              ingredients: [],
              price: 0,
              categoryId: categories[0]?.id || "",
              imageUrl: "",
              isAvailable: true,
              isFeatured: false,
            }
      );
    }
  }, [open, editing, categories, reset]);

  const onSubmit = async (values: FormValues) => {
    if (editing) {
      await db.items.update(editing.id, values);
    } else {
      await db.items.add({
        id: crypto.randomUUID(),
        ...values,
        sortOrder: maxSortOrder + 1,
        createdAt: Date.now(),
        rating: 0,
        ratingCount: 0,
        viewCount: 0,
      });
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "تعديل الطبق" : "طبق جديد"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} label="صورة الطبق" />
          )}
        />
        <FieldError message={errors.imageUrl?.message} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>الاسم بالعربية</Label>
            <Input {...register("nameAr")} placeholder="بركر 1989 الخاص" />
            <FieldError message={errors.nameAr?.message} />
          </div>
          <div>
            <Label>الاسم بالإنجليزية</Label>
            <Input {...register("nameEn")} placeholder="1989 Signature Burger" />
            <FieldError message={errors.nameEn?.message} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>الوصف بالعربية</Label>
            <Textarea rows={2} {...register("descriptionAr")} />
            <FieldError message={errors.descriptionAr?.message} />
          </div>
          <div>
            <Label>الوصف بالإنجليزية</Label>
            <Textarea rows={2} {...register("descriptionEn")} />
            <FieldError message={errors.descriptionEn?.message} />
          </div>
        </div>

        <div>
          <Label>المكونات</Label>
          <Controller
            control={control}
            name="ingredients"
            render={({ field }) => (
              <TagInput tags={field.value} onChange={field.onChange} placeholder="اكتب مكون واضغط Enter" />
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>السعر (د.ع)</Label>
            <Input type="number" {...register("price", { valueAsNumber: true })} placeholder="5000" />
            <FieldError message={errors.price?.message} />
          </div>
          <div>
            <Label>الصنف</Label>
            <select
              {...register("categoryId")}
              className="w-full rounded-xl bg-base-elevated border border-base-line px-4 py-2.5 text-sm text-cream outline-none focus:border-gold/60"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>
            <FieldError message={errors.categoryId?.message} />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-1">
          <Controller
            control={control}
            name="isAvailable"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} label="متوفر" />
            )}
          />
          <Controller
            control={control}
            name="isFeatured"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} label="طبق مميز" />
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {editing ? "حفظ التعديلات" : "إضافة الطبق"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
