import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các trang nằm trong MainLayout (Có Header/Footer) */}
        <Route element={<MainLayout />}>
            <Route path="/" element={<div className="text-center text-xl">Nội dung Trang Chủ ở đây</div>} />
        </Route>

        {/* Các trang Auth nằm riêng (Không có Header/Footer của MainLayout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
