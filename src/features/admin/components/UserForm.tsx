import React, { useState } from "react";
import { createUser } from "../services/userService";

const initial = {
  name: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  birthday: "",
  roleId: 1,
};

type UserFormProps = {
  onSuccess?: () => void;
};

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(form);
      setForm(initial);
      onSuccess && onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4 text-sm"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <h2 className="font-semibold text-slate-100 text-base">Tạo người dùng mới</h2>
        <span className="text-[11px] text-slate-400">Điền đầy đủ thông tin bắt buộc (*)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="name">
            Họ và tên <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="email">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="user@example.com"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="phone">
            Số điện thoại <span className="text-red-400">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0909 000 000"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="address">
            Địa chỉ <span className="text-red-400">*</span>
          </label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Quận 1, TP. Hồ Chí Minh"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="password">
            Mật khẩu tạm <span className="text-red-400">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ít nhất 6 ký tự"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="birthday">
            Ngày sinh <span className="text-red-400">*</span>
          </label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1 text-xs" htmlFor="roleId">
            Vai trò
          </label>
          <select
            id="roleId"
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>User</option>
            <option value={2}>Admin</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md shadow-blue-500/20 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo người dùng"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
