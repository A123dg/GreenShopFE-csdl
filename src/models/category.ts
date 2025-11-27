import type { ProductResponse } from "./products";

export interface CategoryResponse{
    id: number,
    name: string,
    status: number,
    productResponses: ProductResponse[],
}
export interface CreateCategoryRequest{
    name: string,
    status: number,
    productId: number[],
}
export interface CategoryRequest {
  name: string;
  description?: string;
  status?: number;
}