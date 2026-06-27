'use client'

import { useState, useCallback } from 'react'
import { baseService } from '@/services/base-service'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'

export interface FileWithPreview extends File {
  preview?: string
}


export const FILE_SIZE_LIMIT = 1 
export const FILE_SIZE_MB = 1024 * 1024 

export interface UploadState {
  files: FileWithPreview[]
  uploadedUrls: string[]
  isUploading: boolean
  progress: number
  error: string | null
}

export function useUploadMedia() {
  const [state, setState] = useState<UploadState>({
    files: [],
    uploadedUrls: [],
    isUploading: false,
    progress: 0,
    error: null
  })

  
  const validateFileSize = useCallback((file: File): boolean => {
    const fileSizeMB = file.size / FILE_SIZE_MB
    return fileSizeMB <= FILE_SIZE_LIMIT
  }, [])

  
  const compressImage = useCallback(
    async (file: File): Promise<File> => {
      
      if (!file.type.startsWith('image/') || validateFileSize(file)) {
        return file
      }

      const options = {
        maxSizeMB: FILE_SIZE_LIMIT, 
        maxWidthOrHeight: 1920, 
        useWebWorker: true, 
        initialQuality: 0.8 
      }

      try {
        const compressedFile = await imageCompression(file, options)
        console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
        return compressedFile
      } catch (error) {
        console.error('Error compressing image:', error)
        
        return file
      }
    },
    [validateFileSize]
  )
  const handleAddFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const filesArray = Array.from(newFiles)

      
      setState((prev) => ({ ...prev, isUploading: true, progress: 10, error: null }))

      try {
        
        const processedFiles = await Promise.all(
          filesArray.map(async (file) => {
            
            if (file.type.startsWith('image/') && file.size > FILE_SIZE_MB) {
              setState((prev) => ({ ...prev, progress: 30 }))
              try {
                
                const compressedFile = await compressImage(file)
                setState((prev) => ({ ...prev, progress: 60 }))

                
                const fileWithPreview = compressedFile as FileWithPreview
                fileWithPreview.preview = URL.createObjectURL(compressedFile)

                
                console.log(
                  `Compressed: ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
                )

                
                if (compressedFile.size > FILE_SIZE_MB) {
                  toast.warning(`T?i t?p${file.name}`, {
                    description: `T?i t?p${(file.size / 1024 / 1024).toFixed(2)}T?i t?p${(compressedFile.size / 1024 / 1024).toFixed(2)}T?i t?p${FILE_SIZE_LIMIT}T?i t?p`
                  })
                } else {
                  toast.success(`T?i t?p${file.name}`, {
                    description: `T?i t?p${(file.size / 1024 / 1024).toFixed(2)}T?i t?p${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
                  })
                }

                return fileWithPreview
              } catch (error) {
                console.error('Compression error:', error)
                
                const fileWithPreview = file as FileWithPreview
                fileWithPreview.preview = URL.createObjectURL(file)
                return fileWithPreview
              }
            } else {
              
              const fileWithPreview = file as FileWithPreview
              fileWithPreview.preview = URL.createObjectURL(file)
              return fileWithPreview
            }
          })
        )

        setState((prev) => ({
          ...prev,
          files: [...prev.files, ...processedFiles],
          isUploading: false, 
          progress: 0,
          error: null
        }))

        
        uploadFiles(processedFiles)
      } catch (error: any) {
        console.error('File processing error:', error)
        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: 'T?i t?p'
        }))

        toast.error('T?i t?p', {
          description: error.message || 'T?i t?p'
        })
      }
    },
    [compressImage]
  )
  const handleRemoveFile = useCallback((fileName: string) => {
    setState((prev) => {
      const fileIndex = prev.files.findIndex((f) => f.name === fileName)
      if (fileIndex === -1) return prev 

      const newFiles = [...prev.files]
      const fileToRemove = newFiles[fileIndex]
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }

      newFiles.splice(fileIndex, 1)

      return {
        ...prev,
        files: newFiles
      }
    })
  }, [])
  const handleRemoveAllFiles = useCallback(() => {
    setState((prev) => {
      prev.files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })

      return {
        ...prev,
        files: [],
        uploadedUrls: [],
        progress: 0
      }
    })
  }, [])

  
  const uploadFiles = useCallback(
    async (filesToUpload?: FileWithPreview[]) => {
      const filesToProcess = filesToUpload || state.files

      if (filesToProcess.length === 0) {
        return []
      }

      setState((prev) => ({ ...prev, isUploading: true, progress: 0, error: null }))

      let progressInterval: NodeJS.Timeout | undefined = undefined

      try {
        progressInterval = setInterval(() => {
          setState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90)
          }))
        }, 200)

        
        const response = await baseService.uploadMedia(filesToProcess)

        clearInterval(progressInterval)
        
        
        
        
        
        const urls = response.data || []
        const newUrls = urls.map((item: { url: string }, index: number) => item.url)

        setState((prev) => ({
          ...prev,
          uploadedUrls: [...prev.uploadedUrls, ...newUrls],
          isUploading: false,
          progress: 100
        }))

        toast.success(
          `T?i t?p${newUrls.length}T?i t?p`
        )
        return newUrls
      } catch (error: any) {
        
        if (progressInterval) {
          clearInterval(progressInterval)
        }

        console.error('Upload error:', error)

        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: error.message || 'T?i t?p'
        }))

        toast.error('T?i t?p', {
          description: error.message || 'T?i t?p'
        })

        return []
      }
    },
    [state.files]
  )

  
  const reset = useCallback(() => {
    setState((prev) => {
      prev.files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })

      return {
        files: [],
        uploadedUrls: [],
        isUploading: false,
        progress: 0,
        error: null
      }
    })
  }, [])

  return {
    files: state.files,
    uploadedUrls: state.uploadedUrls,
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadFiles,
    reset,
    validateFileSize,
    fileSizeLimit: FILE_SIZE_LIMIT
  }
}

export default useUploadMedia
