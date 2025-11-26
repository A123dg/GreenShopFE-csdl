import type { ApiResponse } from "../interfaces/ApiResponse"
import type { OrderRequset, OrderResponse } from "../models/orders"
import axiosClient from "./axiosClient"

const BASE_URL = "/orders"
export const orderApi = {
    createOrder: (data: OrderRequset) => axiosClient.post<ApiResponse<OrderResponse>>(BASE_URL,data),
    updateOrder: (id:number,data: OrderRequset) => axiosClient.put<ApiResponse<OrderResponse>>(`${BASE_URL}/${id}`,data)
}