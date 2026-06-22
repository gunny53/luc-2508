'use client'

import { useState, useCallback } from 'react'
import { baseService } from '@/services/base-service'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'

export interface FileWithPreview extends File {
  preview?: string
}

// Constants for file validation
export const FILE_SIZE_LIMIT = 1 // 1MB size limit
export const FILE_SIZE_MB = 1024 * 1024 // Convert to bytes

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

  // Validate file size
  const validateFileSize = useCallback((file: File): boolean => {
    const fileSizeMB = file.size / FILE_SIZE_MB
    return fileSizeMB <= FILE_SIZE_LIMIT
  }, [])

  // Compress image before upload
  const compressImage = useCallback(
    async (file: File): Promise<File> => {
      // Only compress if it's an image file and size exceeds limit
      if (!file.type.startsWith('image/') || validateFileSize(file)) {
        return file
      }

      const options = {
        maxSizeMB: FILE_SIZE_LIMIT, // compress to max 1MB
        maxWidthOrHeight: 1920, // limit width/height while maintaining aspect ratio
        useWebWorker: true, // use web worker for better performance
        initialQuality: 0.8 // initial quality to try
      }

      try {
        const compressedFile = await imageCompression(file, options)
        console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
        return compressedFile
      } catch (error) {
        console.error('Error compressing image:', error)
        // Return original file if compression fails
        return file
      }
    },
    [validateFileSize]
  )
  const handleAddFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const filesArray = Array.from(newFiles)

      // Set a loading state for compression
      setState((prev) => ({ ...prev, isUploading: true, progress: 10, error: null }))

      try {
        // Process and compress image files
        const processedFiles = await Promise.all(
          filesArray.map(async (file) => {
            // If it's an image and needs compression (over size limit)
            if (file.type.startsWith('image/') && file.size > FILE_SIZE_MB) {
              setState((prev) => ({ ...prev, progress: 30 }))
              try {
                // Compress the image
                const compressedFile = await compressImage(file)
                setState((prev) => ({ ...prev, progress: 60 }))

                // Create preview URL for compressed file
                const fileWithPreview = compressedFile as FileWithPreview
                fileWithPreview.preview = URL.createObjectURL(compressedFile)

                // Show compression info
                console.log(
                  `Compressed: ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
                )

                // Check if still over limit after compression
                if (compressedFile.size > FILE_SIZE_MB) {
                  toast.warning(`English content normalized from the original source text.${file.name}`, {
                    description: `English content normalized from the original source text.${(file.size / 1024 / 1024).toFixed(2)}English content normalized from the original source text.${(compressedFile.size / 1024 / 1024).toFixed(2)}English content normalized from the original source text.${FILE_SIZE_LIMIT}English content normalized from the original source text.`
                  })
                } else {
                  toast.success(`English content normalized from the original source text.${file.name}`, {
                    description: `English content normalized from the original source text.${(file.size / 1024 / 1024).toFixed(2)}English content normalized from the original source text.${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
                  })
                }

                return fileWithPreview
              } catch (error) {
                console.error('Compression error:', error)
                // If compression fails, use original file with preview
                const fileWithPreview = file as FileWithPreview
                fileWithPreview.preview = URL.createObjectURL(file)
                return fileWithPreview
              }
            } else {
              // For non-image files or already small images, just add preview
              const fileWithPreview = file as FileWithPreview
              fileWithPreview.preview = URL.createObjectURL(file)
              return fileWithPreview
            }
          })
        )

        setState((prev) => ({
          ...prev,
          files: [...prev.files, ...processedFiles],
          isUploading: false, // Will be set to true by uploadFiles
          progress: 0,
          error: null
        }))

        // Directly call uploadFiles with the newly processed files
        uploadFiles(processedFiles)
      } catch (error: any) {
        console.error('File processing error:', error)
        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: 'English content normalized from the original source text.'
        }))

        toast.error('English content normalized from the original source text.', {
          description: error.message || 'English content normalized from the original source text.'
        })
      }
    },
    [compressImage]
  )
  const handleRemoveFile = useCallback((fileName: string) => {
    setState((prev) => {
      const fileIndex = prev.files.findIndex((f) => f.name === fileName)
      if (fileIndex === -1) return prev // File not found

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

  // Upload a specific set of files
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

        // Files are already compressed when added, upload directly
        const response = await baseService.uploadMedia(filesToProcess)

        clearInterval(progressInterval)
        // {
        //   statusCode: 201,
        //   timestamp: "2025-07-17T04:53:03.079Z",
        //   data: [{ url: "https://..." }]
        // }
        const urls = response.data || []
        const newUrls = urls.map((item: { url: string }, index: number) => item.url)

        setState((prev) => ({
          ...prev,
          uploadedUrls: [...prev.uploadedUrls, ...newUrls],
          isUploading: false,
          progress: 100
        }))

        toast.success(
          `English content normalized from the original source text.${newUrls.length}English content normalized from the original source text.`
        )
        return newUrls
      } catch (error: any) {
        // Stop the progress bar on error
        if (progressInterval) {
          clearInterval(progressInterval)
        }

        console.error('Upload error:', error)

        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: error.message || 'English content normalized from the original source text.'
        }))

        toast.error('English content normalized from the original source text.', {
          description: error.message || 'English content normalized from the original source text.'
        })

        return []
      }
    },
    [state.files]
  )

  // Reset state
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
