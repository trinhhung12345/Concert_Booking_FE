import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faSpinner, 
  faTicketAlt, 
  faUser, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt,
  faCreditCard
} from "@fortawesome/free-solid-svg-icons";
import { orderService } from "@/features/booking/services/orderService";
import type { Seat } from "@/features/booking/types/seatmap";
import type { Order } from "@/features/booking/types/order";
import { useAuthStore } from "@/store/useAuthStore";

interface LocationState {
  selectedSeats: Seat[];
  eventName: string;
  showingId: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const state = location.state as LocationState | null;

  // Form state
  const [recipientName, setRecipientName] = useState(user?.name || "");
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || "");
  const [recipientEmail, setRecipientEmail] = useState(user?.email || "");
  const [recipientAddress, setRecipientAddress] = useState("");

  // Loading states
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate có dữ liệu từ trang đặt vé không
  useEffect(() => {
    if (!state || !state.selectedSeats || state.selectedSeats.length === 0) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state || !state.selectedSeats) {
    return null;
  }

  const { selectedSeats, eventName } = state;

  // Tính tổng tiền
  const totalAmount = selectedSeats.reduce((acc, seat) => acc + (seat.price || 0), 0);

  // Xử lý tạo đơn hàng
  const handleCreateOrder = async () => {
    // Validate form
    if (!recipientName.trim()) {
      setError("Vui lòng nhập họ tên người nhận");
      return;
    }
    if (!recipientPhone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }
    if (!recipientEmail.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!recipientAddress.trim()) {
      setError("Vui lòng nhập địa chỉ");
      return;
    }

    setError(null);
    setIsCreatingOrder(true);

    try {
      const response = await orderService.createOrder({
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        recipientEmail: recipientEmail.trim(),
        recipientAddress: recipientAddress.trim(),
        seatIds: selectedSeats.map((seat) => seat.id),
      });

      if (response.code === 200) {
        setCreatedOrder(response.data);
      } else {
        setError(response.message || "Có lỗi xảy ra khi tạo đơn hàng");
      }
    } catch (err: any) {
      console.error("Lỗi tạo đơn hàng:", err);
      setError(err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Xử lý thanh toán
  const handleCheckout = async () => {
    if (!createdOrder) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await orderService.checkout({
        orderId: createdOrder.id,
      });

      if (response.code === 200 && response.message) {
        // Redirect đến trang thanh toán PayOS
        window.location.href = response.message;
      } else {
        setError("Không thể lấy link thanh toán");
      }
    } catch (err: any) {
      console.error("Lỗi checkout:", err);
      setError(err.response?.data?.message || "Không thể thanh toán. Vui lòng thử lại.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div>
            <h1 className="font-bold text-xl">Xác nhận đặt vé</h1>
            <p className="text-sm text-gray-500">{eventName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cột trái: Form thông tin */}
          <div className="md:col-span-2 space-y-6">
            {/* Thông tin vé đã chọn */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                Vé đã chọn ({selectedSeats.length})
              </h2>
              <div className="space-y-3">
                {selectedSeats.map((seat) => (
                  <div 
                    key={seat.id} 
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-bold">{seat.code}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {seat.type || "Ghế thường"}
                      </span>
                    </div>
                    <span className="font-semibold text-primary">
                      {(seat.price || 0).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form thông tin người nhận */}
            {!createdOrder && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-primary" />
                  Thông tin người nhận vé
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 text-sm" />
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nhập họ và tên"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-sm" />
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Nhập số điện thoại"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-sm" />
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-sm" />
                      Địa chỉ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ nhận vé"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin đơn hàng đã tạo */}
            {createdOrder && (
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-200">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Đơn hàng đã được tạo!
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-bold text-primary">{createdOrder.code}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className={`font-semibold ${
                      createdOrder.status === "PAID" ? "text-green-600" : "text-orange-500"
                    }`}>
                      {createdOrder.status === "PAID" ? "Đã thanh toán" : "Chờ thanh toán"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Người nhận</span>
                    <span className="font-medium">{createdOrder.recipientName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Số điện thoại</span>
                    <span className="font-medium">{createdOrder.recipientPhone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium">{createdOrder.recipientEmail}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Địa chỉ</span>
                    <span className="font-medium text-right max-w-[200px]">{createdOrder.recipientAddress}</span>
                  </div>
                </div>

                {/* Chi tiết vé */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold mb-3">Chi tiết vé</h3>
                  <div className="space-y-2">
                    {createdOrder.orderDetails.map((detail) => (
                      <div key={detail.id} className="flex justify-between text-sm">
                        <span>{detail.seatCode}</span>
                        <span className="font-medium">{detail.price.toLocaleString("vi-VN")} đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Tổng thanh toán */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-4">Tổng thanh toán</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Số lượng vé</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-medium">{totalAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>

              <div className="border-t border-dashed my-4"></div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {(createdOrder?.totalAmount || totalAmount).toLocaleString("vi-VN")} đ
                </span>
              </div>

              {/* Hiển thị lỗi */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Button tạo đơn hoặc thanh toán */}
              {!createdOrder ? (
                <Button 
                  className="w-full h-12 text-lg font-bold"
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận đặt vé"
                  )}
                </Button>
              ) : (
                <Button 
                  className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Đang chuyển hướng...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                      Thanh toán ngay
                    </>
                  )}
                </Button>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                Bằng việc đặt vé, bạn đồng ý với Điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
