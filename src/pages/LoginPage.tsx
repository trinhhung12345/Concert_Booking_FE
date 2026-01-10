import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../features/auth/components/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";
import { authService } from "../features/auth/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
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

        // alert("Đăng nhập thành công!");
        // 4. Chuyển hướng về trang chủ
        navigate("/");
      } else {
        alert(res.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      // Xử lý lỗi từ server (ví dụ 401 Unauthorized)
      alert(error.response?.data?.message || "Sai email hoặc mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Discover millions of concert, get alerts about your favorite artists, teams, plays and more."
      isLogin={true}
    >
      {/* Truyền hàm xử lý và trạng thái loading xuống Form */}
      <LoginForm onSubmitAPI={handleLoginSubmit} isLoading={isLoading} />
    </AuthLayout>
  );
}
