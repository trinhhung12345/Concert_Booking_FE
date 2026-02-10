export default function MarketingSolutionsPage() {
  return (
    <div className="w-full text-slate-100">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-medium border border-pink-500/30">
            Tăng trưởng doanh thu vé
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Giải pháp marketing
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Kết hợp dữ liệu đặt vé và kênh truyền thông để đưa sự kiện của bạn đến đúng khán giả.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">1. Kênh truyền thông</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Chúng tôi hỗ trợ truyền thông qua email marketing, thông báo trong ứng dụng,
              mạng xã hội và các vị trí nổi bật trên nền tảng ConcertBooking.
            </p>
          </section>

          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">2. Chiến dịch tùy chỉnh</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tuỳ theo quy mô và đối tượng sự kiện, đội ngũ marketing sẽ đề xuất gói chiến dịch
              phù hợp với ngân sách và mục tiêu doanh thu của bạn.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
