import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../interfaces/ApiResponse";
import type { ProductResponse, CreateProduct } from "../models/products";
import {
  getProductsQuery,
  createProductQuery,
  deleteProductQuery,
  productKeys,
} from "../queries/product.query";

export const useProducts = () => {
  return useQuery<ProductResponse[], AxiosError>({
    queryKey: productKeys.list(),
    queryFn: getProductsQuery,
    staleTime: 0, // luôn coi là stale để dễ refetch
    gcTime: 0, // không giữ cache quá lâu
    refetchOnWindowFocus: true,
    refetchOnMount: "always", // luôn gọi lại khi component mount
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ProductResponse>, AxiosError, CreateProduct>({
    mutationFn: createProductQuery,

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: productKeys.list() });

      const previousProducts = queryClient.getQueryData<ProductResponse[]>(productKeys.list());

      const optimisticProduct: ProductResponse = {
        id: Date.now(), 
        name: newProduct.name,
        price: newProduct.price,
        ...newProduct, //sao chép dữ liệu từ form
      };

      queryClient.setQueryData<ProductResponse[]>(productKeys.list(), (old) =>
        old ? [...old, optimisticProduct] : [optimisticProduct]
      );

      return { previousProducts };
    },

    onError: (err, newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.list(), context.previousProducts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
};


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<boolean>, AxiosError, number>({
    mutationFn: deleteProductQuery,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: productKeys.list() });

      const previousProducts = queryClient.getQueryData<ProductResponse[]>(productKeys.list());

      queryClient.setQueryData<ProductResponse[]>(productKeys.list(), (old) =>
        old ? old.filter((p) => p.id !== id) : []
      );

      return { previousProducts };
    },

    onError: (err, id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.list(), context.previousProducts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
};
