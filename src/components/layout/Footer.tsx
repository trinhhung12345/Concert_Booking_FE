import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 text-sm">
        {/* Liên hệ */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Hotline
          </h3>
          <p className="text-primary font-semibold text-lg">1900 6408</p>

          <h3 className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Email
          </h3>
          <p>support@concertbooking.vn</p>

          <h3 className="mt-5 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Trụ sở chính
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Tầng 12, Tòa nhà Example, 285 Cách Mạng Tháng Tám,
            Phường 12, Quận 10, TP. Hồ Chí Minh
          </p>
        </div>

        {/* Dành cho khách hàng */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Dành cho khách hàng
          </h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link
                to="/terms"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Hỗ trợ & Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link
                to="/refund-policy"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Chính sách hoàn tiền
              </Link>
            </li>
          </ul>
        </div>

        {/* Dành cho nhà tổ chức */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Dành cho nhà tổ chức
          </h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link
                to="/organizer-terms"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Điều khoản nhà tổ chức
              </Link>
            </li>
            <li>
              <Link
                to="/sell-with-us"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Bán vé cùng chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/marketing-solutions"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Giải pháp marketing
              </Link>
            </li>
            <li>
              <Link
                to="/business-contact"
                className="hover:text-foreground hover:underline underline-offset-4"
              >
                Liên hệ kinh doanh
              </Link>
            </li>
          </ul>
        </div>

        {/* Công ty / Mạng xã hội */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Về công ty
            </h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-foreground hover:underline underline-offset-4"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-foreground hover:underline underline-offset-4"
                >
                  Điều khoản & điều kiện
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-methods"
                  className="hover:text-foreground hover:underline underline-offset-4"
                >
                  Phương thức thanh toán
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Theo dõi chúng tôi
            </h4>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
              >
                <FontAwesomeIcon icon={faYoutube} className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Ngôn ngữ
            </h4>
            <div className="flex gap-3 text-xs">
              <button className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                VI
              </button>
              <button className="px-3 py-1 rounded-full bg-muted text-foreground hover:bg-accent transition-colors">
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh dưới */}
      <div className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="text-lg">🎟️</span>
            <span>ConcertBooking</span>
          </div>
          <p className="text-center md:text-right max-w-xl">
            Nền tảng bán vé hàng đầu Việt Nam cho các buổi hòa nhạc
            và sự kiện trực tiếp. Phát triển và đầu tư bởi Công ty của bạn.
          </p>
        </div>
      </div>
    </footer>
  );
}
