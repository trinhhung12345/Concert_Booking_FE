import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDollarSign, faTicketAlt, faCalendarCheck, faUsers, 
  faArrowUp, faArrowDown, faEllipsisV, faDownload 
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { mockDashboardData } from "@/features/admin/data/mock_data";
import { cn } from "@/lib/utils";

// Helper format tiền tệ
const formatCurrency = (val: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export default function ReportsPageTest() {
  const { kpi, revenueChart, categoryPie, recentOrders, topEvents } = mockDashboardData;

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-[#121418] min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan kinh doanh</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cập nhật lần cuối: Hôm nay, 14:30</p>
        </div>
        <div className="flex gap-2">
        
           <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <FontAwesomeIcon icon={faDownload} /> Xuất báo cáo
           </Button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Tổng doanh thu" 
          value={formatCurrency(kpi.totalRevenue)} 
          icon={faDollarSign} 
          trend={kpi.revenueGrowth} 
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
        <KPICard 
          title="Vé đã bán" 
          value={kpi.totalTicketsSold.toLocaleString()} 
          icon={faTicketAlt} 
          trend={5.2} 
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <KPICard 
          title="Sự kiện tổ chức" 
          value={kpi.totalEvents.toString()} 
          icon={faCalendarCheck} 
          trend={0} 
          color="text-purple-500"
          bgColor="bg-purple-500/10"
        />
        <KPICard 
          title="Thành viên mới" 
          value={kpi.totalUsers.toString()} 
          icon={faUsers} 
          trend={-2.5} 
          color="text-orange-500"
          bgColor="bg-orange-500/10"
        />
      </div>

      {/* 3. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REVENUE CHART (Chiếm 2 phần) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1c23] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Biểu đồ doanh thu</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><FontAwesomeIcon icon={faEllipsisV} /></Button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF0082" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF0082" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF0082" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY PIE CHART (Chiếm 1 phần) */}
        <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Tỷ trọng thể loại</h3>
          <div className="h-[300px] w-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPie}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
             </ResponsiveContainer>
             {/* Center Text */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-10 text-center pointer-events-none">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-xs text-gray-500">Tổng quan</div>
             </div>
          </div>
        </div>
      </div>

      {/* 4. LISTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1c23] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Đơn hàng gần đây</h3>
              <Button variant="link" className="text-primary p-0 h-auto">Xem tất cả</Button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-[#121418] border-b dark:border-gray-700">
                    <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Mã đơn</th>
                        <th className="px-4 py-3">Khách hàng</th>
                        <th className="px-4 py-3">Sự kiện</th>
                        <th className="px-4 py-3">Tổng tiền</th>
                        <th className="px-4 py-3 rounded-tr-lg">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1f2937] transition-colors">
                            <td className="px-4 py-3 font-medium">#{order.id}</td>
                            <td className="px-4 py-3">
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-xs text-gray-500">{order.date}</div>
                            </td>
                            <td className="px-4 py-3 truncate max-w-[150px]">{order.eventName}</td>
                            <td className="px-4 py-3 font-bold">{formatCurrency(order.amount)}</td>
                            <td className="px-4 py-3">
                                <StatusBadge status={order.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* TOP EVENTS */}
        <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Top Sự Kiện</h3>
            <div className="space-y-4">
                {topEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-xl text-gray-500">
                            {event.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{event.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>{event.date}</span>
                                <span>•</span>
                                <span className={event.status === 'ACTIVE' ? "text-emerald-500" : "text-gray-400"}>
                                    {event.status}
                                </span>
                            </div>
                            {/* Mini Progress Bar */}
                            <div className="mt-2 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary rounded-full" 
                                    style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                <span>{event.ticketsSold} vé đã bán</span>
                                <span>{formatCurrency(event.revenue)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const KPICard = ({ title, value, icon, trend, color, bgColor }: any) => (
    <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                {trend > 0 ? (
                    <span className="text-emerald-500 flex items-center gap-1">
                        <FontAwesomeIcon icon={faArrowUp} /> {trend}%
                    </span>
                ) : trend < 0 ? (
                    <span className="text-red-500 flex items-center gap-1">
                        <FontAwesomeIcon icon={faArrowDown} /> {Math.abs(trend)}%
                    </span>
                ) : (
                    <span className="text-gray-400">---</span>
                )}
                <span className="text-gray-400 ml-1">so với tháng trước</span>
            </div>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bgColor, color)}>
            <FontAwesomeIcon icon={icon} className="text-lg" />
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        SUCCESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
        PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
        CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
    };
    const labels: Record<string, string> = {
        SUCCESS: "Thành công", PENDING: "Chờ thanh toán", CANCELLED: "Đã hủy"
    };

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold", styles[status] || styles.PENDING)}>
            {labels[status] || status}
        </span>
    );
};