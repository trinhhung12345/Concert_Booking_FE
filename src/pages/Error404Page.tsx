import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Error404Page() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="max-w-3xl w-full text-center space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Oops...</p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight">
            4<span className="text-primary">0</span>4
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-slate-100">
            Trang không tồn tại hoặc bạn không có quyền truy cập.
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Có thể liên kết đã bị thay đổi, sự kiện không còn khả dụng,
            hoặc quyền truy cập của bạn không phù hợp với trang này.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button
            size="lg"
            className="px-8 h-11 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/30"
            onClick={goHome}
          >
            Về trang chủ
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 h-11 rounded-full border-slate-600/70 text-slate-100 hover:bg-slate-800/80 hover:text-white"
            onClick={goBack}
          >
            Quay lại trang trước
          </Button>
        </div>

        <div className="mt-6 text-xs sm:text-sm text-slate-500">
          Nếu bạn nghĩ đây là lỗi phân quyền, hãy liên hệ quản trị viên hệ thống.
        </div>
      </div>
    </div>
  );
}
