import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearProducts() {
  try {
    await prisma.$connect()
    console.log('🗑️  Starting to clear imported products and related data...')
    const creatorUser = await prisma.user.findFirst({
      where: { role: { name: 'ADMIN' } },
      orderBy: { createdAt: 'desc' }
    })

    if (!creatorUser) {
      console.log('⚠️  No admin user found, clearing all data...')
      return clearAllData()
    }

    console.log(`🎯 Clearing data imported by user: ${creatorUser.name} (${creatorUser.id})`)
    const deletedReviewMedia = await prisma.reviewMedia.deleteMany({
      where: {
        review: {
          product: {
            createdById: creatorUser.id
          }
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedReviewMedia.count} review media`)
    const deletedReviews = await prisma.review.deleteMany({
      where: {
        product: {
          createdById: creatorUser.id
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedReviews.count} reviews`)
    const deletedTranslations = await prisma.productTranslation.deleteMany({
      where: {
        product: {
          createdById: creatorUser.id
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedTranslations.count} product translations`)
    const deletedProductSKUSnapshots = await prisma.productSKUSnapshot.deleteMany({
      where: {
        product: {
          createdById: creatorUser.id
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedProductSKUSnapshots.count} product SKU snapshots`)
    const deletedSKUs = await prisma.sKU.deleteMany({
      where: {
        product: {
          createdById: creatorUser.id
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedSKUs.count} SKUs`)
    const deletedCartItems = await prisma.cartItem.deleteMany({
      where: {
        sku: {
          product: {
            createdById: creatorUser.id
          }
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedCartItems.count} cart items`)
    const deletedDiscountSnapshots = await prisma.discountSnapshot.deleteMany({
      where: {
        order: {
          createdById: creatorUser.id
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedDiscountSnapshots.count} discount snapshots`)
    const deletedOrders = await prisma.order.deleteMany({
      where: {
        createdById: creatorUser.id,
        items: {
          none: {}
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedOrders.count} fake orders`)
    const deletedPayments = await prisma.payment.deleteMany({
      where: {
        orders: {
          none: {}
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedPayments.count} orphaned payments`)
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        createdById: creatorUser.id
      }
    })
    console.log(`🗑️  Deleted ${deletedProducts.count} products`)
    const deletedBrandTranslations = await prisma.brandTranslation.deleteMany({
      where: {
        brand: {
          createdById: creatorUser.id
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedBrandTranslations.count} brand translations`)
    const unusedBrands = await prisma.brand.deleteMany({
      where: {
        createdById: creatorUser.id,
        products: {
          none: {}
        }
      }
    })
    console.log(`🗑️  Deleted ${unusedBrands.count} unused brands`)
    const deletedCategoryTranslations = await prisma.categoryTranslation.deleteMany({
      where: {
        category: {
          createdById: creatorUser.id
        }
      }
    })
    console.log(`🗑️  Deleted ${deletedCategoryTranslations.count} category translations`)
    const unusedCategories = await prisma.category.deleteMany({
      where: {
        createdById: creatorUser.id,
        products: {
          none: {}
        }
      }
    })
    console.log(`🗑️  Deleted ${unusedCategories.count} unused categories`)
    const remainingOrders = await prisma.order.deleteMany({})
    console.log(`🗑️  Deleted ${remainingOrders.count} remaining orders`)
    const unusedUsers = await prisma.user.deleteMany({
      where: {
        createdById: creatorUser.id,
        AND: [
          {
            OR: [{ role: { name: 'SELLER' } }, { role: { name: 'CLIENT' } }]
          },
          {
            OR: [{ createdProducts: { none: {} } }, { reviews: { none: {} } }]
          }
        ]
      }
    })
    console.log(`🗑️  Deleted ${unusedUsers.count} unused users (sellers/clients)`)
    const unusedAddresses = await prisma.address.deleteMany({
      where: {
        createdById: creatorUser.id,
        userAddress: {
          none: {}
        }
      }
    })
    console.log(`🗑️  Deleted ${unusedAddresses.count} unused addresses`)
    const deletedDiscounts = await prisma.discount.deleteMany({
      where: {
        createdById: creatorUser.id
      }
    })
    console.log(`🗑️  Deleted ${deletedDiscounts.count} discounts/vouchers`)

    console.log('✅ Successfully cleared all products and related data!')
    const remainingProducts = await prisma.product.count()
    const remainingReviews = await prisma.review.count()
    const remainingSKUs = await prisma.sKU.count()
    const remainingBrands = await prisma.brand.count()
    const remainingCategories = await prisma.category.count()

    console.log('\n📊 Final statistics:')
    console.log(`• Products: ${remainingProducts}`)
    console.log(`• Reviews: ${remainingReviews}`)
    console.log(`• SKUs: ${remainingSKUs}`)
    console.log(`• Brands: ${remainingBrands}`)
    console.log(`• Categories: ${remainingCategories}`)
    console.log('\n🧹 Clearing application cache...')
    try {
      const cacheFlushUrl = process.env.APP_URL || 'http://localhost:3000'
      const response = await fetch(`${cacheFlushUrl}/health/cache/flush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Cache cleared successfully: ${result.message}`)
      } else {
        console.warn(`⚠️  Cache clear failed with status: ${response.status}`)
      }
    } catch (error) {
      console.warn(`⚠️  Could not clear cache: ${error.message}`)
      console.log('💡 Cache will be cleared automatically on next request or restart')
    }
  } catch (error) {
    console.error('❌ Error clearing products:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
if (require.main === module) {
  clearProducts()
    .then(() => {
      console.log('✅ Product clearing completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Product clearing failed:', error)
      process.exit(1)
    })
}
async function clearAllData() {
  console.log('🗑️  Clearing ALL data (fallback mode)...')
  await prisma.reviewMedia.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.productTranslation.deleteMany({})
  await prisma.productSKUSnapshot.deleteMany({})
  await prisma.sKU.deleteMany({})
  await prisma.cartItem.deleteMany({})
  await prisma.discountSnapshot.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.payment.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.brandTranslation.deleteMany({})
  await prisma.brand.deleteMany({})
  await prisma.categoryTranslation.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.discount.deleteMany({})

  console.log('✅ Cleared ALL data')
  console.log('\n🧹 Clearing application cache...')
  try {
    const cacheFlushUrl = process.env.APP_URL || 'http://localhost:3000'
    const response = await fetch(`${cacheFlushUrl}/health/cache/flush`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Cache cleared successfully: ${result.message}`)
    } else {
      console.warn(`⚠️  Cache clear failed with status: ${response.status}`)
    }
  } catch (error) {
    console.warn(`⚠️  Could not clear cache: ${error.message}`)
    console.log('💡 Cache will be cleared automatically on next request or restart')
  }
}

export { clearProducts, clearAllData }
