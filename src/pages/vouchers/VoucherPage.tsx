import { useState } from "react";
import { Table } from "antd";
import { useVouchers } from "../../hooks/useVoucher";
import ModalFormCreateVoucher from "../../components/voucher/CreateVoucherModal";
import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import ModalFormUpdateVoucher from "../../components/voucher/UpdateVoucherModal";
import type { VoucherResposne } from "../../models/voucher";

const VoucherPage = () => {
  const { vouchers, loading, createVoucher, deleteVoucher, updateVoucher } =
    useVouchers();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [openUpdate, setOpenUpdate] = useState(false);
const [selectedVoucher, setSelectedVoucher] = useState<VoucherResposne | null>(null);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Mã voucher", dataIndex: "code", width: 200 },
    { title: "Giảm", dataIndex: "discount", width: 200 },
    { title: "Số lượng", dataIndex: "quantity", width: 200 },
    { title: "Đã dùng", dataIndex: "usedQuantity" },
    { title: "Trạng thái", dataIndex: "status" },

    {
      title: "Thao tác",
      render: (record: any) => (
        <div className="flex space-x-2 items-center">
          
          <button
            className="flex items-center gap-2 bg-gray-200 border border-red-500 text-red-500 px-3 py-1 rounded transition"
            onClick={() => deleteVoucher(record.id)}
          >
            <TrashIcon className="w-5 h-5" />
            <span>Xóa</span>
          </button>

          {/* CẬP NHẬT */}
          <button
            className="flex items-center gap-2 bg-gray-200 border border-green-500 text-green-500 px-3 py-1 rounded transition"
            onClick={() => {
              setSelectedVoucher(record); 
              setOpenUpdate(true); 
            }}
          >
            <PencilSquareIcon className="w-5 h-5" />
            <span>Cập nhật</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Danh sách voucher</h2>

        <button className="!bg-green-300 px-4 py-2 rounded" onClick={() => setOpenCreateModal(true)}>
          Tạo Voucher
        </button>
      </div>
       <input
           type="text"
            placeholder="Tìm kiếm voucher..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
      <Table
        columns={columns}
        dataSource={vouchers}
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

      <ModalFormCreateVoucher
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={(data) => {
          createVoucher(data);
          setOpenCreateModal(false);

        }}
      />

      <ModalFormUpdateVoucher
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        voucher={selectedVoucher}
        onSubmit={(id, data) => {
          updateVoucher(id, data);
          setOpenUpdate(false);

        }}
      />
    </div>
  );
};

export default VoucherPage;
