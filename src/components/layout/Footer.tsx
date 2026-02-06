import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-[#1f2530] text-slate-300 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 text-sm">
        {/* Liên hệ */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Hotline
          </h3>
          <p className="text-green-400 font-semibold text-lg">1900 6408</p>

          <h3 className="mt-5 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Email
          </h3>
          <p>support@concertbooking.vn</p>

          <h3 className="mt-5 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Trụ sở chính
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Tầng 12, Tòa nhà Example, 285 Cách Mạng Tháng Tám,
            Phường 12, Quận 10, TP. Hồ Chí Minh
          </p>
        </div>

        {/* Dành cho khách hàng */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Dành cho khách hàng
          </h3>
          <ul className="space-y-1 text-slate-400">
            <li>Điều khoản sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Hỗ trợ &amp; Câu hỏi thường gặp</li>
            <li>Chính sách hoàn tiền</li>
          </ul>
        </div>

        {/* Dành cho nhà tổ chức */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Dành cho nhà tổ chức
          </h3>
          <ul className="space-y-1 text-slate-400">
            <li>Điều khoản nhà tổ chức</li>
            <li>Bán vé cùng chúng tôi</li>
            <li>Giải pháp marketing</li>
            <li>Liên hệ kinh doanh</li>
          </ul>
        </div>

        {/* Công ty / Mạng xã hội */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Về công ty
            </h3>
            <ul className="space-y-1 text-slate-400">
              <li>Giới thiệu</li>
              <li>Điều khoản &amp; điều kiện</li>
              <li>Phương thức thanh toán</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Theo dõi chúng tôi
            </h4>
            <div className="flex items-center gap-3 text-slate-300">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-500 transition-colors"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-500 transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-500 transition-colors"
              >
                <FontAwesomeIcon icon={faYoutube} className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-500 transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Ngôn ngữ
            </h4>
            <div className="flex gap-3 text-xs">
              <button className="px-3 py-1 rounded-full bg-primary text-white font-medium">
                VI
              </button>
              <button className="px-3 py-1 rounded-full bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors">
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh dưới */}
      <div className="border-t border-slate-800 bg-[#181d26]">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
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
