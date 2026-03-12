import { useLanguageStore } from "@/store/useLanguageStore";

export default function SupportPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";

  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-medium border border-violet-500/30">
            {isVi ? "Trung tâm hỗ trợ" : "Help center"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {isVi ? "Hỗ trợ & Câu hỏi thường gặp" : "Support & FAQs"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            {isVi
              ? "Nếu bạn gặp khó khăn khi đặt vé, thanh toán hoặc check-in, hãy tham khảo các câu hỏi thường gặp bên dưới trước khi liên hệ với chúng tôi."
              : "If you have issues with booking, payment or check‑in, please see the frequently asked questions below before contacting us."}
          </p>
        </header>

        <div className="space-y-4">
          <details className="group bg-card border border-border rounded-2xl p-5">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">
                {isVi
                  ? "Tôi chưa nhận được vé sau khi thanh toán?"
                  : "I haven’t received my tickets after payment?"}
              </span>
              <span className="text-xs text-muted-foreground group-open:hidden">
                {isVi ? "Hiện câu trả lời" : "Show answer"}
              </span>
              <span className="text-xs text-muted-foreground hidden group-open:inline">
                {isVi ? "Ẩn câu trả lời" : "Hide answer"}
              </span>
            </summary>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "Vé điện tử thường được gửi trong vòng vài phút sau khi thanh toán thành công tới email đăng ký và mục \"Đơn hàng của tôi\" trên hệ thống. Nếu quá 15 phút vẫn chưa nhận được, vui lòng kiểm tra thư mục Spam hoặc liên hệ hotline 1900 6408."
                : "E‑tickets are usually sent within a few minutes after successful payment to your registered email and the \"My orders\" section. If you still don’t receive them after 15 minutes, please check your spam folder or contact the hotline 1900 6408."}
            </p>
          </details>

          <details className="group bg-card border border-border rounded-2xl p-5">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-foreground">
                {isVi
                  ? "Tôi có thể đổi tên người tham dự không?"
                  : "Can I change the attendee’s name?"}
              </span>
              <span className="text-xs text-muted-foreground group-open:hidden">
                {isVi ? "Hiện câu trả lời" : "Show answer"}
              </span>
              <span className="text-xs text-muted-foreground hidden group-open:inline">
                {isVi ? "Ẩn câu trả lời" : "Hide answer"}
              </span>
            </summary>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "Một số sự kiện cho phép đổi tên khách tham dự trước thời gian diễn ra. Quy định cụ thể phụ thuộc vào từng nhà tổ chức. Vui lòng xem ghi chú trong trang sự kiện hoặc liên hệ bộ phận hỗ trợ để được kiểm tra."
                : "Some events allow changing the attendee’s name before the show time. The specific rules depend on each organizer. Please check the notes on the event page or contact our support team for confirmation."}
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
