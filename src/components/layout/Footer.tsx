import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LANGUAGE_LABELS } from "@/lib/i18n";

function FooterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      {/* Desktop: always show */}
      <div className="hidden md:block space-y-2">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {title}
        </h3>
        {children}
      </div>

      {/* Mobile: collapsible */}
      <div className="md:hidden border-b border-border/50 last:border-b-0">
        <button
          className="w-full flex items-center justify-between py-3 text-left"
          onClick={() => setOpen(!open)}
        >
          <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {title}
          </h3>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-muted-foreground text-xs transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 pb-3" : "max-h-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { language, setLanguage } = useLanguageStore();
  const isVi = language === "vi";

  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-6 md:py-10 grid gap-0 md:gap-8 md:grid-cols-4 text-sm">
        {/* Liên hệ / Contact */}
        <FooterSection title={isVi ? "Liên hệ" : "Contact"} defaultOpen>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hotline</p>
              <p className="text-primary font-semibold text-lg">1900 6408</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
              <p>support@concertbooking.vn</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {isVi ? "Trụ sở chính" : "Head office"}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {isVi
                  ? "Tầng 12, Tòa nhà Example, 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, TP. Hồ Chí Minh"
                  : "12th Floor, Example Building, 285 Cach Mang Thang Tam Street, Ward 12, District 10, Ho Chi Minh City"}
              </p>
            </div>
          </div>
        </FooterSection>

        {/* Dành cho khách hàng / For customers */}
        <FooterSection title={isVi ? "Dành cho khách hàng" : "For customers"}>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <Link to="/terms" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Điều khoản sử dụng" : "Terms of use"}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Chính sách bảo mật" : "Privacy policy"}
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Hỗ trợ & Câu hỏi thường gặp" : "Support & FAQ"}
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Chính sách hoàn tiền" : "Refund policy"}
              </Link>
            </li>
          </ul>
        </FooterSection>

        {/* Dành cho nhà tổ chức / For organizers */}
        <FooterSection title={isVi ? "Dành cho nhà tổ chức" : "For organizers"}>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <Link to="/organizer-terms" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Điều khoản nhà tổ chức" : "Organizer terms"}
              </Link>
            </li>
            <li>
              <Link to="/sell-with-us" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Bán vé cùng chúng tôi" : "Sell tickets with us"}
              </Link>
            </li>
            <li>
              <Link to="/marketing-solutions" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Giải pháp marketing" : "Marketing solutions"}
              </Link>
            </li>
            <li>
              <Link to="/business-contact" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                {isVi ? "Liên hệ kinh doanh" : "Business contact"}
              </Link>
            </li>
          </ul>
        </FooterSection>

        {/* Công ty / Company */}
        <FooterSection title={isVi ? "Về công ty" : "Company"}>
          <div className="space-y-4">
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                  {isVi ? "Giới thiệu" : "About"}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                  {isVi ? "Điều khoản & điều kiện" : "Terms & conditions"}
                </Link>
              </li>
              <li>
                <Link to="/payment-methods" className="hover:text-foreground hover:underline underline-offset-4 transition-colors">
                  {isVi ? "Phương thức thanh toán" : "Payment methods"}
                </Link>
              </li>
            </ul>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                {isVi ? "Theo dõi chúng tôi" : "Follow us"}
              </h4>
              <div className="flex items-center gap-3 text-muted-foreground">
                <a href="#" aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
                </a>
                <a href="#" aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                </a>
                <a href="#" aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faYoutube} className="text-sm" />
                </a>
                <a href="#" aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                {isVi ? "Ngôn ngữ" : "Language"}
              </h4>
              <div className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage("vi")}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    language === "vi"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-accent"
                  }`}
                >
                  {LANGUAGE_LABELS.vi}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    language === "en"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-accent"
                  }`}
                >
                  {LANGUAGE_LABELS.en}
                </button>
              </div>
            </div>
          </div>
        </FooterSection>
      </div>

      {/* Thanh dưới */}
      <div className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="text-lg">🎟️</span>
            <span>ConcertBooking</span>
          </div>
          <p className="text-center md:text-right max-w-xl">
            {isVi
              ? "Nền tảng bán vé hàng đầu Việt Nam cho các buổi hòa nhạc và sự kiện trực tiếp. Phát triển và đầu tư bởi Công ty của bạn."
              : "Vietnam's leading ticketing platform for concerts and live events. Developed and invested by your company."}
          </p>
        </div>
      </div>
    </footer>
  );
}