import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminHeader({ title }: { title: string }) {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 text-card-foreground">
      {/* LEFT: Page Title */}
      <h1 className="text-lg font-bold">{title}</h1>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Nút về trang người dùng */}
        <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                <FontAwesomeIcon icon={faGlobe} /> Website
            </Button>
        </Link>

        {/* Nút Tạo sự kiện (Màu xanh lá hoặc Hồng tùy bạn, ở đây để Hồng cho đồng bộ Brand) */}
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-5">
            <FontAwesomeIcon icon={faPlus} />
            Tạo sự kiện
        </Button>

        {/* Avatar nhỏ */}
        <div className="flex items-center gap-2 pl-4 border-l border-border">
            <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
