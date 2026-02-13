export default function SupportPage() {
  return (
    <div className="w-full text-slate-100">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-medium border border-violet-500/30">
            Trung tâm hỗ trợ
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Hỗ trợ &amp; Câu hỏi thường gặp
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Nếu bạn gặp khó khăn khi đặt vé, thanh toán hoặc check-in, hãy tham khảo
            các câu hỏi thường gặp bên dưới trước khi liên hệ với chúng tôi.
          </p>
        </header>

        <div className="space-y-4">
          <details className="group bg-gray-800/70 border border-slate-700 rounded-2xl p-5">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-white">
                Tôi chưa nhận được vé sau khi thanh toán?
              </span>
              <span className="text-xs text-slate-400 group-open:hidden">Hiện câu trả lời</span>
              <span className="text-xs text-slate-400 hidden group-open:inline">Ẩn câu trả lời</span>
            </summary>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Vé điện tử thường được gửi trong vòng vài phút sau khi thanh toán thành công
              tới email đăng ký và mục "Đơn hàng của tôi" trên hệ thống. Nếu quá 15 phút
              vẫn chưa nhận được, vui lòng kiểm tra thư mục Spam hoặc liên hệ hotline 1900 6408.
            </p>
          </details>

          <details className="group bg-gray-800/70 border border-slate-700 rounded-2xl p-5">
            <summary className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-white">
                Tôi có thể đổi tên người tham dự không?
              </span>
              <span className="text-xs text-slate-400 group-open:hidden">Hiện câu trả lời</span>
              <span className="text-xs text-slate-400 hidden group-open:inline">Ẩn câu trả lời</span>
            </summary>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Một số sự kiện cho phép đổi tên khách tham dự trước thời gian diễn ra. Quy định
              cụ thể phụ thuộc vào từng nhà tổ chức. Vui lòng xem ghi chú trong trang sự kiện
              hoặc liên hệ bộ phận hỗ trợ để được kiểm tra.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
