import { useEffect, useState } from "react";
import { getMyProfile, editMyProfile, changeMyPassword } from "@/features/admin/services/userService";

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
    } catch (err) {
      console.error("[ProfilePage] editMyProfile error", err);
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
    } catch (err) {
      console.error("[ProfilePage] changeMyPassword error", err);
      setError("Đổi mật khẩu không thành công. Vui lòng thử lại.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full text-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-slate-100">Trang cá nhân</h1>

        {message && <div className="mb-4 rounded bg-emerald-900/40 border border-emerald-600 px-4 py-2 text-emerald-200 text-sm">{message}</div>}
        {error && <div className="mb-4 rounded bg-red-900/40 border border-red-600 px-4 py-2 text-red-200 text-sm">{error}</div>}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Thông tin cá nhân */}
          <section className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
            {loadingProfile ? (
              <p className="text-slate-400 text-sm">Đang tải thông tin...</p>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-sm">
                <div>
                  <label className="block text-slate-300 mb-1" htmlFor="name">Họ và tên</label>
                  <input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1" htmlFor="phone">Số điện thoại</label>
                  <input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1" htmlFor="address">Địa chỉ</label>
                  <input
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1" htmlFor="birthday">Ngày sinh</label>
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={profile.birthday}
                    onChange={handleProfileChange}
                    className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </form>
            )}
          </section>

          {/* Đổi mật khẩu */}
          <section className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-300 mb-1" htmlFor="oldPassword">Mật khẩu hiện tại</label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1" htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                disabled={changingPassword}
              >
                {changingPassword ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
