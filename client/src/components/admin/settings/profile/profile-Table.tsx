'use client'

import { MoreHorizontal, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SettingTable, SettingTableColumn } from '@/components/ui/settings-component/settings-table'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ProfileUpdateSheet } from './profile-update'
import { useUserData } from '@/hooks/use-get-data-user-login'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function ProfileSettingsTable() {
  const user = useUserData()
  const [openUpdate, setOpenUpdate] = useState(false)

  if (!user) {
    return <div>Loading user data...</div>
  }

  const fullName = `${user.lastName} ${user.firstName}`.trim()
  console.log('user in ProfileSettingsTable:', user)

  const columns: SettingTableColumn[] = [
    {
      label: 'Avatar',
      value: (
        <Avatar>
          <AvatarImage src={user.avatar || ''} alt={user.name} className="object-cover" />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
    {
      label: 'T?i kho?n',
      value: user.name || 'T?i kho?n'
    },
    { label: 'Email', value: user.email },
    {
      label: 'T?i kho?n',
      value: user.phoneNumber || 'T?i kho?n'
    },
    {
      label: 'T?i kho?n',
      value: <Badge variant={user.status === 'ACTIVE' ? 'secondary' : 'destructive'}>{user.status}</Badge>
    },
    {
      label: 'T?i kho?n',
      value: <Badge variant="outline">{typeof user.role === 'string' ? user.role : user.role?.name}</Badge>
    },
    {
      label: 'T?i kho?n',
      value: new Date(user.createdAt).toLocaleDateString('vi-VN')
    }
  ]

  return (
    <>
      <SettingTable
        columns={columns}
        title="T?i kho?n"
        subtitle="T?i kho?n"
        rightAction={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                T?i kho?n
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <ProfileUpdateSheet open={openUpdate} onOpenChange={setOpenUpdate} />
    </>
  )
}
