export default function OrganizerTermsPage() {
  return (
    <div className="w-full text-slate-100">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 text-xs font-medium border border-fuchsia-500/30">
            Dành cho nhà tổ chức
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Điều khoản dành cho nhà tổ chức
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Các quy định khi hợp tác bán vé và triển khai sự kiện cùng ConcertBooking.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">1. Trách nhiệm cung cấp thông tin</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Nhà tổ chức chịu trách nhiệm về tính chính xác của thông tin sự kiện, giá vé,
              sơ đồ chỗ ngồi, hạng vé và các thông tin khuyến mãi (nếu có).
            </p>
          </section>

          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">2. Đối soát &amp; chia sẻ doanh thu</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tỷ lệ chia sẻ doanh thu, thời gian thanh toán và quy trình đối soát sẽ được
              quy định chi tiết trong hợp đồng hợp tác ký kết giữa hai bên.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
