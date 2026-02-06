import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Trang Quản Lý Sự Kiện</h1>
          <p className="text-gray-500">
            Khu vực dành cho Admin/Ban tổ chức. Tính năng đang được phát triển...
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <div className="h-32 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-32 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-32 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          <div className="pt-8 flex flex-col gap-2 items-center">
            <Link to="/admin/users">
              <Button variant="default">Quản lý người dùng</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Quay về Trang chủ</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
