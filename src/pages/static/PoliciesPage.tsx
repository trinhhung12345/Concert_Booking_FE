export default function PoliciesPage() {
  return (
    <div className="w-full text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 space-y-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/30">
            Hệ thống đặt vé concert online - TixCon
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Điều khoản tổ chức sự kiện
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Các điều khoản và quy định dành cho nhà tổ chức sự kiện khi sử dụng nền tảng TixCon
            để quảng bá và bán vé cho các buổi biểu diễn âm nhạc.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Đăng ký và xác thực tổ chức</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nhà tổ chức cần đăng ký tài khoản và hoàn tất quá trình xác thực danh tính theo quy định
              của TixCon trước khi được cấp quyền tạo sự kiện. Việc cung cấp thông tin sai lệch có thể
              dẫn đến việc tài khoản bị khóa vĩnh viễn.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Tạo và quản lý sự kiện</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Nhà tổ chức chịu trách nhiệm đảm bảo thông tin sự kiện chính xác, trung thực và hợp pháp.</li>
              <li>Mọi thay đổi quan trọng (thời gian, địa điểm, nghệ sĩ) phải được thông báo ngay lập tức.</li>
              <li>Không được bán vé cho sự kiện chưa được phê duyệt bởi hệ thống TixCon.</li>
              <li>Phải cung cấp đầy đủ thông tin pháp lý và giấy tờ liên quan khi được yêu cầu.</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Chính sách hoa hồng và thanh toán</h2>
            <p className="text-muted-foreground text-sm mb-2">
              TixCon áp dụng mô hình thu phí hoa hồng trên mỗi vé bán ra:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Hoa hồng mặc định: 8% trên giá vé (có thể điều chỉnh theo thỏa thuận).</li>
              <li>Thanh toán được thực hiện sau khi sự kiện kết thúc và xác nhận không có vấn đề phát sinh.</li>
              <li>Chậm nhất 7 ngày làm việc sau sự kiện, số tiền sẽ được chuyển vào tài khoản đã đăng ký.</li>
              <li>Các khoản thuế liên quan do nhà tổ chức chịu trách nhiệm.</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Quy định về vé và giá vé</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
              <li>Giá vé tối thiểu là 50.000 VNĐ đối với vé ngồi thường và 100.000 VNĐ đối với vé VIP.</li>
              <li>Không được tăng giá vé gấp nhiều lần so với giá gốc trong giai đoạn cuối.</li>
              <li>Phải cung cấp thông tin chính xác về loại vé, khu vực và quyền lợi đi kèm.</li>
              <li>Mọi hình thức gian lận trong việc tạo vé đều bị nghiêm cấm.</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Trách nhiệm và hỗ trợ</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              TixCon cung cấp hỗ trợ kỹ thuật và chăm sóc khách hàng, nhưng nhà tổ chức có trách nhiệm
              chính trong việc giải quyết các vấn đề liên quan đến nội dung sự kiện, nghệ sĩ, địa điểm,
              và các vấn đề phát sinh trực tiếp với người tham dự. Trong trường hợp có khiếu nại nghiêm trọng
              từ khách hàng, TixCon có quyền tạm ngừng hợp tác hoặc chấm dứt hợp đồng.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Chấm dứt hợp tác</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hợp tác có thể bị chấm dứt nếu nhà tổ chức vi phạm điều khoản, cung cấp thông tin sai lệch,
              hoặc không đáp ứng các tiêu chuẩn chất lượng của TixCon. Trong trường hợp này, các sự kiện
              đang chạy sẽ được đánh dấu cảnh báo và không được phép tạo sự kiện mới cho đến khi có
              quyết định cuối cùng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}