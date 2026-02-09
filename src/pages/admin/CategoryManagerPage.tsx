import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import {
  categoryService,
  type Category,
  type CategoryCreatePayload,
} from "@/features/concerts/services/categoryService";

const initialForm: CategoryCreatePayload = {
  name: "",
  description: "",
  active: true,
};

export default function CategoryManagerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CategoryCreatePayload>(initialForm);
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => setReloadFlag((r) => !r);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getAllAdmin();
        setCategories(data || []);
      } catch (error) {
        console.error("[CategoryManagerPage] getAll error", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [reloadFlag]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name?.trim()) return;

    setSaving(true);
    try {
      await categoryService.create({
        name: form.name.trim(),
        description: form.description?.trim() || "",
        active: form.active ?? true,
      });
      setForm(initialForm);
      reload();
    } catch (error) {
      console.error("[CategoryManagerPage] create error", error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await categoryService.updateActive(category.id, !category.active);
      reload();
    } catch (error) {
      console.error("[CategoryManagerPage] updateActive error", error);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xoá danh mục này?");
    if (!ok) return;
    try {
      await categoryService.delete(id);
      reload();
    } catch (error) {
      console.error("[CategoryManagerPage] delete error", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
            <p className="text-xs text-slate-400 mt-1">
              Tạo mới, kích hoạt / vô hiệu hoá và xoá danh mục sự kiện.
            </p>
          </div>
        </div>

        {/* Form tạo category */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4 text-sm"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="font-semibold text-slate-100 text-base">
              Tạo danh mục mới
            </h2>
            <span className="text-[11px] text-slate-400">
              Điền tên danh mục và mô tả (tuỳ chọn)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-slate-300 mb-1 text-xs"
                htmlFor="name"
              >
                Tên danh mục <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rock, EDM, Hội thảo..."
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                className="block text-slate-300 mb-1 text-xs"
                htmlFor="description"
              >
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn về danh mục này"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>Trạng thái mặc định:</span>
              <span className="font-semibold text-emerald-400">Hoạt động</span>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md shadow-blue-500/20 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Tạo danh mục"}
            </button>
          </div>
        </form>

        {/* Bảng danh sách categories */}
        <div className="mt-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-4">
          <h2 className="text-sm font-semibold text-slate-100 mb-3">
            Danh sách danh mục
          </h2>

          {loading ? (
            <div className="py-6 text-center text-slate-300 text-sm">
              Đang tải danh sách danh mục...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-sm">
              Chưa có danh mục nào.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Tên danh mục
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {categories.map((cat, index) => (
                    <tr
                      key={cat.id}
                      className={
                        index % 2 === 0
                          ? "hover:bg-gray-800/70 transition-colors"
                          : "bg-gray-900/60 hover:bg-gray-800/70 transition-colors"
                      }
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-slate-200">
                        {cat.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-100 font-medium">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-xs">
                        {cat.description || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className="inline-flex items-center gap-1 text-xs font-medium"
                        >
                          {cat.active ? (
                            <>
                              <BsToggleOn className="w-5 h-5 text-emerald-400" />
                              <span className="text-emerald-300">Đang hoạt động</span>
                            </>
                          ) : (
                            <>
                              <BsToggleOff className="w-5 h-5 text-gray-500" />
                              <span className="text-gray-400">Đã vô hiệu</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Xoá</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
