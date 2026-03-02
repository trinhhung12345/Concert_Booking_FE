import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import AdminProfilePopup from "./AdminProfilePopup";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 text-card-foreground">
      {/* LEFT: Page Title */}
      <h1 className="text-lg font-bold">{title}</h1>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Realtime event notifications for admins / super admins */}
        <NotificationBell />

        {/* Nút về trang người dùng */}
        <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                <FontAwesomeIcon icon={faGlobe} /> Website
            </Button>
        </Link>

        {/* Profile Popup */}
        <div className="pl-4 border-l border-border">
            <AdminProfilePopup />
        </div>
      </div>
    </header>
  );
}
