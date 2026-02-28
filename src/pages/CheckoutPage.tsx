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
import OrderTimer from "@/features/booking/components/OrderTimer";

interface TicketSelection {
  ticketTypeId: number;
  name: string;
  price: number;
  quantity: number;
}

interface LocationState {
  selectedSeats?: Seat[];
  ticketSelections?: TicketSelection[];
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

  const selectedSeats = state?.selectedSeats || [];
  const ticketSelections = state?.ticketSelections || [];

  const hasSeatMode = selectedSeats.length > 0;
  const hasTicketMode = !hasSeatMode && ticketSelections.length > 0;

  useEffect(() => {
    if (!state || (!hasSeatMode && !hasTicketMode)) {
      navigate("/");
    }
  }, [state, hasSeatMode, hasTicketMode, navigate]);

  if (!state || (!hasSeatMode && !hasTicketMode)) return null;

  const { eventName } = state;

  const totalAmount = hasSeatMode
    ? selectedSeats.reduce((acc, seat) => acc + (seat.price || 0), 0)
    : ticketSelections.reduce((acc, t) => acc + t.price * t.quantity, 0);

  const handleCreateOrder = async () => {
    if (!recipientName.trim() || !recipientPhone.trim() || !recipientEmail.trim() || !recipientAddress.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (hasTicketMode) {
      const nonZeroSelections = ticketSelections.filter((t) => t.quantity > 0);

      if (nonZeroSelections.length === 0) {
        setError("Vui lòng chọn ít nhất một vé");
        return;
      }

      if (nonZeroSelections.length > 1) {
        setError("Hiện tại mỗi đơn chỉ hỗ trợ một loại vé. Vui lòng chỉ chọn một loại vé.");
        return;
      }
    }

    setError(null);
    setIsCreatingOrder(true);

    try {
      const payload: any = {
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        recipientEmail: recipientEmail.trim(),
        recipientAddress: recipientAddress.trim(),
      };

      if (hasSeatMode) {
        payload.seatIds = selectedSeats.map((seat) => seat.id);
      } else if (hasTicketMode) {
        const nonZeroSelections = ticketSelections.filter((t) => t.quantity > 0);
        const selected = nonZeroSelections[0];
        payload.ticketTypeId = selected.ticketTypeId;
        payload.quantity = selected.quantity;
      }

      const response = await orderService.createOrder(payload);

      // Handle response format: could be object directly or { code, data, message }
      const orderData = response?.data || response;
      
      if (orderData && orderData.id) {
        setCreatedOrder(orderData);
      } else {
        setError(response?.message || "Có lỗi xảy ra");
      }
    } catch (err: any) {
      console.error("Create order error:", err);
      setError(err.message || "Không thể tạo đơn hàng");
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
      
      // Handle response format: could be { code, message, data } or direct object
      const checkoutData = response?.data || response;
      
      if (checkoutData?.message || response?.message) {
        // Xóa thông tin order trên FE trước khi chuyển sang PayOS
        setCreatedOrder(null);
        window.location.href = checkoutData?.message || response?.message;
      } else {
        setError("Không thể lấy link thanh toán");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Không thể thanh toán");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="bg-background min-h-screen w-full text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <div>
            <h1 className="font-bold text-xl text-foreground">Xác nhận đặt vé</h1>
            <p className="text-sm text-muted-foreground">{eventName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">
            {/* Vé đã chọn */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                <FontAwesomeIcon icon={faTicketAlt} className="text-primary" />
                Vé đã chọn (
                {hasSeatMode
                  ? selectedSeats.length
                  : ticketSelections.reduce((sum, t) => sum + t.quantity, 0)}
                )
              </h2>

              <div className="space-y-3">
                {hasSeatMode &&
                  selectedSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <span className="font-bold text-foreground">{seat.code}</span>
                        <span className="text-muted-foreground text-sm ml-2">
                          {seat.ticketTypeId}
                        </span>
                      </div>
                      <span className="font-semibold text-primary">
                        {(seat.price || 0).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  ))}

                {hasTicketMode &&
                  ticketSelections.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <span className="font-bold text-foreground">{t.name}</span>
                        <span className="text-muted-foreground text-sm ml-2">
                          x{t.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-primary">
                        {(t.price * t.quantity).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Form người nhận */}
            {!createdOrder && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
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
                      <Label className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <FontAwesomeIcon icon={icon} className="text-muted-foreground text-sm" />
                        {label} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="bg-muted border-border text-foreground placeholder-muted-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
              <h2 className="font-bold text-lg mb-4 text-foreground">Tổng thanh toán</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Số lượng vé</span>
                  <span>
                    {hasSeatMode
                      ? selectedSeats.length
                      : ticketSelections.reduce((sum, t) => sum + t.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{totalAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>

              <div className="border-t border-border my-4"></div>

              <div className="flex justify-between text-lg font-bold mb-6 text-foreground">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {(createdOrder?.totalAmount || totalAmount).toLocaleString("vi-VN")} đ
                </span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              {createdOrder && createdOrder.status === "UNPAID" && createdOrder.createdAt && (
                <div className="mb-4">
                  <OrderTimer 
                    createdAt={createdOrder.createdAt} 
                    variant="block"
                    size="lg"
                    onExpired={() => {
                      setCreatedOrder({ ...createdOrder, status: "CANCELLED" });
                      setError("Đơn hàng đã bị hủy do hết thời gian thanh toán. Vui lòng đặt lại vé.");
                    }}
                  />
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
              ) : createdOrder.status === "CANCELLED" ? (
                <Button
                  className="w-full h-12 text-lg font-bold"
                  onClick={() => navigate(-1)}
                >
                  Quay lại đặt vé
                </Button>
              ) : (
                <Button
                  className="w-full h-12 text-lg font-bold bg-pink-600 hover:bg-pink-700"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Thanh toán ngay
                </Button>
              )}

              <p className="text-xs text-muted-foreground text-center mt-4">
                Bằng việc đặt vé, bạn đồng ý với Điều khoản sử dụng của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
