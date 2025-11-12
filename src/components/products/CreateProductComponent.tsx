import React, { useState } from "react";
import { toast } from "react-toastify";
import type { CreateProduct } from "../../models/products";
import type { CreateAdminComponentProps } from "../../interfaces/createAdmin";
import { useCreateProduct } from "../../hooks/useProducts";

const CreateProductComponent: React.FC<CreateAdminComponentProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState<CreateProduct>({
    name: "",
    price: 0,
    quantity: 0,
    image: "",
    rate: 0,
    description: "",
    status: 1,
  });

  const createProductMutation = useCreateProduct();

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "rate"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate(form, {
      onSuccess: (res) => {
        if (res) {
          toast.success("Tạo sản phẩm thành công!");
          onClose();
        } else {
          toast.error("Tạo sản phẩm thất bại!");
        }
      },
      onError: (error) => {
        const msg =
          error?.message || "Lỗi kết nối server!";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
          Tạo sản phẩm mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số lượng
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Hình ảnh
            </label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400"
              rows={3}
              placeholder="Mô tả sản phẩm..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="px-4 py-2 rounded-md !bg-green-400 text-black hover:bg-green-500 transition"
            >
              {createProductMutation.isPending ? "Đang tạo..." : "Tạo sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductComponent;
