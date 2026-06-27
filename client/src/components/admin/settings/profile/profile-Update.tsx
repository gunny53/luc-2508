'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { SheetRework } from '@/components/ui/component/sheet-rework'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useUserData } from '@/hooks/use-get-data-user-login'
import { useUpdateProfile } from './use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'
import { showToast } from '@/components/ui/toastify'
import { UpdateProfileSchema } from '@/utils/schema'
import { useUploadMedia } from '@/hooks/use-upload-media'

interface ProfileUpdateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileUpdateSheet({ open, onOpenChange }: ProfileUpdateSheetProps) {
  const t = useTranslations()
  const userData = useUserData()
  const formSchema = UpdateProfileSchema(t)
  const { handleAddFiles, uploadedUrls, isUploading, reset } = useUploadMedia()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState<string>(userData?.avatar || '')

  const { updateProfile, loading } = useUpdateProfile(() => onOpenChange(false))

  type ProfileFormData = z.infer<typeof formSchema>

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      avatar: ''
    }
  })

  useEffect(() => {
    if (userData && open) {
      form.reset({
        name: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        
        avatar: userData.avatar || ''
      })
      
    }
  }, [userData, open, form])

  useEffect(() => {
    if (uploadedUrls.length > 0) {
      const newUrl = uploadedUrls[0]
      setAvatar(newUrl)
      form.setValue('avatar', newUrl, { shouldDirty: true })
    }
  }, [uploadedUrls, form])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    reset()
    await handleAddFiles([file])
  }

  const onSubmit = (data: ProfileFormData) => {
    const hasChanges =
      data.name !== userData?.name || data.phoneNumber !== userData?.phoneNumber || data.avatar !== userData?.avatar

    if (!hasChanges) {
      showToast('T?i kho?n', 'info')
      return
    }

    updateProfile(data)
  }

  return (
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title={t('admin.profileUpdate.title')}
      subtitle={t('admin.profileUpdate.subtitle')}
      onCancel={() => onOpenChange(false)}
      onConfirm={form.handleSubmit(onSubmit)}
      isConfirmLoading={loading}
      confirmText="T?i kho?n"
      cancelText="T?i kho?n"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-center">
            <div className="relative" onClick={handleAvatarClick}>
              <Avatar className="w-24 h-24 border cursor-pointer">
                <AvatarImage src={avatar} alt={userData?.name} className="object-cover" />
                <AvatarFallback>{userData?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-background border rounded-full cursor-pointer hover:bg-muted"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
                <input
                  id="avatar-upload"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.common.name')}</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.common.phonenumber')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </SheetRework>
  )
}
