'use client'

import { useMemo, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  CheckCircle,
  Clock,
  CreditCard,
  Calendar,
  Info,
  Target,
  Percent,
  Activity,
  AlertTriangle,
  TrendingDown
} from 'lucide-react'
import type { ManageOrder } from '@/types/order.interface'
import { manageOrderService } from '@/services/order-service'
import axios from 'axios'
import { toast } from 'sonner'

interface OrdersStatsProps {
  orders: ManageOrder[]
}

export function OrdersStats({ orders }: OrdersStatsProps) {
  const [statsData, setStatsData] = useState<ManageOrder[]>(orders)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  console.log('OrdersStats rendered with orders:', orders.length) 

  
  const fetchOrdersStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await manageOrderService.getAll({
        limit: 200,
        page: 1
      })

      console.log('Stats API Response:', response) 

      if (response && response.data) {
        setStatsData(response.data)
      } else {
        
        console.warn('No data in response, falling back to current orders')
        setStatsData(orders)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.name !== 'CanceledError') {
        console.error('Error fetching orders stats:', error)
        toast.error('??n h?ng')
      }
      
      setStatsData(orders)
    } finally {
      setIsLoadingStats(false)
    }
  }
  useEffect(() => {
    fetchOrdersStats()
  }, [])
  useEffect(() => {
    if (!isLoadingStats && (!statsData || statsData.length === 0)) {
      setStatsData(orders)
    }
  }, [orders, isLoadingStats, statsData])
  const stats = useMemo(() => {
    const dataToUse = statsData && statsData.length > 0 ? statsData : orders

    console.log('Stats calculation using data:', dataToUse.length, 'orders') 

    if (!dataToUse || dataToUse.length === 0) {
      return {
        totalOrders: 0,
        revenue: 0,
        aov: 0,
        productsSold: 0,
        uniqueCustomers: 0,
        deliveryRate: 0,
        pendingPickup: 0,
        paymentMethods: {},
        newOrders24h: 0,
        totalPaymentAmount: 0,
        averageOrderValue: 0,
        completionRate: 0,
        shippingEfficiency: 0,
        customerRetentionRate: 0,
        orderGrowthRate: 0,
        cancelledRate: 0,
        averageOrderProcessingTime: 0
      }
    }
    const totalOrders = dataToUse.length
    const revenue = dataToUse.reduce((sum, order) => {
      return sum + (order.totalPayment || 0)
    }, 0)
    const aov = totalOrders > 0 ? revenue / totalOrders : 0
    const productsSold = dataToUse.reduce((sum, order) => {
      if (order.items && Array.isArray(order.items)) {
        return sum + order.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
      }
      return sum
    }, 0)
    const uniqueCustomers = new Set(dataToUse.map((order) => order.userId)).size
    const deliveredOrders = dataToUse.filter((order) => order.status === 'DELIVERED').length
    const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0
    const pendingPickup = dataToUse.filter((order) =>
      ['PENDING_PACKAGING', 'PENDING_DELIVERY'].includes(order.status)
    ).length
    const paymentMethods = dataToUse.reduce(
      (acc, order) => {
        const paymentId = order.paymentId
        acc[paymentId] = (acc[paymentId] || 0) + 1
        return acc
      },
      {} as Record<number, number>
    )
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const newOrders24h = dataToUse.filter((order) => new Date(order.createdAt) >= yesterday).length
    const totalPaymentAmount = revenue
    const completionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0
    const pickedUpOrders = dataToUse.filter((order) => ['PENDING_DELIVERY', 'DELIVERED'].includes(order.status)).length
    const shippingEfficiency = pickedUpOrders > 0 ? (deliveredOrders / pickedUpOrders) * 100 : 0
    const customerOrderCounts = dataToUse.reduce(
      (acc, order) => {
        acc[order.userId] = (acc[order.userId] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
    const returningCustomers = Object.values(customerOrderCounts).filter((count) => count > 1).length
    const customerRetentionRate = uniqueCustomers > 0 ? (returningCustomers / uniqueCustomers) * 100 : 0
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const ordersLast7Days = dataToUse.filter((order) => new Date(order.createdAt) >= weekAgo).length
    const ordersBeforeLast7Days = totalOrders - ordersLast7Days
    const orderGrowthRate =
      ordersBeforeLast7Days > 0 ? ((ordersLast7Days - ordersBeforeLast7Days) / ordersBeforeLast7Days) * 100 : 0
    const cancelledOrders = dataToUse.filter((order) => order.status === 'CANCELLED').length
    const cancelledRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0
    const deliveredOrdersWithTime = dataToUse.filter(
      (order) => order.status === 'DELIVERED' && order.updatedAt && order.createdAt
    )
    let averageOrderProcessingTime = 0
    if (deliveredOrdersWithTime.length > 0) {
      const totalProcessingTime = deliveredOrdersWithTime.reduce((sum, order) => {
        const created = new Date(order.createdAt).getTime()
        const delivered = new Date(order.updatedAt).getTime()
        return sum + (delivered - created)
      }, 0)
      averageOrderProcessingTime = totalProcessingTime / deliveredOrdersWithTime.length / (1000 * 60 * 60 * 24)
    }

    const result = {
      totalOrders,
      revenue,
      aov,
      productsSold,
      uniqueCustomers,
      deliveryRate,
      pendingPickup,
      paymentMethods,
      newOrders24h,
      totalPaymentAmount,
      completionRate,
      shippingEfficiency,
      customerRetentionRate,
      orderGrowthRate,
      cancelledRate,
      averageOrderProcessingTime
    }

    console.log('Calculated stats:', result) 

    return result
  }, [statsData, orders])

  const paymentMethodLabels: Record<number, { label: string; color: string }> = {
    1: { label: 'COD', color: 'bg-green-100 text-green-700' },
    2: { label: 'VNPay', color: 'bg-blue-100 text-blue-700' },
    3: { label: 'MoMo', color: 'bg-pink-100 text-pink-700' },
    4: { label: 'Bank Transfer', color: 'bg-purple-100 text-purple-700' }
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats.totalOrders.toLocaleString()}</div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoadingStats ? '...' : `${stats.totalPaymentAmount.toLocaleString()}₫`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
            <p className="text-xs text-muted-foreground mt-1">
              ??n h?ng
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingStats ? '...' : stats.productsSold.toLocaleString()}</div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : stats.uniqueCustomers.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {isLoadingStats ? '...' : `${stats.completionRate.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
            <p className="text-xs text-muted-foreground mt-1">
              ??n h?ng
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoadingStats ? '...' : `${stats.shippingEfficiency.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
            <p className="text-xs text-muted-foreground mt-1">
              ??n h?ng
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {isLoadingStats ? '...' : `${stats.customerRetentionRate.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
            <p className="text-xs text-muted-foreground mt-1">
              ??n h?ng {'>'}??n h?ng
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {isLoadingStats ? '...' : stats.newOrders24h.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {isLoadingStats ? '...' : `${stats.cancelledRate.toFixed(1)}%`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
            <p className="text-xs text-muted-foreground mt-1">
              ??n h?ng
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-help">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  ??n h?ng
                  <Info className="h-3 w-3" />
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">
                  {isLoadingStats
                    ? '...'
                    : `${stats.averageOrderProcessingTime.toFixed(1)}??n h?ng`}
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>??n h?ng</p>
            <p className="text-xs text-muted-foreground mt-1">
              ??n h?ng
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
