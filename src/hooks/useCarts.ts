import { useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/cartApi";
import type { CartAddRequest, CartDecreaseRequest, CartResponse } from "../models/cart";

export function useCarts() {
  const [carts, setCarts] = useState<CartResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarts = useCallback(async () => {
  setLoading(true);

  try {
    const res = await cartApi.getAllCarts();
    const rawData = res?.data;

    const parsed = Array.isArray(rawData) ? rawData : [];

    setCarts(parsed);
    setError(null);
  } catch (err: any) {
    console.error("Fetch carts failed:", err);
    setError(err?.response?.data?.message || "Error loading carts");
    setCarts([]);
  } finally {
    setLoading(false);
  }
}, []);

  const addCart = useCallback(
    async (data: CartAddRequest) => {
     
        const res = await cartApi.addCart(data);
        await fetchCarts();
        return res.data;
      
    },
    [fetchCarts]
  );

  const decreaseCart = useCallback(
    async (data: CartDecreaseRequest) => {
     
        const res = await cartApi.decreaseCart(data);
        await fetchCarts();
        return res.data;
       
    },
    [fetchCarts]
  );

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  return {
    carts,
    loading,
    error,
    fetchCarts,
    addCart,
    decreaseCart,
  };
}
