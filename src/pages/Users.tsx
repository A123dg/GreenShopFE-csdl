import React, { useEffect, useState } from "react";
import type { UserResponse } from "../models/user";
import { userApi } from "../api/userApi";
import type { ApiResponse } from "../interfaces/ApiResponse";
import UpdateUserComponent from "../components/UpdateUserComponent";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import CreateAdminComponent from "../components/CreateAdminComponent";

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
   const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    const sub = userApi.getUsers().subscribe({
      next: (res: ApiResponse<UserResponse[]>) => {
        let userList: UserResponse[] = [];
        if (Array.isArray(res)) {
          toast.success()
          userList = res;
        } else if (res?.data && Array.isArray(res.data)) {
          userList = res.data;
        } else {
          setError("Invalid response format");
        }
        setUsers(userList);
        setFilteredUsers(userList);
        setLoading(false);
      },
      error: (err: ApiResponse<UserResponse[]>) => {
        setError(err?.message || "Unknown error");
        setLoading(false);
      },
    });
   
    return () => sub.unsubscribe();
  }, []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleAddUser = () => {
  setIsCreateModalOpen(true);
};
   const handleDelete = (userId: number) =>{
      const sub = userApi.deleteUser(userId).subscribe(
        {
          next: (res : ApiResponse<boolean>) => {
            toast.success(res.message)
            setUsers((prev) => prev.filter((u) => u.userId !== userId));
            setFilteredUsers((prev) => prev.filter((u)=> u.userId !== userId));
          },
          error: (err: ApiResponse<boolean>) => {
            toast.error(err.message);
          },
        }
      )
      return () => sub.unsubscribe();
    };
  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Đang tải người dùng...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-md p-4 mt-6">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="w-full  p-6 bg-white rounded-xl shadow-md space-y-2">
      <div className="flex justify-between item-center">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Danh sách người dùng</h2>
      <div className="flex space-x-5">
      <input
           type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        <button onClick={handleAddUser} className="bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 !hover:bg-green-700 text-gray-600 hover:text-gray-800">
            <UserPlusIcon className="w-6 h-6" />

        </button>
        </div>
          </div>
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Không có người dùng nào.</p>
      ) : (
        <div className="w-full">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-6 w-60 py-3 text-gray-700 font-semibold border-b">ID</th>
                <th className="px-6 w-60 py-3 text-gray-700 font-semibold border-b">Tên đăng nhập</th>
                <th className="px-6 w-60 py-3 text-gray-700 font-semibold border-b">Email</th>
                <th className="px-6  w-60 py-3 text-gray-700 font-semibold border-b">Vai trò</th>
                <th className="px-6 w-60 py-3 text-gray-700 font-semibold border-b text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
           <tbody>
  {filteredUsers.map((user) => (
    <tr
      key={user.userId}
      className="hover:bg-green-50 transition-all duration-200 cursor-pointer"
    >
      <td className="px-6 py-3 border-b">{user.userId}</td>
      <td className="px-6 py-3 border-b">{user.username}</td>
      <td className="px-6 py-3 border-b">{user.email}</td>
      <td className="px-6 py-3 border-b">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          user.role === "ADMIN"
            ? "bg-green-200 text-green-800"
            : "bg-emerald-100 text-emerald-700"
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-3 border-b text-center">
        <div className="flex space-x-5">
          <button onClick={() => handleEdit(user)} className="text-gray-600 hover:text-gray-800">
            <PencilSquareIcon className="w-6 h-6" />

          </button>
          {/* <button onClick={handleAddUser} className="text-gray-600 hover:text-gray-800">
            <UserPlusIcon className="w-6 h-6" />

          </button> */}
          <button onClick={() => handleDelete(user.userId)} className="text-red-400 hover:text-red-500">
            <TrashIcon className="w-6 h-6" />

          </button>
          
        </div>
      </td>
    </tr>
  ))}
</tbody>

          </table>

          <UpdateUserComponent
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userData={selectedUser}
          />
          <CreateAdminComponent
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  onSuccess={() => {
    const sub = userApi.getUsers().subscribe({
      next: (res: ApiResponse<UserResponse[]>) => {
        if (res?.data) {
          setUsers(res.data);
          setFilteredUsers(res.data);
        }
      },
    });
    return () => sub.unsubscribe();
  }}
/>


        </div>
      )}
    </div>
  );
};

export default Users;
