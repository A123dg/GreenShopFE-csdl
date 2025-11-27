import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { UserResponse } from "../models/user";
import { toast } from "react-toastify";

const SignIn: React.FC = () => {
  //Các state 
  const [username, setUsername] = useState(""); //lưu giá trị tên đăng nhập
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sub = userApi.login({ username, password }).subscribe({
      next: (res: ApiResponse<UserResponse>) => {
        if (res.success) {
          // Token được lưu bởi interceptor khi login
          toast.success(res.message);
          navigate("/");
        } else {
          toast.success(res.message || "Đăng nhập thất bại");
        }
        setLoading(false);
      },
      error: (err: any) => {
        const errorMessage = err?.response?.data?.message || err?.message || "Đăng nhập thất bại";
        toast.error(errorMessage);
        setLoading(false);
      },
    });

    return () => sub.unsubscribe();
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-100 to-green-200">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
          Đăng nhập
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition-all ${
              loading
                ? "!bg-green-300 cursor-not-allowed text-gray-800"
                : "!bg-green-400 hover:bg-green-700 text-black"
            }`}
          >
            {loading ? "Đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-600 font-medium hover:underline cursor-pointer"
          >
            Đăng kí
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;