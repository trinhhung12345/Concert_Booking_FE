import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCalendarPlus,
  faCalendarXmark,
  faChartPie,
  faChevronRight,
  faRefresh,
  faCoins,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { reportService, type EventsStats } from "@/features/admin/services/reportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Màu sắc cho pie chart
const CHART_COLORS = [
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#6366f1", // indigo
];

export default function ReportsPage() {
  const [stats, setStats] = useState<EventsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await reportService.getEventsStats();
      setStats(data);
    } catch (err) {
      setError("Không thể tải dữ liệu báo cáo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng để tính phần trăm
  const totalByCategory = stats?.byCategory.reduce((sum, item) => sum + item.count, 0) || 1;

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Lấy ngày diễn ra sớm nhất của event
  const getFirstShowingDate = (event: any) => {
    if (!event.showings || event.showings.length === 0) return null;
    const sorted = [...event.showings].sort(
      (a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    return sorted[0].startTime;
  };

  // Xác định trạng thái event
  const getEventStatus = (event: any) => {
    const now = new Date();
    const firstShowing = getFirstShowingDate(event);
    
    if (!firstShowing) return { label: "Chưa có lịch", variant: "secondary" as const };
    
    const showingDate = new Date(firstShowing);
    if (showingDate < now) return { label: "Đã kết thúc", variant: "destructive" as const };
    return { label: "Sắp diễn ra", variant: "default" as const };
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-80 bg-muted rounded-xl"></div>
            <div className="h-80 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="py-10 text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchStats} className="mt-4">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan về các sự kiện và hoạt động của hệ thống
          </p>
        </div>
        <Button variant="outline" onClick={fetchStats}>
          <FontAwesomeIcon icon={faRefresh} className="mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng sự kiện
            </CardTitle>
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="h-5 w-5 text-pink-500"
            />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-pink-500">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sự kiện trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sắp diễn ra
            </CardTitle>
            <FontAwesomeIcon
              icon={faCalendarPlus}
              className="h-5 w-5 text-emerald-500"
            />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-500">{stats?.upcoming || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sự kiện sẽ diễn ra trong tương lai
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 border-slate-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã kết thúc
            </CardTitle>
            <FontAwesomeIcon
              icon={faCalendarXmark}
              className="h-5 w-5 text-slate-500"
            />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-500">{stats?.completed || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sự kiện đã hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Events by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faChartPie} className="h-5 w-5 text-pink-500" />
              Sự kiện theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats && stats.byCategory.length > 0 ? (
              <div className="flex items-center gap-8">
                {/* Pie Chart SVG */}
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {stats.byCategory.reduce<React.ReactNode[]>(
                      (segments, item, index) => {
                        const percentage = (item.count / totalByCategory) * 100;
                        const dashArray = (percentage / 100) * 100;
                        
                        segments.push(
                          <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={CHART_COLORS[index % CHART_COLORS.length]}
                            strokeWidth="20"
                            strokeDasharray={`${dashArray} 100`}
                            strokeDashoffset={-((index * 100) / stats.byCategory.length)}
                          />
                        );
                        return segments;
                      },
                      []
                    )}
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.byCategory.length}</div>
                      <div className="text-xs text-muted-foreground">Danh mục</div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                  {stats.byCategory.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        ></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({((item.count / totalByCategory) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Chưa có dữ liệu sự kiện
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sự kiện gần đây</CardTitle>
            <Link to="/admin/events">
              <Button variant="ghost" size="sm">
                Xem tất cả
                <FontAwesomeIcon icon={faChevronRight} className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats && stats.recentEvents.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEvents.map((event) => {
                  const status = getEventStatus(event);
                  const firstDate = getFirstShowingDate(event);
                  
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.venue || "Chưa có địa điểm"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {firstDate ? formatDate(firstDate) : "Chưa có lịch"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.showings?.length || 0} suất diễn
                          </p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Chưa có sự kiện nào
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Other Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <FontAwesomeIcon
              icon={faCoins}
              className="h-12 w-12 text-muted-foreground/50 mb-4"
            />
            <h3 className="font-medium mb-2">Báo cáo doanh thu</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Đang chờ API từ backend
            </p>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <FontAwesomeIcon
              icon={faTicket}
              className="h-12 w-12 text-muted-foreground/50 mb-4"
            />
            <h3 className="font-medium mb-2">Báo cáo bán vé</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Đang chờ API từ backend
            </p>
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
