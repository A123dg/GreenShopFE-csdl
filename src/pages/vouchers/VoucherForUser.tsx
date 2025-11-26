import { useState, useMemo, useEffect } from "react";
import { Table, Input, Button, Select } from "antd";
import { useVouchers } from "../../hooks/useVoucher";
import {  PencilSquareIcon } from "@heroicons/react/24/solid";
import debounce from "lodash.debounce";
import type { VoucherResposne } from "../../models/voucher";
import ModalFormUseVoucher from "../../components/voucher/UseVoucherModal";

const { Option } = Select;

const UserVoucherPage = () => {
  const {
    vouchers,
    loading,
    updateVoucher,
    query,
    setQuery,
    fetchVoucher,
  } = useVouchers();

  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherResposne | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const debouncedFetch = useMemo(
    () =>
      debounce((search: string) => {
        fetchVoucher({ ...query, search });
      }, 500),
    [fetchVoucher, query]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery({ ...query, search: value });
    debouncedFetch(value);
  };

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Mã voucher", dataIndex: "code", width: 200 },
    { title: "Giảm", dataIndex: "discount", width: 200 },
    { title: "Số lượng", dataIndex: "quantity", width: 200 },
    { title: "Đã dùng", dataIndex: "usedQuantity" },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Thao tác",
      render: (record: VoucherResposne) => (
        <div className="flex space-x-2 items-center">
          

          <button
            className="flex items-center gap-2 bg-gray-200 border border-green-500 text-green-500 px-3 py-1 rounded transition"
            onClick={() => {
              setSelectedVoucher(record);
              setOpenUpdate(true);
            }}
          >
            <PencilSquareIcon className="w-5 h-5" />
            <span>Sử dụng</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold  text-green-700 mb-4">Danh sách voucher</h2>
        
      </div>

      <div className="flex !space-x-2 mb-4 items-end">
        <Input
          placeholder="Tìm kiếm voucher..."
          value={query.search}
          onChange={handleSearchChange}
          className="w-64"
        />

        <Button onClick={() => setShowAdvancedSearch((prev) => !prev)}>
          Tìm kiếm nâng cao
        </Button>
      </div>

      {showAdvancedSearch && (
        <div className="flex !space-x-2 mb-4 items-end">
          <Select
            placeholder="Chọn trạng thái"
            value={query.status}
            onChange={(value) => setQuery({ ...query, status: value })}
            style={{ width: 150 }}
            allowClear
          >
            <Option value={1}>Đang hoạt động</Option>
            <Option value={0}>Ngưng hoạt động</Option>
          </Select>

          <Input
            placeholder="Giảm tối thiểu"
            type="number"
            value={query.discount}
            onChange={(e) =>
              setQuery({ ...query, discount: Number(e.target.value) || undefined })
            }
            style={{ width: 150 }}
          />

          <Button type="primary" onClick={() => fetchVoucher(query)}>
            Áp dụng
          </Button>
        </div>
      )}

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

      
      <ModalFormUseVoucher
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

export default UserVoucherPage;
