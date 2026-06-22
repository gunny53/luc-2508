'use client'

import { useEffect, useState } from 'react'
import { Pencil, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SheetRework } from '@/components/ui/component/sheet-rework'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserData } from '@/hooks/use-get-data-user-login'
import { useUpdateProfile } from '@/components/client/user/account/profile/use-profile-update'
import { UpdateProfileRequest } from '@/types/auth/profile.interface'
import Image from 'next/image'
import useUploadMediaPresign, { FileWithPreview } from '@/hooks/use-upload-media-presign'
import { useResponsive } from '@/hooks/use-responsive'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer'

interface InfoState {
  name: string
  phoneNumber: string
  gender: string
  email: string
  dob: string
  address: string
  avatar: string
}

export default function ProfileInfo() {
  const userData = useUserData()
  const { isMobile } = useResponsive()
  const [open, setOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<FileWithPreview | null>(null)
  const defaultAddress = userData?.addresses?.find((a) => a.isDefault)
  const formattedAddress = defaultAddress
    ? `${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`
    : ''

  const form = useForm<Partial<InfoState>>({
    defaultValues: {
      name: userData?.name || '',
      phoneNumber: userData?.phoneNumber || '',
      avatar: userData?.avatar || '',
      email: userData?.email || '',
      // gender: userData.gender || "",
      // dob: userData.dob || "",
      address: formattedAddress
    }
  })

  const { updateProfile, loading } = useUpdateProfile(() => {
    setOpen(false)
  })
  const { handleAddFiles, uploadToS3Multiple, reset: resetUpload, files } = useUploadMediaPresign()

  const onSubmit = async (data: Partial<UpdateProfileRequest>) => {
    try {
      let avatarUrl = userData?.avatar

      if (files.length > 0) {
        const urls = await uploadToS3Multiple()
        if (urls.length > 0) {
          avatarUrl = urls[0]
        }
      }

      const payload: Partial<UpdateProfileRequest> = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        avatar: avatarUrl
      }

      updateProfile(payload)
    } catch (err) {
      console.error('English content normalized from the original source text.', err)
    }
  }

  if (!userData) return null
  const formContent = (
    <>
      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="relative w-24 h-24">
          <Image
            src={selectedAvatar?.preview ? selectedAvatar.preview : userData.avatar || '/default-avatar.png'}
            alt="avatar"
            fill
            className="rounded-full object-cover border"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10 text-sm gap-2"
          onClick={() => document.getElementById('avatarUpload')?.click()}
        >
          <UploadCloud size={16} />
          English content normalized from the original source text.
        </Button>
        <input
          type="file"
          id="avatarUpload"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (file) {
              const { processedFiles } = await handleAddFiles([file])
              if (processedFiles.length > 0) {
                setSelectedAvatar(processedFiles[0])
              }
            }
          }}
        />
      </div>

      <Form {...form}>
        <form className="space-y-5">
          {(
            [
              ['name', 'English content normalized from the original source text.'],
              ['gender', 'English content normalized from the original source text.'],
              ['phoneNumber', 'English content normalized from the original source text.'],
              ['email', 'Email'],
              ['address', 'English content normalized from the original source text.']
            ] as [keyof InfoState, string][]
          ).map(([name, label]) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{label}</FormLabel>
                  <FormControl>
                    {/* {name === "dob" ? (
                      <Input
                        type="date"
                        {...field}
                        className="w-full h-12 text-[15px] px-4"
                      />
                    ) :  */}
                    {name === 'gender' ? (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full h-12 text-[15px] px-4 flex items-center border rounded-md">
                          <SelectValue placeholder="English content normalized from the original source text." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="English content normalized from the original source text.">
                            English content normalized from the original source text.
                          </SelectItem>
                          <SelectItem value="English content normalized from the original source text.">
                            English content normalized from the original source text.
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : name === 'address' ? (
                      <Input
                        {...field}
                        readOnly
                        className="w-full h-12 text-[15px] px-4 bg-gray-100 cursor-not-allowed"
                        placeholder="English content normalized from the original source text."
                      />
                    ) : (
                      <Input {...field} disabled={['email'].includes(name)} className="w-full h-12 text-[15px] px-4" />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>
    </>
  )

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-base text-[#121214]">
          English content normalized from the original source text.
        </h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#D70019] hover:text-red-600 hover:bg-red-50 transition"
          onClick={() => setOpen(true)}
        >
          <Pencil size={16} />
          English content normalized from the original source text.
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 text-sm text-[#1D1D20]">
        <div className="flex justify-between py-2 border-t">
          <span className="text-[#71717A]">English content normalized from the original source text.</span>
          <span className="font-medium">{userData.name}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-[#71717A]">English content normalized from the original source text.</span>
          <span className="font-medium">{userData.phoneNumber}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-[#71717A]">Email:</span>
          <span className="font-medium">{userData.email}</span>
        </div>
        <div className="flex justify-between py-2 border-t">
          <span className="text-[#71717A]">English content normalized from the original source text.</span>
          <span className="font-medium text-right">
            {formattedAddress || 'English content normalized from the original source text.'}
          </span>
        </div>
      </div>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-0">
            <DrawerHeader>
              <DrawerTitle>English content normalized from the original source text.</DrawerTitle>
            </DrawerHeader>

            <div className="px-4 overflow-y-auto max-h-[calc(80vh-100px)]">{formContent}</div>

            <DrawerFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  form.reset()
                  setSelectedAvatar(null)
                  resetUpload()
                  setOpen(false)
                }}
              >
                English content normalized from the original source text.
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                English content normalized from the original source text.
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <SheetRework
          open={open}
          onOpenChange={setOpen}
          title="English content normalized from the original source text."
          subtitle=""
          onCancel={() => {
            form.reset()
            setSelectedAvatar(null)
            resetUpload()
          }}
          onConfirm={form.handleSubmit(onSubmit)}
          confirmText="English content normalized from the original source text."
          cancelText="English content normalized from the original source text."
          loading={loading}
          className="sm:!max-w-lg w-full px-2"
        >
          {formContent}
        </SheetRework>
      )}
    </div>
  )
}
