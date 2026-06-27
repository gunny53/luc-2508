import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Users, ShoppingBag, FolderTree, FileText } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { OverviewStats } from '../hooks/use-db-admin'

interface OverviewStatsTableProps {
  overviewStats: OverviewStats
}

const OverviewStatsTable: React.FC<OverviewStatsTableProps> = ({ overviewStats }) => {
  const { totalUsers, totalBrands, totalCategories, totalAuditLogs, isLoading, error } = overviewStats
  const overviewData = [
    {
      id: 'users',
      title: 'Users',
      description: 'B?ng ?i?u khi?n',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'brands',
      title: 'Brands',
      description: 'B?ng ?i?u khi?n',
      value: totalBrands,
      icon: ShoppingBag,
      color: 'bg-green-50 text-green-600 border-green-200',
      badgeColor: 'bg-green-100 text-green-700'
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'B?ng ?i?u khi?n',
      value: totalCategories,
      icon: FolderTree,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'auditlogs',
      title: 'Audit Logs',
      description: 'B?ng ?i?u khi?n',
      value: totalAuditLogs,
      icon: FileText,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      badgeColor: 'bg-orange-100 text-orange-700'
    }
  ]

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>B?ng ?i?u khi?n</CardTitle>
          <CardDescription>B?ng ?i?u khi?n</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>B?ng ?i?u khi?n</CardTitle>
        <CardDescription>B?ng ?i?u khi?n</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewData.map((item) => {
              const IconComponent = item.icon
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 ${item.color} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-6 w-6" />
                    <Badge className={item.badgeColor}>{item.value.toLocaleString()}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm opacity-75">{item.description}</p>
                </div>
              )
            })}
          </div>
        )}

        {}
        {!isLoading && !error && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              B?ng ?i?u khi?n
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">B?ng ?i?u khi?n</span>
                <span className="ml-2 font-medium">{totalUsers.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">B?ng ?i?u khi?n</span>
                <span className="ml-2 font-medium">{totalBrands.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">B?ng ?i?u khi?n</span>
                <span className="ml-2 font-medium">{totalCategories.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">B?ng ?i?u khi?n</span>
                <span className="ml-2 font-medium">{totalAuditLogs.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OverviewStatsTable
