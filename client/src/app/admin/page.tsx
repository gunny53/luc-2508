"use client";

import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
import { useUserData } from '@/hooks/useGetData-UserLogin'
import DashboardAdmin from '@/components/admin/dashboard/admin/dashboard-Admin'
import DashboardSeller from '@/components/admin/dashboard/seller/dashboard-Seller'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

// export const metadata: Metadata = metadataConfig['/admin']

export default function AdminDashboard() {
  const userData = useUserData();

  // Loading state
  if (!userData) {
    return (
      <div className="space-y-6 p-6 h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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

  // English content normalized from the original source text.
  const userRole = userData.role?.name;

  switch (userRole) {
    case 'ADMIN':
      return <DashboardAdmin />;

    case 'SELLER':
      return <DashboardSeller />;

    default:
      // English content normalized from the original source text.
      return (
        <div className="space-y-6 p-6 h-screen bg-white">
          <div>
            <h1 className="text-3xl font-bold">English content normalized from the original source text.</h1>
            <p className="text-muted-foreground">English content normalized from the original source text.</p>
          </div>

          <Card className="p-6 border-amber-200 bg-amber-50">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">English content normalized from the original source text.</p>
                <p className="text-sm text-amber-700">
                  English content normalized from the original source text. {userRole || 'English content normalized from the original source text.'}.
                  English content normalized from the original source text.
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
  }
}
