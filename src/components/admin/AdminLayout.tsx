import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import {
  LayoutDashboard,
  FolderKanban,
  UtensilsCrossed,
  Settings,
  Palette,
  QrCode,
  LogOut,
  Menu as MenuIcon,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/admin/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/admin/categories", label: "الأصناف", icon: FolderKanban },
  { to: "/admin/items", label: "الأطباق", icon: UtensilsCrossed },
  { to: "/admin/settings", label: "إعدادات المطعم", icon: Settings },
  { to: "/admin/theme", label: "المظهر", icon: Palette },
  { to: "/admin/qr", label: "رمز QR", icon: QrCode },
];

export function ProtectedRoute() {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuth((s) => s.logout);
  const username = useAuth((s) => s.username);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center justify-between px-2">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gold">1989</h1>
          <p className="text-[11px] text-cream-dim">لوحة التحكم</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-arBody font-medium transition-colors",
                active
                  ? "bg-gold/15 text-gold"
                  : "text-cream-muted hover:bg-white/5 hover:text-cream"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-base-line pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-cream-muted hover:bg-white/5 hover:text-cream transition-colors"
        >
          <ExternalLink size={17} />
          عرض المنيو
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-rust hover:bg-rust/10 transition-colors"
        >
          <LogOut size={17} />
          تسجيل الخروج ({username})
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-base" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-e border-base-line bg-base-soft p-5 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-base-line bg-base-soft/95 backdrop-blur px-4 py-3 lg:hidden">
        <span className="font-display text-xl font-semibold text-gold">1989</span>
        <button onClick={() => setMobileOpen(true)} className="text-cream">
          <MenuIcon size={22} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 lg:hidden"
            />
            <motion.aside
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: "spring", damping: 28 }}
              className="fixed inset-y-0 end-0 z-50 flex w-72 flex-col border-s border-base-line bg-base-soft p-5 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0">
        <div className="mx-auto max-w-6xl p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
