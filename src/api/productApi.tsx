import axiosClient from "./axiosClient";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { CreateProduct, ProductResponse, UpdateProduct } from "../models/products";
import type { ProductQuery } from "../interfaces/query";

const BASE_URL = `/products`;

export const productApi = {
  createProduct: (data: CreateProduct) => axiosClient.post<ApiResponse<ProductResponse>>(`${BASE_URL}`, data),

  getAllProcduct:() => axiosClient.get<ApiResponse<ProductResponse[]>>(BASE_URL),
  getProductWithFilter : (query: ProductQuery) => axiosClient<ApiResponse<ProductResponse[]>>(`${BASE_URL}/filter`,
{
  params : query
}  ),
  updateProduct: (id: number, data: UpdateProduct) => {
  return axiosClient.put(`${BASE_URL}/${id}`, data, {
    headers: {
      id: id.toString(), 
    },
  });
},

  deleteProduct:(id: number) => {
    return axiosClient.delete<ApiResponse<boolean>>(`${BASE_URL}/${id}`)
  }

};
