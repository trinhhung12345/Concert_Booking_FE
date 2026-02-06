import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUserRole } from "../../features/admin/services/userService";
import UserTable from "../../features/admin/components/UserTable";
import UserForm from "../../features/admin/components/UserForm";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
};

const UserManagerPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsers({ page: 1, size: 50 })
      .then((res: any) => {
        console.log("[UserManagerPage] getUsers result:", res);
        setUsers(res.data || []); // API trả về res.data là mảng user
      })
      .finally(() => setLoading(false));
  }, [reload]);

  const handleDelete = async (userId: number) => {
    await deleteUser(userId);
    setReload((r) => !r);
  };

  const handleRoleChange = async (userId: number, roleId: number) => {
    await updateUserRole(userId, { roleId });
    setReload((r) => !r);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
            <p className="text-xs text-slate-400 mt-1">
              Xem, tạo mới và phân quyền tài khoản trong hệ thống.
            </p>
          </div>
        </div>

        <UserForm onSuccess={() => setReload((r) => !r)} />
        <UserTable users={users} loading={loading} onDelete={handleDelete} onRoleChange={handleRoleChange} />
      </div>
    </div>
  );
};

export default UserManagerPage;
