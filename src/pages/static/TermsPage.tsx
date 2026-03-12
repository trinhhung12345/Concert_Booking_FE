import { useLanguageStore } from "@/store/useLanguageStore";

export default function TermsPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";

  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/30">
            {isVi
                ? "Phiên bản 1.0 - Cập nhật gần nhất: 02/2026"
                : "Version 1.0 - Last updated: 02/2026"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {isVi ? "Điều khoản sử dụng" : "Terms of use"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            {isVi
              ? "Khi sử dụng ConcertBooking, bạn đồng ý tuân thủ các điều khoản dưới đây nhằm đảm bảo trải nghiệm đặt vé công bằng, minh bạch và an toàn cho tất cả người dùng."
              : "By using ConcertBooking, you agree to the terms below to ensure a fair, transparent and safe ticket‑booking experience for all users."}
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "1. Phạm vi áp dụng" : "1. Scope of application"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "Điều khoản này áp dụng cho mọi hoạt động trên nền tảng, bao gồm nhưng không giới hạn ở việc tạo tài khoản, tìm kiếm sự kiện, đặt vé, thanh toán và sử dụng vé điện tử tại điểm check-in."
                : "These terms apply to all activities on the platform, including but not limited to creating an account, searching for events, booking tickets, making payments and using e‑tickets at check‑in."}
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "2. Tài khoản và bảo mật" : "2. Account and security"}
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>
                {isVi
                  ? "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình."
                  : "You are responsible for keeping your login information secure."}
              </li>
              <li>
                {isVi
                  ? "Không chia sẻ tài khoản cho người khác sử dụng với mục đích trục lợi."
                  : "Do not share your account for abuse or profiteering purposes."}
              </li>
              <li>
                {isVi
                  ? "Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép."
                  : "Notify us immediately if you detect any unauthorized access."}
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "3. Hành vi bị cấm" : "3. Prohibited actions"}
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              {isVi
                ? "Để bảo vệ cộng đồng, bạn không được thực hiện các hành vi sau:"
                : "To protect the community, you must not engage in the following actions:"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>
                {isVi
                  ? "Mua đi bán lại vé với mục đích đầu cơ, trục lợi."
                  : "Reselling tickets for speculation or profiteering."}
              </li>
              <li>
                {isVi
                  ? "Sử dụng thông tin thanh toán giả mạo hoặc không thuộc quyền sở hữu."
                  : "Using fake payment information or information that does not belong to you."}
              </li>
              <li>
                {isVi
                  ? "Tấn công, can thiệp hệ thống hoặc thu thập dữ liệu trái phép."
                  : "Attacking or interfering with the system, or collecting data illegally."}
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "4. Thay đổi điều khoản" : "4. Changes to the terms"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "ConcertBooking có thể cập nhật điều khoản để phù hợp với quy định pháp luật và chính sách vận hành. Mọi thay đổi quan trọng sẽ được thông báo trên nền tảng trước khi áp dụng."
                : "ConcertBooking may update these terms to comply with laws and operational policies. Any important changes will be announced on the platform before they take effect."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
