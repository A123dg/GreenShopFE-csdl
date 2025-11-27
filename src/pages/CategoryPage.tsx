import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { useCategory } from "../hooks/useCategory";
import { useProducts } from "../hooks/useProducts";
import type { CategoryResponse, CategoryRequest, CreateCategoryRequest } from "../models/category";

const CategoryPage = () => {
  const { categories, loading, getAll, filterByName, create, update, remove } = useCategory();
  const { data: products = [], isLoading: productsLoading } = useProducts(); // hook products

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getAll();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record: CategoryResponse) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      status: record.status,
     
      productId: record.productResponses.map((p) => p.id),
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    if (editing) {
      const body: CategoryRequest & { productId?: number[] } = {
        name: values.name,
        description: values.description,
        status: values.status,
        productId: values.productId,
      };
      await update(editing.id, body);
    } else {
      const body: CreateCategoryRequest = {
        name: values.name,
        status: values.status,
        productId: values.productId,
      };
      await create(body);
    }

    setOpen(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },
    { title: "Tên", dataIndex: "name" },
    { title: "Trạng thái", dataIndex: "status", render: (v: number) => (v === 1 ? "Active" : "Inactive") },
    {
      title: "Hành động",
      width: 200,
      render: (record: CategoryResponse) => (
        <div className="flex gap-2">
          <Button onClick={() => openEdit(record)}>Sửa</Button>
          <Button danger onClick={() => remove(record.id)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* SEARCH */}
      <div className="flex justify-between mb-3">
        <Input.Search
          allowClear
          placeholder="Tìm theo tên..."
          className="w-64"
          onSearch={(val) => filterByName(val)}
        />
        <Button className="!bg-green-300" onClick={openCreate}>+ Thêm danh mục</Button>
      </div>

      <Table pagination={false} loading={loading} rowKey="id" dataSource={categories} columns={columns} />

      <Modal
        title={editing ? "Cập nhật danh mục" : "Thêm mới danh mục"}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
          okButtonProps={{ className: "!bg-green-400 hover:bg-green-500 border-none" }}

      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Không được bỏ trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Sản phẩm"
            name="productId"
            rules={[{ required: true, message: "Chọn sản phẩm" }]}
          >
            <Select
              mode="multiple"
              loading={productsLoading}
              placeholder="Chọn sản phẩm"
              options={products.map((p) => ({ label: p.name, value: p.id }))}
            />
          </Form.Item>

          

          <Form.Item label="Trạng thái" name="status" initialValue={1}>
            <Select options={[{ label: "Active", value: 1 }, { label: "Inactive", value: 0 }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
