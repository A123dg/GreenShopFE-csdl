import { productApi } from "../api/productApi";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { ProductResponse, CreateProduct } from "../models/products";

export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};

// Lấy danh sách sản phẩm
export const getProductsQuery = async () => {
  const res = await productApi.getAllProcduct();

  // Chuẩn hóa kết quả
  const data = res?.data?.data || res?.data || [];
  if (!Array.isArray(data)) throw new Error("Không có dữ liệu từ server");

  return data as ProductResponse[];
};

// Tạo sản phẩm mới
export const createProductQuery = async (form: CreateProduct) => {
  const res = await productApi.createProduct(form);
  return res.data as ApiResponse<ProductResponse>;
};

//  Xóa sản phẩm
export const deleteProductQuery = async (id: number) => {
  const res = await productApi.deleteProduct(id);
  return res.data as ApiResponse<boolean>;
};
