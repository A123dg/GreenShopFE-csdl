import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userApi } from "../api/userApi";
import { toYYYYMMDD } from "../utils/date";
import type { UserResponse } from "../models/user";
import type { ApiResponse } from "../interfaces/ApiResponse";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedDob = toYYYYMMDD(dob);

    const sub = userApi
      .createUser({
        username,
        email,
        dob: formattedDob || "",
        password,
      })
      .subscribe({
        next: (res: ApiResponse<UserResponse>) => {
          if (res?.data) navigate("/signin");
          else setError(res?.message || "Đăng ký thất bại");
          setLoading(false);
        },
        error: (err: ApiResponse<UserResponse>) => {
          setError(err?.error || "Lỗi kết nối mạng");
          setLoading(false);
        },
      });

    return () => sub.unsubscribe();
  };

  return (
    <div className="flex justify-center w-screen items-center h-screen bg-gradient-to-br from-green-100 via-emerald-200 to-green-300">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
          Đăng ký tài khoản
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full !bg-green-500 text-black py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <a href="/signin" className="!text-green-600  hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
