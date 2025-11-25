import React, { useState } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useDeleteProduct, useProducts } from "../../hooks/useProducts";
import { toast } from "react-toastify";
import type { ProductResponse } from "../../models/products";
import CreateProductComponent from "../../components/products/CreateProductComponent";
import EditProductComponent from "../../components/products/UpdateProductComponent";

const ProductsPage: React.FC = () => {
  const { data, isLoading, isError, error } = useProducts();
  const deleteMutation = useDeleteProduct();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: (res) => {
        if (res.success) toast.success("Xóa thành công");
        else toast.error(res.message);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleAddProduct = () => {
    setIsCreateOpen(true);
  };

  const handleEdit = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-6">Đang tải sản phẩm...</p>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-md p-4 mt-6">
        Lỗi: {error?.message}
      </div>
    );
  }

  const products = data || [];

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Danh sách sản phẩm</h2>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 !bg-green-300 text-gray-800 rounded-lg hover:bg-green-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Thêm
          </button>
        </div>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Không có sản phẩm nào.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-lg">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[80px]">ID</th>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[180px]">Tên sản phẩm</th>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[100px]">Giá</th>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[90px]">Số lượng</th>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[220px]">Mô tả</th>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[100px]">Đánh giá</th>
                <th className="px-6 py-3 text-gray-700 font-semibold text-center min-w-[120px]">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-green-50 transition cursor-pointer">

                  <td className="px-6 py-3 border-b">{product.id}</td>
                  <td className="px-6 py-3 border-b">{product.name}</td>
                  <td className="px-6 py-3 border-b">{product.price}</td>
                  <td className="px-6 py-3 border-b">{product.quantity}</td>
                  <td className="px-6 py-3 border-b">{product.description}</td>

                  <td className="px-6 py-3 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.rate > 2.5
                          ? "bg-green-200 text-green-800"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {product.rate}
                    </span>
                  </td>

                  <td className="px-6 py-3 border-b text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateOpen && (
        <CreateProductComponent
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {isEditOpen && selectedProduct && (
        <EditProductComponent
          isOpen={isEditOpen}
          product={selectedProduct}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductsPage;
