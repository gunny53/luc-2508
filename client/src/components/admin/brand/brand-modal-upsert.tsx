'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { ZodError } from 'zod'
import { useTranslations } from 'next-intl'
import { showToast } from '@/components/ui/toastify'
import { Brand, BrandCreateRequest, BrandUpdateRequest } from '@/types/admin/brands.interface'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react'
import { useUploadMediaPresign } from '@/hooks/use-upload-media-presign'
import { Progress } from '@/components/ui/progress'

interface BrandModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  brand: Brand | null
  onSubmit: (values: BrandCreateRequest | BrandUpdateRequest) => Promise<void>
}

export default function BrandModalUpsert({ open, onClose, mode, brand, onSubmit }: BrandModalUpsertProps) {
  const t = useTranslations('admin.ModuleBrands')

  
  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  
  const {
    files,
    uploadedUrls,
    presignedData,
    isUploading,
    isProcessing,
    progress,
    error: uploadError,
    currentStep,
    progressMessage,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadFiles,
    uploadToS3Multiple,
    reset: resetUpload
  } = useUploadMediaPresign()

  
  useEffect(() => {
    if (mode === 'edit' && brand) {
      setName(brand.name || '')
      setLogo(brand.logo || '')

      
      resetUpload()
    } else if (mode === 'add') {
      setName('')
      setLogo('')
      setErrors({})

      
      resetUpload()
    }
  }, [mode, brand, open, resetUpload])

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        showToast('Th??ng hi?u', 'error')
        return
      }

      
      handleRemoveAllFiles()

      
      handleAddFiles(e.target.files)
    }
  }

  
  const handleUploadLogo = async () => {
    if (presignedData.length === 0) return

    const urls = await uploadToS3Multiple()
    if (urls.length > 0) {
      
      setLogo(urls[0])
    }
  }

  
  useEffect(() => {
    if (uploadedUrls.length > 0 && !isUploading) {
      setLogo(uploadedUrls[uploadedUrls.length - 1]) 
    }
  }, [uploadedUrls, isUploading])

  
  const brandSchema = z.object({
    name: z.string().min(1, 'Th??ng hi?u'),
    logo: z.string().optional()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      brandSchema.parse({ name, logo })
      setErrors({})
      setLoading(true)

      try {
        if (mode === 'add') {
          const data: BrandCreateRequest = {
            name,
            logo
          }
          await onSubmit(data)
        } else if (mode === 'edit' && brand) {
          const data: BrandUpdateRequest = {
            name,
            logo
          }
          await onSubmit(data)
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
              ? t('modal.addTitle') || 'Th??ng hi?u'
              : t('modal.editTitle') || 'Th??ng hi?u'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? t('modal.addDescription') || 'Th??ng hi?u'
              : t('modal.editDescription') || 'Th??ng hi?u'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('modal.name') || 'Th??ng hi?u'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('modal.namePlaceholder') || 'Th??ng hi?u'}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('modal.logo') || 'Th??ng hi?u'}
              </label>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      {logo ? (
                        <AvatarImage src={logo} alt="Logo preview" className="object-contain p-1" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {name ? name.substring(0, 2).toUpperCase() : <ImageIcon className="h-6 w-6" />}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <button
                      type="button"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      disabled={isUploading}
                      aria-label={t('modal.selectImage') || 'Th??ng hi?u'}
                      title={t('modal.selectImage') || 'Th??ng hi?u'}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-1">
                    <Input
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder={
                        t('modal.logoPlaceholder') || 'Th??ng hi?u'
                      }
                      className="bg-muted"
                      readOnly={isUploading}
                    />

                    {isProcessing && (
                      <div className="space-y-1">
                        <Progress value={progress} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          {progressMessage} - {progress}%{' '}
                          {t('modal.completed') || 'Th??ng hi?u'}
                        </p>
                      </div>
                    )}

                    {isUploading && (
                      <div className="space-y-1">
                        <Progress value={progress} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          {progressMessage} - {progress}%{' '}
                          {t('modal.completed') || 'Th??ng hi?u'}
                        </p>
                      </div>
                    )}

                    {presignedData.length > 0 && !isUploading && !isProcessing && (
                      <div className="space-y-2">
                        <p className="text-xs text-green-600">
                          Th??ng hi?u
                        </p>
                        <Button type="button" size="sm" onClick={handleUploadLogo} className="w-full">
                          Th??ng hi?u
                        </Button>
                      </div>
                    )}

                  </div>
                </div>

                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  accept="image/*"
                  aria-label={t('modal.selectImage') || 'Th??ng hi?u'}
                />

                {isUploading && (
                  <div className="space-y-1">
                    <Progress value={progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">
                      {progressMessage} - {progress}%{' '}
                      {t('modal.completed') || 'Th??ng hi?u'}
                    </p>
                  </div>
                )}

                {files.length > 0 && !isUploading && (
                  <div className="text-xs text-muted-foreground">
                    {files[0].name} ({Math.round(files[0].size / 1024)} KB)
                  </div>
                )}

                {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
              </div>
              {errors.logo && <p className="text-sm text-red-500 mt-1">{errors.logo}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading || isUploading}>
              {t('modal.cancel') || 'Th??ng hi?u'}
            </Button>
            <Button type="submit" disabled={loading || isUploading}>
              {loading || isUploading
                ? mode === 'add'
                  ? t('modal.adding') || 'Th??ng hi?u'
                  : t('modal.saving') || 'Th??ng hi?u'
                : mode === 'add'
                  ? t('modal.add') || 'Th??ng hi?u'
                  : t('modal.save') || 'Th??ng hi?u'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
