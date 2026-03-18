import { useLanguageStore } from "@/store/useLanguageStore";

export default function PoliciesPage() {
  const { language } = useLanguageStore();
  const isVi = language === "vi";

  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/30">
            {isVi
                ? "Hệ thống đặt vé concert online - TixCon"
                : "TixCon - Online concert ticketing system"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {isVi ? "Điều khoản tổ chức sự kiện" : "Event organizer terms"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            {isVi
              ? "Các điều khoản và quy định dành cho nhà tổ chức sự kiện khi sử dụng nền tảng TixCon để quảng bá và bán vé cho các buổi biểu diễn âm nhạc."
              : "Terms and conditions for event organizers using the TixCon platform to promote and sell tickets for music performances."}
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi
                  ? "1. Đăng ký và xác thực tổ chức"
                  : "1. Organizer registration and verification"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "Nhà tổ chức cần đăng ký tài khoản và hoàn tất quá trình xác thực danh tính theo quy định của TixCon trước khi được cấp quyền tạo sự kiện. Việc cung cấp thông tin sai lệch có thể dẫn đến việc tài khoản bị khóa vĩnh viễn."
                : "Organizers must register an account and complete the identity verification process as required by TixCon before being allowed to create events. Providing false information may result in permanent account suspension."}
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "2. Tạo và quản lý sự kiện" : "2. Creating and managing events"}
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>
                {isVi
                  ? "Nhà tổ chức chịu trách nhiệm đảm bảo thông tin sự kiện chính xác, trung thực và hợp pháp."
                  : "Organizers are responsible for ensuring event information is accurate, truthful and legal."}
              </li>
              <li>
                {isVi
                  ? "Mọi thay đổi quan trọng (thời gian, địa điểm, nghệ sĩ) phải được thông báo ngay lập tức."
                  : "Any important changes (time, venue, artists) must be announced immediately."}
              </li>
              <li>
                {isVi
                  ? "Không được bán vé cho sự kiện chưa được phê duyệt bởi hệ thống TixCon."
                  : "Tickets may not be sold for events that have not been approved by the TixCon system."}
              </li>
              <li>
                {isVi
                  ? "Phải cung cấp đầy đủ thông tin pháp lý và giấy tờ liên quan khi được yêu cầu."
                  : "Organizers must provide all required legal information and documents when requested."}
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "3. Chính sách hoa hồng và thanh toán" : "3. Commission and payments"}
            </h2>
            <p className="text-muted-foreground text-sm mb-2">
              {isVi
                ? "TixCon áp dụng mô hình thu phí hoa hồng trên mỗi vé bán ra:"
                : "TixCon applies a commission‑based fee model on each ticket sold:"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>
                {isVi
                  ? "Hoa hồng mặc định: 8% trên giá vé (có thể điều chỉnh theo thỏa thuận)."
                  : "Default commission: 8% of the ticket price (adjustable by agreement)."}
              </li>
              <li>
                {isVi
                  ? "Thanh toán được thực hiện sau khi sự kiện kết thúc và xác nhận không có vấn đề phát sinh."
                  : "Payouts are made after the event ends and once no issues are reported."}
              </li>
              <li>
                {isVi
                  ? "Chậm nhất 7 ngày làm việc sau sự kiện, số tiền sẽ được chuyển vào tài khoản đã đăng ký."
                  : "Funds will be transferred to the registered account within 7 working days after the event at the latest."}
              </li>
              <li>
                {isVi
                  ? "Các khoản thuế liên quan do nhà tổ chức chịu trách nhiệm."
                  : "Organizers are responsible for any applicable taxes."}
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "4. Quy định về vé và giá vé" : "4. Ticket and pricing rules"}
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>
                {isVi
                  ? "Giá vé tối thiểu là 50.000 VNĐ đối với vé ngồi thường và 100.000 VNĐ đối với vé VIP."
                  : "The minimum ticket price is 50,000 VND for standard seats and 100,000 VND for VIP seats."}
              </li>
              <li>
                {isVi
                  ? "Không được tăng giá vé gấp nhiều lần so với giá gốc trong giai đoạn cuối."
                  : "Ticket prices may not be raised multiple times above the original price in the final sales period."}
              </li>
              <li>
                {isVi
                  ? "Phải cung cấp thông tin chính xác về loại vé, khu vực và quyền lợi đi kèm."
                  : "Accurate information about ticket types, zones and included benefits must be provided."}
              </li>
              <li>
                {isVi
                  ? "Mọi hình thức gian lận trong việc tạo vé đều bị nghiêm cấm."
                  : "Any form of fraud in creating tickets is strictly prohibited."}
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "5. Trách nhiệm và hỗ trợ" : "5. Responsibilities and support"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "TixCon cung cấp hỗ trợ kỹ thuật và chăm sóc khách hàng, nhưng nhà tổ chức có trách nhiệm chính trong việc giải quyết các vấn đề liên quan đến nội dung sự kiện, nghệ sĩ, địa điểm, và các vấn đề phát sinh trực tiếp với người tham dự. Trong trường hợp có khiếu nại nghiêm trọng từ khách hàng, TixCon có quyền tạm ngừng hợp tác hoặc chấm dứt hợp đồng."
                : "TixCon provides technical and customer support, but organizers are primarily responsible for issues related to event content, artists, venues and any matters arising directly with attendees. In serious customer complaint cases, TixCon reserves the right to suspend cooperation or terminate the contract."}
            </p>
          </section>
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {isVi ? "6. Chấm dứt hợp tác" : "6. Termination of cooperation"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isVi
                ? "Hợp tác có thể bị chấm dứt nếu nhà tổ chức vi phạm điều khoản, cung cấp thông tin sai lệch, hoặc không đáp ứng các tiêu chuẩn chất lượng của TixCon. Trong trường hợp này, các sự kiện đang chạy sẽ được đánh dấu cảnh báo và không được phép tạo sự kiện mới cho đến khi có quyết định cuối cùng."
                : "Cooperation may be terminated if the organizer violates these terms, provides false information or fails to meet TixCon’s quality standards. In such cases, ongoing events may be flagged and no new events may be created until a final decision is made."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}