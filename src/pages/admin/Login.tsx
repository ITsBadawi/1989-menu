import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Field";
import { Lock, User, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/admin/dashboard");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-5">
      <div className="absolute inset-0 bg-tea-gradient" />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-base-line bg-base-soft p-8 shadow-2xl"
      >
        <div className="mb-7 text-center">
          <h1 className="font-display text-4xl font-semibold text-gold">1989</h1>
          <p className="mt-2 font-arBody text-sm text-cream-muted">
            لوحة تحكم المطعم
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>اسم المستخدم</Label>
            <div className="relative">
              <User size={15} className="absolute top-1/2 -translate-y-1/2 start-3.5 text-cream-dim" />
              <Input
                className="ps-9"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoFocus
              />
            </div>
          </div>
          <div>
            <Label>كلمة المرور</Label>
            <div className="relative">
              <Lock size={15} className="absolute top-1/2 -translate-y-1/2 start-3.5 text-cream-dim" />
              <Input
                className="ps-9"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rust/10 px-3 py-2 text-xs text-rust">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            تسجيل الدخول
          </Button>

          <p className="text-center text-[11px] text-cream-dim">
            تجريبي: admin / 1989admin
          </p>
        </div>
      </motion.form>
    </div>
  );
}
