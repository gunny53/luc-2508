import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useUploadMediaPresign } from '@/hooks/use-upload-media-presign'
import { toast } from 'sonner'

interface ImageObject {
  id: string
  url: string
  file?: File
  progress: number
  originalIndex?: number 
}

interface UseMediaFormProps {
  initialImageUrls: string[]
}

export function useMediaForm({ initialImageUrls }: UseMediaFormProps) {
  const [imageObjects, setImageObjects] = useState<ImageObject[]>(() =>
    initialImageUrls.map((url) => ({ id: url, url, progress: 100 }))
  )

  const prevUrlsRef = useRef<string[]>([])
  const lastProcessedLengthRef = useRef<number>(0) 
  useEffect(() => {
    const currentUrls = imageObjects.map((img) => img.url)
    const initialUrlsChanged = JSON.stringify(initialImageUrls) !== JSON.stringify(prevUrlsRef.current)

    if (initialUrlsChanged) {
      prevUrlsRef.current = initialImageUrls

      setImageObjects((currentObjects) => {
        const uploadingObjects = currentObjects.filter((o) => o.file)
        const uploadingUrls = new Set(uploadingObjects.map((o) => o.url))
        const newObjectsFromUrls = initialImageUrls
          .filter((url) => !uploadingUrls.has(url))
          .map((url) => ({ id: url, url, progress: 100 }))

        return [...newObjectsFromUrls, ...uploadingObjects]
      })
    }
  }, [initialImageUrls])

  const presignHook = useUploadMediaPresign()

  
  const uploadedUrls = presignHook.uploadedUrls
  const isUploading = presignHook.isProcessing || presignHook.isUploading
  const overallProgress = presignHook.progress

  
  const handleAddFiles = useCallback(
    async (files: File[]) => {
      try {
        
        const result = await presignHook.handleAddFiles(files)

        
        if (result && result.presignedData && result.presignedData.length > 0) {
          console.log(
            'Uploading with files:',
            result.processedFiles.length,
            'presigned data:',
            result.presignedData.length
          )

          
          await presignHook.uploadToS3Multiple(result.processedFiles, result.presignedData)
        }
      } catch (error) {
        console.error('Error in handleAddFiles:', error)
      }
    },
    [presignHook]
  )

  
  const uploadFiles = handleAddFiles

  
  const handleRemoveFile = presignHook.handleRemoveFile

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false) 

  useEffect(() => {
    setImageObjects((currentObjects) =>
      currentObjects.map((obj) => (obj.file ? { ...obj, progress: overallProgress } : obj))
    )
  }, [overallProgress])
  useEffect(() => {
    
    if (isDragging) return

    if (uploadedUrls.length > lastProcessedLengthRef.current) {
      
      const newUrls = uploadedUrls.slice(lastProcessedLengthRef.current)

      console.log('Processing new uploaded URLs:', newUrls)
      setImageObjects((currentObjects) => {
        console.log(
          'Current objects before update:',
          currentObjects.map((o: ImageObject) => ({ id: o.id, url: o.url.substring(0, 50), hasFile: !!o.file }))
        )
        const uploadingObjects = currentObjects.filter((obj) => obj.file)

        

        
        const updatedObjects = currentObjects.map((obj) => {
          
          if (obj.file) {
            const uploadingIndex = uploadingObjects.indexOf(obj)
            if (uploadingIndex !== -1 && uploadingIndex < newUrls.length) {
              
              console.log(`Updating object: ${obj.id} with URL: ${newUrls[uploadingIndex]}`)
              return {
                id: newUrls[uploadingIndex], 
                url: newUrls[uploadingIndex], 
                progress: 100,
                file: undefined 
              }
            }
          }
          
          return obj
        })

        
        const unmatchedUrls = newUrls.slice(uploadingObjects.length)
        unmatchedUrls.forEach((url) => {
          updatedObjects.push({
            id: url, 
            url: url,
            progress: 100
          })
        })

        
        lastProcessedLengthRef.current = uploadedUrls.length

        console.log(
          'Updated objects after processing:',
          updatedObjects.map((o: ImageObject) => ({ id: o.id, url: o.url.substring(0, 50), hasFile: !!o.file }))
        )

        return updatedObjects
      })
    }
  }, [uploadedUrls, isDragging])

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      const availableSlots = 12 - imageObjects.length
      if (availableSlots <= 0) {
        toast.warning('S?n ph?m')
        return
      }

      const filesToProcess = files.slice(0, availableSlots).filter((f) => f.type.startsWith('image/'))
      if (filesToProcess.length === 0) return

      const newImageObjects: ImageObject[] = filesToProcess.map((file) => ({
        id: `uploading-${file.name}-${Date.now()}`, 
        url: URL.createObjectURL(file),
        file: file,
        progress: 0
      }))

      setImageObjects((prev) => [...prev, ...newImageObjects])

      await handleAddFiles(filesToProcess)
    },
    [imageObjects.length, handleAddFiles]
  )

  const handleImageUpload = useCallback(() => fileInputRef.current?.click(), [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileSelected(Array.from(e.target.files))
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [handleFileSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      if (e.dataTransfer.files) {
        handleFileSelected(Array.from(e.dataTransfer.files))
      }
    },
    [handleFileSelected]
  )

  const handleRemoveSelected = useCallback(() => {
    if (selectedImageIds.length === 0) return

    const uploadingFilesToRemove = imageObjects
      .filter((img) => selectedImageIds.includes(img.id) && img.file)
      .map((img) => img.file!)

    
    uploadingFilesToRemove.forEach((file) => handleRemoveFile(file.name))

    setImageObjects((prev) => prev.filter((img) => !selectedImageIds.includes(img.id)))
    setSelectedImageIds([])
    console.log(
      'Images after removal:',
      imageObjects.filter((img) => !selectedImageIds.includes(img.id)).map((img) => img.url)
    )
  }, [imageObjects, selectedImageIds, handleRemoveFile])

  const handleToggleSelect = useCallback((idToToggle: string) => {
    setSelectedImageIds((prev) =>
      prev.includes(idToToggle) ? prev.filter((id) => id !== idToToggle) : [...prev, idToToggle]
    )
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedImageIds.length === imageObjects.length) {
      setSelectedImageIds([])
    } else {
      setSelectedImageIds(imageObjects.map((img) => img.id))
    }
  }, [imageObjects, selectedImageIds.length])

  const handleRemoveImage = useCallback(
    (id: string) => {
      const imageToRemove = imageObjects.find((img) => img.id === id)

      
      setImageObjects((prev) => prev.filter((img) => img.id !== id))

      
      if (imageToRemove && imageToRemove.file) {
        handleRemoveFile(imageToRemove.file.name)
      }
      
      
      
    },
    [imageObjects, handleRemoveFile]
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setIsDragging(false) 

    if (over && active.id !== over.id) {
      setImageObjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }, [])

  const handleDragEnter = useCallback(() => setIsDragOver(true), [])
  const handleDragLeave = useCallback(() => setIsDragOver(false), [])
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const imagesForDisplay = useMemo(() => imageObjects.map((img) => img.url), [imageObjects])

  return {
    images: imagesForDisplay,
    imageObjects,
    fileInputRef,
    handleImageUpload,
    handleFileChange,
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    hoveredImageIndex,
    setHoveredImageIndex,
    selectedImages: selectedImageIds,
    handleToggleSelect,
    handleSelectAll,
    handleRemoveSelected,
    handleDragEnd,
    handleDragStart,
    isUploading
  }
}
