import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/components/AuthLayout";
import RegisterForm from "../features/auth/components/RegisterForm";
import OtpModal from "../features/auth/components/OtpModal";
import { authService } from "../features/auth/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const [showOtp, setShowOtp] = useState(false);
  const [tempFormData, setTempFormData] = useState<any>(null); // Lưu tạm data form để đợi OTP
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Bước 1: Xử lý khi user bấm nút Register ở Form
  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      // Gọi API gửi OTP
      console.log("Sending OTP to:", formData.email);
      const res = await authService.sendOtp(formData.email, formData.phone);

      if (res.code === 200) {
        // Nếu gửi thành công -> Lưu tạm dữ liệu và mở Modal nhập OTP
        setTempFormData(formData);
        setShowOtp(true);
        console.log("OTP sent successfully");
      } else {
        console.error("Failed to send OTP:", res.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Server connection error:", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 2: Xử lý khi user nhập xong OTP và bấm Verify
  const handleVerifyOtp = async (otp: string) => {
    if (!tempFormData) return;

    try {
      console.log("Verifying OTP & Registering...");
      // Gọi API Đăng ký chính thức
      const res = await authService.register(tempFormData, otp);

      if (res.code === 200) {
        // Đăng ký thành công -> Lưu Token vào Store
        const { accessToken, ...userData } = res.data;
        login(accessToken, userData as any);

        console.log("Registration successful");
        setShowOtp(false);
        navigate("/"); // Chuyển hướng về trang chủ
      } else {
        console.error("Registration failed:", res.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("OTP verification/registration error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <AuthLayout
        title="Join Us"
        subtitle="Create an account to start booking your favorite concerts today. Simple, fast and secure."
        isLogin={false}
      >
        {/* Truyền hàm xử lý xuống Form */}
        <RegisterForm onSubmitAPI={handleFormSubmit} isSubmittingAPI={isLoading} />
      </AuthLayout>

      <OtpModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleVerifyOtp}
        email={tempFormData?.email || ""}
      />
    </>
  );
}
