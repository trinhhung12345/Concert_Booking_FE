import React, { useMemo, useState } from "react";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
};

interface UserTableProps {
  users: User[];
  loading: boolean;
  onDelete: (id: number) => void;
  onRoleChange: (id: number, roleId: number) => void;
}

type SortKey = "id" | "name" | "email" | "phone" | null;

const UserTable: React.FC<UserTableProps> = ({ users, loading, onDelete, onRoleChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "ascending" | "descending" }>({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSort = (key: SortKey) => {
    if (!key) return;
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    const copy = [...(users || [])];
    if (!sortConfig.key) return copy;
    return copy.sort((a, b) => {
      const aValue = (a as any)[sortConfig.key!];
      const bValue = (b as any)[sortConfig.key!];
      if (aValue === bValue) return 0;
      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [users, sortConfig]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return sortedUsers;
    return sortedUsers.filter((u) =>
      [u.name, u.email, u.phone].some((field) => field?.toLowerCase().includes(term))
    );
  }, [sortedUsers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const indexOfLastItem = currentPageSafe * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const getRoleLabel = (roleId: number) => {
    if (roleId === 2) return "Admin";
    return "User";
  };

  const getRoleColor = (roleId: number) => {
    if (roleId === 2) return "bg-purple-100 text-purple-800";
    return "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <div className="mt-6 flex items-center justify-center text-slate-300 text-sm">
        Đang tải danh sách người dùng...
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg p-4">
      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <input
          type="text"
          placeholder="Tìm theo tên, email, SĐT..."
          className="w-full px-3 py-2 pl-9 border border-gray-700 rounded-lg bg-gray-800 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <FiSearch className="absolute left-2.5 top-2.5 text-gray-500" size={16} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              {(["id", "name", "email", "phone"] as SortKey[]).map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 select-none"
                >
                  <div className="flex items-center gap-1">
                    {column === "id" && "ID"}
                    {column === "name" && "Tên"}
                    {column === "email" && "Email"}
                    {column === "phone" && "SĐT"}
                    {sortConfig.key === column && (
                      sortConfig.direction === "ascending" ? (
                        <BsArrowUp className="w-3 h-3" />
                      ) : (
                        <BsArrowDown className="w-3 h-3" />
                      )
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {currentUsers.length > 0 ? (
              currentUsers.map((u, index) => (
                <tr
                  key={u.id}
                  className={
                    index % 2 === 0
                      ? "hover:bg-gray-800/70 transition-colors"
                      : "bg-gray-900/60 hover:bg-gray-800/70 transition-colors"
                  }
                >
                  <td className="px-4 py-3 whitespace-nowrap text-slate-200">{u.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-100 font-medium">{u.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{u.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{u.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 inline-flex text-[11px] leading-5 font-semibold rounded-full ${getRoleColor(
                          u.roleId
                        )}`}
                      >
                        {getRoleLabel(u.roleId)}
                      </span>
                      <select
                        value={u.roleId}
                        onChange={(e) => onRoleChange(u.id, Number(e.target.value))}
                        className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={1}>User</option>
                        <option value={2}>Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <button
                      className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                      onClick={() => onDelete(u.id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-sm">
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 text-xs">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                currentPageSafe === index + 1
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTable;
