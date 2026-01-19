import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useThemeStore } from "@/store/useThemeStore";

export default function AdminLayout() {
  const { theme } = useThemeStore();

  // Áp dụng theme class lên document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar cố định bên trái */}
      <AdminSidebar />

      {/* Nội dung chính bên phải */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Quản lý sự kiện" />

        <main className="flex-1 p-6 overflow-y-auto">
           {/* Outlet là nơi các trang con (AdminEventManager...) hiển thị */}
           <Outlet />
        </main>
      </div>
    </div>
  );
}
