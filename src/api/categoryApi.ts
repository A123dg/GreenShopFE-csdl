import type { ApiResponse } from "../interfaces/ApiResponse";
import type { CategoryResponse, CreateCategoryRequest, CategoryRequest } from "../models/category";
import axiosClient from "./axiosClient";


const CATEGORY_URL = "/categories";

export const categoryApi = {
  filter: (name?: string) =>
    axiosClient.get<ApiResponse<CategoryResponse[]>>(
      `${CATEGORY_URL}/filter`,
      { params: { name } }
    ),

  getAll: (params?: {
    categoryName?: string;
    productName?: string;
    status?: number;
  }) =>
    axiosClient.get<ApiResponse<CategoryResponse[]>>(CATEGORY_URL, {
      params,
    }),

  getById: (id: number) =>
    axiosClient.get<ApiResponse<CategoryResponse>>(`${CATEGORY_URL}/${id}`),

  create: (body: CreateCategoryRequest) =>
    axiosClient.post<ApiResponse<CategoryResponse>>(CATEGORY_URL, body),

  update: (id: number, body: CategoryRequest) =>
    axiosClient.put<ApiResponse<CategoryResponse>>(
      `${CATEGORY_URL}/${id}`,
      body
    ),

  delete: (id: number) =>
    axiosClient.delete<ApiResponse<void>>(`${CATEGORY_URL}/${id}`),
};
