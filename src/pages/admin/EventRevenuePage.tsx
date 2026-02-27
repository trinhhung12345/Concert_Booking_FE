import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChartLine,
  faReceipt,
  faTicketAlt,
  faMoneyBillTrendUp,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { eventRevenueService, type EventRevenueData } from "@/features/admin/services/eventRevenueService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

const parseApiDate = (value?: string) => {
  if (!value) return null;
  const normalized = value.includes(" ") ? value.replace(" ", "T") : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateLabel = (value?: string) => {
  const date = parseApiDate(value);
  if (!date) return "Không rõ";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(date);
};

const formatDateTime = (value?: string) => {
  const date = parseApiDate(value);
  if (!date) return "Không rõ thời gian";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function EventRevenuePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<EventRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await eventRevenueService.getEventRevenue(id);
      setData(response);
    } catch (err) {
      console.error("Lỗi tải doanh thu sự kiện:", err);
      setError("Không thể tải báo cáo doanh thu sự kiện.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [id]);

  const orders = data?.orders || [];

  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; orders: number }>();
    orders.forEach((order) => {
      const date = parseApiDate(order.paymentAt || order.createdAt);
      const key = date ? date.toISOString().slice(0, 10) : "unknown";
      const current = map.get(key) || {
        date: key === "unknown" ? "Không rõ" : formatDateLabel(order.paymentAt || order.createdAt),
        revenue: 0,
        orders: 0,
      };
      current.revenue += order.totalAmount || 0;
      current.orders += 1;
      map.set(key, current);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, item]) => item);
  }, [orders]);

  const statusData = useMemo(() => {
    const byStatus = new Map<string, number>();
    orders.forEach((order) => {
      const key = order.status || "UNKNOWN";
      byStatus.set(key, (byStatus.get(key) || 0) + 1);
    });
    return Array.from(byStatus.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const totalTickets = useMemo(
    () => orders.reduce((sum, order) => sum + (order.totalQuantity || 0), 0),
    [orders]
  );

  const paidOrders = useMemo(
    () => orders.filter((order) => (order.status || "").toUpperCase() === "PAID").length,
    [orders]
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <Link to="/admin/events" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Quay lại danh sách sự kiện
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Báo cáo doanh thu sự kiện</h1>
          <p className="text-sm text-muted-foreground">{data?.eventTitle || `Sự kiện #${id}`}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/admin/events/${id}/orders`}>
            <Button variant="outline" className="gap-2">
              <FontAwesomeIcon icon={faReceipt} />
              Xem đơn hàng
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={fetchRevenue} disabled={loading} title="Tải lại dữ liệu">
            <FontAwesomeIcon icon={faRotateRight} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={faMoneyBillTrendUp}
          label="Tổng doanh thu"
          value={loading ? "..." : formatCurrency(data?.revenue || 0)}
        />
        <StatCard icon={faReceipt} label="Tổng đơn hàng" value={loading ? "..." : String(orders.length)} />
        <StatCard icon={faTicketAlt} label="Tổng vé đã bán" value={loading ? "..." : String(totalTickets)} />
        <StatCard icon={faChartLine} label="Đơn PAID" value={loading ? "..." : String(paidOrders)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-4">
          <h2 className="font-semibold text-foreground mb-4">Doanh thu theo ngày</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => new Intl.NumberFormat("vi-VN").format(value)}
                />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "revenue" ? [formatCurrency(value), "Doanh thu"] : [String(value), "Đơn hàng"]
                  }
                />
                <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--accent-foreground))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="font-semibold text-foreground mb-4">Tỷ lệ trạng thái đơn</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary-foreground))"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h2 className="font-semibold text-foreground mb-3">Đơn hàng gần nhất</h2>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-border rounded-lg px-3 py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{order.code}</p>
                <p className="text-xs text-muted-foreground">
                  {order.recipientName || "Khách hàng"} • {formatDateTime(order.paymentAt || order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{formatCurrency(order.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">{order.totalQuantity} vé • {order.status}</p>
              </div>
            </div>
          ))}
          {!loading && orders.length === 0 && (
            <p className="text-sm text-muted-foreground">Sự kiện chưa có đơn hàng.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <FontAwesomeIcon icon={icon} className="text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold text-foreground mt-3">{value}</p>
    </div>
  );
}
