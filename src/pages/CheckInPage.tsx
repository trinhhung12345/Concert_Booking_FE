import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faCheckCircle, 
  faTimesCircle,
  faExclamationTriangle,
  faTicketAlt,
  faHome
} from "@fortawesome/free-solid-svg-icons";
import { orderService } from "@/features/booking/services/orderService";
import { Button } from "@/components/ui/button";

type CheckInStatus = "loading" | "success" | "already_used" | "error";

interface CheckInResult {
  status: CheckInStatus;
  message: string;
}

const CheckInPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [result, setResult] = useState<CheckInResult>({
    status: "loading",
    message: "Đang xác thực vé...",
  });

  useEffect(() => {
    const performCheckIn = async () => {
      if (!token) {
        setResult({
          status: "error",
          message: "Không tìm thấy mã vé. Vui lòng quét lại QR code.",
        });
        return;
      }

      try {
        const response = await orderService.checkIn(token);

        if (response.code === 200) {
          setResult({
            status: "success",
            message: response.data?.message || "Check-in thành công! Chào mừng bạn đến sự kiện.",
          });
        } else if (response.code === 400) {
          // Vé đã được sử dụng
          setResult({
            status: "already_used",
            message: response.message || "Vé này đã được sử dụng trước đó.",
          });
        } else {
          setResult({
            status: "error",
            message: response.message || "Có lỗi xảy ra. Vui lòng thử lại.",
          });
        }
      } catch (err: any) {
        console.error("Check-in error:", err);
        
        // Xử lý các loại lỗi từ API
        const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi check-in.";
        const errorCode = err.response?.status;

        if (errorCode === 400 || errorMessage.toLowerCase().includes("đã sử dụng") || errorMessage.toLowerCase().includes("already")) {
          setResult({
            status: "already_used",
            message: errorMessage,
          });
        } else {
          setResult({
            status: "error",
            message: errorMessage,
          });
        }
      }
    };

    performCheckIn();
  }, [token]);

  const getStatusConfig = () => {
    switch (result.status) {
      case "loading":
        return {
          icon: faSpinner,
          iconClass: "text-primary animate-spin",
          bgClass: "bg-gradient-to-br from-primary/10 to-pink-500/10",
          borderClass: "border-primary/20",
        };
      case "success":
        return {
          icon: faCheckCircle,
          iconClass: "text-green-500",
          bgClass: "bg-gradient-to-br from-green-50 to-emerald-100",
          borderClass: "border-green-200",
        };
      case "already_used":
        return {
          icon: faExclamationTriangle,
          iconClass: "text-orange-500",
          bgClass: "bg-gradient-to-br from-orange-50 to-amber-100",
          borderClass: "border-orange-200",
        };
      case "error":
        return {
          icon: faTimesCircle,
          iconClass: "text-red-500",
          bgClass: "bg-gradient-to-br from-red-50 to-rose-100",
          borderClass: "border-red-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`max-w-md w-full ${config.bgClass} rounded-3xl shadow-xl border-2 ${config.borderClass} overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-pink-600 text-white p-6 text-center">
          <FontAwesomeIcon icon={faTicketAlt} className="text-4xl mb-3" />
          <h1 className="text-2xl font-bold">Check-in Sự kiện</h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              result.status === "loading" ? "bg-primary/10" :
              result.status === "success" ? "bg-green-100" :
              result.status === "already_used" ? "bg-orange-100" :
              "bg-red-100"
            }`}>
              <FontAwesomeIcon 
                icon={config.icon} 
                className={`text-5xl ${config.iconClass}`}
              />
            </div>
          </div>

          {/* Status Title */}
          <h2 className={`text-2xl font-bold mb-3 ${
            result.status === "loading" ? "text-gray-700" :
            result.status === "success" ? "text-green-600" :
            result.status === "already_used" ? "text-orange-600" :
            "text-red-600"
          }`}>
            {result.status === "loading" && "Đang xử lý..."}
            {result.status === "success" && "Check-in Thành Công!"}
            {result.status === "already_used" && "Vé Đã Sử Dụng"}
            {result.status === "error" && "Check-in Thất Bại"}
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {result.message}
          </p>

          {/* Success animation */}
          {result.status === "success" && (
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Vé đã được xác nhận
              </div>
            </div>
          )}

          {/* Token info (for debugging) */}
          {token && result.status !== "loading" && (
            <div className="mb-6 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Mã vé:</p>
              <p className="text-sm font-mono text-gray-600 break-all">
                {token.substring(0, 20)}...
              </p>
            </div>
          )}

          {/* Actions */}
          {result.status !== "loading" && (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/")} 
                className="w-full h-12"
                variant={result.status === "success" ? "default" : "outline"}
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Về trang chủ
              </Button>
              
              {result.status === "error" && (
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="w-full h-12"
                >
                  Thử lại
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-400">
            TixCon - Hệ thống đặt vé sự kiện
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
