

























'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const ProfilePage = dynamic(() => import('../desktop/profile/profile-index'), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false
})

export function ProfileMain() {
  return (
    <div className="w-full h-full">
      <ProfilePage />
    </div>
  )
}
