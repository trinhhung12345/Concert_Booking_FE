import { Outlet } from "react-router-dom";
import Header from "./Header";
import CategoryNav from "./CategoryNav"; // Import mới

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">

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
      <footer className="bg-secondary text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© Tien go kys. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
