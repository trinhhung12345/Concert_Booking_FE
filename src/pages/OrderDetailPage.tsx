import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QRCode from "react-qr-code";
import { 
  faSpinner, 
  faTicketAlt, 
  faQrcode,
  faChair,
  faDownload,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faArrowLeft,
  faReceipt,
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import { orderService } from "@/features/booking/services/orderService";
import type { Order, OrderDetail } from "@/features/booking/types/order";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<OrderDetail | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Fetch order detail
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await orderService.getOrderById(Number(orderId));
        
        if (response.code === 200) {
          setOrder(response.data);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        console.error("Lỗi tải đơn hàng:", err);
        setError("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

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
  const getStatusBadge = (status: Order["status"]) => {
    const baseClass = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium";
    
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

  // Xem chi tiết vé trong modal
  const handleViewTicket = (ticket: OrderDetail) => {
    console.log("QR Data:", ticket.qr); // Debug QR
    console.log("QR Length:", ticket.qr?.length); // Debug độ dài
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
          <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-400 mb-6">{error || "Đơn hàng không tồn tại hoặc bạn không có quyền xem."}</p>
          <Button onClick={() => navigate("/tickets")}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate("/tickets")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FontAwesomeIcon icon={faReceipt} />
            Chi tiết đơn hàng
          </h1>
          <p className="text-white/80 mt-1">
            Mã đơn: <span className="font-bold text-white">{order.code}</span>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Order Info Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{order.code}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {order.status === "PAID" 
                  ? `Thanh toán lúc: ${formatDate(order.paymentAt)}`
                  : "Chưa thanh toán"
                }
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          {/* Thông tin người nhận */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-400 w-4" />
              <div>
                <p className="text-xs text-gray-500">Người nhận</p>
                <p className="font-medium">{order.recipientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
              <div>
                <p className="text-xs text-gray-500">Số điện thoại</p>
                <p className="font-medium">{order.recipientPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{order.recipientEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 w-4" />
              <div>
                <p className="text-xs text-gray-500">Địa chỉ</p>
                <p className="font-medium">{order.recipientAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách vé trong order */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
              Danh sách vé ({order.orderDetails.length})
            </h3>
          </div>
          
          <div className="divide-y">
            {order.orderDetails.map((ticket) => (
              <div 
                key={ticket.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Ticket icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      order.status === "PAID" 
                        ? "bg-gradient-to-br from-primary to-pink-500" 
                        : order.status === "UNPAID"
                        ? "bg-gradient-to-br from-orange-400 to-amber-500"
                        : "bg-gradient-to-br from-gray-400 to-gray-500"
                    } text-white`}>
                      <div className="text-center">
                        <FontAwesomeIcon icon={faChair} className="text-lg" />
                        <p className="text-xs font-bold mt-1">{ticket.seatCode}</p>
                      </div>
                    </div>
                    
                    {/* Ticket info */}
                    <div>
                      <h4 className="font-bold text-lg">{ticket.seatCode}</h4>
                      <p className="text-sm text-gray-500">Mã ghế: {ticket.seatId}</p>
                      <p className="text-xs text-gray-400 line-through">
                        Giá gốc: {ticket.originalPrice != null ? ticket.originalPrice.toLocaleString("vi-VN") : "-"} đ
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-bold text-primary text-xl">
                        {ticket.price.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                    
                    {order.status === "PAID" && (
                      <Button 
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                        QR Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng cộng ({order.totalQuantity} vé)</span>
              <span className="text-2xl font-bold text-primary">
                {order.totalAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>

        {/* Nút thanh toán nếu chưa thanh toán */}
        {order.status === "UNPAID" && (
          <div className="mt-6">
            <Button 
              className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600"
              onClick={() => navigate("/my-orders")}
            >
              Đi đến trang thanh toán
            </Button>
          </div>
        )}
      </div>

      {/* Modal xem QR Code vé */}
      <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
              Vé điện tử
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && order && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                {selectedTicket.qr ? (
                  <div className="p-4 bg-white rounded-xl border-2 border-gray-200">
                    <QRCode 
                      value={`${import.meta.env.VITE_API_URL}/orders/check-in?token=${selectedTicket.qr}`}
                      size={220}
                      level="H"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faQrcode} className="text-5xl text-gray-400 mb-2" />
                      <p className="text-xs text-gray-400">Mã QR Check-in</p>
                      <p className="text-xs font-mono mt-1 text-primary">{order.code}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-dashed">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-bold text-primary">{order.code}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Mã ghế</span>
                  <span className="font-bold text-xl">{selectedTicket.seatCode}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Người nhận</span>
                  <span className="font-medium">{order.recipientName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Ngày mua</span>
                  <span className="font-medium text-sm">{formatDate(order.paymentAt)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-dashed">
                  <span className="text-gray-500">Giá vé</span>
                  <span className="font-bold text-primary text-xl">
                    {selectedTicket.price.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Tải xuống
                </Button>
                <Button className="flex-1" onClick={() => setIsTicketModalOpen(false)}>
                  Đóng
                </Button>
              </div>

              <p className="text-xs text-center text-gray-400">
                Vui lòng xuất trình mã QR này khi check-in tại sự kiện
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetailPage;
