import type { ApiResponse } from "../interfaces/ApiResponse"
import type { NewsQuery } from "../interfaces/query"
import type { NewsResponse, NewsRequest } from "../models/news"
import axiosClient from "./axiosClient"

const BASE_URL = "/news"
export const newsApi = {
    createNews: (data : NewsRequest) => axiosClient.post<ApiResponse<NewsResponse>>(BASE_URL, data),
    getNewsWithFilter:(query: NewsQuery) => axiosClient.get<ApiResponse<NewsResponse[]>>(`${BASE_URL}/filter`,{
        params: query,
    }),
    deleteNews: (id: number)=> axiosClient.delete<ApiResponse<boolean>>(`${BASE_URL}/${id}`),
    updateNews : (id: number,data: NewsRequest) => axiosClient.put<ApiResponse<NewsResponse>>(`${BASE_URL}/${id}`,data),
    getNewsById : (id: number) => axiosClient.get<ApiResponse<NewsResponse>>(`${BASE_URL}/${id}`)
}