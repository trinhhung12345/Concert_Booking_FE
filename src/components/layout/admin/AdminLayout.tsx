import { useEffect, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useThemeStore } from "@/store/useThemeStore";

export default function AdminLayout() {
  const { theme } = useThemeStore();

  // Áp dụng theme class ngay khi mount (trước khi paint)
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Cleanup: Gỡ class dark khi rời khỏi Admin
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
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
