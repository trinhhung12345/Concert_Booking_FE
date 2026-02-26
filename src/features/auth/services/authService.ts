import apiClient from "../../../lib/axios";

// Kiểu dữ liệu trả về từ Backend
export interface SendOtpResponse {
  code: number;
  message: string;
  data: {
    id: number;
    email: string;
  };
}

export interface RegisterResponse {
  code: number;
  message: string;
  data: {
    accessToken: string;
    email: string;
    phone: string;
    name: string;
    role: any;
    // ... các trường khác
  };
}

// Interface cho kết quả API Login
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    id: number;
    code: string;
    phone: string;
    name: string;
    email: string;
    role: any;
    accessToken: string; // Token quan trọng nằm ở đây
  };
}

interface ForgotPasswordResponse {
  code: number;
  message: string;
}

export const authService = {
  // API: Quên mật khẩu
  forgotPassword: async (email: string) => {
    return apiClient.post<any, ForgotPasswordResponse>("/forgot-password", {
      email,
    });
  },

  // API 1: Gửi OTP
  sendOtp: async (email: string, phone: string) => {
    const payload = {
      email,
      phone,
      type: "1",     // Cứng theo yêu cầu
      purpose: "1",  // Cứng theo yêu cầu
    };
    return apiClient.post<any, SendOtpResponse>("/auth/send-otp", payload);
  },

  // API 2: Đăng ký (Gửi kèm OTP)
  register: async (registerData: any, otp: string) => {
    // Map dữ liệu từ Form sang dữ liệu Backend cần
    const payload = {
      accountPhone: registerData.phone, // Backend dùng key accountPhone
      email: registerData.email,
      accountName: registerData.fullName, // Form dùng fullName, Backend dùng accountName
      password: registerData.password,
      confirmPassword: registerData.password, // Backend yêu cầu confirmPassword
      code: otp,
      type: "1",
      purpose: "1",
      businessRole: 1,
    };
    return apiClient.post<any, RegisterResponse>("/auth/register", payload);
  },

  // API 3: Đăng nhập
  login: async (email: string, password: string) => {
    return apiClient.post<any, LoginResponse>("/auth/login", {
      email,
      password,
    });
  },
};
