import { useCallback, useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import { toast } from "react-toastify";
import type { OrderRequest, OrderResponse } from "../models/orders";

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderApi.getOrder();
      const rawData = res?.data?.data; // tùy backend
      toast.success(res?.data?.message || "Tải đơn hàng thành công");
      setOrders(Array.isArray(rawData) ? rawData : []);
      return rawData;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không tải được đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const createOrder = useCallback(
    async (data: OrderRequest) => {
      setLoading(true);
      try {
        const res = await orderApi.createOrder(data);
        toast.success(res.data.message || "Tạo đơn hàng mới thành công");
        await fetchOrders();
        return res.data;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Tạo đơn hàng thất bại");
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders]
  );

  const updateOrder = useCallback(
    async (id: number, data: OrderRequest) => {
      setLoading(true);
      try {
        const res = await orderApi.updateOrder(id, data);
        toast.success(res.data.message || "Cập nhật đơn hàng thành công");
        await fetchOrders();
        return res.data;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Cập nhật đơn hàng thất bại");
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders]
  );


  const getOrderById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await orderApi.getOrderById(id);
      toast.success(res?.data?.message || "Lấy đơn hàng theo ID thành công");
      return res.data.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lấy đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    loading,
    orders,
    fetchOrders,
    createOrder,
    updateOrder,
    getOrderById,
  };
};
