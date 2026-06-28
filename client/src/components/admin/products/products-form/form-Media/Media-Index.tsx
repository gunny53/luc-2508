'use client'

import { UploadCloud, X, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useMediaForm } from './use-media-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { SortableImage } from './sortable-image'

interface MediaFormProps {
  images: string[]
  setImages: (images: string[]) => void
}

export const MediaForm = ({ images, setImages }: MediaFormProps) => {
  const {
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
    selectedImages,
    handleToggleSelect,
    handleSelectAll,
    handleRemoveSelected,
    handleDragEnd: onDragEnd,
    handleDragStart: onDragStart,
    isUploading
  } = useMediaForm({ initialImageUrls: images })
  const prevImagesRef = useRef<string[]>([])
  useEffect(() => {
    const newUrls = imageObjects.map((img) => img.url).filter((url) => url && url.trim() !== '')

    const prevUrls = prevImagesRef.current
    const urlsChanged = JSON.stringify(newUrls) !== JSON.stringify(prevUrls)
    const differentFromProps = JSON.stringify(newUrls) !== JSON.stringify(images)

    if (urlsChanged && differentFromProps) {
      prevImagesRef.current = newUrls
      setImages(newUrls.length > 0 ? newUrls : [])
      console.log('Sản phẩm', newUrls.length > 0 ? newUrls : [])
    }
  }, [imageObjects])

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    onDragStart() 
  }

  const handleDragEnd = (event: DragEndEvent) => {
    onDragEnd(event)
    setActiveId(null)
  }

  const isSelectionMode = selectedImages.length > 0
  const allSelected = selectedImages.length === images.length && images.length > 0
  const canAddMore = images.length < 12

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        {!isSelectionMode ? (
          <Label>Sản phẩm</Label>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <Checkbox
              id="select-all-images"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Sản phẩm"
            />
            <Label htmlFor="select-all-images" className="text-sm font-medium cursor-pointer">
              Sản phẩm {selectedImages.length} / {images.length}
            </Label>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleRemoveSelected}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Sản phẩm
            </Button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
        title="Sản phẩm"
        aria-label="Sản phẩm"
      />

      {images.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragOver ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
          }`}
          onClick={handleImageUpload}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className={`w-8 h-8 ${isDragOver ? 'text-primary' : 'text-gray-400'}`} />
          <p className="mt-3 font-semibold text-sm">
            {isDragOver
              ? 'Sản phẩm'
              : 'Sản phẩm'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isDragOver
              ? 'Sản phẩm'
              : 'Sản phẩm'}
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className="relative"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <SortableContext items={imageObjects} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {imageObjects.map((img, index) => (
                  <SortableImage
                    key={img.id}
                    id={img.id}
                    src={img.url}
                    index={index}
                    isMainImage={index === 0}
                    isDragging={activeId === img.id}
                    hoveredImageIndex={hoveredImageIndex}
                    selectedImages={selectedImages}
                    setHoveredImageIndex={setHoveredImageIndex}
                    handleToggleSelect={handleToggleSelect}
                    isUploading={img.progress < 100 && isUploading}
                    progress={img.progress}
                  />
                ))}

                {}
                {images.length < 12 && !isUploading && (
                  <div
                    onClick={handleImageUpload}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary transition-colors aspect-square h-full w-full"
                  >
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                    <p className="text-xs font-medium mt-1">
                      Sản phẩm
                    </p>
                  </div>
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <SortableImage
                  id={activeId}
                  src={imageObjects.find((img) => img.id === activeId)?.url || ''}
                  index={imageObjects.findIndex((img) => img.id === activeId)}
                  isDragging={true}
                  isMainImage={false} 
                  hoveredImageIndex={null}
                  selectedImages={[]}
                  setHoveredImageIndex={() => {}}
                  handleToggleSelect={() => {}}
                  isUploading={false} 
                  progress={0}
                />
              ) : null}
            </DragOverlay>

            {}
            {isDragOver && (
              <div className="absolute inset-0 bg-primary/5 border-2 border-primary border-dashed rounded-lg flex items-center justify-center z-10 pointer-events-none">
                <div className="text-center">
                  <UploadCloud className="w-10 h-10 text-primary mx-auto" />
                  <p className="mt-2 text-lg font-semibold text-primary">
                    Sản phẩm
                  </p>
                </div>
              </div>
            )}
          </div>
        </DndContext>
      )}
    </div>
  )
}
