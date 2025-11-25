import { useCallback, useEffect, useState } from "react";
import { voucherApi } from "../api/voucherApi";
import type { VoucherRequest, VoucherResposne } from "../models/voucher";
import { toast } from "react-toastify";
import type { VoucherQuery } from "../interfaces/query";

export const useVouchers = () => {
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherResposne[]>([]);
  const [query, setQuery] = useState<VoucherQuery>({
    search: "",
    status: undefined,
    discount: undefined,
  });

  const fetchVoucher = useCallback(
    async (queryParam?: VoucherQuery) => {
      setLoading(true);
      try {
        const res = await voucherApi.getAllVoucher(queryParam || query);
        const rawData = res?.data;
        setVouchers(Array.isArray(rawData) ? rawData : []);
        return res.data;
      } catch (err: any) {
        setVouchers([]);
        toast.error(err?.response?.data?.message || "Không tải được voucher");
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const createVoucher = useCallback(
    async (data: VoucherRequest) => {
      try {
        setLoading(true);
        const res = await voucherApi.createVoucher(data);
        toast.success(res.data.message || "Tạo voucher thành công");
        await fetchVoucher();
        return res.data;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Tạo thất bại");
      } finally {
        setLoading(false);
      }
    },
    [fetchVoucher]
  );

  const updateVoucher = useCallback(
    async (id: number, data: VoucherRequest) => {
      try {
        setLoading(true);
        const res = await voucherApi.updateVoucher(id, data);
        toast.success(res.data.message || "Cập nhật thành công");
        await fetchVoucher();
        return res.data;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Cập nhật thất bại");
      } finally {
        setLoading(false);
      }
    },
    [fetchVoucher]
  );

  const deleteVoucher = useCallback(
    async (id: number) => {
      try {
        const res = await voucherApi.deleteVoucher(id);
        await fetchVoucher();
        toast.success("Xóa thành công");
        return res.data;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Xóa thất bại");
      } finally {
        setLoading(false);
      }
    },
    [fetchVoucher]
  );

  useEffect(() => {
    fetchVoucher();
  }, [fetchVoucher]);

  return {
    loading,
    vouchers,
    fetchVoucher,
    deleteVoucher,
    createVoucher,
    updateVoucher,
    query,
    setQuery,
  };
};
