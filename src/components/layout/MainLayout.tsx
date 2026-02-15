import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import CategoryNav from "./CategoryNav"; // Import mới
import Footer from "./Footer";
import { useThemeStore } from "@/store/useThemeStore";

const MainLayout = () => {
  const { theme } = useThemeStore();

  // Sync theme với document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-foreground">

      {/* Khối Header Wrapper */}
      {/* Nếu muốn cả thanh category cũng dính thì bọc sticky cả 2 component này */}
      <div className="sticky top-0 z-50 shadow-sm">
        <Header />
        <CategoryNav />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default MainLayout;
