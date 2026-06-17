import { PrismaClient } from '@prisma/client'
import {
  readJsonStream,
  logger,
  CONFIG,
  ShopeeProduct,
  ProcessedProduct,
  validateProductEnhanced,
  generateEnhancedVariants,
  generateSKUs,
  validateVariantsAndCalculateSKUs,
  generateProductSpecifications,
  generateProductMetadata
} from './import-utils'
import { importBrands } from './import-brands'
import { importCategories } from './import-categories'
import { importUsers } from './import-users'
import { importProducts } from './import-products'
import { importFullAddressesFromGHN } from './import-addresses'
import { importSKUs } from './import-skus'
import { importProductTranslations } from './import-product-translations'
import { importReviews } from './import-reviews'
import { importReviewMedia } from './import-review-media'
import { v4 as uuidv4 } from 'uuid'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../../../src/app.module'
import { SearchSyncService } from '../../../src/shared/services/search-sync.service'
import { createLanguages } from '../../init/create-languages'

const prisma = new PrismaClient()

// English content normalized from the original source text.
type OrderData = {
  id: string
  userId: string
  status:
    | 'PENDING_PAYMENT'
    | 'PENDING_PACKAGING'
    | 'PICKUPED'
    | 'PENDING_DELIVERY'
    | 'DELIVERED'
    | 'RETURNED'
    | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
  receiver: string
  shopId: string
  paymentId: number
}

type ReviewData = {
  rating: number
  content: string
  userId: string
  productId: string
  orderId: string
  createdAt: Date
  updatedAt: Date
}

type ReviewMediaData = {
  url: string
  type: 'IMAGE' | 'VIDEO'
  reviewId: string
  createdAt: Date
}

