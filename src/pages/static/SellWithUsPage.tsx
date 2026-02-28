export default function SellWithUsPage() {
  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/30">
            Bán vé cùng ConcertBooking
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Bán vé cùng chúng tôi
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Từ show nhỏ đến festival, chúng tôi giúp bạn quản lý vé, khách tham dự
            và dữ liệu doanh thu trên một nền tảng duy nhất.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">Lợi ích khi hợp tác</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Tiếp cận cộng đồng người yêu âm nhạc năng động.</li>
              <li>Báo cáo thời gian thực về lượng vé bán ra.</li>
              <li>Hệ thống check-in QR nhanh, hạn chế gian lận vé.</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">Quy trình đăng ký</h2>
            <ol className="list-decimal pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Gửi thông tin sự kiện và nhu cầu qua email kinh doanh.</li>
              <li>Đội ngũ ConcertBooking tư vấn gói giải pháp phù hợp.</li>
              <li>Ký kết hợp đồng và triển khai bán vé trên nền tảng.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
