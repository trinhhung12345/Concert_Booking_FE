export default function PrivacyPage() {
  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-medium border border-sky-500/30">
            Bảo mật dữ liệu khách hàng
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Chính sách bảo mật
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Chúng tôi tôn trọng quyền riêng tư và cam kết bảo vệ thông tin cá nhân, thông tin
            thanh toán mà bạn cung cấp khi sử dụng ConcertBooking.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Thông tin chúng tôi thu thập</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Thông tin liên hệ: họ tên, email, số điện thoại.</li>
              <li>Thông tin giao dịch: lịch sử đặt vé, phương thức thanh toán.</li>
              <li>Thông tin kỹ thuật: địa chỉ IP, loại thiết bị, trình duyệt.</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Mục đích sử dụng</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              Dữ liệu được sử dụng để:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Xử lý đơn hàng, gửi vé điện tử và hóa đơn.</li>
              <li>Hỗ trợ khách hàng khi có khiếu nại, thắc mắc.</li>
              <li>Gửi thông báo về thay đổi sự kiện, khuyến mãi (khi bạn đồng ý).</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Bảo mật thanh toán</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thông tin thẻ không được lưu trực tiếp trên hệ thống của ConcertBooking mà
              được xử lý thông qua các cổng thanh toán đạt chuẩn PCI-DSS. Chúng tôi chỉ lưu
              các mã tham chiếu giao dịch phục vụ đối soát và hỗ trợ khách hàng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
