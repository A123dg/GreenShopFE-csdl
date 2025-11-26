import { useCallback, useEffect, useState } from "react";
import type { NewsQuery } from "../interfaces/query";
import { newsApi } from "../api/newsApi";
import { toast } from "react-toastify";
import type { NewsRequest, NewsResponse } from "../models/news";

export const useNews = () => {
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState<NewsResponse[] | []> ([]);
    const [query,setQuery] = useState<NewsQuery>({
        title:"",
        author: undefined,
        source: undefined,

    });
    const fetchNews = useCallback(
        async (queryParam? : NewsQuery)=> {
            setLoading(true);
            try{
                const res = await newsApi.getNewsWithFilter(queryParam || query);
                const rawData = res?.data;
                toast.success(res.data.message || "Tải tin tức thành công")
                setNews(Array.isArray(rawData) ? rawData : []);
                return res.data;
            }catch (err: any) {
                setNews([]);
                toast.error(err?.response?.data?.message || "Không tải được tin tức")
            }
            finally {
                setLoading(false);
            }
        },[query]
    );
    const createNews = useCallback(
        async(data: NewsRequest) =>{
            try{
                setLoading(true);
                const res = await newsApi.createNews(data);
                toast.success(res.data.message || "Tạo tin tức mới thành công");
                await fetchNews();
                return res.data;
            }
            catch(err:any)
            {
                toast.error(err?.response?.data?.message || "Tạo tin tức thất bại")
            }
            finally{
                setLoading(false);
            }
        },[fetchNews]
    );
    const updateNews = useCallback(
        async (id: number, data: NewsRequest) =>{
            try {
                setLoading(true);
                const res= await newsApi.updateNews(id, data);
                toast.success(res.data.message || "Cập nhật thành công");
                await fetchNews();
                return res.data;
            }catch(err: any) {
                toast.error( err?.response?.data?.message ||"Cập nhật sản phẩm thất bại")
            }
            finally{
                setLoading(false);
            }
        },[fetchNews]
    );
    const deleteNews = useCallback(
        async (id: number) => {
          try {
            const res = await newsApi.deleteNews(id);
            await fetchNews();
            toast.success("Xóa thành công");
            return res.data;
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Xóa thất bại");
          } finally {
            setLoading(false);
          }
        },
        [fetchNews]
      );
      const getNewsById = useCallback(
        async (id : number) => {
            try{
                setLoading(true);
                const res =await newsApi.getNewsById(id);
                toast.success(res?.data?.message || "Lấy tin tức theo id thành công");
                return res.data;
            }
            catch(err : any){
                toast.error(err.data.response.message || "Lấy tin tức thất bại")
            }
            finally{
                setLoading(false);
            }
        },[]
      )
    
      useEffect(() => {
        fetchNews();
      }, [fetchNews]);
    
    return {
        loading, news, fetchNews,setQuery, updateNews,deleteNews,createNews,query,getNewsById
    }
}