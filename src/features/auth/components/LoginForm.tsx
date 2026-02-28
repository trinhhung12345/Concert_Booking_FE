import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "../schemas";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

type LoginFormData = z.infer<typeof LoginSchema>;

// Thêm Props để nhận hàm xử lý từ Page
interface LoginFormProps {
  onSubmitAPI: (data: LoginFormData) => void;
  isLoading: boolean;
}

export default function LoginForm({ onSubmitAPI, isLoading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  // Watch all fields to determine if form is complete
  const email = watch("email");
  const password = watch("password");
  const isFormFilled = email && email.length > 0 && password && password.length > 0;

  const onSubmit = (data: LoginFormData) => {
    // Truyền dữ liệu lên cha (LoginPage)
    onSubmitAPI(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground/80 font-medium ml-1">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          className={`h-12 rounded-2xl bg-muted/50 border-border focus-visible:ring-primary focus-visible:border-primary ${errors.email ? "border-destructive bg-destructive/5" : ""}`}
        />
        {errors.email && <p className="text-sm text-destructive ml-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground/80 font-medium ml-1">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={`h-12 rounded-2xl bg-muted/50 border-border focus-visible:ring-primary focus-visible:border-primary pr-10 ${errors.password ? "border-destructive bg-destructive/5" : ""}`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive ml-1">{errors.password.message}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsForgotPasswordOpen(true)}
          className="text-sm font-medium text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Quên mật khẩu?
        </button>
      </div>

      <ForgotPasswordDialog
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      <Button
        type="submit"
        className={`w-full h-12 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-sm ${
          isFormFilled
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
        disabled={isSubmitting || isLoading || !isFormFilled}
      >
        {(isSubmitting || isLoading) ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
