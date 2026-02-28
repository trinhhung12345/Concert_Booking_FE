import { useEffect, useState } from "react";
import { getMyProfile, editMyProfile, changeMyPassword } from "@/features/admin/services/userService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBirthdayCake,
  faLock,
  faKey,
  faShieldAlt,
  faCheckCircle,
  faExclamationCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res: any = await getMyProfile();
        const data = res?.data || {};
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          birthday: data.birthday || "",
        });
      } catch (err) {
        console.error("[ProfilePage] getMyProfile error", err);
        setError("Không thể tải thông tin cá nhân. Vui lòng thử lại.");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage(null);
    setError(null);
    try {
      await editMyProfile(profile);
      setMessage("Cập nhật thông tin cá nhân thành công.");
    } catch {
      setError("Cập nhật thông tin không thành công. Vui lòng thử lại.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setMessage(null);
    setError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setChangingPassword(false);
      return;
    }

    try {
      await changeMyPassword(passwordForm as any);
      setMessage("Đổi mật khẩu thành công.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setError("Đổi mật khẩu không thành công. Vui lòng thử lại.");
    } finally {
      setChangingPassword(false);
    }
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="bg-background min-h-screen w-full text-foreground">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {loadingProfile ? "Đang tải..." : profile.name || "Trang cá nhân"}
            </h1>
            <p className="text-white/80 text-sm sm:text-base truncate mt-1">
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span className="text-sm">{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 flex items-center gap-3 text-destructive">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Thông tin cá nhân - 3 cols */}
          <section className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-primary text-sm" />
              </div>
              <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
            </div>

            <div className="p-5 sm:p-6">
              {loadingProfile ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-muted-foreground text-sm flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-xs" />
                      Họ và tên
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="h-11"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-muted-foreground text-sm flex items-center gap-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="h-11"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-muted-foreground text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-xs" />
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="h-11"
                        placeholder="0912 345 678"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="birthday" className="text-muted-foreground text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faBirthdayCake} className="text-xs" />
                        Ngày sinh
                      </Label>
                      <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={profile.birthday}
                        onChange={handleProfileChange}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-muted-foreground text-sm flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                      Địa chỉ
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      className="h-11"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="h-11 px-6 rounded-xl font-semibold" disabled={savingProfile}>
                      {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Đổi mật khẩu - 2 cols */}
          <section className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden h-fit">
            <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-primary text-sm" />
              </div>
              <h2 className="text-lg font-semibold">Đổi mật khẩu</h2>
            </div>

            <div className="p-5 sm:p-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="oldPassword" className="text-muted-foreground text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faLock} className="text-xs" />
                    Mật khẩu hiện tại
                  </Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-muted-foreground text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faKey} className="text-xs" />
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-muted-foreground text-sm flex items-center gap-2">
                    <FontAwesomeIcon icon={faKey} className="text-xs" />
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-11 px-6 rounded-xl font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;