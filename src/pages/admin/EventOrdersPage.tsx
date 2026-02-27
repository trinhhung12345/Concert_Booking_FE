import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChartLine, faRotateRight } from "@fortawesome/free-solid-svg-icons";
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

export default function EventOrdersPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<EventRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await eventRevenueService.getEventRevenue(id);
      setData(response);
    } catch (err) {
      console.error("Lỗi tải đơn hàng sự kiện:", err);
      setError("Không thể tải danh sách đơn hàng sự kiện.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  const orders = data?.orders || [];
  const paidCount = useMemo(
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
          <h1 className="text-2xl font-bold text-foreground mt-2">Đơn hàng của sự kiện</h1>
          <p className="text-sm text-muted-foreground">{data?.eventTitle || `Sự kiện #${id}`}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/admin/events/${id}/revenue`}>
            <Button variant="outline" className="gap-2">
              <FontAwesomeIcon icon={faChartLine} />
              Xem tổng quan doanh thu
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={fetchOrders} disabled={loading} title="Tải lại dữ liệu">
            <FontAwesomeIcon icon={faRotateRight} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard label="Tổng đơn" value={loading ? "..." : String(orders.length)} />
        <InfoCard label="Đơn đã thanh toán" value={loading ? "..." : String(paidCount)} />
        <InfoCard label="Tổng doanh thu" value={loading ? "..." : formatCurrency(data?.revenue || 0)} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Liên hệ</th>
                <th className="px-4 py-3">SL vé</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thanh toán lúc</th>
                <th className="px-4 py-3">Ghế</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border text-sm text-foreground align-top">
                  <td className="px-4 py-3 font-medium">{order.code}</td>
                  <td className="px-4 py-3">{order.recipientName || "-"}</td>
                  <td className="px-4 py-3">
                    <p>{order.recipientPhone || "-"}</p>
                    <p className="text-xs text-muted-foreground">{order.recipientEmail || "-"}</p>
                  </td>
                  <td className="px-4 py-3">{order.totalQuantity}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3">{formatDateTime(order.paymentAt || order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {order.orderDetails?.map((detail) => (
                        <span
                          key={detail.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs"
                        >
                          {detail.seatCode}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && orders.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">Sự kiện chưa có đơn hàng nào.</div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground mt-2">{value}</p>
    </div>
  );
}
