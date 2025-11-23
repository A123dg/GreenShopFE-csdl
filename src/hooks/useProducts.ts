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

/* =======================
   GET PRODUCTS HOOK
==========================*/
export const useProducts = () => {
  return useQuery<ProductResponse[], AxiosError>({
    queryKey: productKeys.list(),
    queryFn: getProductsQuery,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
};

/* =======================
   CREATE PRODUCT HOOK
==========================*/
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ProductResponse>,
    AxiosError,
    CreateProduct,
    { previousProducts: ProductResponse[] | undefined }
  >({
    mutationFn: createProductQuery,

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: productKeys.list() });

      const previousProducts =
        queryClient.getQueryData<ProductResponse[]>(productKeys.list());

      const optimisticProduct: ProductResponse = {
        id: Date.now(),
        ...newProduct,
      };

      queryClient.setQueryData<ProductResponse[]>(productKeys.list(), (old) =>
        old ? [...old, optimisticProduct] : [optimisticProduct]
      );

      return { previousProducts };
    },

    onError: (_error, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          productKeys.list(),
          context.previousProducts
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
};

/* =======================
   DELETE PRODUCT HOOK
==========================*/
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<boolean>,
    AxiosError,
    number,
    { previousProducts: ProductResponse[] | undefined }
  >({
    mutationFn: deleteProductQuery,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: productKeys.list() });

      const previousProducts =
        queryClient.getQueryData<ProductResponse[]>(productKeys.list());

      queryClient.setQueryData<ProductResponse[]>(productKeys.list(), (old) =>
        old ? old.filter((p) => p.id !== id) : []
      );

      return { previousProducts };
    },

    onError: (_error, _id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          productKeys.list(),
          context.previousProducts
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
};
