export default function PaymentMethodsPage() {
  const bankLogos = [
    { src: "/logo/vietcombank.png", alt: "Vietcombank" },
    { src: "/logo/vpbank.png", alt: "VPBank" },
    { src: "/logo/tpbank.png", alt: "TPBank" },
    { src: "/logo/vietabank.png", alt: "Việt Á Bank" },
  ];

  const walletLogos = [
    { src: "/logo/momo.png", alt: "MoMo" },
    { src: "/logo/zalopay.webp", alt: "ZaloPay" },
    { src: "/logo/vnpay.png", alt: "VNPay" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">

        {/* HEADER */}
        <header className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 text-lime-300 text-xs border border-lime-500/30">
            Thanh toán an toàn
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Phương thức thanh toán
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Hỗ trợ đa dạng hình thức thanh toán, nhanh chóng và bảo mật tuyệt đối.
          </p>
        </header>

        {/* BANKS */}
        <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Ngân hàng đối tác
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {bankLogos.map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center
                           h-16 sm:h-20 md:h-24
                           p-4 rounded-xl
                           bg-gray-900/40
                           hover:scale-105 transition"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-[80%] object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* E-WALLETS */}
        <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Ví điện tử hỗ trợ
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {walletLogos.map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center
                           h-16 sm:h-20 md:h-24
                           p-4 rounded-xl
                           bg-gray-900/40
                           hover:scale-105 transition"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-[80%] object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* NOTES */}
        <section className="bg-gray-800/70 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2 text-white">
            Lưu ý khi thanh toán
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-300 text-sm">
            <li>Luôn giữ thông tin thanh toán an toàn và bảo mật.</li>
            <li>Kiểm tra chi tiết đơn hàng trước khi xác nhận.</li>
            <li>Liên hệ ngân hàng nếu phát hiện giao dịch bất thường.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
