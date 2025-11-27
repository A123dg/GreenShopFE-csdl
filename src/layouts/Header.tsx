import React, { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import UpdateUserComponent from "../components/UpdateUserComponent";
import type { UserResponse } from "../models/user";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();
const [username, setUsername] = useState<string | null>(null);
const [userData, setUserData] = useState<UserResponse | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(() => {
const storedUserJson = localStorage.getItem("userData"); // lưu trữ object JSON
if (storedUserJson) {
const storedUser: UserResponse = JSON.parse(storedUserJson);
setUsername(storedUser.username);
setUserData(storedUser);
}
}, []);

const handleLogout = () => {
localStorage.removeItem("userData");
localStorage.removeItem("accessToken");
setUsername(null);
setUserData(null);
};

return ( <header className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 px-6 flex justify-between items-center z-20"> <div className="text-2xl font-bold text-green-600 cursor-pointer select-none flex items-center"> <p className="font-bold text-green-700">GreenShop</p> <SparklesIcon className="ml-2 h-6 w-6 text-green-600" /> </div>

```
    {(username  && userData)? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 font-medium">
             <span className="text-green-700">{username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="border border-red-500 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        // Nếu chưa đăng nhập
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/signup")}
            className="text-gray-800 border !bg-green-300 border-green-600 rounded-lg px-4 py-1.5 font-medium hover:bg-green-600 hover:text-white transition-all"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="text-gray-800 border !bg-green-300 border-green-600 rounded-lg px-4 py-1.5 font-medium hover:bg-green-600 hover:text-white transition-all"
          >
            Sign In
          </button>
        </div>
      )}

  
  <UpdateUserComponent
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    userData={userData}
  />
</header>

);
};

export default Header;
