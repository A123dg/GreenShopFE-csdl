import React, { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import type { UpdateUserRequest } from "../models/user";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { toYYYYMMDD } from "../utils/date";
import type { UpdateUserComponentProps } from "../interfaces/updateUserComponentProps";
interface UpdateFormData extends UpdateUserRequest {
  id?: number;
}

const UpdateUserComponent: React.FC<UpdateUserComponentProps> = ({
  isOpen,
  onClose,
  userData,
}) => {
  const [dob, setDob] = useState<Date | null>(null);
  const [formData, setFormData] = useState<UpdateFormData>({
    id: undefined,
    email: "",
    username: "",
    dob: "",
    password: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.userId,
        email: userData.email || "",
        username: userData.username || "",
        dob: userData.dob || "",
        password: "",
      });
      setDob(userData.dob ? new Date(userData.dob) : null);
    }
  }, [userData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id) {
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }

    const updatedData: UpdateUserRequest = {
  username: (formData.username ?? "").trim(),
  email: (formData.email ?? "").trim(),
  dob: dob ? toYYYYMMDD(dob) : "",
  password: (formData.password ?? "").trim(),
};

    userApi.updateUser(formData.id, updatedData).subscribe({
      next: (res) => {
        toast.success(res.message || "Cập nhật người dùng thành công!");
        onClose();
      },
      error: (err) => {
        toast.error(err.message || "Có lỗi xảy ra khi cập nhật!");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Cập nhật người dùng
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 text-gray-700">Tên người dùng</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-gray-700">Ngày sinh</label>
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholderText="Chọn ngày sinh"
              maxDate={new Date()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={80}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-gray-700">Mật khẩu mới (tuỳ chọn)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Để trống nếu không đổi mật khẩu"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md !bg-green-300 text-black hover:bg-green-500 transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserComponent;
