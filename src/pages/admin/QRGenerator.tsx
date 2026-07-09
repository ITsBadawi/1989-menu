import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Field";
import { Download, QrCode as QrIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function QRGenerator() {
  const [table, setTable] = useState("1");
  const [dataUrl, setDataUrl] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const generate = async () => {
    const url = `${baseUrl}/?table=${encodeURIComponent(table)}`;
    const png = await QRCode.toDataURL(url, {
      width: 640,
      margin: 2,
      color: { dark: "#0a0a0a", light: "#f5efe6" },
    });
    setDataUrl(png);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `1989-table-${table}.png`;
    a.click();
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-arDisplay text-2xl font-bold text-cream">مولّد رمز QR</h1>
        <p className="mt-1 font-arBody text-sm text-cream-muted">
          أنشئ رمز QR لكل طاولة يوجّه الزبائن مباشرة إلى المنيو
        </p>
      </div>

      <section className="rounded-2xl border border-base-line bg-base-elevated p-5 space-y-4">
        <div>
          <Label>رقم الطاولة</Label>
          <Input value={table} onChange={(e) => setTable(e.target.value)} placeholder="1" />
        </div>
        <Button onClick={generate}>
          <QrIcon size={16} /> إنشاء الرمز
        </Button>
      </section>

      {dataUrl && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-base-line bg-base-elevated p-6 text-center space-y-4"
        >
          <img src={dataUrl} alt="QR" className="mx-auto w-56 rounded-xl bg-cream p-3" />
          <p className="text-sm text-cream-muted">طاولة رقم {table}</p>
          <Button variant="outline" onClick={download} className="mx-auto">
            <Download size={15} /> تحميل PNG
          </Button>
        </motion.section>
      )}
    </div>
  );
}
