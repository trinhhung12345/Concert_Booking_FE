import { useEffect, useState } from "react";
import { eventService } from "@/features/concerts/services/eventService";
import type { Showing, TicketType } from "@/features/concerts/services/eventService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faChevronDown, faChevronUp, faTicket } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

// Helper format tiền
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

// Helper format ngày giờ đẹp (VD: 19:00 - 22:00, CN 18 Tháng 01)
const formatSchedule = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const timeStr = `${startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  const dateStr = startDate.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });

  return { time: timeStr, date: dateStr };
};

interface EventScheduleProps {
  eventId: number | string;
}

export default function EventSchedule({ eventId }: EventScheduleProps) {
  const [showings, setShowings] = useState<Showing[]>([]);
  const [loading, setLoading] = useState(true);

  // State quản lý việc mở/đóng accordion (lưu id của showing đang mở)
  const [expandedShowingId, setExpandedShowingId] = useState<number | null>(null);

  // Cache lưu trữ ticket types đã tải để không phải gọi API lại: { [showingId]: TicketType[] }
  const [ticketsCache, setTicketsCache] = useState<Record<number, TicketType[]>>({});
  const [loadingTickets, setLoadingTickets] = useState(false);

  // 1. Load danh sách lịch diễn
  useEffect(() => {
    const fetchShowings = async () => {
      try {
        const data = await eventService.getShowingsByEventId(eventId);
        setShowings(data);
        // Tự động mở cái đầu tiên nếu có
        if (data.length > 0) {
            handleToggle(data[0].id);
        }
      } catch (error) {
        console.error("Lỗi tải lịch diễn:", error);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchShowings();
  }, [eventId]);

  // 2. Xử lý khi bấm vào lịch diễn
  const handleToggle = async (showingId: number) => {
    // Nếu đang mở cái này rồi thì đóng lại
    if (expandedShowingId === showingId) {
      setExpandedShowingId(null);
      return;
    }

    // Mở cái mới
    setExpandedShowingId(showingId);

    // Nếu chưa có data vé trong cache thì gọi API
    if (!ticketsCache[showingId]) {
      setLoadingTickets(true);
      try {
        const tickets = await eventService.getTicketTypesByShowingId(showingId);
        setTicketsCache((prev) => ({ ...prev, [showingId]: tickets }));
      } catch (error) {
        console.error("Lỗi tải vé:", error);
      } finally {
        setLoadingTickets(false);
      }
    }
  };

  if (loading) return <Skeleton className="h-32 w-full rounded-xl" />;
  if (showings.length === 0) return <div className="text-gray-500 italic">Chưa có lịch diễn nào.</div>;

  return (
    <div className="space-y-4">
      {showings.map((show) => {
        const { time, date } = formatSchedule(show.startTime, show.endTime);
        const isOpen = expandedShowingId === show.id;

        return (
          <div
            key={show.id}
            className={cn(
                "border rounded-2xl overflow-hidden transition-all duration-300",
                isOpen ? "border-primary ring-1 ring-primary bg-white shadow-md" : "border-gray-200 bg-white hover:border-primary/50"
            )}
          >
            {/* HEADER CỦA LỊCH DIỄN (Click để mở) */}
            <div
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-4"
                onClick={() => handleToggle(show.id)}
            >
                {/* Time Info */}
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        isOpen ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    )}>
                         <FontAwesomeIcon icon={faCalendarDays} className="text-xl" />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-gray-900">{time}</p>
                        <p className={cn("font-medium", isOpen ? "text-primary" : "text-gray-500")}>
                            {date}
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <span className="text-sm text-gray-400 md:hidden">
                        {isOpen ? "Thu gọn" : "Xem vé"}
                    </span>
                    <Button
                        className={cn(
                            "rounded-full px-6 font-bold transition-all",
                            isOpen ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        {isOpen ? "Đang chọn" : "Mua vé ngay"}
                    </Button>
                    <FontAwesomeIcon
                        icon={isOpen ? faChevronUp : faChevronDown}
                        className="text-gray-400 hidden md:block"
                    />
                </div>
            </div>

            {/* DANH SÁCH VÉ (Accordion Content) */}
            {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 md:p-6 animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Thông tin vé</h4>

                    <div className="space-y-3">
                        {loadingTickets ? (
                             <Skeleton className="h-16 w-full" />
                        ) : ticketsCache[show.id]?.length > 0 ? (
                            ticketsCache[show.id].map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Tag màu của vé */}
                                        <div className="h-10 w-1 rounded-full" style={{ backgroundColor: ticket.color || "#ccc" }}></div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">
                                                {ticket.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{ticket.description || "Số lượng có hạn"}</p>
                                        </div>
                                    </div>

                                    <div className="mt-2 sm:mt-0 text-right">
                                        <p className="font-bold text-xl text-primary">{formatCurrency(ticket.price)}</p>
                                        {ticket.originalPrice > ticket.price && (
                                            <p className="text-xs text-gray-400 line-through">{formatCurrency(ticket.originalPrice)}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-4">Hiện chưa có loại vé nào được mở bán.</p>
                        )}
                    </div>
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
