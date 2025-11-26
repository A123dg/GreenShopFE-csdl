import type { ApiResponse } from "../interfaces/ApiResponse";
import type { DashboardResponse } from "../models/dashboard";
import axiosClient from "./axiosClient";

const BASE_URL = "/dashboard";

export const dashboardApi = {
  /**
   * Lấy tất cả thống kê dashboard
   * @returns Promise với data chứa thông tin tổng quan
   */
  getDashboard: () => 
    axiosClient.get<ApiResponse<DashboardResponse>>(BASE_URL),
};