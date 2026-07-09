import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";

function cropToAspect(file: File, aspect: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let sw = img.width;
        let sh = img.height;
        let sx = 0;
        let sy = 0;
        const currentAspect = sw / sh;
        if (currentAspect > aspect) {
          sw = sh * aspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = sw / aspect;
          sy = (img.height - sh) / 2;
        }
        const canvas = document.createElement("canvas");
        const targetW = 900;
        canvas.width = targetW;
        canvas.height = targetW / aspect;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("no ctx");
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({
  value,
  onChange,
  aspect = 16 / 9,
  circular = false,
  label,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  aspect?: number;
  circular?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const cropped = await cropToAspect(file, aspect);
      onChange(cropped);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {label && <p className="mb-1.5 text-xs font-medium text-cream-muted">{label}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative cursor-pointer overflow-hidden border border-dashed border-base-line bg-base-elevated transition-colors hover:border-gold/50",
          circular ? "h-28 w-28 rounded-full" : "aspect-video w-full rounded-xl"
        )}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-cream-dim">
            <ImagePlus size={22} />
            <span className="text-[11px]">اختر صورة</span>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 size={20} className="animate-spin text-gold" />
          </div>
        )}
        {value && !loading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-1.5 end-1.5 rounded-full bg-black/70 p-1 text-cream opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X size={13} />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      <p className="mt-1 text-[10px] text-cream-dim">
        {circular ? "سيتم قص الصورة دائرياً تلقائياً" : "سيتم قص الصورة بنسبة 16:9 تلقائياً"}
      </p>
    </div>
  );
}
