// src/features/admin/data/mock_data.ts

// --- TYPES ---
export interface KPIMetrics {
  totalRevenue: number;
  totalTicketsSold: number;
  totalEvents: number;
  totalUsers: number;
  revenueGrowth: number; // Phần trăm tăng trưởng so với tháng trước
}

export interface RevenueChartData {
  name: string; // Tháng/Ngày
  revenue: number;
  tickets: number;
}

export interface CategoryDistribution {
  name: string;
  value: number; // Doanh thu hoặc số lượng vé
  color: string;
}

export interface TopEventData {
  id: number;
  title: string;
  venue: string;
  date: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export interface RecentOrder {
  id: number;
  customerName: string;
  eventName: string;
  date: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "CANCELLED";
}

// --- MOCK DATA (Dựa trên dữ liệu dump SQL) ---

export const mockDashboardData = {
  // 1. Chỉ số tổng quan (KPIs)
  kpi: {
    totalRevenue: 285400000, // Tổng hợp từ bảng orders
    totalTicketsSold: 1250,  // Tổng hợp từ order_details
    totalEvents: 4,          // Đếm từ bảng events
    totalUsers: 152,         // Đếm từ bảng users
    revenueGrowth: 12.5,     // Giả lập tăng 12.5%
  } as KPIMetrics,

  // 2. Dữ liệu biểu đồ doanh thu (Theo tháng - lấy từ created_at của orders)
  revenueChart: [
    { name: "Tháng 10", revenue: 45000000, tickets: 120 },
    { name: "Tháng 11", revenue: 62000000, tickets: 200 },
    { name: "Tháng 12", revenue: 88000000, tickets: 350 },
    { name: "Tháng 01", revenue: 55000000, tickets: 180 },
    { name: "Tháng 02", revenue: 35400000, tickets: 400 }, // Dữ liệu tháng hiện tại trong dump
  ] as RevenueChartData[],

  // 3. Tỷ trọng theo thể loại (Bảng categories + order_details)
  categoryPie: [
    { name: "Rock", value: 45, color: "#FF0082" }, // Màu hồng chủ đạo
    { name: "Pop", value: 30, color: "#00C49F" },
    { name: "Ballad", value: 15, color: "#FFBB28" },
    { name: "Indie", value: 10, color: "#FF8042" },
  ] as CategoryDistribution[],

  // 4. Top sự kiện bán chạy (Bảng events + ticket_types)
  topEvents: [
    {
      id: 1,
      title: "Taylor Swift Concert",
      venue: "SVĐ Mỹ Đình",
      date: "2026-02-21",
      ticketsSold: 450,
      totalTickets: 500,
      revenue: 150000000,
      status: "ACTIVE",
    },
    {
      id: 2,
      title: "KARMØYGEDDON Metal Festival",
      venue: "Korpervik, Norway",
      date: "2026-04-05",
      ticketsSold: 120,
      totalTickets: 1000,
      revenue: 85000000,
      status: "ACTIVE",
    },
    {
      id: 4,
      title: "Dead Pop Festival",
      venue: "Kawasaki, Japan",
      date: "2026-04-04",
      ticketsSold: 300,
      totalTickets: 300, // Sold out
      revenue: 45000000,
      status: "COMPLETED",
    },
  ] as TopEventData[],

  // 5. Đơn hàng gần đây (Bảng orders + users)
  recentOrders: [
    {
      id: 51,
      customerName: "Trịnh Hữu Hưng",
      eventName: "Taylor Swift Concert",
      date: "2026-02-14 17:09",
      amount: 40000,
      status: "SUCCESS",
    },
    {
      id: 50,
      customerName: "Trần Quốc Thái",
      eventName: "Dead Pop Festival",
      date: "2026-02-14 16:26",
      amount: 10000,
      status: "PENDING",
    },
    {
      id: 49,
      customerName: "Nguyễn Văn A",
      eventName: "KARMØYGEDDON",
      date: "2026-02-13 19:49",
      amount: 123456,
      status: "SUCCESS",
    },
    {
      id: 48,
      customerName: "Lê Thị B",
      eventName: "Taylor Swift Concert",
      date: "2026-02-13 19:39",
      amount: 370368,
      status: "CANCELLED",
    },
  ] as RecentOrder[],
};