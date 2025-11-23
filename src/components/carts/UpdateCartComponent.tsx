// import React, { useState, useEffect } from "react";
// import type { CartAddRequest, CartDecreaseRequest, CartResponse } from "../../models/cart";
// import  { cartApi } from "../../api/cartApi";

// export type UpdateCartModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   userId: number;
//   cartItem?: CartResponse | null; 
//   productId?: number; 
//   onSaved?: () => void; 
// };

// export default function UpdateCartModal({
//   isOpen,
//   onClose,
//   userId,
//   cartItem = null,
//   productId,
//   onSaved,
// }: UpdateCartModalProps) {
//   const [mode, setMode] = useState<"add" | "decrease">("add");
//   const [quantity, setQuantity] = useState<number>(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // khi mở modal cập nhật giá trị mặc định
//   useEffect(() => {
//     if (isOpen) {
//       setMode("add");
//       setError(null);
//       // nếu có cartItem thì mặc định quantity = 1, nếu muốn có khác có thể thay
//       setQuantity(1);
//     }
//   }, [isOpen, cartItem]);

//   if (!isOpen) return null;

//   const productIdToUse = cartItem ? cartItem.id : productId;

//   const handleSave = async () => {
//     if (!productIdToUse) {
//       setError("Không xác định productId");
//       return;
//     }
//     if (quantity <= 0) {
//       setError("Số lượng phải lớn hơn 0");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       if (mode === "add") {
//         const payload: CartAddRequest = {
//           userId,
//           productId: productIdToUse,
//           quantity,
//         };
//         await cartApi.addCart(payload);
//       } else {
//         const payload: CartDecreaseRequest = {
//           userId,
//           productId: productIdToUse,
//           quantity,
//         };
//         await cartApi.decreaseCart(payload);
//       }

//       // gọi callback nếu có
//       onSaved?.();
//       onClose();
//     } catch (err: any) {
//       // hiển thị message nếu server trả về
//       const msg = err?.response?.data?.message || err?.message || "Lỗi khi cập nhật giỏ hàng";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50"
//         onClick={() => {
//           if (!loading) onClose();
//         }}
//       />

//       {/* modal */}
//       <div className="relative z-10 max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 mx-4">
//         <div className="flex items-start gap-4">
//           <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
//             {cartItem?.image ? (
//               <img src={cartItem.image} alt={cartItem.productName} className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No Image</div>
//             )}
//           </div>

//           <div className="flex-1">
//             <h3 className="text-lg font-medium">{cartItem?.productName ?? "Sản phẩm"}</h3>
//             <p className="text-sm text-gray-500">Giá: {cartItem ? `${cartItem.price}` : "-"}</p>
//             <p className="text-sm text-gray-500">Số lượng hiện tại: {cartItem ? cartItem.quantity : 0}</p>
//           </div>

//           <button
//             className="text-gray-400 hover:text-gray-600"
//             onClick={() => {
//               if (!loading) onClose();
//             }}
//             aria-label="Đóng"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="mt-5">
//           <label className="flex items-center gap-3">
//             <input
//               type="radio"
//               name="mode"
//               checked={mode === "add"}
//               onChange={() => setMode("add")}
//               className="form-radio"
//             />
//             <span className="select-none">Thêm</span>

//             <input
//               type="radio"
//               name="mode"
//               checked={mode === "decrease"}
//               onChange={() => setMode("decrease")}
//               className="form-radio ml-4"
//             />
//             <span className="select-none">Giảm</span>
//           </label>

//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700">Số lượng</label>
//             <div className="mt-1 flex items-center gap-2">
//               <button
//                 type="button"
//                 className="px-2 py-1 rounded-md border border-gray-200"
//                 onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                 disabled={loading}
//               >
//                 -
//               </button>

//               <input
//                 type="number"
//                 value={quantity}
//                 min={1}
//                 onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
//                 className="w-24 text-center rounded-md border border-gray-200 px-3 py-1"
//                 disabled={loading}
//               />

//               <button
//                 type="button"
//                 className="px-2 py-1 rounded-md border border-gray-200"
//                 onClick={() => setQuantity((q) => q + 1)}
//                 disabled={loading}
//               >
//                 +
//               </button>
//             </div>

//             <p className="mt-2 text-xs text-gray-500">Lưu ý: nếu chọn "Giảm" và số lượng giảm vượt quá số lượng hiện tại, backend có thể xử lý theo riêng.</p>
//           </div>

//           {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

//           <div className="mt-6 flex justify-end gap-3">
//             <button
//               className="px-4 py-2 rounded-md border border-gray-200"
//               onClick={() => {
//                 if (!loading) onClose();
//               }}
//               disabled={loading}
//             >
//               Hủy
//             </button>

//             <button
//               className={`px-4 py-2 rounded-md font-medium bg-green-300 hover:bg-green-400 disabled:opacity-60`} 
//               onClick={handleSave}
//               disabled={loading}
//             >
//               {loading ? "Đang lưu..." : "Lưu thay đổi"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
