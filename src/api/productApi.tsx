import axiosClient from "./axiosClient";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { CreateProduct, ProductResponse } from "../models/products";

const BASE_URL = `/products`;

export const productApi = {
  createProduct: (data: CreateProduct) => axiosClient.post<ApiResponse<ProductResponse>>(`${BASE_URL}`, data),

  getAllProcduct:() => axiosClient.get<ApiResponse<ProductResponse[]>>(BASE_URL),

  updateProduct: (id: number, data: CreateProduct) => {
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
