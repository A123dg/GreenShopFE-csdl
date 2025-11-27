import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useOrder } from "../../hooks/useOrder";
import type { OrderResponse } from "../../models/orders";

interface ModalViewOrderProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

const ModalViewOrder: React.FC<ModalViewOrderProps> = ({ isOpen, onClose, orderId }) => {
  const { getOrderById, loading } = useOrder();
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      (async () => {
        const data = await getOrderById(orderId);
        setOrderData(data || null);
      })();
    }
  }, [isOpen, orderId, getOrderById]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] relative">
        
        {/* Close button */}
        <button className="absolute top-3 right-3" onClick={onClose}>
          <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>

        <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>

        {loading && <p>Đang tải...</p>}

        {!loading && orderData && (
          <>
            <div className="mb-4">
              <p><b>ID đơn hàng:</b> {orderData.id}</p>
              <p><b>Khách hàng:</b> {orderData.userName}</p>
              <p><b>Ghi chú:</b> {orderData.note}</p>
              <p><b>Tổng giá:</b> {orderData.totalPrice.toLocaleString()} đ</p>
              <p><b>Ngày tạo:</b> {orderData.createAt}</p>
              <p><b>Trạng thái:</b> {orderData.status}</p>
            </div>

            <hr className="my-4" />

            <h3 className="font-semibold mb-2">Chi tiết sản phẩm</h3>
            
            <div className="border p-3 rounded bg-gray-50">
              <p><b>ID sản phẩm:</b> {orderData.orderDetails.productId}</p>
              <p><b>Tên sản phẩm:</b> {orderData.orderDetails.productName}</p>
              <p><b>Số lượng:</b> {orderData.orderDetails.quantity}</p>
              <p><b>Giá:</b> {orderData.orderDetails.price.toLocaleString()} đ</p>
              <p><b>Trạng thái:</b> {orderData.orderDetails.status}</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ModalViewOrder;
