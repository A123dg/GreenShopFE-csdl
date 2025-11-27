import { useState } from "react";
import { Table } from "antd";
import { EyeIcon } from "@heroicons/react/24/solid";
import type { OrderResponse } from "../../models/orders";
import { useOrder } from "../../hooks/useOrder";
import ModalViewOrder from "../../components/orders/ModalViewOrders";

const OrderPage = () => {
  const { orders, loading } = useOrder();

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpenView = (id: number) => {
    setSelectedId(id);
    setIsViewOpen(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Mã đơn", dataIndex: "orderCode", width: 140 },
    { title: "Khách hàng", dataIndex: "customerName", width: 160 },
    { title: "SĐT", dataIndex: "customerPhone", width: 120 },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 140,
      render: (date: string) =>
        date ? new Date(date).toLocaleString("vi-VN") : "",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      width: 120,
      render: (p: number) => p?.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (status: number) => (
        <span className={status === 1 ? "text-green-600" : "text-red-600"}>
          {status === 1 ? "Hoàn thành" : "Đang xử lý"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      width: 80,
      render: (record: OrderResponse) => (
        <button
          className="flex items-center gap-2 bg-gray-200 border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50"
          onClick={() => handleOpenView(record.id)}
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Danh sách đơn hàng
      </h2>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={false}
        loading={loading}
        components={{
          header: {
            cell: (props: any) => (
              <th {...props} className="!bg-green-300 text-black font-semibold">
                {props.children}
              </th>
            ),
          },
        }}
      />

      <ModalViewOrder
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        orderId={selectedId}
      />
    </div>
  );
};

export default OrderPage;
