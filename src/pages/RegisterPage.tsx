import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/components/AuthLayout";
import RegisterForm from "../features/auth/components/RegisterForm";
import OtpModal from "../features/auth/components/OtpModal";
import ErrorDialog from "../features/auth/components/ErrorDialog";
import { authService } from "../features/auth/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
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
      const res = await authService.sendOtp(formData.email, formData.phone);

      if (res.code === 200) {
        // Nếu gửi thành công -> Lưu tạm dữ liệu và mở Modal nhập OTP
        setTempFormData(formData);
        setShowOtp(true);
        console.log("OTP sent successfully");
      } else {
        setErrorDialog({
          isOpen: true,
          message: res.message || "Không thể gửi mã OTP",
          code: res.code
        });
      }
    } catch (error: any) {
      setErrorDialog({
        isOpen: true,
        message: error.response?.data?.message || "Lỗi kết nối máy chủ. Vui lòng thử lại.",
        code: error.response?.status || 500
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
      const res = await authService.register(tempFormData, otp);

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
          message: res.message || "Đăng ký thất bại",
          code: res.code
        });
      }
    } catch (error: any) {
      setErrorDialog({
        isOpen: true,
        message: error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn",
        code: error.response?.status || 400
      });
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

      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ isOpen: false, message: "", code: undefined })}
        message={errorDialog.message}
        code={errorDialog.code}
      />
    </>
  );
}
