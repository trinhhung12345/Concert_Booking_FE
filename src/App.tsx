import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import TermsPage from "./pages/static/TermsPage";
import PrivacyPage from "./pages/static/PrivacyPage";
import SupportPage from "./pages/static/SupportPage";
import RefundPolicyPage from "./pages/static/RefundPolicyPage";
import OrganizerTermsPage from "./pages/static/OrganizerTermsPage";
import SellWithUsPage from "./pages/static/SellWithUsPage";
import MarketingSolutionsPage from "./pages/static/MarketingSolutionsPage";
import BusinessContactPage from "./pages/static/BusinessContactPage";
import AboutPage from "./pages/static/AboutPage";
import PaymentMethodsPage from "./pages/static/PaymentMethodsPage";
import PoliciesPage from "./pages/static/PoliciesPage";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import EventManagerPage from "@/pages/admin/EventManagerPage";
import EventWizardPage from "@/pages/admin/EventWizardPage";
import LoginPromptModal from "./features/auth/components/LoginPromptModal";
import { useModalStore } from "./store/useModalStore";
import AdminSeatMapPage from "./pages/admin/AdminSeatMapPage";
import UserManagerPage from "./pages/admin/UserManagerPage";
import CategoryManagerPage from "./pages/admin/CategoryManagerPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import EventRevenuePage from "./pages/admin/EventRevenuePage";
import EventOrdersPage from "./pages/admin/EventOrdersPage";
import { useAuthStore } from "./store/useAuthStore";
import Error404Page from "./pages/Error404Page";
import { setNavigator } from "@/lib/navigation";

function AdminRoute({ children }: { children: React.ReactElement }) {
  const user = useAuthStore((s) => s.user);
  const roleName = (user?.role?.roleName || "").toUpperCase();
  const isAdmin =
    roleName === "ADMIN" ||
    roleName === "SUPER_ADMIN" ||
    roleName === "SUPERADMIN";

  if (!isAdmin) {
    // Người dùng thường không được truy cập admin → 404
    return <Navigate to="/404" replace />;
  }

  return children;
}

function SuperAdminRoute({ children }: { children: React.ReactElement }) {
  const user = useAuthStore((s) => s.user);
  const roleName = (user?.role?.roleName || "").toUpperCase();
  const isSuperAdmin = roleName === "SUPER_ADMIN" || roleName === "SUPERADMIN";

  if (!isSuperAdmin) {
    // Không đủ quyền: chuyển thẳng sang trang 404
    return <Navigate to="/404" replace />;
  }

  return children;
}

function NavigationRegistrar() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null;
}

function App() {
  const { isLoginPromptOpen, closeLoginPrompt } = useModalStore();

  return (
    <BrowserRouter>
      {/* Đăng ký hàm navigate toàn cục cho axios interceptor, v.v. */}
      <NavigationRegistrar />

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

          {/* Trang tĩnh từ footer */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/organizer-terms" element={<OrganizerTermsPage />} />
          <Route path="/sell-with-us" element={<SellWithUsPage />} />
          <Route path="/marketing-solutions" element={<MarketingSolutionsPage />} />
          <Route path="/business-contact" element={<BusinessContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />

          {/* 404 Page (hiển thị trong MainLayout) */}
          <Route path="/404" element={<Error404Page />} />
        </Route>

        {/* Các trang Auth nằm riêng (Không có Header/Footer của MainLayout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Trang Check-in (Không cần MainLayout - dành cho scan QR) */}
        <Route path="/check-in" element={<CheckInPage />} />

        {/* --- ROUTE ADMIN (MỚI) --- */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          {/* Mặc định vào /admin sẽ redirect hoặc render trang events */}
          <Route index element={<EventManagerPage />} />

          <Route path="events" element={<EventManagerPage />} />
          <Route path="events/create" element={<EventWizardPage />} />

          {/* Thêm các route placeholder này */}
          <Route path="events/:id/edit" element={<EventWizardPage />} />
          <Route path="events/:id/seatmap" element={<AdminSeatMapPage />} />
          <Route path="events/:id/revenue" element={<EventRevenuePage />} />
          <Route path="events/:id/orders" element={<EventOrdersPage />} />

          <Route
            path="users"
            element={
              <SuperAdminRoute>
                <UserManagerPage />
              </SuperAdminRoute>
            }
          />

          <Route
            path="categories"
            element={
              <SuperAdminRoute>
                <CategoryManagerPage />
              </SuperAdminRoute>
            }
          />

          <Route path="profile" element={<AdminProfilePage />} />

          <Route
            path="reports"
            element={
              <SuperAdminRoute>
                <ReportsPage />
              </SuperAdminRoute>
            }
          />
          {/* <Route path="reports" element={<ReportsPageTest/>} /> */}
          <Route path="policies" element={<PoliciesPage />} />
        </Route>

        {/* Catch-all cho các route không khớp */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
