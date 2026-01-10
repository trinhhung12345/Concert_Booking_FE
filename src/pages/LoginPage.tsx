import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/components/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";
import ErrorDialog from "../features/auth/components/ErrorDialog";
import { authService } from "../features/auth/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
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
      const res = await authService.login(data.email, data.password);

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
          message: res.message || "Đăng nhập thất bại",
          code: res.code
        });
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setErrorDialog({
        isOpen: true,
        message: error.response?.data?.message || "Sai email hoặc mật khẩu",
        code: error.response?.status || 401
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Welcome back"
        subtitle="Discover millions of concert, get alerts about your favorite artists, teams, plays and more."
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
    </>
  );
}
