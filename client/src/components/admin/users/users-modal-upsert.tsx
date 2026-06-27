'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ZodError } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, Upload, X, Image as ImageIcon, Camera } from 'lucide-react'
import { User, UserCreateRequest, UserRole, UserUpdateRequest } from '@/types/admin/user.interface'
import { useUploadMediaPresign } from '@/hooks/use-upload-media-presign'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { userCreateSchema, userUpdateSchema } from '@/utils/schema'

interface UsersModalUpsertProps {
  roles: UserRole[]
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  user: User | null
  onSubmit: (data: User | UserCreateRequest) => Promise<void>
}

export default function UsersModalUpsert({ roles, open, onClose, mode, user, onSubmit }: UsersModalUpsertProps) {
  const t = useTranslations()

  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [avatar, setAvatar] = useState('')
  const [roleId, setRoleId] = useState<string>('')
  const [status, setStatus] = useState('ACTIVE')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  
  const {
    files,
    uploadedUrls,
    presignedData,
    isProcessing,
    isUploading,
    progress,
    progressMessage,
    error: uploadError,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadToS3Multiple,
    reset: resetUpload
  } = useUploadMediaPresign()

  
  const STATUS_OPTIONS = [
    {
      value: 'ACTIVE',
      label: t('admin.users.modal.statusActive') || 'T?i kho?n'
    },
    {
      value: 'INACTIVE',
      label: t('admin.users.modal.statusInactive') || 'T?i kho?n'
    }
  ]

  
  useEffect(() => {
    if (mode === 'edit' && user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhoneNumber(user.phoneNumber || '')
      setAvatar(user.avatar || '')
      setRoleId(user.roleId || '')
      setStatus(user.status || 'ACTIVE')
      setPassword('')
      setConfirmPassword('')

      
      resetUpload()
    } else if (mode === 'add') {
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setPhoneNumber('')
      setAvatar('')
      setRoleId('')
      setStatus('ACTIVE')
      setErrors({})

      
      resetUpload()
    }
  }, [mode, user, open, resetUpload])

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        toast.error('T?i kho?n', {
          description: 'T?i kho?n'
        })
        return
      }

      
      handleRemoveAllFiles()

      
      handleAddFiles(e.target.files)
    }
  }

  
  const handleUploadAvatar = async () => {
    if (files.length === 0) return
    let urls: string[] = []

    if (presignedData.length > 0) {
      urls = await uploadToS3Multiple()
    } else {
      await handleAddFiles(files)
      
      urls = await uploadToS3Multiple()
    }

    if (urls.length > 0) {
      
      setAvatar(urls[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (mode === 'add') {
        userCreateSchema(t).parse({
          email,
          name,
          phoneNumber,
          password,
          confirmPassword,
          roleId,
          status
        })
      } else {
        userUpdateSchema(t).parse({
          email,
          name,
          phoneNumber,
          roleId,
          status
        })
      }

      setErrors({})
      setLoading(true)

      try {
        if (mode === 'add') {
          const data: UserCreateRequest = {
            email,
            name,
            phoneNumber,
            password, 
            roleId,
            status,
            avatar
          }
          await onSubmit(data)
        } else if (mode === 'edit' && user) {
          const data: UserUpdateRequest = {
            name,
            phoneNumber,
            roleId,
            status,
            avatar
          }
          if (!user.email.toLowerCase().includes('admin')) {
            data.email = email
          }

          
          const submitData: User = {
            ...user, 
            ...data 
          }
          await onSubmit(submitData)
        }
        onClose()
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        setLoading(false)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(formattedErrors)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? t('admin.users.modal.addTitle') || 'T?i kho?n'
              : t('admin.users.modal.editTitle') || 'T?i kho?n'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? t('admin.users.modal.addDescription') || 'T?i kho?n'
              : t('admin.users.modal.editDescription') || 'T?i kho?n'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('admin.users.modal.name') || 'T?i kho?n'}
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('admin.users.modal.name') || 'T?i kho?n'}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.users.modal.email') || 'Email'}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.users.modal.email') || 'Email'}
                disabled={mode === 'edit'}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('admin.users.modal.phoneNumber') || 'T?i kho?n'}
              </label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={
                  t('admin.users.modal.phoneNumber') || 'T?i kho?n'
                }
              />
              {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('admin.users.modal.avatar') || 'T?i kho?n'}
              </label>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      {avatar ? (
                        <AvatarImage src={avatar} alt="Avatar preview" className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {name ? name.substring(0, 2).toUpperCase() : <ImageIcon className="h-6 w-6" />}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <button
                      type="button"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isUploading || isProcessing}
                      aria-label={
                        t('admin.users.modal.selectImage') ||
                        'T?i kho?n'
                      }
                      title={
                        t('admin.users.modal.selectImage') ||
                        'T?i kho?n'
                      }
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-1">
                    <Input
                      value={avatar}
                      readOnly
                      placeholder={
                        t('admin.users.modal.avatarUrl') || 'T?i kho?n'
                      }
                      className="bg-muted"
                    />

                    {files.length > 0 && presignedData.length > 0 && !isUploading && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUploadAvatar}
                        disabled={isUploading || isProcessing}
                        className="w-full"
                      >
                        {isUploading
                          ? t('admin.users.modal.uploading') ||
                            'T?i kho?n'
                          : t('admin.users.modal.uploadImage') ||
                            'T?i kho?n'}
                      </Button>
                    )}

                    {isProcessing && (
                      <Button type="button" size="sm" disabled className="w-full">
                        {progressMessage || 'T?i kho?n'}
                      </Button>
                    )}
                  </div>
                </div>

                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading || isProcessing}
                  accept="image/*"
                  aria-label={
                    t('admin.users.modal.selectImage') || 'T?i kho?n'
                  }
                />

                {(isUploading || isProcessing) && (
                  <div className="space-y-1">
                    <Progress value={progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">
                      {progress}%{' '}
                      {t('admin.users.modal.completed') || 'T?i kho?n'}{' '}
                      - {progressMessage}
                    </p>
                  </div>
                )}

                {files.length > 0 && !isUploading && !isProcessing && (
                  <div className="text-xs text-muted-foreground">
                    {files[0].name} ({Math.round(files[0].size / 1024)} KB)
                    {presignedData.length > 0 && (
                      <span className="text-green-600 ml-2">
                        T?i kho?n
                      </span>
                    )}
                  </div>
                )}

                {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('admin.users.modal.role') || 'T?i kho?n'}
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    {roles.find((role) => role.id === roleId)?.name ||
                      t('admin.users.modal.selectRole') ||
                      'T?i kho?n'}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {roles.map((role) => (
                    <DropdownMenuItem key={role.id} onClick={() => setRoleId(role.id)}>
                      {role.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.roleId && <p className="text-sm text-red-500 mt-1">{errors.roleId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('admin.users.modal.status') || 'T?i kho?n'}
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    {STATUS_OPTIONS.find((option) => option.value === status)?.label ||
                      'T?i kho?n'}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuItem key={option.value} onClick={() => setStatus(option.value)}>
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {mode === 'add' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('admin.users.modal.password') || 'T?i kho?n'}
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      t('admin.users.modal.password') || 'T?i kho?n'
                    }
                  />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('admin.users.modal.confirmPassword') ||
                      'T?i kho?n'}
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={
                      t('admin.users.modal.confirmPassword') ||
                      'T?i kho?n'
                    }
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {t('admin.users.modal.cancel') || 'T?i kho?n'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? mode === 'add'
                  ? t('admin.users.modal.adding') || 'T?i kho?n'
                  : t('admin.users.modal.saving') || 'T?i kho?n'
                : mode === 'add'
                  ? t('admin.users.modal.add') || 'T?i kho?n'
                  : t('admin.users.modal.save') || 'T?i kho?n'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
