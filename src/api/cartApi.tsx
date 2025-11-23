import type { ApiResponse } from "../interfaces/ApiResponse"
import type { CartAddRequest, CartDecreaseRequest, CartResponse } from "../models/cart"
import axiosClient from "./axiosClient"

const BASE_URL = `/carts`

    export const cartApi = {
    getAllCarts: () => axiosClient.get<ApiResponse<CartResponse[]>>(BASE_URL),

    decreaseCart: (data: CartDecreaseRequest) =>
        axiosClient.post<ApiResponse<CartResponse>>(`${BASE_URL}/decrease`, data),

    addCart: (data: CartAddRequest) =>
        axiosClient.post<ApiResponse<CartResponse>>(`${BASE_URL}/add`, data),

    getCartByUserId: (userId: number) =>
        axiosClient.get<ApiResponse<CartResponse>>(`${BASE_URL}/${userId}`, {
            headers: { id: userId.toString() },
        }),
};
    

