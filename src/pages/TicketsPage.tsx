import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faTicketAlt, 
  faQrcode,
  faCalendarAlt,
  faChair,
  faDownload,
  faFilter,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faChevronRight,
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

type FilterStatus = "ALL" | "PAID" | "UNPAID" | "CANCELLED";

const TicketsPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  
  // State cho việc xem chi tiết order
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<OrderDetail | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

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

  // Xem chi tiết vé trong modal
  const handleViewTicket = (ticket: OrderDetail) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  // Tính toán stats
  const paidOrders = orders.filter(o => o.status === "PAID");
  const unpaidOrders = orders.filter(o => o.status === "UNPAID");
  const totalTickets = orders.reduce((acc, o) => acc + o.totalQuantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
          <p className="text-gray-500">Đang tải vé của bạn...</p>
        </div>
      </div>
    );
  }

  // Nếu đang xem chi tiết một order
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-pink-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <button 
              onClick={() => setSelectedOrder(null)}
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
              Mã đơn: <span className="font-bold text-white">{selectedOrder.code}</span>
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Order Info Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedOrder.code}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.status === "PAID" 
                    ? `Thanh toán lúc: ${formatDate(selectedOrder.paymentAt)}`
                    : "Chưa thanh toán"
                  }
                </p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Thông tin người nhận */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-gray-400 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Người nhận</p>
                  <p className="font-medium">{selectedOrder.recipientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{selectedOrder.recipientPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedOrder.recipientEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 w-4" />
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ</p>
                  <p className="font-medium">{selectedOrder.recipientAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách vé trong order */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                Danh sách vé ({selectedOrder.orderDetails.length})
              </h3>
            </div>
            
            <div className="divide-y">
              {selectedOrder.orderDetails.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Ticket icon */}
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        selectedOrder.status === "PAID" 
                          ? "bg-gradient-to-br from-primary to-pink-500" 
                          : selectedOrder.status === "UNPAID"
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
                          Giá gốc: {ticket.originalPrice.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="font-bold text-primary text-xl">
                          {ticket.price.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                      
                      {selectedOrder.status === "PAID" && (
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
                <span className="text-gray-600">Tổng cộng ({selectedOrder.totalQuantity} vé)</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedOrder.totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </div>

          {/* Nút thanh toán nếu chưa thanh toán */}
          {selectedOrder.status === "UNPAID" && (
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

            {selectedTicket && (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faQrcode} className="text-5xl text-gray-400 mb-2" />
                      <p className="text-xs text-gray-400">Mã QR Check-in</p>
                      <p className="text-xs font-mono mt-1 text-primary">{selectedOrder.code}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-dashed">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-bold text-primary">{selectedOrder.code}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Mã ghế</span>
                    <span className="font-bold text-xl">{selectedTicket.seatCode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Người nhận</span>
                    <span className="font-medium">{selectedOrder.recipientName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Ngày mua</span>
                    <span className="font-medium text-sm">{formatDate(selectedOrder.paymentAt)}</span>
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
  }

  // Trang danh sách orders
  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FontAwesomeIcon icon={faTicketAlt} className="text-7xl text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-3">Chưa có đơn hàng nào</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
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
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold text-primary">{orders.length}</div>
                <div className="text-gray-500 text-sm">Tổng đơn hàng</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold text-blue-600">{totalTickets}</div>
                <div className="text-gray-500 text-sm">Tổng số vé</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold text-green-600">{paidOrders.length}</div>
                <div className="text-gray-500 text-sm">Đơn đã thanh toán</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold text-orange-500">{unpaidOrders.length}</div>
                <div className="text-gray-500 text-sm">Đơn chờ thanh toán</div>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-500 flex items-center gap-2">
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
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-400">Không có đơn hàng nào trong danh mục này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer ${
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
                            <h3 className="font-bold text-lg">{order.code}</h3>
                            <p className="text-sm text-gray-500">
                              {order.totalQuantity} vé • {formatDate(order.paymentAt || order.paymentAt)}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {order.orderDetails.slice(0, 3).map((detail) => (
                                <span 
                                  key={detail.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs font-medium"
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