export default function RefundPolicyPage() {
  return (
    <div className="w-full text-slate-100">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/30">
            Minh bạch &amp; rõ ràng
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Chính sách hoàn tiền
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Chính sách hoàn tiền có thể khác nhau giữa các sự kiện, nhưng chúng tôi luôn
            cố gắng bảo vệ quyền lợi chính đáng của khách hàng.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">1. Sự kiện bị hủy</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Nếu sự kiện bị hủy bởi nhà tổ chức, ConcertBooking sẽ phối hợp hoàn tiền
              theo đúng thông báo chính thức. Số tiền sẽ được hoàn qua cùng phương thức
              thanh toán ban đầu trong thời gian sớm nhất có thể.
            </p>
          </section>

          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">2. Thay đổi thời gian hoặc địa điểm</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Khi sự kiện thay đổi thời gian hoặc địa điểm, nhà tổ chức sẽ công bố chính
              sách hỗ trợ cụ thể (đổi vé hoặc hoàn tiền một phần/toàn phần). Chúng tôi sẽ
              thông báo qua email và trong trang đơn hàng của bạn.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
