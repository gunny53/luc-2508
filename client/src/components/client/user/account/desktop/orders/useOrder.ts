"use client";

import { useCallback, useState } from "react";
import { orderService } from "@/services/orderService";
import {
  OrderGetAllResponse,
  OrderGetByIdResponse,
  OrderStatus,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderCancelResponse,
  Order,
} from "@/types/order.interface";
import { PaginationMetadata } from "@/types/base.interface";
import { useGetProfile } from "@/hooks/useGetProfile";
import { date } from "zod";

export function useOrder() {
  const [orders, setOrders] = useState<OrderGetAllResponse["data"]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchProfile = useGetProfile(); // English content normalized from the original source text.

  // English content normalized from the original source text.
  const fetchAllOrders = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getAll({ page, limit });
      setOrders(res.data);
      setMetadata(res.metadata);
      await fetchProfile.fetchProfile(); // English content normalized from the original source text.
      return res;
    } catch (err: any) {
      setError(err.message || "English content normalized from the original source text.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // English content normalized from the original source text.
  const fetchOrdersByStatus = useCallback(
    async (status: OrderStatus, page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderService.getByStatus(status, { page, limit });
        setOrders(res.data);
        setMetadata(res.metadata);
        return res;
      } catch (err: any) {
        setError(err.message || "English content normalized from the original source text.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // English content normalized from the original source text.
  const fetchOrderDetail = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getById(orderId);

      const firstOrder = res.data ?? null; // English content normalized from the original source text.
      setOrderDetail(firstOrder);

      return res;
    } catch (err: any) {
      setError(err.message || "English content normalized from the original source text.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // English content normalized from the original source text.
  const createOrder = useCallback(async (data: OrderCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res: OrderCreateResponse = await orderService.create(data);
      return res;
    } catch (err: any) {
      setError(err.message || "English content normalized from the original source text.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // English content normalized from the original source text.
  const cancelOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: OrderCancelResponse = await orderService.cancel(orderId);
      return res;
    } catch (err: any) {
      setError(err.message || "English content normalized from the original source text.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    orderDetail,
    loading,
    error,
    metadata,
    fetchAllOrders,
    fetchOrdersByStatus,
    fetchOrderDetail,
    createOrder,
    cancelOrder,
  };
}

