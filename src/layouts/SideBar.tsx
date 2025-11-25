import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ShoppingCartIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định role dựa trên URL
  const role = useMemo(() => {
    return location.pathname.startsWith("/dashboard") ? "admin" : "user";
  }, [location.pathname]);

  const adminMenu = [
    { name: "Tổng quan", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
    { name: "Người dùng", icon: <UsersIcon className="h-5 w-5" />, path: "/dashboard/users" },
    { name: "Sản phẩm", icon: <ShoppingBagIcon className="h-5 w-5" />, path: "/dashboard/products" },
    { name: "Giỏ hàng", icon: <ShoppingCartIcon className="h-5 w-5" />, path: "/dashboard/carts" },
    { name: "Voucher", icon: <TicketIcon className="h-5 w-5" />, path: "/dashboard/vouchers" },
    { name: "Cài đặt", icon: <Cog6ToothIcon className="h-5 w-5" />, path: "/dashboard/settings" },
  ];

  const userMenu = [
    { name: "Sản phẩm", icon: <ShoppingBagIcon className="h-5 w-5" />, path: "/products" },
    { name: "Giỏ hàng", icon: <ShoppingCartIcon className="h-5 w-5" />, path: "/cart" },
    { name: "Voucher", icon: <TicketIcon className="h-5 w-5" />, path: "/voucher" },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  return (
    <aside
      className={`fixed top-[77px] left-0 h-[calc(100vh-5rem)]
      bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 
      text-emerald-700 shadow-lg transition-all duration-300 
      ${isOpen ? "w-64" : "w-20"} z-40`}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-emerald-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-emerald-700 hover:bg-emerald-600 transition"
        >
          <Bars3Icon className="h-4 w-4 text-black hover:text-emerald-700" />
        </button>
      </div>

      <nav className="flex flex-col space-y-2 mt-4 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center ${
                isOpen ? "space-x-3 px-4 justify-start" : "justify-center"
              } py-2 rounded-md font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-600 text-black hover:text-emerald-700"
                  : "bg-emerald-700 text-black hover:bg-emerald-600 hover:text-emerald-700"
              }`}
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;