import type { ProductResponse } from "./products";

export interface CategoryResponse{
    id: number,
    name: string,
    status: number,
    productResponses: ProductResponse[],
}
export interface CategoryResponse{
    name: string,
    status: number,
    productId: number[],
}