import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@/components/ui/skeleton";

// Services & Components
import { eventService, type Event } from "@/features/concerts/services/eventService";
import AdminEventCard from "@/features/admin/components/AdminEventCard";

export default function EventManagerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách sự kiện
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Tạm dùng getAll (public) hoặc tạo API getMyEvents riêng cho admin nếu backend có
        const data = await eventService.getAll();
        setEvents(data);
      } catch (error) {
        console.error("Lỗi tải sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* 1. FILTER BAR */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Tìm kiếm sự kiện..."
                className="pl-10 bg-gray-50 dark:bg-[#0f172a] border-gray-300 dark:border-gray-600"
            />
        </div>

        <Link to="/admin/events/create">
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                <FontAwesomeIcon icon={faPlus} /> Tạo sự kiện mới
            </Button>
        </Link>
      </div>

      {/* 2. TABS & CONTENT */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-[#1e293b] border dark:border-gray-700 text-gray-500">
          <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Tất cả ({events.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
          <TabsTrigger value="past">Đã qua</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">

            {/* LOADING STATE */}
            {loading && Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1e293b] h-48 rounded-xl border p-4 flex gap-4 animate-pulse">
                    <Skeleton className="w-64 h-40 rounded-lg" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            ))}

            {/* DATA LIST */}
            {!loading && events.length > 0 ? (
                events.map((event) => (
                    <AdminEventCard key={event.id} event={event} />
                ))
            ) : (
                !loading && (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        Chưa có sự kiện nào.
                    </div>
                )
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
