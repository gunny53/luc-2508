import { PrismaClient } from '@prisma/client'
import { ShopeeProduct, ProcessedProduct, CONFIG, logger, hasDataChanged } from './import-utils'

interface ProductData {
  name: string
  description: string
  basePrice: number
  virtualPrice: number
  brandId: string
  images: string[]
  variants: any
  specifications: any
}

export async function importProducts(
  processedProducts: ProcessedProduct[],
  creatorUserId: string,
  tx: PrismaClient
): Promise<{ success: number; failed: number; productIds: string[] }> {
  let successCount = 0
  let failedCount = 0
  let skippedCount = 0
  const productIds: string[] = []
  const existingProducts = await tx.product.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      description: true,
      basePrice: true,
      virtualPrice: true,
      brandId: true,
      images: true,
      variants: true,
      specifications: true,
      createdById: true
    }
  })

  const copyBatchSize = CONFIG.COPY_BATCH_SIZE
  const copyChunks = Array.from({ length: Math.ceil(processedProducts.length / copyBatchSize) }, (_, i) =>
    processedProducts.slice(i * copyBatchSize, (i + 1) * copyBatchSize)
  )

  for (const chunk of copyChunks) {
    try {
      const now = new Date()
      const productsToCreate: any[] = []

      for (const processed of chunk) {
        const sellerId = processed.sellerId || creatorUserId

        const newProductData = {
          name: processed.shopeeData.title,
          description: processed.shopeeData['Product Description'] || '',
          basePrice: processed.shopeeData.final_price,
          virtualPrice: processed.shopeeData.initial_price,
          brandId: processed.brandId,
          images: [...processed.validImages, ...processed.validVideos],
          variants: processed.variants,
          specifications: processed.specifications.length ? processed.specifications : null,
          createdById: sellerId,
          publishedAt: processed.shopeeData.is_available ? now : null,
          createdAt: now,
          updatedAt: now
        }
        const existingProduct = existingProducts.find((ep) => ep.name === newProductData.name)

        if (!existingProduct) {
          productsToCreate.push(newProductData)
        } else {
          const hasChanged = hasDataChanged(existingProduct, newProductData as ProductData, [
            'description',
            'basePrice',
            'virtualPrice',
            'brandId',
            'images',
            'variants',
            'specifications'
          ])

          if (hasChanged) {
            await tx.product.update({
              where: { id: existingProduct.id },
              data: {
                description: newProductData.description,
                basePrice: newProductData.basePrice,
                virtualPrice: newProductData.virtualPrice,
                brandId: newProductData.brandId,
                images: newProductData.images,
                variants: newProductData.variants,
                specifications: newProductData.specifications,
                updatedAt: now
              }
            })
            productIds.push(existingProduct.id)
            successCount++
          } else {
            productIds.push(existingProduct.id)
            skippedCount++
          }
        }
      }
      if (productsToCreate.length > 0) {
        await tx.product.createMany({ data: productsToCreate, skipDuplicates: true })
        const createdProducts = await tx.product.findMany({
          where: {
            name: { in: productsToCreate.map((p) => p.name) },
            createdById: { in: productsToCreate.map((p) => p.createdById) }
          },
          select: { id: true, name: true },
          orderBy: { createdAt: 'desc' },
          take: productsToCreate.length
        })
        productIds.push(...createdProducts.map((p) => p.id))
        successCount += productsToCreate.length
      }
    } catch (error) {
      logger.error(`❌ Failed to create products batch`, error)
      failedCount += chunk.length
    }
  }

  logger.log(`✅ Imported ${successCount} products, skipped ${skippedCount}, failed: ${failedCount}`)
  return { success: successCount, failed: failedCount, productIds }
}
