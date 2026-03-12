import { useLanguageStore } from "@/store/useLanguageStore";

export default function BusinessContactPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";

  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-medium border border-cyan-500/30">
            {isVi ? "Hợp tác & phát triển" : "Partnerships & growth"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {isVi ? "Liên hệ kinh doanh" : "Business contact"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            {isVi
              ? "Chúng tôi luôn sẵn sàng đồng hành cùng các nhà tổ chức, thương hiệu và đối tác."
              : "We are ready to work with organizers, brands and partners on long‑term collaborations."}
          </p>
        </header>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isVi
              ? (
                <>
                  Gửi email tới <span className="text-emerald-300 font-medium">business@concertbooking.vn</span>{" "}
                  hoặc liên hệ hotline <span className="text-emerald-300 font-medium">1900 6408 (nhánh 2)</span>{" "}
                  để được tư vấn nhanh nhất.
                </>
              )
              : (
                <>
                  Please email <span className="text-emerald-300 font-medium">business@concertbooking.vn</span>{" "}
                  or call our hotline <span className="text-emerald-300 font-medium">1900 6408 (ext. 2)</span>{" "}
                  for the fastest support.
                </>
              )
            }
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isVi
              ? "Thời gian làm việc: 9:00 - 18:00, Thứ 2 - Thứ 6 (trừ ngày lễ)."
              : "Working hours: 9:00 – 18:00, Monday to Friday (except public holidays)."}
          </p>
        </section>
      </div>
    </div>
  );
}
