import React, { useState } from "react";
import { useCarts } from "../../hooks/useCarts";
import CartDetailModal from "../../components/carts/CartDetailModal";
import type { CartResponse } from "../../models/cart";
import { EyeIcon } from "@heroicons/react/24/outline";

const UserCartPage: React.FC = () => {
  const { carts, loading, error } = useCarts();
  const [selectedCart, setSelectedCart] = useState<CartResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewCart = (cart: CartResponse) => {
    setSelectedCart(cart);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Đang tải giỏ hàng...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-md p-4 mt-6">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Giỏ hàng của bạn</h2>

      {carts.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Không có sản phẩm nào.</p>
      ) : (
        <div className="w-full">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-6 py-3 text-gray-700 font-semibold border-b">ID</th>
                <th className="px-6 py-3 text-gray-700 font-semibold border-b ">User ID</th>
                <th className="px-6 py-3 text-gray-700 font-semibold border-b ">
                  Tổng SL
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold border-b ">
                  Tổng giá trị
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold border-b text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {carts.map((cart) => (
                <tr
                  key={cart.id}
                  className="hover:bg-green-50 transition-all duration-200"
                >
                  <td className="px-6 py-3 border-b">{cart.id}</td>
                  <td className="px-6 py-3 border-b">{cart.userId}</td>
                  <td className="px-6 py-3 border-b">{cart.totalQuantity}</td>
                  <td className="px-6 py-3 border-b">
                    {cart.totalValue?.toLocaleString("vi-VN")} ₫
                  </td>

                  <td className="px-6 py-3 border-b text-center">
                    <button
                      onClick={() => handleViewCart(cart)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-6 h-6 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <CartDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            userId={selectedCart?.userId ?? 0}
          />
        </div>
      )}
    </div>
  );
};

export default UserCartPage;
