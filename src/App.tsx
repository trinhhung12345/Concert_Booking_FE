import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventDetailPage from "./pages/EventDetailPage";
import ProfilePage from "./pages/ProfilePage";
import TicketsPage from "./pages/TicketsPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
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
        </Route>

        {/* Các trang Auth nằm riêng (Không có Header/Footer của MainLayout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Trang Admin nằm riêng (Không có MainLayout) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
