import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  isLogin?: boolean; // Để switch link đăng ký/đăng nhập
}

export default function AuthLayout({ children, title, subtitle, isLogin = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex font-sans">

      {/* LEFT SIDE (Image & Welcome Text) */}
      {/* Mobile: Hidden / Desktop: Static 1/2 screen */}
      <div className="hidden lg:flex absolute inset-0 lg:static lg:w-1/2 bg-neutral-900 flex-col justify-center px-8 lg:px-20 z-0">

        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411177-334811adbced?q=80&w=2070&auto=format&fit=crop')]
          bg-cover bg-center opacity-60"
        />

        {/* Content trên nền ảnh */}
        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">
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
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center justify-center min-h-screen bg-white lg:bg-gray-50 p-6 lg:p-12">
        {/* Mobile: Full white background / Desktop: Centered on gray background */}
        <div className="w-full max-w-md bg-white rounded-3xl lg:shadow-xl p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-10 lg:slide-in-from-right-10 duration-500">

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isLogin ? "Login" : "Register"}
                </h2>
                {/* Link switch trang */}
                <p className="text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Link
                        to={isLogin ? "/register" : "/login"}
                        className="font-semibold text-primary hover:underline"
                    >
                        {isLogin ? "Make an account" : "Login here"}
                    </Link>
                </p>
            </div>

            {children}
        </div>
      </div>
    </div>
  );
}