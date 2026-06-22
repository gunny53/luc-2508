import { PrismaClient } from '@prisma/client'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@api/app.module'
import { SearchSyncService } from '@shared/services/search-sync.service'
import { Logger } from '@nestjs/common'
import { Client } from '@elastic/elasticsearch'

const prisma = new PrismaClient()
const logger = new Logger('SyncToElasticsearch')
const ES_CONFIG = {
  node: 'http://103.147.186.84:9200',
  indexName: 'products'
}

async function cleanElasticsearchIndex(): Promise<void> {
  const client = new Client({ node: ES_CONFIG.node })

  try {
    logger.log('English content normalized from the original source text.')
    const info = await client.info()
    logger.log(`English content normalized from the original source text.${info.version.number}`)
    const indexExists = await client.indices.exists({ index: ES_CONFIG.indexName })

    if (indexExists) {
      const count = await client.count({ index: ES_CONFIG.indexName })
      logger.log(
        `📊 Index ${ES_CONFIG.indexName}English content normalized from the original source text.${count.count} documents`
      )

      if (count.count > 0) {
        logger.log(
          `English content normalized from the original source text.${count.count}English content normalized from the original source text.`
        )
        const deleteResult = await client.deleteByQuery({
          index: ES_CONFIG.indexName,
          body: {
            query: {
              match_all: {}
            }
          }
        })

        logger.log(`English content normalized from the original source text.${deleteResult.deleted} documents`)
        logger.log('English content normalized from the original source text.')
        await client.indices.delete({ index: ES_CONFIG.indexName })
        logger.log(`English content normalized from the original source text.${ES_CONFIG.indexName}`)
      } else {
        logger.log(`✅ Index ${ES_CONFIG.indexName}English content normalized from the original source text.`)
      }
    } else {
      logger.log(`ℹ️  Index ${ES_CONFIG.indexName}English content normalized from the original source text.`)
    }

    logger.log('English content normalized from the original source text.')
  } catch (error) {
    logger.error('English content normalized from the original source text.', error)
    throw error
  } finally {
    await client.close()
  }
}

async function syncAllProductsToElasticsearch(): Promise<void> {
  let app: any = null

  try {
    logger.log('English content normalized from the original source text.')
    await cleanElasticsearchIndex()
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        createdById: { not: undefined }
      },
      select: {
        id: true,
        name: true
      }
    })

    logger.log(
      `English content normalized from the original source text.${products.length}English content normalized from the original source text.`
    )

    if (products.length === 0) {
      logger.warn('English content normalized from the original source text.')
      return
    }
    logger.log('English content normalized from the original source text.')
    app = await NestFactory.createApplicationContext(AppModule)
    const searchSyncService = app.get(SearchSyncService)
    const batchSize = 100
    const batches = Array.from({ length: Math.ceil(products.length / batchSize) }, (_, i) =>
      products.slice(i * batchSize, (i + 1) * batchSize)
    )

    logger.log(
      `English content normalized from the original source text.${products.length} products trong ${batches.length} batches`
    )

    let successCount = 0
    let failCount = 0
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const productIds = batch.map((p) => p.id)

      logger.log(
        `English content normalized from the original source text.${i + 1}/${batches.length}English content normalized from the original source text.${batch.length} products...`
      )

      try {
        await searchSyncService.syncProductsBatchToES({
          productIds: productIds,
          action: 'create'
        })

        successCount += batch.length
        logger.log(`English content normalized from the original source text.${i + 1}/${batches.length}`)
        batch.forEach((product) => {
          logger.log(`  ✅ Queued sync for product: ${product.name}`)
        })
      } catch (error) {
        failCount += batch.length
        logger.error(`English content normalized from the original source text.${i + 1}/${batches.length}:`, error)
      }
    }

    logger.log(`🎉 Sync completed! Success: ${successCount}, Failed: ${failCount}`)
  } catch (error) {
    logger.error('❌ Sync failed:', error)
    throw error
  } finally {
    if (app) {
      await app.close()
      logger.log('English content normalized from the original source text.')
    }

    await prisma.$disconnect()
    logger.log('English content normalized from the original source text.')
  }
}
if (require.main === module) {
  syncAllProductsToElasticsearch()
    .then(() => {
      logger.log('✅ Sync to Elasticsearch completed!')
      process.exit(0)
    })
    .catch((error) => {
      logger.error('❌ Sync to Elasticsearch failed:', error)
      process.exit(1)
    })
}

export { syncAllProductsToElasticsearch, cleanElasticsearchIndex }
