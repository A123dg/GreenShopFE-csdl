import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { cartApi } from "../../api/cartApi";
import { toast } from "react-toastify";
import type { CartItemResponse } from "../../models/cart";

interface CartDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const CartDetailModal: React.FC<CartDetailModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [cartDetail, setCartDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchCartDetail(userId);
    }
  }, [isOpen, userId]);

 const fetchCartDetail = async(userId : number) => {
  try{
    setLoading(true);
    const res = await cartApi.getCartByUserId(userId);
    toast.success(res.data.message || "Lấy cart theo user thành công")
    setCartDetail(res.data)
    return res.data;
  }
  catch(err  : any)
  {
    toast.error(err.data.message || "Lấy cart thất bại")
  }
  finally{
    setLoading(false);
  }

 }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-700">
            Chi tiết giỏ hàng (User ID: {userId})
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : cartDetail ? (
          <div>
            <p className="mb-4 text-gray-700">
              <strong>Giỏ hàng ID:</strong> {cartDetail.id}
            </p>

            {cartDetail.items && cartDetail.items.length > 0 ? (
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Sản phẩm</th>
                    <th className="px-4 py-2 text-left border-b">Giá</th>
                    <th className="px-4 py-2 text-left border-b">Số lượng</th>
                    <th className="px-4 py-2 text-left border-b">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {cartDetail.items.map((item : CartItemResponse) => (
                    <tr key={item.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{item.productName}</td>
                      <td className="px-4 py-2 border-b">{item.price}đ</td>
                      <td className="px-4 py-2 border-b">{item.quantity}</td>
                      <td className="px-4 py-2 border-b">
                        {item.price * item.quantity}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">Giỏ hàng trống</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Không có dữ liệu</p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDetailModal;
