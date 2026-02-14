export default function TermsPage() {
  return (
    <div className="w-full text-slate-100">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/30">
            Phiên bản 1.0 - Cập nhật gần nhất: 02/2026
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Điều khoản sử dụng
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Khi sử dụng ConcertBooking, bạn đồng ý tuân thủ các điều khoản dưới đây nhằm
            đảm bảo trải nghiệm đặt vé công bằng, minh bạch và an toàn cho tất cả người dùng.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">1. Phạm vi áp dụng</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Điều khoản này áp dụng cho mọi hoạt động trên nền tảng, bao gồm nhưng không
              giới hạn ở việc tạo tài khoản, tìm kiếm sự kiện, đặt vé, thanh toán và sử dụng
              vé điện tử tại điểm check-in.
            </p>
          </section>

          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">2. Tài khoản và bảo mật</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 text-sm">
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
              <li>Không chia sẻ tài khoản cho người khác sử dụng với mục đích trục lợi.</li>
              <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.</li>
            </ul>
          </section>

          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">3. Hành vi bị cấm</h2>
            <p className="text-slate-300 text-sm mb-2">
              Để bảo vệ cộng đồng, bạn không được thực hiện các hành vi sau:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 text-sm">
              <li>Mua đi bán lại vé với mục đích đầu cơ, trục lợi.</li>
              <li>Sử dụng thông tin thanh toán giả mạo hoặc không thuộc quyền sở hữu.</li>
              <li>Tấn công, can thiệp hệ thống hoặc thu thập dữ liệu trái phép.</li>
            </ul>
          </section>

          <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">4. Thay đổi điều khoản</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              ConcertBooking có thể cập nhật điều khoản để phù hợp với quy định pháp luật
              và chính sách vận hành. Mọi thay đổi quan trọng sẽ được thông báo trên nền tảng
              trước khi áp dụng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
