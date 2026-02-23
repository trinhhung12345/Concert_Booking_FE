import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUserRole, type UserListResponse } from "../../features/admin/services/userService";
import UserTable from "../../features/admin/components/UserTable";
import UserForm from "../../features/admin/components/UserForm";
import UserUpdateForm, { type UserUpdateFormValues } from "../../features/admin/components/UserUpdateForm";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  // roleId: id của bản ghi role trong DB
  roleId: number;
  address: string;
  birthday: string;
  status: 1 | null;
};

const UserManagerPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setLoading(true);
    getUsers({ page: 1, size: 50 })
      .then((res: UserListResponse) => {
        console.log("[UserManagerPage] getUsers result:", res);
        const mapped = (res.data || []).map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          // Backend: roleType 0 - SUPER_ADMIN, 1 - ADMIN, 2 - USER
          // FE hiển thị đúng 0/1/2 nên dùng trực tiếp roleType
          roleId: u.role?.roleType ?? 2,
          address: u.address ?? "",
          birthday: u.birthday ? u.birthday.slice(0, 10) : "",
          status: (u.status === 1 ? 1 : null) as 1 | null,
        }));
        setUsers(mapped);
      })
      .finally(() => setLoading(false));
  }, [reload]);

  const handleDelete = async (userId: number) => {
    await deleteUser(userId);
    setReload((r) => !r);
  };

  const handleRoleChange = async (userId: number, roleId: number) => {
    // roleId trên FE: 0 - SUPER_ADMIN, 1 - ADMIN, 2 - USER
    // Backend nhận 1 - SUPER_ADMIN, 2 - ADMIN, 3 - USER
    const backendRole = roleId + 1;
    await updateUserRole(userId, { roleId: backendRole });
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
        {selectedUser && (
          <div className="mt-6">
            <UserUpdateForm
              userId={selectedUser.id}
              initialData={{
                phone: selectedUser.phone,
                email: selectedUser.email,
                name: selectedUser.name,
                address: selectedUser.address,
                birthday: selectedUser.birthday,
                status: selectedUser.status,
              } as UserUpdateFormValues}
              onSuccess={() => {
                setReload((r) => !r);
                setSelectedUser(null);
              }}
            />
          </div>
        )}
        <UserTable
          users={users}
          loading={loading}
          onDelete={handleDelete}
          onRoleChange={handleRoleChange}
          onEdit={(user) =>
            setSelectedUser({
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              roleId: user.roleId,
              address: user.address ?? "",
              birthday: user.birthday ?? "",
              status: (user.status === 1 ? 1 : null) as 1 | null,
            })
          }
        />
      </div>
    </div>
  );
};

export default UserManagerPage;
