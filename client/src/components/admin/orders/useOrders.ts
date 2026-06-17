"use client";

import { useCallback, useState } from "react";
import { orderService, manageOrderService } from "@/services/orderService";
import {
  OrderGetAllResponse,
  OrderGetByIdResponse,
  OrderStatus,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderCancelResponse,
  Order,
  ManageOrderGetAllResponse,
  ManageOrderGetByIdResponse,
  ManageOrder,
  UpdateStatusRequest,
} from "@/types/order.interface";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  search?: string;
}

export function useOrder() {
  const [orders, setOrders] = useState<ManageOrder[]>([]);
  const [orderDetail, setOrderDetail] = useState<ManageOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    search: "",
  });

  // English content normalized from the original source text.
  const fetchAllOrders = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoading(true);
      setError(null);
      try {
        const res = await manageOrderService.getAll({ page, limit, search });
        setOrders(res.data);
        setPagination((prev) => ({
          ...prev,
          page,
          limit,
          total: res.metadata?.totalItems || 0,
          search,
        }));
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
  const fetchOrdersByStatus = useCallback(
    async (status: OrderStatus, page = 1, limit = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res = await manageOrderService.getAll({
          page,
          limit,
          status
        });
        setOrders(res.data);
        setPagination((prev) => ({
          ...prev,
          page,
          limit,
          total: res.metadata?.totalItems || 0,
        }));
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
  const handleSearch = (searchValue: string) => {
    const page = 1;
    const limit = pagination.limit ?? 10;
    fetchAllOrders(page, limit, searchValue);
  };

  // English content normalized from the original source text.
  const handlePageChange = (page: number) => {
    const limit = pagination.limit ?? 10;
    const search = pagination.search ?? "";
    fetchAllOrders(page, limit, search);
  };

  // English content normalized from the original source text.
  const handleLimitChange = (limit: number) => {
    const page = 1;
    const search = pagination.search ?? "";
    fetchAllOrders(page, limit, search);
  };

  // English content normalized from the original source text.
  const fetchOrderDetail = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await manageOrderService.getById(orderId);
      setOrderDetail(res.data ?? null);
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
  const updateOrderStatus = useCallback(async (orderId: string, data: UpdateStatusRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await manageOrderService.updateStatus(orderId, data);
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

  // English content normalized from the original source text.
  const handlePrintInvoice = useCallback(async (orderId: string, orderCode?: string) => {
    try {
      console.log('Printing invoice for orderId:', orderId);
      console.log('Provided orderCode:', orderCode);

      // English content normalized from the original source text.
      if (orderCode) {
        console.log('Using provided orderCode:', orderCode);
      } else {
        // English content normalized from the original source text.
        const order = orderDetail?.id === orderId ? orderDetail : orders.find(o => o.id === orderId);
        console.log('Found order from state:', order);

        if (!order) {
          console.error('Order not found for ID:', orderId);
          alert('English content normalized from the original source text.');
          return;
        }

        if (!order.orderCode) {
          console.error('Order found but missing orderCode:', order);
          alert('English content normalized from the original source text.');
          return;
        }

        orderCode = order.orderCode;
        console.log('Using orderCode from state:', orderCode);
      }

      if (!orderCode) {
        alert('English content normalized from the original source text.');
        return;
      }

      console.log('Final orderCode to use:', orderCode);

      // English content normalized from the original source text.
      const tokenResponse = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token', {
        method: 'POST',
        headers: {
          'Token': process.env.NEXT_PUBLIC_GHN_TOKEN || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_codes: [orderCode]
        })
      });

      console.log('Token response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token API error:', errorText);
        throw new Error(`Failed to generate token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('Token data:', tokenData);

      const printToken = tokenData.data?.token;

      if (!printToken) {
        console.error('No token in response:', tokenData);
        throw new Error('No token received from GHN');
      }

      // English content normalized from the original source text.
      const printUrl = `https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token=${printToken}`;
      console.log('Opening print URL:', printUrl);
      window.open(printUrl, '_blank');

    } catch (error) {
      console.error('Error printing invoice:', error);
      alert(`English content normalized from the original source text.${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [orderDetail, orders]);

  return {
    orders,
    orderDetail,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    fetchAllOrders,
    fetchOrdersByStatus,
    fetchOrderDetail,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    handlePrintInvoice,
  };
}
