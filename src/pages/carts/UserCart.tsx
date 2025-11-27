import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useCarts } from "../../hooks/useCarts";
import type { CartAddRequest, CartDecreaseRequest } from "../../models/cart";
import { toast } from "react-toastify";

export function UserCartPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDecreaseModalOpen, setIsDecreaseModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [decreaseQuantity, setDecreaseQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const {
    userCart,
    userCartLoading,
    fetchUserCart,
    addCart,
    decreaseCart,
  } = useCarts();

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserCart();
    }
  }, [userId, fetchUserCart]);

  const handleToggleProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    if (!quantities[productId]) {
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      setQuantities((prev) => ({ ...prev, [productId]: quantity }));
    }
  };

  const openAddModal = () => {
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      for (const productId of selectedProducts) {
        const quantity = quantities[productId] || 1;
        const addRequest: CartAddRequest = {
          userId: parseInt(userId),
          productId,
          quantity,
        };
        await addCart(addRequest);
      }

      setSelectedProducts([]);
      setQuantities({});
      setIsAddModalOpen(false);
      toast.success("Thêm sản phẩm vào giỏ hàng thành công");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Thêm sản phẩm vào giỏ hàng thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const openDecreaseModal = (productId: number) => {
    setSelectedProductId(productId);
    setDecreaseQuantity(1);
    setIsDecreaseModalOpen(true);
  };

  const handleConfirmDecrease = async () => {
    if (!userId || selectedProductId === null) return;

    setIsLoading(true);
    try {
      const decreaseRequest: CartDecreaseRequest = {
        userId: parseInt(userId),
        productId: selectedProductId,
        quantity: decreaseQuantity,
      };
      await decreaseCart(decreaseRequest);
      setIsDecreaseModalOpen(false);
      setSelectedProductId(null);
      toast.success("Cập nhật thành công");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật giỏ hàng thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Vui lòng đăng nhập để xem giỏ hàng</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Product Selection */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Chọn sản phẩm</h2>

          {productsLoading ? (
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">Không có sản phẩm nào</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleToggleProduct(product.id)}
                    className="w-5 h-5 cursor-pointer"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      ${product.price}
                    </p>
                  </div>

                  {selectedProducts.includes(product.id) && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Số lượng:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantities[product.id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 px-2 py-1 border rounded-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={openAddModal}
            disabled={selectedProducts.length === 0 || productsLoading || isLoading}
            className="mt-6 w-full !bg-green-400 hover:!bg-green-600 disabled:bg-gray-400 text-black font-bold py-3 rounded-lg transition"
          >
            Thêm {selectedProducts.length > 0 ? selectedProducts.length : ""} sản phẩm vào giỏ
          </button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng của tôi</h2>

          {userCartLoading ? (
            <p className="text-gray-500">Đang tải giỏ hàng...</p>
          ) : !userCart || !userCart.items || userCart.items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Giỏ hàng trống</p>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userCart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-green-600 mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      <button
                        onClick={() => openDecreaseModal(item.productId)}
                        disabled={isLoading}
                        className="px-2 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded transition"
                      >
                        -
                      </button>
                      <button
                        onClick={() => openDecreaseModal(item.productId)}
                        disabled={isLoading}
                        className="px-2 py-1 text-sm bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${userCart.totalValue.toFixed(2)}
                  </span>
                </div>
                <button className="w-full !bg-green-300 hover:bg-green-700 text-black font-bold py-2 rounded-lg transition">
                  Thanh toán
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Xác nhận thêm sản phẩm</h3>

            <div className="mb-4 max-h-64 overflow-y-auto">
              {selectedProducts.map((productId) => {
                const product = products.find((p) => p.id === productId);
                return (
                  <div key={productId} className="flex justify-between py-2 border-b">
                    <span className="font-semibold">{product?.name}</span>
                    <span className="text-gray-600">x{quantities[productId] || 1}</span>
                  </div>
                );
              })}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Xác nhận thêm <strong>{selectedProducts.length}</strong> sản phẩm vào giỏ hàng
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAdd}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-400 text-black rounded-lg transition font-semibold"
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decrease Modal */}
      {isDecreaseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Cập nhật số lượng</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập số lượng cần giảm:
              </label>
              <input
                type="number"
                min="1"
                value={decreaseQuantity}
                onChange={(e) => setDecreaseQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Nếu giảm hết số lượng, sản phẩm sẽ bị xóa khỏi giỏ hàng
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDecreaseModalOpen(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDecrease}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition font-semibold"
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
