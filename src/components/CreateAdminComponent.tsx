import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userApi } from "../api/userApi";
import { toYYYYMMDD } from "../utils/date";
import type { UserResponse } from "../models/user";
import type { ApiResponse } from "../interfaces/ApiResponse";
import { toast } from "react-toastify";

interface CreateAdminComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAdminComponent: React.FC<CreateAdminComponentProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formattedDob = toYYYYMMDD(dob);

    const sub = userApi
      .createAdmin({
        username,
        email,
        dob: formattedDob || "",
        password,
      })
      .subscribe({
        next: (res: ApiResponse<UserResponse>) => {
          setLoading(false);
          if (res?.success) {
            toast.success(res.message || "Tạo quản trị viên thành công!");
            onClose();
            onSuccess?.();
          } else {
            toast.error(res?.message || "Tạo thất bại");
          }
        },
        error: (err: ApiResponse<UserResponse>) => {
          setLoading(false);
          toast.error(err?.error || "Lỗi kết nối mạng");
        },
      });

    return () => sub.unsubscribe();
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
          Tạo tài khoản quản lý mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ngày sinh
            </label>
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholderText="Chọn ngày sinh"
              maxDate={new Date()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={80}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 !hover:bg-green-700 text-gray-800 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminComponent;
