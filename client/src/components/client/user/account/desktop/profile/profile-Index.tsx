'use client'

import { useResponsive } from '@/hooks/use-responsive'
import AddressBook from './profile-address'
import ProfileInfo from './profile-info'
import LinkedAccounts from './profile-link-accounts'
import PasswordSection from './profile-password'
import { useUserData } from '@/hooks/use-get-data-user-login'
import ProfileHeader from '../../profile/profile-header'

export default function ProfilePage() {
  const { isMobile } = useResponsive()
  const userData = useUserData()

  return (
    <div className="space-y-4 h-full">
      {isMobile && (
        <ProfileHeader
          name={userData?.name ?? ''}
          email={userData?.email ?? ''}
          phone={userData?.phoneNumber ?? ''}
          // birthday={userData?.dob ?? ""}
          avatar={userData?.avatar ?? ''}
          totalOrders={userData?.statistics?.totalOrders ?? 0}
          totalSpent={userData?.statistics?.totalSpent ?? 0}
          memberSince={userData?.statistics?.memberSince ?? ''}
        />
      )}

      <ProfileInfo />
      <AddressBook />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordSection />
        <LinkedAccounts />
      </div>
    </div>
  )
}
