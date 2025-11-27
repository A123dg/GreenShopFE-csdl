import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import  { categoryApi } from "../api/categoryApi";
import type { CategoryResponse, CreateCategoryRequest, CategoryRequest } from "../models/category";


export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const getAll = useCallback(
    async (params?: { categoryName?: string }) => {
      try {
        setLoading(true);
        const res = await categoryApi.getAll({
          categoryName: params?.categoryName,
        });
        setCategories(res.data);
      } catch {
        toast.error("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const filterByName = async (name?: string) => {
    try {
      setLoading(true);
      const res = await categoryApi.filter(name);
      setCategories(res.data);
    } catch {
      toast.error("Không thể lọc danh mục");
    } finally {
      setLoading(false);
    }
  };

  const create = async (body: CreateCategoryRequest) => {
    try {
      await categoryApi.create(body);
      toast.success("Tạo danh mục thành công");
      getAll();
    } catch {
      toast.error("Tạo thất bại");
    }
  };

  // UPDATE
  const update = async (id: number, body: CategoryRequest) => {
    try {
      await categoryApi.update(id, body);
      toast.success("Cập nhật thành công");
      getAll();
    } catch {
      toast.error("Không thể cập nhật");
    }
  };

  // DELETE
  const remove = async (id: number) => {
    try {
      await categoryApi.delete(id);
      toast.success("Xóa thành công");
      getAll();
    } catch {
      toast.error("Không thể xóa");
    }
  };

  return {
    loading,
    categories,
    getAll,
    filterByName,
    create,
    update,
    remove,
  };
};
