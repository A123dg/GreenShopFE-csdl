import type { ApiResponse } from "../interfaces/ApiResponse"
import type { OrderRequest, OrderResponse } from "../models/orders"
import axiosClient from "./axiosClient"

const BASE_URL = "/orders"
export const orderApi = {
    createOrder: (data: OrderRequest) => axiosClient.post<ApiResponse<OrderResponse>>(BASE_URL,data),
    updateOrder: (id:number,data: OrderRequest) => axiosClient.put<ApiResponse<OrderResponse>>(`${BASE_URL}/${id}`,data),
    getOrder:() => axiosClient.get<ApiResponse<OrderResponse[]>>(BASE_URL),
    getOrderById:(id: number) => axiosClient.get<ApiResponse<OrderResponse>>(`${BASE_URL}/${id}`)

    

}