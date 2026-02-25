import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faPen,
  faCouch,
  faChartPie,
  faUsers,
  faReceipt,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { EVENT_STATUS, type Event } from "@/features/concerts/services/eventService";
import { cleanImageUrl } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

// Helper format ngày giờ
const formatDateTime = (dateString: string) => {
  if (!dateString) return "Chưa có lịch diễn";
  const date = new Date(dateString);
  const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const day = date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
  return `${time}, ${day}`;
};

// Status badge component
const EventStatusBadge = ({ status, deleted }: { status?: number; deleted?: boolean }) => {
  if (deleted) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
        <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
        Đã xóa
      </span>
    );
  }
  switch (status) {
    case EVENT_STATUS.APPROVED:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
          Đã duyệt
        </span>
      );
    case EVENT_STATUS.NOT_APPROVED:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
          <FontAwesomeIcon icon={faTimesCircle} className="text-[10px]" />
          Không duyệt
        </span>
      );
    case EVENT_STATUS.PENDING:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <FontAwesomeIcon icon={faClock} className="text-[10px]" />
          Chờ duyệt
        </span>
      );
    default:
      return null;
  }
};

interface AdminEventCardProps {
  event: Event;
  onApprove?: (eventId: number) => Promise<void>;
  onNotApprove?: (eventId: number) => Promise<void>;
}

export default function AdminEventCard({ event, onApprove, onNotApprove }: AdminEventCardProps) {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role?.roleName === "SUPER_ADMIN";
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);

  // 1. Xử lý lấy ảnh Thumbnail
  const thumbnailFile = event.files?.find(f => f.type === 0) || event.files?.[0];
  const imageUrl = cleanImageUrl(thumbnailFile?.thumbUrl || thumbnailFile?.originUrl);

  // 2. Lấy thông tin hiển thị (Thời gian & Địa điểm)
  const firstShowing = event.showings?.[0];
  const startTime = firstShowing?.startTime || "";

  // Ghép địa điểm
  const location = [event.venue, event.address].filter(Boolean).join(", ");

  const handleApprove = async () => {
    if (!onApprove) return;
    setActionLoading("approve");
    try {
      await onApprove(event.id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleNotApprove = async () => {
    if (!onNotApprove) return;
    setActionLoading("reject");
    try {
      await onNotApprove(event.id);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={`w-full bg-card text-card-foreground rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md ${
      event.deleted ? "border-gray-300 opacity-70" : "border-border"
    }`}>

      {/* --- PHẦN TRÊN: ẢNH & THÔNG TIN --- */}
      <div className="flex flex-col md:flex-row p-4 gap-4 md:gap-6">

        {/* Cột trái: Ảnh */}
        <div className="w-full md:w-64 h-40 flex-shrink-0 relative">
          <img
            src={imageUrl}
            alt={event.title}
            className={`w-full h-full object-cover rounded-lg border border-border ${event.deleted ? "grayscale" : ""}`}
          />
          {/* Status badge overlay on image */}
          <div className="absolute top-2 left-2">
            <EventStatusBadge status={event.status} deleted={event.deleted} />
          </div>
        </div>

        {/* Cột phải: Thông tin */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-foreground">
              {event.title}
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            {/* Thời gian */}
            <div className="flex items-center gap-3 text-primary font-medium">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-4" />
              <span>{formatDateTime(startTime)}</span>
            </div>

            {/* Địa điểm */}
            <div className="flex items-start gap-3 text-muted-foreground">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mt-1" />
              <span className="line-clamp-2">{location || "Chưa cập nhật địa điểm"}</span>
            </div>

             {/* Category Badge */}
             <div className="pt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    {event.categoryName}
                </span>
                {event.showings && event.showings.length > 0 && (
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-md">
                    {event.showings.length} suất diễn
                  </span>
                )}
             </div>
          </div>

          {/* Nút duyệt cho Super Admin */}
          {isSuperAdmin && !event.deleted && (
            <div className="flex items-center gap-2 pt-2">
              {event.status !== EVENT_STATUS.APPROVED && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8"
                  onClick={handleApprove}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "approve" ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                  ) : (
                    <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                  )}
                  Duyệt
                </Button>
              )}
              {event.status !== EVENT_STATUS.NOT_APPROVED && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5 text-xs h-8"
                  onClick={handleNotApprove}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "reject" ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                  ) : (
                    <FontAwesomeIcon icon={faTimesCircle} className="text-xs" />
                  )}
                  Không duyệt
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- PHẦN DƯỚI: ACTION BAR --- */}
      <div className="bg-muted/50 border-t border-border p-2 grid grid-cols-5 gap-1">

        {/* Các nút chức năng */}
        <ActionButton icon={faChartPie} label="Tổng quan" disabled />
        <ActionButton icon={faUsers} label="Thành viên" disabled />
        <ActionButton icon={faReceipt} label="Đơn hàng" disabled />

        {/* NÚT QUAN TRỌNG: Sơ đồ ghế */}
        <Link to={`/admin/events/${event.id}/seatmap`} className="contents">
            <Button variant="ghost" className="flex flex-col h-auto py-2 gap-1 text-muted-foreground hover:text-primary hover:bg-background">
                <FontAwesomeIcon icon={faCouch} className="text-lg" />
                <span className="text-xs font-normal">Sơ đồ ghế</span>
            </Button>
        </Link>

        {/* NÚT QUAN TRỌNG: Chỉnh sửa */}
        <Link to={`/admin/events/${event.id}/edit`} className="contents">
            <Button variant="ghost" className="flex flex-col h-auto py-2 gap-1 text-muted-foreground hover:text-primary hover:bg-background">
                <FontAwesomeIcon icon={faPen} className="text-lg" />
                <span className="text-xs font-normal">Chỉnh sửa</span>
            </Button>
        </Link>

      </div>
    </div>
  );
}

// Component nút nhỏ nội bộ
const ActionButton = ({ icon, label, disabled = false }: { icon: any, label: string, disabled?: boolean }) => (
  <Button
    variant="ghost"
    disabled={disabled}
    className="flex flex-col h-auto py-2 gap-1 text-muted-foreground hover:text-foreground"
  >
    <FontAwesomeIcon icon={icon} className="text-lg" />
    <span className="text-xs font-normal">{label}</span>
  </Button>
);
