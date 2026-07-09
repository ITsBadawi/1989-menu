import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuPage from "./pages/MenuPage";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Items from "./pages/admin/Items";
import RestaurantSettings from "./pages/admin/RestaurantSettings";
import ThemeSettings from "./pages/admin/ThemeSettings";
import QRGenerator from "./pages/admin/QRGenerator";
import { AdminLayout, ProtectedRoute } from "./components/admin/AdminLayout";
import { seedIfEmpty } from "./lib/seed";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/items" element={<Items />} />
            <Route path="/admin/settings" element={<RestaurantSettings />} />
            <Route path="/admin/theme" element={<ThemeSettings />} />
            <Route path="/admin/qr" element={<QRGenerator />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
