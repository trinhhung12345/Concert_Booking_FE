import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/components/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";
import ErrorDialog from "../features/auth/components/ErrorDialog";
import { authService, type LoginResponse } from "../features/auth/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function LoginPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    message: "",
    code: undefined as number | undefined
  });
  const navigate = useNavigate();
  const loginToStore = useAuthStore((state) => state.login); // Hàm login của Zustand

  const handleLoginSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log("Submitting Login:", data.email);

      // 1. Gọi API
      const res = await authService.login(data.email, data.password) as LoginResponse;
      console.log("Login response:", res);

      // 2. Kiểm tra kết quả trả về
      if (res.code === 200) {
        // Tách accessToken và thông tin User từ response data
        const { accessToken, ...userInfo } = res.data;

        // 3. Lưu vào Store (Zustand sẽ tự lưu xuống localStorage)
        loginToStore(accessToken, userInfo);

        console.log("Login successful");
        // 4. Chuyển hướng về trang chủ
        navigate("/");
      } else {
        setErrorDialog({
          isOpen: true,
          message: res.message || (isVi ? "Đăng nhập thất bại" : "Login failed"),
          code: res.code
        });
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setErrorDialog({
        isOpen: true,
        message: error.message || (isVi ? "Sai email hoặc mật khẩu" : "Incorrect email or password"),
        code: error.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full">
      <AuthLayout
        title={isVi ? "Chào mừng trở lại!" : "Welcome back!"}
        subtitle={
          isVi
            ? "Khám phá hàng triệu buổi hòa nhạc, nhận thông báo về các nghệ sĩ, vở kịch yêu thích của bạn và nhiều hơn thế nữa."
            : "Discover concerts, get notified about your favorite artists and shows, and much more."
        }
        isLogin={true}
      >
        {/* Truyền hàm xử lý và trạng thái loading xuống Form */}
        <LoginForm onSubmitAPI={handleLoginSubmit} isLoading={isLoading} />
      </AuthLayout>

      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ isOpen: false, message: "", code: undefined })}
        message={errorDialog.message}
        code={errorDialog.code}
      />
    </div>
  );
}
