import { useLanguageStore } from "@/store/useLanguageStore";

export default function PrivacyPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";

  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-medium border border-sky-500/30">
            {isVi ? "Bảo mật dữ liệu khách hàng" : "Protecting customer data"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {isVi ? "Chính sách bảo mật" : "Privacy policy"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            {isVi
              ? "Chúng tôi tôn trọng quyền riêng tư và cam kết bảo vệ thông tin cá nhân, thông tin thanh toán mà bạn cung cấp khi sử dụng ConcertBooking."
              : "We respect your privacy and are committed to protecting the personal and payment information you provide when using ConcertBooking."}
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "1. Thông tin chúng tôi thu thập" : "1. Information we collect"}
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>
                {isVi
                  ? "Thông tin liên hệ: họ tên, email, số điện thoại."
                  : "Contact information: full name, email, phone number."}
              </li>
              <li>
                {isVi
                  ? "Thông tin giao dịch: lịch sử đặt vé, phương thức thanh toán."
                  : "Transaction information: booking history, payment methods."}
              </li>
              <li>
                {isVi
                  ? "Thông tin kỹ thuật: địa chỉ IP, loại thiết bị, trình duyệt."
                  : "Technical information: IP address, device type, browser."}
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "2. Mục đích sử dụng" : "2. Purposes of use"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              {isVi ? "Dữ liệu được sử dụng để:" : "Your data is used to:"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>
                {isVi
                  ? "Xử lý đơn hàng, gửi vé điện tử và hóa đơn."
                  : "Process orders, send e‑tickets and invoices."}
              </li>
              <li>
                {isVi
                  ? "Hỗ trợ khách hàng khi có khiếu nại, thắc mắc."
                  : "Support customers when there are complaints or questions."}
              </li>
              <li>
                {isVi
                  ? "Gửi thông báo về thay đổi sự kiện, khuyến mãi (khi bạn đồng ý)."
                  : "Send notifications about event changes and promotions (where you agree)."}
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "3. Bảo mật thanh toán" : "3. Payment security"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "Thông tin thẻ không được lưu trực tiếp trên hệ thống của ConcertBooking mà được xử lý thông qua các cổng thanh toán đạt chuẩn PCI-DSS. Chúng tôi chỉ lưu các mã tham chiếu giao dịch phục vụ đối soát và hỗ trợ khách hàng."
                : "Card information is not stored directly on ConcertBooking’s systems. It is processed through PCI‑DSS compliant payment gateways. We only store transaction reference codes for reconciliation and customer support."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
