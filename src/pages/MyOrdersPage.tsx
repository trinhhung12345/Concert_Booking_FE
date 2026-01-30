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

export default function MyOrdersPage() {
  const navigate = useNavigate();
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

  // Xử lý thanh toán cho đơn hàng chưa thanh toán
  const handleCheckout = async (orderId: number) => {
    setCheckingOutId(orderId);
    try {
      const response = await orderService.checkout({ orderId });
      if (response.code === 200 && response.message) {
        window.location.href = response.message;
      } else {
        alert("Không thể lấy link thanh toán");
      }
    } catch (err: any) {
      console.error("Lỗi checkout:", err);
      alert(err.response?.data?.message || "Không thể thanh toán. Vui lòng thử lại.");
    } finally {
      setCheckingOutId(null);
    }
  };

  // Status badge
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
            Đã thanh toán
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
            <FontAwesomeIcon icon={faClock} className="text-xs" />
            Chờ thanh toán
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <FontAwesomeIcon icon={faTimesCircle} className="text-xs" />
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
          <p className="text-gray-500">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen w-full">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <h1 className="font-bold text-xl">Đơn hàng của tôi</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faTicketAlt} className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng</h2>
            <p className="text-gray-400 mb-6">Bạn chưa đặt vé nào. Hãy khám phá các sự kiện!</p>
            <Button onClick={() => navigate("/")}>
              Khám phá sự kiện
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
              >
                {/* Header đơn hàng */}
                <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Mã đơn hàng: </span>
                    <span className="font-bold text-primary">{order.code}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Nội dung đơn hàng */}
                <div className="p-4">
                  {/* Thông tin người nhận */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Người nhận:</span>
                      <p className="font-medium">{order.recipientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Số điện thoại:</span>
                      <p className="font-medium">{order.recipientPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{order.recipientEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Địa chỉ:</span>
                      <p className="font-medium">{order.recipientAddress}</p>
                    </div>
                  </div>

                  {/* Danh sách vé */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Chi tiết vé ({order.totalQuantity})</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.orderDetails.map((detail) => (
                        <div 
                          key={detail.id}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                        >
                          <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                          <span className="font-medium">{detail.seatCode}</span>
                          <span className="text-gray-500">-</span>
                          <span className="text-primary font-semibold">
                            {detail.price.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer đơn hàng */}
                <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-sm text-gray-500">Tổng tiền: </span>
                    <span className="text-xl font-bold text-primary">
                      {order.totalAmount.toLocaleString("vi-VN")} đ
                    </span>
                    {order.paymentAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Thanh toán lúc: {formatDate(order.paymentAt)}
                      </p>
                    )}
                  </div>

                  {order.status === "UNPAID" && (
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
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
