import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useUpdateProduct } from "../../hooks/useProducts";
import { toast } from "react-toastify";
import type { ProductResponse } from "../../models/products";

interface EditProductComponentProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductResponse;
}

const EditProductComponent: React.FC<EditProductComponentProps> = ({ 
  isOpen, 
  onClose, 
  product 
}) => {
  const updateMutation = useUpdateProduct();
  
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    description: product.description,
    rate: product.rate,
  });

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  // Reset form khi product thay đổi
  useEffect(() => {
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      rate: product.rate,
    });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" || name === "rate" 
        ? Number(value) 
        : value,
    }));
    
    // Clear error khi user nhập
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {
      name: "",
      price: "",
      quantity: "",
      description: "",
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
      isValid = false;
    }

    if (formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
      isValid = false;
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Số lượng không được âm";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    updateMutation.mutate(
      { 
        id: product.id, 
        ...formData 
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success("Cập nhật sản phẩm thành công");
            onClose();
          } else {
            toast.success(res.message || "Cập nhật thành công");
          }
        },
        onError: (err: any) => {
          toast.error(err?.message || "Đã xảy ra lỗi khi cập nhật");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-green-700">
            Chỉnh sửa sản phẩm #{product.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:ring-green-500"
              }`}
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Giá và Số lượng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="0"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.quantity 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Đánh giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá (0-5)
            </label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                errors.description 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:ring-green-500"
              }`}
              placeholder="Nhập mô tả sản phẩm"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={updateMutation.isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 !bg-green-300 text-gray-900 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductComponent;