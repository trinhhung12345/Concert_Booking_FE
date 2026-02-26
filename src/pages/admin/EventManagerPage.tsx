import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faTrash,
  faListUl,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";

// Services & Components
import { eventService, EVENT_STATUS, type Event } from "@/features/concerts/services/eventService";
import AdminEventCard from "@/features/admin/components/AdminEventCard";

type TabValue = "all" | "approved" | "not_approved" | "pending" | "deleted";

export default function EventManagerPage() {
  const user = useAuthStore((s) => s.user);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const roleName = (user?.role?.roleName || "").toUpperCase();
  const isSuperAdmin = roleName === "SUPER_ADMIN" || roleName === "SUPERADMIN";

  // Gọi API lấy danh sách sự kiện (admin)
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = isSuperAdmin
        ? await eventService.getAdminEvents()
        : await eventService.getAdminMyEvents();
      setEvents(data);
    } catch (error) {
      console.error("Lỗi tải sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isSuperAdmin]);

  // Handle approve event
  const handleApprove = async (eventId: number) => {
    try {
      const updated = await eventService.approveEvent(eventId);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: updated.status ?? EVENT_STATUS.APPROVED } : e))
      );
    } catch (error) {
      console.error("Lỗi duyệt sự kiện:", error);
      alert("Không thể duyệt sự kiện. Vui lòng thử lại.");
    }
  };

  // Handle not approve event
  const handleNotApprove = async (eventId: number, reason?: string) => {
    try {
      const updated = await eventService.notApproveEvent(eventId, reason);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: updated.status ?? EVENT_STATUS.NOT_APPROVED, deleted: updated.deleted } : e))
      );
    } catch (error) {
      console.error("Lỗi từ chối sự kiện:", error);
      alert("Không thể từ chối sự kiện. Vui lòng thử lại.");
    }
  };

  // Filter events by search query
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q) ||
        e.address?.toLowerCase().includes(q) ||
        e.categoryName?.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  // Categorize events
  const categorized = useMemo(() => {
    const all = searchFiltered.filter((e) => !e.deleted);
    const approved = searchFiltered.filter((e) => e.status === EVENT_STATUS.APPROVED && !e.deleted);
    const notApproved = searchFiltered.filter((e) => e.status === EVENT_STATUS.NOT_APPROVED && !e.deleted);
    const pending = searchFiltered.filter((e) => e.status === EVENT_STATUS.PENDING && !e.deleted);
    const deleted = searchFiltered.filter((e) => e.deleted === true);
    return { all, approved, notApproved, pending, deleted };
  }, [searchFiltered]);

  // Get events for current tab
  const currentEvents = useMemo(() => {
    switch (activeTab) {
      case "approved": return categorized.approved;
      case "not_approved": return categorized.notApproved;
      case "pending": return categorized.pending;
      case "deleted": return categorized.deleted;
      default: return categorized.all;
    }
  }, [activeTab, categorized]);

  // Tab config
  const tabs: { value: TabValue; label: string; icon: any; count: number; color: string }[] = [
    { value: "all", label: "Tất cả", icon: faListUl, count: categorized.all.length, color: "text-foreground" },
    { value: "pending", label: "Chờ duyệt", icon: faClock, count: categorized.pending.length, color: "text-amber-600 dark:text-amber-400" },
    { value: "approved", label: "Đã duyệt", icon: faCheckCircle, count: categorized.approved.length, color: "text-emerald-600 dark:text-emerald-400" },
    { value: "not_approved", label: "Không duyệt", icon: faTimesCircle, count: categorized.notApproved.length, color: "text-red-600 dark:text-red-400" },
    { value: "deleted", label: "Đã xóa", icon: faTrash, count: categorized.deleted.length, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* 1. FILTER BAR */}
      <div className="bg-card p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-96">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sự kiện..."
              className="pl-10 bg-input text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchEvents}
            disabled={loading}
            title="Tải lại"
          >
            <FontAwesomeIcon icon={faRotateRight} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>

        <Link to="/admin/events/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <FontAwesomeIcon icon={faPlus} /> Tạo sự kiện mới
          </Button>
        </Link>
      </div>

      {/* 2. TABS & CONTENT */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
        <TabsList className="bg-muted border border-border text-muted-foreground h-auto flex-wrap gap-1 p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2 px-4 py-2"
            >
              <FontAwesomeIcon icon={tab.icon} className={`text-xs ${activeTab === tab.value ? tab.color : ""}`} />
              <span>{tab.label}</span>
              <span className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted-foreground/20 text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Shared content for all tabs */}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6 space-y-4">
            {/* LOADING STATE */}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card h-48 rounded-xl border border-border p-4 flex gap-4 animate-pulse">
                  <Skeleton className="w-64 h-40 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}

            {/* DATA LIST */}
            {!loading && currentEvents.length > 0
              ? currentEvents.map((event) => (
                  <AdminEventCard
                    key={event.id}
                    event={event}
                    onApprove={handleApprove}
                    onNotApprove={handleNotApprove}
                  />
                ))
              : !loading && (
                  <div className="text-center py-20">
                    <FontAwesomeIcon icon={tab.icon} className="text-4xl text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? `Không tìm thấy sự kiện "${searchQuery}" trong tab này.`
                        : tab.value === "all"
                          ? "Chưa có sự kiện nào."
                          : `Không có sự kiện nào ${tab.label.toLowerCase()}.`}
                    </p>
                  </div>
                )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
