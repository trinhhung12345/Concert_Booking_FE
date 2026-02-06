import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faTicketAlt, 
  faCalendarAlt,
  faChair,
  faFilter,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faChevronRight,
  faReceipt
} from "@fortawesome/free-solid-svg-icons";
import { orderService } from "@/features/booking/services/orderService";
import type { Order } from "@/features/booking/types/order";
import { Button } from "@/components/ui/button";

type FilterStatus = "ALL" | "PAID" | "UNPAID" | "CANCELLED";

const TicketsPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        
        if (response.code === 200) {
          setOrders(response.data);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        console.error("Lỗi tải đơn hàng:", err);
        setError("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Lọc orders theo trạng thái
  const filteredOrders = orders.filter(order => {
    if (filterStatus === "ALL") return true;
    return order.status === filterStatus;
  });

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status: Order["status"], size: "sm" | "md" = "md") => {
    const baseClass = size === "sm" 
      ? "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      : "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium";
    
    switch (status) {
      case "PAID":
        return (
          <span className={`${baseClass} bg-green-100 text-green-700`}>
            <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
            Đã thanh toán
          </span>
        );
      case "UNPAID":
        return (
          <span className={`${baseClass} bg-orange-100 text-orange-700`}>
            <FontAwesomeIcon icon={faClock} className="text-xs" />
            Chờ thanh toán
          </span>
        );
      case "CANCELLED":
        return (
          <span className={`${baseClass} bg-red-100 text-red-700`}>
            <FontAwesomeIcon icon={faTimesCircle} className="text-xs" />
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  // Tính toán stats
  const paidOrders = orders.filter(o => o.status === "PAID");
  const unpaidOrders = orders.filter(o => o.status === "UNPAID");
  const totalTickets = orders.reduce((acc, o) => acc + o.totalQuantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-slate-100">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
          <p className="text-slate-300">Đang tải vé của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faTicketAlt} />
            Vé của tôi
          </h1>
          <p className="text-white/80 mt-2">
            Quản lý tất cả đơn hàng và vé bạn đã đặt
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/60 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-2xl shadow-sm border border-slate-700">
            <FontAwesomeIcon icon={faTicketAlt} className="text-7xl text-slate-600 mb-6" />
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Chưa có đơn hàng nào</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Bạn chưa đặt vé nào. Hãy đặt vé để tham gia các sự kiện thú vị!
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Khám phá sự kiện
            </Button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
                <div className="text-3xl font-bold text-primary">{orders.length}</div>
                <div className="text-slate-400 text-sm">Tổng đơn hàng</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
                <div className="text-3xl font-bold text-blue-400">{totalTickets}</div>
                <div className="text-slate-400 text-sm">Tổng số vé</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
                <div className="text-3xl font-bold text-green-400">{paidOrders.length}</div>
                <div className="text-slate-400 text-sm">Đơn đã thanh toán</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
                <div className="text-3xl font-bold text-orange-400">{unpaidOrders.length}</div>
                <div className="text-slate-400 text-sm">Đơn chờ thanh toán</div>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-700 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-slate-400 flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilter} />
                  Lọc theo:
                </span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={filterStatus === "ALL" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("ALL")}
                  >
                    Tất cả ({orders.length})
                  </Button>
                  <Button
                    variant={filterStatus === "PAID" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("PAID")}
                    className={filterStatus === "PAID" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                    Đã thanh toán ({paidOrders.length})
                  </Button>
                  <Button
                    variant={filterStatus === "UNPAID" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("UNPAID")}
                    className={filterStatus === "UNPAID" ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    Chờ thanh toán ({unpaidOrders.length})
                  </Button>
                  <Button
                    variant={filterStatus === "CANCELLED" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("CANCELLED")}
                    className={filterStatus === "CANCELLED" ? "bg-gray-500 hover:bg-gray-600" : ""}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                    Đã hủy ({orders.filter(o => o.status === "CANCELLED").length})
                  </Button>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-700">
                <p className="text-slate-400">Không có đơn hàng nào trong danh mục này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => navigate(`/tickets/${order.id}`)}
                    className={`bg-slate-900 rounded-xl shadow-sm border border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer ${
                      order.status === "CANCELLED" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left: Order info */}
                            <div className="flex items-center gap-4">
                          {/* Order icon */}
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            order.status === "PAID" 
                              ? "bg-gradient-to-br from-primary to-pink-500" 
                              : order.status === "UNPAID"
                              ? "bg-gradient-to-br from-orange-400 to-amber-500"
                              : "bg-gradient-to-br from-gray-400 to-gray-500"
                          } text-white`}>
                            <FontAwesomeIcon icon={faReceipt} className="text-xl" />
                          </div>
                          
                          <div>
                            <h3 className="font-bold text-lg text-slate-100">{order.code}</h3>
                            <p className="text-sm text-slate-400">
                              {order.totalQuantity} vé • {formatDate(order.paymentAt)}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {order.orderDetails.slice(0, 3).map((detail) => (
                                <span 
                                  key={detail.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-xs font-medium text-slate-100"
                                >
                                  <FontAwesomeIcon icon={faChair} className="mr-1 text-gray-400" />
                                  {detail.seatCode}
                                </span>
                              ))}
                              {order.orderDetails.length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-500">
                                  +{order.orderDetails.length - 3} vé khác
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Price & Status */}
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="text-right">
                            {getStatusBadge(order.status, "sm")}
                            <p className="font-bold text-xl text-primary mt-2">
                              {order.totalAmount.toLocaleString("vi-VN")} đ
                            </p>
                          </div>
                          
                          <FontAwesomeIcon 
                            icon={faChevronRight} 
                            className="text-gray-300 text-xl hidden sm:block" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
