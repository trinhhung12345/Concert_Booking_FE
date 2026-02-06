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

  const [recipientName, setRecipientName] = useState(user?.name || "");
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || "");
  const [recipientEmail, setRecipientEmail] = useState(user?.email || "");
  const [recipientAddress, setRecipientAddress] = useState("");

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state || !state.selectedSeats || state.selectedSeats.length === 0) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state || !state.selectedSeats) return null;

  const { selectedSeats, eventName } = state;
  const totalAmount = selectedSeats.reduce((acc, seat) => acc + (seat.price || 0), 0);

  const handleCreateOrder = async () => {
    if (!recipientName.trim() || !recipientPhone.trim() || !recipientEmail.trim() || !recipientAddress.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
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
        setError(response.message || "Có lỗi xảy ra");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tạo đơn hàng");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCheckout = async () => {
    if (!createdOrder) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await orderService.checkout({ orderId: createdOrder.id });
      if (response.code === 200 && response.message) {
        window.location.href = response.message;
      } else {
        setError("Không thể lấy link thanh toán");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể thanh toán");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="bg-[#0b1220] min-h-screen w-full text-slate-200">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <div>
            <h1 className="font-bold text-xl text-white">Xác nhận đặt vé</h1>
            <p className="text-sm text-slate-400">{eventName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">
            {/* Vé đã chọn */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                Vé đã chọn ({selectedSeats.length})
              </h2>

              <div className="space-y-3">
                {selectedSeats.map((seat) => (
                  <div key={seat.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <div>
                      <span className="font-bold text-white">{seat.code}</span>
                      <span className="text-slate-400 text-sm ml-2">
                        {seat.ticketTypeId }
                      </span>
                    </div>
                    <span className="font-semibold text-primary">
                      {(seat.price || 0).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form người nhận */}
            {!createdOrder && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                  <FontAwesomeIcon icon={faUser} className="text-primary" />
                  Thông tin người nhận vé
                </h2>

                <div className="space-y-4">
                  {[
                    ["Họ và tên", recipientName, setRecipientName, faUser],
                    ["Số điện thoại", recipientPhone, setRecipientPhone, faPhone],
                    ["Email", recipientEmail, setRecipientEmail, faEnvelope],
                    ["Địa chỉ", recipientAddress, setRecipientAddress, faMapMarkerAlt],
                  ].map(([label, value, setter, icon]: any, i) => (
                    <div key={i}>
                      <Label className="flex items-center gap-2 mb-2 text-slate-300">
                        <FontAwesomeIcon icon={icon} className="text-slate-400 text-sm" />
                        {label} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
              <h2 className="font-bold text-lg mb-4 text-white">Tổng thanh toán</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Số lượng vé</span>
                  <span>{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tạm tính</span>
                  <span>{totalAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>

              <div className="border-t border-slate-600 my-4"></div>

              <div className="flex justify-between text-lg font-bold mb-6 text-white">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {(createdOrder?.totalAmount || totalAmount).toLocaleString("vi-VN")} đ
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {!createdOrder ? (
                <Button className="w-full h-12 text-lg font-bold" onClick={handleCreateOrder} disabled={isCreatingOrder}>
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
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Thanh toán ngay
                </Button>
              )}

              <p className="text-xs text-slate-400 text-center mt-4">
                Bằng việc đặt vé, bạn đồng ý với Điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
