import * as z from "zod";

// Utility function to check uniqueness
const checkUniqueness = (field: string, value: string): boolean => {
  try {
    const storedUsers = localStorage.getItem('registered_users');
    if (!storedUsers) return true;

    const users = JSON.parse(storedUsers);
    return !users.some((user: any) => user[field] === value);
  } catch (error) {
    return true; // If localStorage fails, allow registration
  }
};

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export const RegisterSchema = z.object({
  fullName: z.string()
    .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
    .refine((value) => checkUniqueness('fullName', value), {
      message: "Tên này đã được sử dụng. Vui lòng chọn tên khác.",
    }),
  phone: z.string()
    .regex(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" })
    .refine((value) => checkUniqueness('phone', value), {
      message: "Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác.",
    }),
  email: z.string()
    .email({ message: "Email không hợp lệ" })
    .refine((value) => checkUniqueness('email', value), {
      message: "Email này đã được đăng ký. Vui lòng sử dụng email khác.",
    }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  confirmPassword: z.string().min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});
