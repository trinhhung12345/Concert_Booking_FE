import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventDetailPage from "./pages/EventDetailPage";
import ProfilePage from "./pages/ProfilePage";
import TicketsPage from "./pages/TicketsPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CheckInPage from "./pages/CheckInPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import EventManagerPage from "@/pages/admin/EventManagerPage";
import CreateEventPage from "@/pages/admin/CreateEventPage";
import LoginPromptModal from "./features/auth/components/LoginPromptModal";
import { useModalStore } from "./store/useModalStore";

function App() {
  const { isLoginPromptOpen, closeLoginPrompt } = useModalStore();

  return (
    <BrowserRouter>
      {/* Global Login Prompt Modal - Luôn có sẵn trong toàn app */}
      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={closeLoginPrompt}
      />

      <Routes>
        {/* Các trang nằm trong MainLayout (Có Header/Footer) */}
        <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/booking/:eventId" element={<BookingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:orderId" element={<OrderDetailPage />} />
        </Route>

        {/* Các trang Auth nằm riêng (Không có Header/Footer của MainLayout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Trang Check-in (Không cần MainLayout - dành cho scan QR) */}
        <Route path="/check-in" element={<CheckInPage />} />

        {/* --- ROUTE ADMIN (MỚI) --- */}
        <Route path="/admin" element={<AdminLayout />}>
            {/* Mặc định vào /admin sẽ redirect hoặc render trang events */}
            <Route index element={<EventManagerPage />} />

            <Route path="events" element={<EventManagerPage />} />
            <Route path="events/create" element={<CreateEventPage />} />

            {/* Thêm các route placeholder này */}
            <Route path="events/:id/edit" element={<div>Trang Chỉnh Sửa Sự Kiện (ID)</div>} />
            <Route path="events/:id/seatmap" element={<div>Trang Quản Lý Sơ Đồ Ghế</div>} />

            <Route path="reports" element={<div className="text-white p-4">Trang Báo Cáo (Đang phát triển)</div>} />
            <Route path="policies" element={<div className="text-white p-4">Trang Điều Khoản (Đang phát triển)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
