'use client'

import { useResponsive } from '@/hooks/use-responsive'
import DashboardOrders from './dashboard-orders'

import { useUserData } from '@/hooks/use-get-data-user-login'
import ProfileHeader from '../../profile/profile-header'

export default function DashboardIndex() {
  const { isMobile } = useResponsive()
  const userData = useUserData()

  return (
    <div className="bg-[#f5f5f7] h-full space-y-4">
      {isMobile && (
        <ProfileHeader
          name={userData?.name ?? ''}
          email={userData?.email ?? ''}
          phone={userData?.phoneNumber ?? ''}
          
          avatar={userData?.avatar ?? ''}
          totalOrders={userData?.statistics?.totalOrders ?? 0}
          totalSpent={userData?.statistics?.totalSpent ?? 0}
          memberSince={userData?.statistics?.memberSince ?? ''}
        />
      )}
      <DashboardOrders />
    </div>
  )
}
