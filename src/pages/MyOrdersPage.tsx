import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faTicketAlt, 
  faCheckCircle,
  faClock,
  faTimesCircle,
  faCreditCard,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { orderService } from "@/features/booking/services/orderService";
import type { Order } from "@/features/booking/types/order";
import OrderTimer from "@/features/booking/components/OrderTimer";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getLocale } from "@/lib/i18n";

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isVi = language === "vi";
  const locale = getLocale(language);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingOutId, setCheckingOutId] = useState<number | null>(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        
        // Handle response format: could be array directly or { code, data, message }
        if (Array.isArray(response)) {
          setOrders(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setError(response?.message || (isVi ? "Không có dữ liệu" : "No data"));
        }
      } catch (err: any) {
        console.error("Lỗi tải đơn hàng:", err);
        setError(isVi ? "Không thể tải danh sách đơn hàng" : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Xử lý thanh toán cho đơn hàng chưa thanh toán
  const handleCheckout = async (orderId: number) => {
    setCheckingOutId(orderId);
    try {
      const response = await orderService.checkout({ orderId });
      
      // Handle response format: could be { code, message, data } or direct object
      const checkoutData = response?.data || response;
      
      if (checkoutData?.message || response?.message) {
        window.location.href = checkoutData?.message || response?.message;
      } else {
        alert("Không thể lấy link thanh toán");
      }
    } catch (err: any) {
      console.error("Lỗi checkout:", err);
      alert(err.message || (isVi ? "Không thể thanh toán. Vui lòng thử lại." : "Cannot process payment. Please try again."));
    } finally {
      setCheckingOutId(null);
    }
  };

  // Status badge
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
            {isVi ? "Đã thanh toán" : "Paid"}
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
            <FontAwesomeIcon icon={faClock} className="text-xs" />
            {isVi ? "Chờ thanh toán" : "Pending"}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <FontAwesomeIcon icon={faTimesCircle} className="text-xs" />
            {isVi ? "Đã hủy" : "Cancelled"}
          </span>
        );
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
          <p className="text-muted-foreground">
            {isVi ? "Đang tải đơn hàng..." : "Loading your orders..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen w-full">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <h1 className="font-bold text-xl">
            {isVi ? "Đơn hàng của tôi" : "My orders"}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faTicketAlt} className="text-6xl text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {isVi ? "Chưa có đơn hàng" : "No orders yet"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isVi
                ? "Bạn chưa đặt vé nào. Hãy khám phá các sự kiện!"
                : "You haven't booked any tickets yet. Discover events now!"}
            </p>
            <Button onClick={() => navigate("/")}>
              {isVi ? "Khám phá sự kiện" : "Browse events"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-md transition-shadow"
              >
                {/* Header đơn hàng */}
                <div className="p-4 border-b border-border bg-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Mã đơn hàng: </span>
                    <span className="font-bold text-primary">{order.code}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Nội dung đơn hàng */}
                <div className="p-4">
                  {/* Thông tin người nhận */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <span className="text-muted-foreground">
                          {isVi ? "Người nhận:" : "Recipient:"}
                        </span>
                      <p className="font-medium">{order.recipientName}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">
                          {isVi ? "Số điện thoại:" : "Phone:"}
                        </span>
                      <p className="font-medium">{order.recipientPhone}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{order.recipientEmail}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">
                          {isVi ? "Địa chỉ:" : "Address:"}
                        </span>
                      <p className="font-medium">{order.recipientAddress}</p>
                    </div>
                  </div>

                  {/* Danh sách vé */}
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold mb-2">
                      {isVi ? "Chi tiết vé" : "Ticket details"} ({order.totalQuantity})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {order.orderDetails.map((detail) => (
                        <div 
                          key={detail.id}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm"
                        >
                          <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                          <span className="font-medium">{detail.seatCode}</span>
                          {(detail.ticketTypeName || detail.ticketTypeId) && (
                            <span className="text-muted-foreground">
                              • {detail.ticketTypeName ?? (isVi ? `Loại vé #${detail.ticketTypeId}` : `Ticket type #${detail.ticketTypeId}`)}
                            </span>
                          )}
                          <span className="text-muted-foreground">-</span>
                          <span className="text-primary font-semibold">
                            {detail.price.toLocaleString(locale)} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer đơn hàng */}
                <div className="p-4 border-t border-border bg-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {isVi ? "Tổng tiền: " : "Total: "}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {order.totalAmount.toLocaleString(locale)} đ
                    </span>
                    {order.paymentAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {isVi ? "Thanh toán lúc: " : "Paid at: "}
                        {formatDate(order.paymentAt)}
                      </p>
                    )}
                  </div>

                  {order.status === "UNPAID" && (
                    <div className="flex items-center gap-3">
                      {order.createdAt && (
                        <OrderTimer 
                          createdAt={order.createdAt} 
                          size="sm" 
                          variant="inline"
                          onExpired={() => {
                            setOrders(prev => prev.map(o => 
                              o.id === order.id ? { ...o, status: "CANCELLED" } : o
                            ));
                          }}
                        />
                      )}
                      <Button 
                        className="bg-pink-600 hover:bg-pink-700"
                        onClick={() => handleCheckout(order.id)}
                        disabled={checkingOutId === order.id}
                      >
                        {checkingOutId === order.id ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                            Thanh toán ngay
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
