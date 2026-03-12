import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/components/AuthLayout";
import RegisterForm from "../features/auth/components/RegisterForm";
import OtpModal from "../features/auth/components/OtpModal";
import ErrorDialog from "../features/auth/components/ErrorDialog";
import { authService, type SendOtpResponse, type RegisterResponse } from "../features/auth/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function RegisterPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";
  const [showOtp, setShowOtp] = useState(false);
  const [tempFormData, setTempFormData] = useState<any>(null); // Lưu tạm data form để đợi OTP
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    message: "",
    code: undefined as number | undefined
  });

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Bước 1: Xử lý khi user bấm nút Register ở Form
  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      // Gọi API gửi OTP
      console.log("Sending OTP to:", formData.email);
      const res = await authService.sendOtp(formData.email, formData.phone) as SendOtpResponse;
      console.log("Send OTP response:", res);

      if (res.code === 200) {
        // Nếu gửi thành công -> Lưu tạm dữ liệu và mở Modal nhập OTP
        setTempFormData(formData);
        setShowOtp(true);
        console.log("OTP sent successfully");
      } else {
        setErrorDialog({
          isOpen: true,
          message: res.message || (isVi ? "Không thể gửi mã OTP" : "Unable to send OTP"),
          code: res.code
        });
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      setErrorDialog({
        isOpen: true,
        message: error.message || (isVi ? "Lỗi kết nối máy chủ. Vui lòng thử lại." : "Server connection error. Please try again."),
        code: error.code
      });
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
      const res = await authService.register(tempFormData, otp) as RegisterResponse;
      console.log("Register response:", res);

      if (res.code === 200) {
        // Đăng ký thành công -> Lưu Token vào Store
        const { accessToken, ...userData } = res.data;
        login(accessToken, userData as any);

        // Lưu thông tin user vào localStorage để kiểm tra trùng lặp
        try {
          const storedUsers = localStorage.getItem('registered_users');
          const users = storedUsers ? JSON.parse(storedUsers) : [];
          users.push({
            fullName: tempFormData.fullName,
            phone: tempFormData.phone,
            email: tempFormData.email,
            registeredAt: new Date().toISOString()
          });
          localStorage.setItem('registered_users', JSON.stringify(users));
        } catch (error) {
          console.warn("Could not save user data to localStorage:", error);
        }

        console.log("Registration successful");
        setShowOtp(false);
        navigate("/"); // Chuyển hướng về trang chủ
      } else {
        setErrorDialog({
          isOpen: true,
          message: res.message || (isVi ? "Đăng ký thất bại" : "Registration failed"),
          code: res.code
        });
      }
    } catch (error: any) {
      console.error("Register error:", error);
      setErrorDialog({
        isOpen: true,
        message: error.message || (isVi ? "Mã OTP không đúng hoặc đã hết hạn" : "OTP is invalid or has expired"),
        code: error.code
      });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full">
      <AuthLayout
        title={isVi ? "Tham gia cùng chúng tôi" : "Join Us"}
        subtitle={
          isVi
            ? "Tạo tài khoản để bắt đầu đặt vé cho những buổi hòa nhạc yêu thích của bạn. Nhanh chóng, đơn giản và bảo mật."
            : "Create an account to start booking your favorite concerts today. Simple, fast and secure."
        }
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

      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ isOpen: false, message: "", code: undefined })}
        message={errorDialog.message}
        code={errorDialog.code}
      />
    </div>
  );
}
