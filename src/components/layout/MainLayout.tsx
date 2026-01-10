import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicket } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <FontAwesomeIcon icon={faTicket} />
            <span>ConcertTicket</span>
          </div>

          {/* Desktop Menu (Ẩn trên mobile) */}
          <nav className="hidden md:flex gap-6 font-medium text-secondary">
            <a href="#" className="hover:text-primary transition-colors">Trang chủ</a>
            <a href="#" className="hover:text-primary transition-colors">Sự kiện</a>
            <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-white">
              Đăng nhập
            </Button>
            <Button className="hidden md:flex bg-secondary hover:bg-secondary/90">
              Đăng ký
            </Button>

            {/* Mobile Menu Button (Hiện trên mobile) */}
            <Button variant="ghost" size="icon" className="md:hidden">
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      {/* flex-1 giúp phần này tự giãn ra đẩy footer xuống đáy */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-secondary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 ConcertTicket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;