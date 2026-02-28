export default function BusinessContactPage() {
  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-medium border border-cyan-500/30">
            Hợp tác &amp; phát triển
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Liên hệ kinh doanh
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Chúng tôi luôn sẵn sàng đồng hành cùng các nhà tổ chức, thương hiệu và đối tác.
          </p>
        </header>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Gửi email tới <span className="text-emerald-300 font-medium">business@concertbooking.vn</span>
            {" "}hoặc liên hệ hotline <span className="text-emerald-300 font-medium">1900 6408 (nhánh 2)</span>
            {" "}để được tư vấn nhanh nhất.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thời gian làm việc: 9:00 - 18:00, Thứ 2 - Thứ 6 (trừ ngày lễ).
          </p>
        </section>
      </div>
    </div>
  );
}
