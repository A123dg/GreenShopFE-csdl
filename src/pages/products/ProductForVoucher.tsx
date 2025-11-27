import React, { useState, useMemo } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import type { ProductResponse } from "../../models/products";
import CreateProductComponent from "../../components/products/CreateProductComponent";
import { useProducts } from "../../hooks/useProducts";
import debounce from "lodash.debounce";

const ProductUserPage: React.FC = () => {
  const { data, isLoading, isError, error } = useProducts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    status: "",
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setSearchTerm(term);
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleAddToCart = (product: ProductResponse) => {
    toast.info(`Đã thêm ${product.name} vào giỏ hàng`);
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

  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = filters.minPrice === "" || product.price >= Number(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === "" || product.price <= Number(filters.maxPrice);
    const matchesStatus =
      filters.status === "" || String(product.status) === filters.status;

    return matchesName && matchesMinPrice && matchesMaxPrice && matchesStatus;
  });

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">Danh sách sản phẩm</h2>
      </div>

      {/* Search Bar với nút tìm kiếm nâng cao */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={handleSearchChange}
        />
        <button
          onClick={() => setShowAdvancedSearch((prev) => !prev)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 border hover:bg-green-600 transition whitespace-nowrap font-medium"
        >
          {showAdvancedSearch ? "Đóng tìm kiếm nâng cao" : "Tìm kiếm nâng cao"}
        </button>
      </div>

      {/* Advanced Search Section */}
      {showAdvancedSearch && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-green-700 mb-3">Tìm kiếm nâng cao</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Giá tối thiểu */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Giá tối thiểu</label>
              <input
                type="number"
                placeholder="Nhập giá..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value,
                  }))
                }
              />
            </div>

            {/* Giá tối đa */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Giá tối đa</label>
              <input
                type="number"
                placeholder="Nhập giá..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value,
                  }))
                }
              />
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Trạng thái</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="">Tất cả</option>
                <option value="1">Hoạt động</option>
                <option value="0">Ngưng hoạt động</option>
              </select>
            </div>

            {/* Nút reset */}
            <div className="flex items-end">
              <button
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                onClick={() => {
                  setFilters({ minPrice: "", maxPrice: "", status: "" });
                  setSearchTerm("");
                }}
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Không có sản phẩm nào.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto bg-white rounded-lg">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-6 py-3 text-gray-700 font-semibold whitespace-nowrap min-w-[50px]">
                  ID
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold whitespace-nowrap min-w-[180px]">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold whitespace-nowrap min-w-[100px]">
                  Giá
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold whitespace-nowrap min-w-[90px]">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[200px]">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold whitespace-nowrap min-w-[100px]">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-gray-700 font-semibold min-w-[180px]">
                  Trạng thái
                </th>
                
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-green-50 transition-all duration-200 cursor-pointer"
                >
                  <td className="px-6 py-3 border-b whitespace-nowrap">{product.id}</td>
                  <td className="px-6 py-3 border-b whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-3 border-b whitespace-nowrap">
                    {product.price.toLocaleString()} đ
                  </td>
                  <td className="px-6 py-3 border-b whitespace-nowrap">{product.quantity}</td>
                  <td className="px-6 py-3 border-b">{product.description}</td>
                  <td className="px-6 py-3 border-b ">
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
                  <td className="px-6 py-3 border-b min-w-[100px]">
                    <span
                      className={`px-6 py-1 rounded-full text-sm font-medium ${
                        product.status === 1 || product.status === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product.status === 1 || product.status === 0
                        ? "Hoạt động"
                        : "Ngưng hoạt động"}
                    </span>
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
    </div>
  );
};

export default ProductUserPage;