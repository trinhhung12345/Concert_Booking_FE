import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  FileText,
  DollarSign,
  Plus,
  BarChart3,
  Settings,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockEvents,
  mockUsers,
  mockOrders,
  mockCategories,
  getMockUserById,
} from "@/lib/mock_data";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to get status label
const getStatusLabel = (status: number): { label: string; color: string } => {
  switch (status) {
    case 0:
      return { label: "Chờ xử lý", color: "text-yellow-500" };
    case 1:
      return { label: "Đang xử lý", color: "text-blue-500" };
    case 2:
      return { label: "Hoàn thành", color: "text-green-500" };
    default:
      return { label: "Không xác định", color: "text-gray-500" };
  }
};

export default function AdminDashboard() {
  // Calculate stats from mock data
  const totalEvents = mockEvents.length;
  const totalUsers = mockUsers.length;
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders
    .filter((o) => o.status === 2) // Only completed orders
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Get recent events (sorted by created date)
  const recentEvents = [...mockEvents]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // Get recent orders (sorted by created date)
  const recentOrders = [...mockOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Tổng sự kiện",
      value: totalEvents,
      icon: Calendar,
      color: "bg-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Tổng người dùng",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Tổng đơn hàng",
      value: totalOrders,
      icon: FileText,
      color: "bg-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Doanh thu",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-500/10",
      isCurrency: true,
    },
  ];

  const quickActions = [
    {
      label: "Quản lý sự kiện",
      icon: Calendar,
      href: "/admin/events",
      color: "hover:bg-purple-500/10 hover:text-purple-400",
    },
    {
      label: "Quản lý người dùng",
      icon: Users,
      href: "/admin/users",
      color: "hover:bg-blue-500/10 hover:text-blue-400",
    },
    {
      label: "Quản lý danh mục",
      icon: Settings,
      href: "/admin/categories",
      color: "hover:bg-pink-500/10 hover:text-pink-400",
    },
    {
      label: "Báo cáo thống kê",
      icon: BarChart3,
      href: "/admin/reports",
      color: "hover:bg-cyan-500/10 hover:text-cyan-400",
    },
    {
      label: "Tạo sự kiện mới",
      icon: Plus,
      href: "/admin/events/create",
      color: "hover:bg-green-500/10 hover:text-green-400",
    },
    {
      label: "Quay về trang chủ",
      icon: Ticket,
      href: "/",
      color: "hover:bg-gray-500/10 hover:text-gray-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
            <p className="text-slate-400 mt-1">
              Chào mừng đến với trang quản lý sự kiện
            </p>
          </div>
          <div className="text-right text-slate-400">
            <p className="text-sm">Hôm nay</p>
            <p className="text-lg font-medium text-white">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Button
                  variant="outline"
                  className={`w-full h-auto py-4 flex flex-col items-center gap-2 border-slate-600/50 text-slate-300 ${action.color} transition-all duration-200`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Events & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Sự kiện gần đây</h2>
              <Link to="/admin/events">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{event.title}</p>
                      <p className="text-slate-400 text-sm">
                        {event.categoryName} • {event.venue}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        Hoạt động
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">Chưa có sự kiện nào</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Đơn hàng gần đây</h2>
              <Link to="/admin/orders">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const user = getMockUserById(order.userId);
                  const status = getStatusLabel(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{order.code}</p>
                        <p className="text-slate-400 text-sm truncate">
                          {user?.name || "Không xác định"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <span className={`text-xs ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-center py-4">Chưa có đơn hàng nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Categories Summary */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Danh mục sự kiện</h2>
            <Link to="/admin/categories">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Quản lý danh mục <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {mockCategories.map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-slate-500/50 transition-colors"
              >
                <p className="text-white font-medium">{category.name}</p>
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                  {category.description}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                      category.active
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {category.active ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
