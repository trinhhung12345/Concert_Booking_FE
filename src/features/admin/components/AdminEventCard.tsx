import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faPen,
  faCouch,
  faChartPie,
  faUsers,
  faReceipt
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import type { Event } from "@/features/concerts/services/eventService";

// Helper format ngày giờ
const formatDateTime = (dateString: string) => {
  if (!dateString) return "Chưa có lịch diễn";
  const date = new Date(dateString);
  const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const day = date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
  return `${time}, ${day}`;
};

interface AdminEventCardProps {
  event: Event;
}

export default function AdminEventCard({ event }: AdminEventCardProps) {
  // 1. Xử lý lấy ảnh Thumbnail
  // Tìm file có type = 0 (Ảnh) hoặc lấy file đầu tiên
  const thumbnailFile = event.files?.find(f => f.type === 0) || event.files?.[0];
  const imageUrl = thumbnailFile?.thumbUrl || thumbnailFile?.originUrl || "https://placehold.co/600x400?text=No+Image";

  // 2. Lấy thông tin hiển thị (Thời gian & Địa điểm)
  const firstShowing = event.showings?.[0];
  const startTime = firstShowing?.startTime || "";

  // Ghép địa điểm
  const location = [event.venue, event.address].filter(Boolean).join(", ");

  return (
    <div className="w-full bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all hover:shadow-md">

      {/* --- PHẦN TRÊN: ẢNH & THÔNG TIN --- */}
      <div className="flex flex-col md:flex-row p-4 gap-4 md:gap-6">

        {/* Cột trái: Ảnh */}
        <div className="w-full md:w-64 h-40 flex-shrink-0">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover rounded-lg border border-gray-100 dark:border-gray-600"
          />
        </div>

        {/* Cột phải: Thông tin */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm">
            {/* Thời gian */}
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-4" />
              <span>{formatDateTime(startTime)}</span>
            </div>

            {/* Địa điểm */}
            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mt-1" />
              <span className="line-clamp-2">{location || "Chưa cập nhật địa điểm"}</span>
            </div>

             {/* Category Badge */}
             <div className="pt-1">
                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                    {event.categoryName}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN DƯỚI: ACTION BAR --- */}
      <div className="bg-gray-50 dark:bg-[#0f172a]/50 border-t border-gray-100 dark:border-gray-700 p-2 grid grid-cols-5 gap-1">

        {/* Các nút chức năng (Giống ảnh mẫu) */}
        <ActionButton icon={faChartPie} label="Tổng quan" disabled />
        <ActionButton icon={faUsers} label="Thành viên" disabled />
        <ActionButton icon={faReceipt} label="Đơn hàng" disabled />

        {/* NÚT QUAN TRỌNG: Sơ đồ ghế */}
        <Link to={`/admin/events/${event.id}/seatmap`} className="contents">
            <Button variant="ghost" className="flex flex-col h-auto py-2 gap-1 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-gray-800">
                <FontAwesomeIcon icon={faCouch} className="text-lg" />
                <span className="text-xs font-normal">Sơ đồ ghế</span>
            </Button>
        </Link>

        {/* NÚT QUAN TRỌNG: Chỉnh sửa */}
        <Link to={`/admin/events/${event.id}/edit`} className="contents">
            <Button variant="ghost" className="flex flex-col h-auto py-2 gap-1 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-gray-800">
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
    className="flex flex-col h-auto py-2 gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
  >
    <FontAwesomeIcon icon={icon} className="text-lg" />
    <span className="text-xs font-normal">{label}</span>
  </Button>
);
