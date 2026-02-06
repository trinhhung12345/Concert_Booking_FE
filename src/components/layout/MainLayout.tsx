import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import CategoryNav from "./CategoryNav"; // Import mới
import Footer from "./Footer";

const MainLayout = () => {
  // Đảm bảo trang user luôn dùng light theme
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-900 text-slate-100">

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
