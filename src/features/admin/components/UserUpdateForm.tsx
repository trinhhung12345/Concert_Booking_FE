import React, { useState } from "react";
import { updateUser } from "../services/userService";

type UserStatus = 1 | null;

export type UserUpdateFormValues = {
  phone: string;
  email: string;
  name: string;
  address: string;
  birthday: string; // format: YYYY-MM-DD
  status: UserStatus;
};

type UserUpdateFormProps = {
  userId: number | string;
  initialData: UserUpdateFormValues;
  onSuccess?: () => void;
};

const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ userId, initialData, onSuccess }) => {
  const [form, setForm] = useState<UserUpdateFormValues>(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "status") {
      setForm((prev) => ({
        ...prev,
        status: value === "" ? null : (Number(value) as UserStatus),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(userId, {
        phone: form.phone,
        email: form.email,
        name: form.name,
        address: form.address,
        birthday: form.birthday,
        status: form.status,
      });

      onSuccess && onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const isActivated = form.status === 1;

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4 text-sm"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <h2 className="font-semibold text-slate-100 text-base">Cập nhật người dùng</h2>
      </div>

      {/* Thanh hiển thị trạng thái kích hoạt */}
      <div
        className={
          "w-full rounded-lg px-3 py-2 text-xs font-medium flex items-center justify-between " +
          (isActivated
            ? "bg-emerald-900/60 border border-emerald-700 text-emerald-200"
            : "bg-amber-900/40 border border-amber-700 text-amber-100")
        }
      >
        <span>
          {isActivated
            ? "Tài khoản đã được kích hoạt"
            : "Tài khoản chưa được kích hoạt"}
        </span>
        <span
          className={
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] " +
            (isActivated
              ? "bg-emerald-500/20 text-emerald-100"
              : "bg-amber-500/20 text-amber-100")
          }
        >
          <span
            className={
              "w-1.5 h-1.5 rounded-full " +
              (isActivated ? "bg-emerald-400" : "bg-amber-400")
            }
          />
          {isActivated ? "Đã kích hoạt" : "Chưa kích hoạt"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="name">
            Họ và tên
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="user@example.com"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="phone">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0987 654 321"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="address">
            Địa chỉ
          </label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Hà Nội, Việt Nam"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="birthday">
            Ngày sinh
          </label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="status">
            Trạng thái kích hoạt
          </label>
          <select
            id="status"
            name="status"
            value={form.status === null ? "" : String(form.status)}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chưa kích hoạt</option>
            <option value="1">Đã kích hoạt</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md shadow-blue-500/20 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
};

export default UserUpdateForm;
