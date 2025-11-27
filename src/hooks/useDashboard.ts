import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { DashboardResponse } from "../models/dashboard";
import { dashboardApi } from "../api/dashBoardApi";
export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await dashboardApi.getDashboard();
      
      console.log("Full Response:", res);
      console.log("Data:", res.data);
      
      // Set data vào state
      setDashboard(res.data);
      
      // Chỉ hiển thị toast khi thành công
      if (res.data) {
        toast.success(res.message || "Tải thống kê thành công");
      }
      
      return res.data;
    } catch (err: any) {
      setDashboard(null);
      toast.error(
        err?.response?.data?.message || "Không tải được thống kê"
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    loading,
    dashboard,
    fetchDashboard,
  };
};