import type { ApiResponse } from "../interfaces/ApiResponse";
import type { VoucherQuery } from "../interfaces/query";
import type { VoucherResposne, VoucherRequest } from "../models/voucher";
import axiosClient from "./axiosClient";

const BASE_URL = `/vouchers`;

export const voucherApi = {
    createVoucher :( data: VoucherRequest) => axiosClient.post<ApiResponse<VoucherResposne>>(`${BASE_URL}`,data),

    updateVoucher : (id:number, data: VoucherRequest) => axiosClient.put<ApiResponse<VoucherResposne>>(`${BASE_URL}/${id}`,data),

    deleteVoucher : (id : number) => axiosClient.delete<ApiResponse<boolean>>(`${BASE_URL}/${id}`),

getAllVoucher: (query: VoucherQuery) =>
  axiosClient.get<ApiResponse<VoucherResposne[]>>(`${BASE_URL}/vouchers`, {
    params: query,
  })

};
