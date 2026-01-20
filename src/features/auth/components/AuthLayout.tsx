import { type ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  isLogin?: boolean; // Để switch link đăng ký/đăng nhập
}

export default function AuthLayout({ children, title, subtitle, isLogin = true }: AuthLayoutProps) {
  // Đảm bảo trang auth luôn dùng light theme
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <>
      {/* ===== MOBILE LAYOUT (< lg) ===== */}
      <div className="lg:hidden min-h-screen w-full font-sans relative overflow-auto">
        {/* Background Image - Full screen fixed */}
        <div className="fixed inset-0 bg-neutral-900">
          <div
            className="absolute inset-0 bg-[url('@/assets/images/concert-bg.jfif')]
            bg-cover bg-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>

        {/* Content Container - Scrollable */}
        <div className="relative z-10 min-h-screen flex flex-col px-5 py-8">
          {/* Hero Text - Top */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              {subtitle}
            </p>
            {/* Pink underline */}
            <div className="h-1 w-40 bg-primary mt-3 rounded-full"></div>
          </div>

          {/* Form Card - Floating on hero */}
          <div className="flex-1 flex items-start">
            <div className="w-full bg-white rounded-2xl px-5 py-5 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="mb-3">
              <h2 className="text-xl font-bold text-gray-900">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </h2>
              </div>

              {/* Form content - compact */}
              {children}

              {/* Link switch trang - Bottom */}
              <p className="text-sm text-gray-500 text-center mt-5">
                {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                <Link
                  to={isLogin ? "/register" : "/login"}
                  className="font-semibold text-primary hover:underline"
                >
                  {isLogin ? "Tạo tài khoản" : "Đăng nhập tại đây"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT (>= lg) ===== */}
      <div className="hidden lg:flex min-h-screen w-full font-sans">
        {/* LEFT SIDE (Image & Welcome Text) */}
        <div className="relative w-1/2 bg-neutral-900 flex flex-col justify-center px-20">
          {/* Background Image Overlay */}
          <div
            className="absolute inset-0 bg-[url('@/assets/images/concert-bg.jfif')]
            bg-cover bg-center opacity-50"
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Content trên nền ảnh */}
          <div className="relative z-10 text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-2">
              {title}
            </h1>
            {/* Dấu gạch chân màu hồng */}
            <div className="h-1.5 w-24 bg-primary mb-6 rounded-full"></div>
            <p className="text-lg text-gray-200 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Form Container) */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-50 p-12">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </h2>
              {/* Link switch trang */}
              <p className="text-sm text-gray-500">
                {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                <Link
                  to={isLogin ? "/register" : "/login"}
                  className="font-semibold text-primary hover:underline"
                >
                  {isLogin ? "Tạo tài khoản" : "Đăng nhập tại đây"}
                </Link>
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
}
