import { useCallback, useEffect, useState } from "react";
import { voucherApi } from "../api/voucherApi";
import type { VoucherRequest, VoucherResposne } from "../models/voucher";
import { toast } from "react-toastify";

export const useVouchers = () => {
    const [loading, setLoading] = useState(false);
    const [vouchers, setVouchers] = useState<VoucherResposne[]>([])
    const fetchVoucher = useCallback(async () => {
        setLoading(true);
        try {
            const res = await voucherApi.getAllVoucher();
            const rawData = res?.data;
            const parsed = Array.isArray(rawData)? rawData : [];
            setVouchers(parsed);
        }
        catch (err : any) {
            setVouchers([]);
            toast.error(err?.message || "Không tải được voucher");
            
        } finally {
            setLoading(false);
        }
       
        
    },[]);
    const createVoucher = useCallback(async (data : VoucherRequest) => {
        try{
            setLoading(true);
            const res =await voucherApi.createVoucher(data);
            toast.success(res.data.message ||"Tạo voucher thành công")
            await fetchVoucher();
            return res.data;
        }
        catch (err : any)
        {
            toast.error(err.data.message || "Tạo thất bại")
        }
        finally{
            setLoading(false);
        }
    }, [fetchVoucher]);
    const updateVoucher = useCallback(async (id: number,data: VoucherRequest)=> {
        try{
            setLoading(true);
            const res = await voucherApi.updateVoucher(id,data);
            toast.success(res.data.message || "Cập nhật thành cônng");
            await fetchVoucher();
            return res.data;
        }
        catch(err : any)
        {
            toast.error(err.data.message);
        }
        finally {
            setLoading(false);
        }
        

    },[fetchVoucher]);
    const deleteVoucher = useCallback(async (id:number) => {
        try{
        const res = await voucherApi.deleteVoucher(id);
        await fetchVoucher();
        toast.success( "Xóa thành công");
        return res.data;}
        catch( err : any){
            toast.error(err?.message);
        }
        finally{
            setLoading(false)
        }
    }, [fetchVoucher])
    useEffect(() => {
        fetchVoucher();
       },[fetchVoucher]) 

    return {
        loading,vouchers,fetchVoucher,deleteVoucher,createVoucher, updateVoucher
    };
}