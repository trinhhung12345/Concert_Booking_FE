import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "../schemas";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";

type RegisterFormData = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
  onSubmitAPI: (data: any) => void;
  isSubmittingAPI: boolean;
}

export default function RegisterForm({ onSubmitAPI, isSubmittingAPI }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  // Watch all fields to determine if form is complete
  const fullName = watch("fullName");
  const phone = watch("phone");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isFormFilled = fullName && fullName.length > 0 &&
                       phone && phone.length > 0 &&
                       email && email.length > 0 &&
                       password && password.length > 0 &&
                       confirmPassword && confirmPassword.length > 0;

  const onSubmit = (data: RegisterFormData) => {
    // Gọi hàm từ component cha (RegisterPage)
    onSubmitAPI(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* FULL NAME */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-gray-700 font-medium ml-1">Họ và tên</Label>
        <Input
          id="fullName"
          placeholder=""
          {...register("fullName")}
          className={`h-11 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:border-primary ${errors.fullName ? "border-red-500 bg-red-50" : ""}`}
        />
        {errors.fullName && <p className="text-sm text-red-500 ml-1">{errors.fullName.message}</p>}
      </div>

      {/* PHONE & EMAIL (Chia đôi dòng nếu muốn, ở đây để dọc cho mobile dễ nhìn) */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700 font-medium ml-1">Số điện thoại</Label>
        <Input
          id="phone"
          placeholder=""
          {...register("phone")}
          className={`h-11 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:border-primary ${errors.phone ? "border-red-500 bg-red-50" : ""}`}
        />
        {errors.phone && <p className="text-sm text-red-500 ml-1">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium ml-1">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder=""
          {...register("email")}
          className={`h-11 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:border-primary ${errors.email ? "border-red-500 bg-red-50" : ""}`}
        />
        {errors.email && <p className="text-sm text-red-500 ml-1">{errors.email.message}</p>}
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium ml-1">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=""
            {...register("password")}
            className={`h-11 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:border-primary pr-10 ${errors.password ? "border-red-500 bg-red-50" : ""}`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500 ml-1">{errors.password.message}</p>}
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium ml-1">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder=""
            {...register("confirmPassword")}
            className={`h-11 rounded-2xl bg-gray-50 border-gray-200 focus-visible:ring-primary focus-visible:border-primary pr-10 ${errors.confirmPassword ? "border-red-500 bg-red-50" : ""}`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500 ml-1">{errors.confirmPassword.message}</p>}
      </div>

      <Button
        type="submit"
        className={`w-full h-12 mt-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${
          isFormFilled
            ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        disabled={isSubmitting || isSubmittingAPI || !isFormFilled}
      >
        {(isSubmitting || isSubmittingAPI) ? "Đang xử lý..." : "Tạo tài khoản"}
      </Button>
    </form>
  );
}
