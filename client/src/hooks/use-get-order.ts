import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { orderService } from '@/services/order-service'
import { OrderGetAllParams, OrderGetAllResponse } from '@/types/order.interface'

export const useGetOrders = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderGetAllResponse | null>(null)

  const fetchOrders = useCallback(
    async (params?: OrderGetAllParams, signal?: AbortSignal): Promise<OrderGetAllResponse | null> => {
      setLoading(true)
      setError(null)
      try {
        const response = await orderService.getAll(params, signal)

        if (!response?.data) {
          throw new Error('??n h?ng')
        }

        setOrders(response)
        return response
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || err?.message || '??n h?ng'
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    fetchOrders,
    loading,
    error,
    orders
  }
}
