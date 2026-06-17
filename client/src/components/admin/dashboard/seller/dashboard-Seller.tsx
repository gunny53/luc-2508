"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Store,
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Activity,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Percent,
  Tag,
  Gift
} from 'lucide-react';
import { useDbSeller } from '../hooks/useDbSeller';

export default function DashboardSeller() {
  const { sellerStats, discountStats, refreshStats } = useDbSeller();

  // English content normalized from the original source text.
  const orderStatsCards = [
    {
      title: 'English content normalized from the original source text.',
      value: sellerStats.totalOrders.toString(),
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'English content normalized from the original source text.',
      value: sellerStats.pendingPayment.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'orange'
    },
    {
      title: 'English content normalized from the original source text.',
      value: sellerStats.pendingPackaging.toString(),
      icon: <Package className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'English content normalized from the original source text.',
      value: sellerStats.pendingDelivery.toString(),
      icon: <Truck className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'English content normalized from the original source text.',
      value: sellerStats.delivered.toString(),
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'English content normalized from the original source text.',
      value: sellerStats.cancelled.toString(),
      icon: <XCircle className="w-6 h-6" />,
      color: 'red'
    }
  ];

  // Stats cards data cho discount
  const discountStatsCards = [
    {
      title: 'English content normalized from the original source text.',
      value: discountStats.totalDiscounts.toString(),
      icon: <Gift className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'English content normalized from the original source text.',
      value: discountStats.activeDiscounts.toString(),
      icon: <Tag className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'English content normalized from the original source text.',
      value: discountStats.expiredDiscounts.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'red'
    },
    {
      title: 'English content normalized from the original source text.',
      value: discountStats.shopDiscounts.toString(),
      icon: <Store className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'English content normalized from the original source text.',
      value: discountStats.productDiscounts.toString(),
      icon: <Package className="w-6 h-6" />,
      color: 'orange'
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500/10 text-blue-600',
      green: 'bg-green-500/10 text-green-600',
      purple: 'bg-purple-500/10 text-purple-600',
      orange: 'bg-orange-500/10 text-orange-600',
      red: 'bg-red-500/10 text-red-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500/10 text-gray-600';
  };

  if (sellerStats.isLoading || discountStats.isLoading) {
    return (
      <div className="space-y-6 p-6 h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 h-screen bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">English content normalized from the original source text.</h1>
          <p className="text-muted-foreground">English content normalized from the original source text.</p>
        </div>
        <Button
          onClick={refreshStats}
          variant="outline"
          size="sm"
          disabled={sellerStats.isLoading || discountStats.isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(sellerStats.isLoading || discountStats.isLoading) ? 'animate-spin' : ''}`} />English content normalized from the original source text.</Button>
      </div>

      {/* English content normalized from the original source text. */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />English content normalized from the original source text.</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {orderStatsCards.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* English content normalized from the original source text. */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Gift className="w-5 h-5 mr-2" />English content normalized from the original source text.</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5">
          {discountStatsCards.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* English content normalized from the original source text. */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>English content normalized from the original source text.</span>
              <span className="font-medium text-green-600">
                {sellerStats.totalOrders > 0 ? ((sellerStats.delivered / sellerStats.totalOrders) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>English content normalized from the original source text.</span>
              <span className="font-medium text-orange-600">
                {(sellerStats.pendingPayment + sellerStats.pendingPackaging + sellerStats.pendingDelivery).toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded">
              📦 {sellerStats.totalOrders.toLocaleString()} English content normalized from the original source text.
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>English content normalized from the original source text.</span>
              <span className="font-medium text-green-600">
                {discountStats.totalDiscounts > 0 ? ((discountStats.activeDiscounts / discountStats.totalDiscounts) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>English content normalized from the original source text.</span>
              <span className="font-medium text-red-600">
                {discountStats.expiredDiscounts.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground p-2 bg-purple-50 rounded">
              🎁 {discountStats.totalDiscounts.toLocaleString()} English content normalized from the original source text.
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">English content normalized from the original source text.</h2>
            <Percent className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center">
                <Store className="w-4 h-4 mr-2 text-blue-500" />
                Shop
              </span>
              <span className="font-medium">{discountStats.shopDiscounts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-orange-500" />English content normalized from the original source text.</span>
              <span className="font-medium">{discountStats.productDiscounts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center">
                <Percent className="w-4 h-4 mr-2 text-purple-500" />English content normalized from the original source text.</span>
              <span className="font-medium">{discountStats.platformDiscounts.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
