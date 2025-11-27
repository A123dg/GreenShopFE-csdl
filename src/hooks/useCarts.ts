import { useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/cartApi";
import type { CartAddRequest, CartDecreaseRequest, CartResponse } from "../models/cart";

export function useCarts() {
  const [carts, setCarts] = useState<CartResponse[]>([]);
  const [userCart, setUserCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [userCartLoading, setUserCartLoading] = useState(false);
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

  const getUserId = useCallback(() => {
    try {
      return localStorage.getItem("userId");
    } catch (err) {
      console.error("Error reading userId from localStorage:", err);
      return null;
    }
  }, []);

  const fetchUserCart = useCallback(async () => {
    const userId = Number(getUserId());
    if (!userId) {
      setUserCart(null);
      return;
    }

    setUserCartLoading(true);

    try {
      const res = await cartApi.getCartByUserId(userId);
      const cartData = res?.data;

      if (!cartData) {
        console.warn("No cart data received");
        setUserCart(null);
        return;
      }

      setUserCart(cartData.data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch user cart failed:", err);
      const errorMsg = err?.response?.data?.message || "Error loading user cart";
      setError(errorMsg);
      setUserCart(null);
    } finally {
      setUserCartLoading(false);
    }
  }, [getUserId]);

  const addCart = useCallback(
    async (data: CartAddRequest) => {
      try {
        const res = await cartApi.addCart(data);
        await fetchCarts();
        await fetchUserCart();
        return res.data;
      } catch (err: any) {
        setError(err?.response?.data?.message || "Error adding to cart");
        throw err;
      }
    },
    [fetchCarts, fetchUserCart]
  );

  const decreaseCart = useCallback(
    async (data: CartDecreaseRequest) => {
      try {
        const res = await cartApi.decreaseCart(data);
        await fetchCarts();
        await fetchUserCart();
        return res.data;
      } catch (err: any) {
        console.error("Decrease cart failed:", err);
        setError(err?.response?.data?.message || "Error decreasing cart");
        throw err;
      }
    },
    [fetchCarts, fetchUserCart]
  );

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  return {
    // All carts
    carts,
    loading,
    error,
    fetchCarts,

    // User cart
    userCart,
    userCartLoading,
    fetchUserCart,

    // Actions
    addCart,
    decreaseCart,
  };
}