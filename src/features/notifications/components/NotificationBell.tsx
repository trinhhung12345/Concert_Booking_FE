import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/store/useNotificationStore";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Vừa xong";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;

  return date.toLocaleDateString();
}

export function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleClickNotification = (id: string, eventId: number | string) => {
    markAsRead(id);
    setOpen(false);
    if (eventId) {
      navigate(`/event/${eventId}`);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 hover:text-primary hover:bg-pink-50"
          aria-label="Thông báo sự kiện"
        >
          <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Thông báo</span>
          {notifications.length > 0 && (
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => markAllAsRead()}
            >
              Đánh dấu đã đọc tất cả
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <div className="px-3 py-4 text-sm text-muted-foreground">
            Chưa có thông báo nào.
          </div>
        )}

        {notifications.slice(0, 10).map((n) => (
          <DropdownMenuItem
            key={n.id}
            className={`flex cursor-pointer flex-col items-start gap-1 whitespace-normal ${
              n.read ? "bg-background" : "bg-primary/5"
            }`}
            onClick={() => handleClickNotification(n.id, n.eventId)}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {n.title}
              </span>
              {!n.read && (
                <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Mới
                </span>
              )}
            </div>
            <p className="w-full text-xs text-foreground line-clamp-2">
              {n.message}
            </p>
            <span className="text-[11px] text-muted-foreground">
              {formatRelativeTime(n.createdAt)}
            </span>
          </DropdownMenuItem>
        ))}

        {notifications.length > 10 && (
          <div className="px-3 py-2 text-center text-[11px] text-muted-foreground">
            Hiển thị 10 thông báo gần nhất.
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
