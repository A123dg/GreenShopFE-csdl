import React, { useState } from "react";
import {  PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import type { ProductResponse } from "../../models/products";
import CreateProductComponent from "../../components/products/CreateProductComponent";
import { useProducts } from "../../hooks/useProducts";

const ProductUserPage: React.FC = () => {
  const { data, isLoading, isError, error } = useProducts();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

  
 

  const handleEdit = (product: ProductResponse) => {
    toast.info(`Sửa sản phẩm: ${product.name}`);
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
          
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Không có sản phẩm nào.</p>
      ) : (
        <div className="w-full overflow-x-auto">
  <table className="w-full table-auto bg-white  rounded-lg">
    <thead className="bg-green-100 text-left">
      <tr>
        <th className="px-6 py-3 text-gray-700 font-semibold  whitespace-nowrap min-w-[80px]">ID</th>
        <th className="px-6 py-3 text-gray-700 font-semibold  whitespace-nowrap min-w-[180px]">Tên sản phẩm</th>
        <th className="px-6 py-3 text-gray-700 font-semibold  whitespace-nowrap min-w-[100px]">Giá</th>
        <th className="px-6 py-3 text-gray-700 font-semibold  whitespace-nowrap min-w-[90px]">Số lượng</th>
        <th className="px-6 py-3 text-gray-700 font-semibold  min-w-[200px]">Mô tả</th>
        <th className="px-6 py-3 text-gray-700 font-semibold  whitespace-nowrap min-w-[100px]">Đánh giá</th>
        <th className="px-6 py-3 text-gray-700 font-semibold  min-w-[50px]">Trạng thái</th>

        <th className="px-6 py-3 text-gray-700 font-semibold  text-center whitespace-nowrap min-w-[120px]">Thao tác</th>
      </tr>
    </thead>

    <tbody>
      {products.map((product) => (
        <tr key={product.id} className="hover:bg-green-50 transition-all duration-200 cursor-pointer">

          <td className="px-6 py-3 border-b whitespace-nowrap">{product.id}</td>
          <td className="px-6 py-3 border-b whitespace-nowrap">{product.name}</td>
          <td className="px-6 py-3 border-b whitespace-nowrap">{product.price}</td>
          <td className="px-6 py-3 border-b whitespace-nowrap">{product.quantity}</td>

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
          <td className="px-6 py-3 border-b">{product.status}</td>

          <td className="px-6 py-3 border-b text-center">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleEdit(product)}
                className="text-gray-600 hover:text-gray-800"
              > 
                <PlusIcon className="w-6 h-6" /> Thêm vào giỏ hàng
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
        <CreateProductComponent isOpen={isCreateOpen}
        onClose={()=> setIsCreateOpen(false)}
     
        ></CreateProductComponent>
      )}
    </div>
  );
};

export default ProductUserPage;
