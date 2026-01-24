import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChartLine,
  faFileContract,
  faTicket
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { path: "/admin/events", icon: faCalendarAlt, label: "Sự kiện của tôi" },
  { path: "/admin/reports", icon: faChartLine, label: "Quản lý báo cáo" },
  { path: "/admin/policies", icon: faFileContract, label: "Điều khoản tổ chức" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-card text-card-foreground flex flex-col min-h-screen border-r border-border">
      {/* 1. BRAND LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <FontAwesomeIcon icon={faTicket} />
          <span>Organizer Center</span>
        </div>
      </div>

      {/* 2. MENU */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" // Active: Màu hồng
                  : "text-muted-foreground hover:bg-muted hover:text-foreground" // Inactive: Màu xám
              )
            }
          >
            <FontAwesomeIcon icon={item.icon} className="w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 3. FOOTER */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        <p>TixCon Admin v1.0</p>
        <p>© 2024 TixCon Inc.</p>
      </div>
    </aside>
  );
}