async function main() {
  logger.log('English content normalized from the original source text.')
  await prisma.$connect()

  // English content normalized from the original source text.
  await createLanguages()

  const jsonPath = require('path').join(process.cwd(), 'initialScript', 'product', 'data', 'Shopee-products.json')
  const products: ShopeeProduct[] = await readJsonStream(jsonPath)

  // English content normalized from the original source text.
  const validProducts: ShopeeProduct[] = []
  for (const product of products) {
    const validation = validateProductEnhanced(product)
    if (validation.isValid) validProducts.push(product)
  }

  // 2. Import brands
  const creatorUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } })
  if (!creatorUser) throw new Error('English content normalized from the original source text.')
  const brandMap = await importBrands(validProducts, creatorUser.id, prisma)

  // 3. Import categories
  const categoryMap = await importCategories(validProducts, creatorUser.id, prisma)

  // 4. Import users (sellers)
  const uniqueSellers = new Map(
    validProducts
      .map((p) => [p.seller_id, p])
      .filter(([_, p]) => (p as ShopeeProduct).seller_id && (p as ShopeeProduct).seller_name) as [
      string,
      ShopeeProduct
    ][]
  )
  const sellerMap = await importUsers(uniqueSellers as Map<string, ShopeeProduct>, 'SELLER', creatorUser.id, prisma)

  // 5. Import users (customers)
  const uniqueCustomers = new Map(
    validProducts
      .flatMap((p) => p.product_ratings?.map((r) => [r.customer_name, r.customer_name]) || [])
      .filter(([name]) => name) as [string, string][]
  )
  const clientMap = await importUsers(uniqueCustomers as Map<string, string>, 'CLIENT', creatorUser.id, prisma)

  // English content normalized from the original source text.
  const allUsers = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      role: { select: { name: true } }
    }
  })
  await importFullAddressesFromGHN(allUsers, creatorUser.id, prisma)

  // English content normalized from the original source text.
  const processedProducts: ProcessedProduct[] = validProducts.map((product, idx) => {
    const brandId =
      brandMap.get(product.brand || CONFIG.DEFAULT_BRAND_NAME) || brandMap.get(CONFIG.DEFAULT_BRAND_NAME) || ''
    const categoryNames = product.breadcrumb.slice(1, -1).slice(0, 3)
    const categoryIds = categoryNames.map((name) => categoryMap.get(name)).filter((id) => id) as string[]

    // English content normalized from the original source text.
    if (categoryIds.length === 0 && categoryNames.length > 0) {
      const firstCategoryId = categoryMap.get(categoryNames[0])
      if (firstCategoryId) {
        categoryIds.push(firstCategoryId)
      }
    }

    // English content normalized from the original source text.
    if (categoryIds.length === 0) {
    }

    // English content normalized from the original source text.
    const variants = generateEnhancedVariants(product.variations)

    // English content normalized from the original source text.
    const variantValidation = validateVariantsAndCalculateSKUs(variants)
    if (!variantValidation.isValid) {
    }

    // English content normalized from the original source text.
    const specifications = generateProductSpecifications(product)

    // English content normalized from the original source text.
    const validImages = product.image.filter(
      (img) => img?.startsWith('http') && img?.length > 0 && !img?.includes('.mp4')
    )
    const validVideos = product.video?.filter((vid) => vid?.startsWith('http') && vid?.includes('.mp4')) || []
    const skus = generateSKUs(variants, product.final_price, product.stock, [...validImages, ...validVideos])

    // English content normalized from the original source text.
    if (skus.length > 1) {
    }

    // English content normalized from the original source text.
    const reviews = (product.product_ratings || [])
      .filter((r) => r.review && r.review.trim().length > 0) // English content normalized from the original source text.
      .map((r) => ({
        clientName: r.customer_name,
        rating: r.rating_stars,
        content: r.review,
        date: r.review_date,
        likes: r.review_likes,
        media: r.review_media
      }))

    // English content normalized from the original source text.
    const metadata = generateProductMetadata(product)

    return {
      shopeeData: product,
      brandId,
      categoryIds,
      sellerId: sellerMap.get(product.seller_id) || '',
      validImages,
      validVideos,
      variants,
      specifications,
      metadata,
      skus,
      reviews,
      productNumber: idx + 1
    }
  })

  // 8. Import products
  const productResult = await importProducts(processedProducts, creatorUser.id, prisma)

  // English content normalized from the original source text.
  const allSellerIds = [...new Set(processedProducts.map((p) => p.sellerId).filter(Boolean))]
  const createdProducts = await prisma.product.findMany({
    where: {
      name: { in: processedProducts.map((p) => p.shopeeData.title) },
      createdById: { in: allSellerIds }
    },
    select: { id: true, name: true, createdById: true }
  })

  // English content normalized from the original source text.
  const nameAndSellerToProductId = new Map(createdProducts.map((p) => [`${p.name}_${p.createdById}`, p.id]))

  processedProducts.forEach((p) => {
    const key = `${p.shopeeData.title}_${p.sellerId}`
    p.productId = nameAndSellerToProductId.get(key)
  })

  // English content normalized from the original source text.
  const skusData = processedProducts.flatMap((p) =>
    p.skus.map((sku) => ({
      ...sku,
      productId: p.productId!,
      createdById: p.sellerId || creatorUser.id, // English content normalized from the original source text.
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  )
  if (skusData.length) await importSKUs(skusData, prisma)

  // English content normalized from the original source text.
  const translationsData = processedProducts.map((p) => ({
    productId: p.productId!,
    languageId: CONFIG.VIETNAMESE_LANGUAGE_ID,
    name: p.shopeeData.title,
    description: p.shopeeData['Product Description'] || '',
    createdById: p.sellerId || creatorUser.id, // English content normalized from the original source text.
    createdAt: new Date(),
    updatedAt: new Date()
  }))
  if (translationsData.length) await importProductTranslations(translationsData, prisma)

  // English content normalized from the original source text.
  const existingPayment = await prisma.payment.findFirst({
    where: { status: 'SUCCESS' },
    orderBy: { createdAt: 'desc' }
  })

  const mockPayment =
    existingPayment ||
    (await prisma.payment.create({
      data: {
        status: 'SUCCESS',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

  // English content normalized from the original source text.
  const ordersData: OrderData[] = []
  const reviewsData: ReviewData[] = []
  processedProducts.forEach((p) => {
    p.reviews.forEach((review, idx) => {
      const userId = clientMap.get(review.clientName)
      if (!userId) return // English content normalized from the original source text.

      const orderId = uuidv4()
      ordersData.push({
        id: orderId,
        userId,
        status: 'DELIVERED',
        createdAt: new Date(),
        updatedAt: new Date(),
        receiver: JSON.stringify({ name: review.clientName || 'English content normalized from the original source text.', phone: '', address: '' }),
        shopId: p.sellerId,
        paymentId: mockPayment.id // English content normalized from the original source text.
      })
      reviewsData.push({
        rating: review.rating,
        content: review.content,
        userId,
        productId: p.productId!,
        orderId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })
  })
  if (ordersData.length) await prisma.order.createMany({ data: ordersData as any, skipDuplicates: true })
  let reviewIds: string[] = []
  if (reviewsData.length) reviewIds = await importReviews(reviewsData, prisma)

  // English content normalized from the original source text.
  const reviewMedias: ReviewMediaData[] = []
  let reviewIdx = 0
  processedProducts.forEach((p) => {
    p.reviews.forEach((review, idx) => {
      if (reviewIds[reviewIdx]) {
        // English content normalized from the original source text.
        if (review.media) {
          review.media.forEach((url) => {
            if (url && typeof url === 'string') {
              reviewMedias.push({
                url,
                type: url.endsWith('.mp4') ? 'VIDEO' : 'IMAGE',
                reviewId: reviewIds[reviewIdx],
                createdAt: new Date()
              })
            }
          })
        }
      }
      reviewIdx++
    })
  })
  if (reviewMedias.length) await importReviewMedia(reviewMedias, prisma)

  // English content normalized from the original source text.
  const vouchersData: any[] = []
  processedProducts.forEach((p) => {
    if (p.shopeeData.vouchers && Array.isArray(p.shopeeData.vouchers)) {
      p.shopeeData.vouchers.forEach((voucher: any) => {
        if (voucher && typeof voucher === 'object' && voucher.value && voucher.value > 0) {
          // English content normalized from the original source text.
          vouchersData.push({
            name: voucher.name || `Voucher ${p.shopeeData.title}`,
            description: voucher.description || '',
            value: voucher.value || 0,
            code: voucher.code || `VOUCHER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // English content normalized from the original source text.
            minOrderValue: voucher.minOrderValue || 0,
            maxUses: voucher.maxUses || 100,
            maxUsesPerUser: voucher.maxUsesPerUser || 1,
            discountType: voucher.value > 100 ? 'PERCENTAGE' : 'FIX_AMOUNT',
            discountStatus: 'ACTIVE',
            voucherType: 'PRODUCT',
            isPlatform: false,
            displayType: 'PUBLIC',
            discountApplyType: 'SPECIFIC',
            createdById: p.sellerId || creatorUser.id, // English content normalized from the original source text.
            shopId: p.sellerId || null, // English content normalized from the original source text.
            createdAt: new Date(),
            updatedAt: new Date(),
            products: {
              connect: p.productId ? [{ id: p.productId }] : []
            }
          })
        }
      })
    }
  })

  if (vouchersData.length > 0) {
    let successCount = 0
    let failCount = 0

    for (const voucher of vouchersData) {
      try {
        await prisma.discount.create({
          data: voucher
        })
        successCount++
      } catch (error) {
        logger.warn(`⚠️ Failed to import voucher: ${voucher.code} - ${error}`)
        failCount++
      }
    }
  }

  // English content normalized from the original source text.
  for (const p of processedProducts) {
    if (p.productId && p.validVideos.length > 0) {
      // English content normalized from the original source text.
      const product = await prisma.product.findUnique({
        where: { id: p.productId },
        select: { images: true }
      })

      if (product) {
        // English content normalized from the original source text.
        const existingVideos = product.images.filter((img) => img.includes('.mp4'))
        const newVideos = p.validVideos.filter((video) => !existingVideos.includes(video))
        const updatedImages = [...product.images, ...newVideos]

        if (newVideos.length > 0) {
          await prisma.product.update({
            where: { id: p.productId },
            data: { images: updatedImages }
          })
          logger.log(`📹 Added ${newVideos.length} videos to product: ${p.shopeeData.title}`)
        }
      }
    }
  }

  // English content normalized from the original source text.
  let connectedCount = 0
  let failedCount = 0

  for (const p of processedProducts) {
    if (p.productId && p.categoryIds.length > 0) {
      try {
        await prisma.product.update({
          where: { id: p.productId },
          data: {
            categories: {
              connect: p.categoryIds.map((categoryId) => ({ id: categoryId }))
            }
          }
        })
        connectedCount++
      } catch (error) {
        failedCount++
      }
    }
  }

  // English content normalized from the original source text.
  if (processedProducts.length > 0) {
    logger.log('English content normalized from the original source text.')

    try {
      // English content normalized from the original source text.
      const app = await NestFactory.createApplicationContext(AppModule)
      const searchSyncService = app.get(SearchSyncService)

      // English content normalized from the original source text.
      const productIds = processedProducts.map((p) => p.productId).filter((id) => id) as string[]

      if (productIds.length > 0) {
        // English content normalized from the original source text.
        const batchSize = 100
        const batches = Array.from({ length: Math.ceil(productIds.length / batchSize) }, (_, i) =>
          productIds.slice(i * batchSize, (i + 1) * batchSize)
        )

        logger.log(`English content normalized from the original source text.${productIds.length} products trong ${batches.length} batches`)

        let syncSuccessCount = 0
        let syncFailCount = 0

        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i]

          try {
            await searchSyncService.syncProductsBatchToES({
              productIds: batch,
              action: 'create'
            })
            syncSuccessCount += batch.length
            logger.log(`English content normalized from the original source text.${i + 1}/${batches.length}`)

            // English content normalized from the original source text.
            if (i < batches.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000)) // English content normalized from the original source text.
            }
          } catch (error) {
            syncFailCount += batch.length
            logger.error(`English content normalized from the original source text.${i + 1}/${batches.length}:`, error)
          }
        }

        logger.log(`🎉 Elasticsearch sync completed! Success: ${syncSuccessCount}, Failed: ${syncFailCount}`)
      }

      await app.close()
    } catch (error) {
      logger.error('English content normalized from the original source text.', error)
      // English content normalized from the original source text.
    }
  }

  logger.log('English content normalized from the original source text.')
  await prisma.$disconnect()
}

if (require.main === module) {
  main().catch((err) => {
    logger.error('English content normalized from the original source text.', err)
    process.exit(1)
  })
}
