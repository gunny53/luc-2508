import { PrismaClient } from '@prisma/client'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../../../src/app.module'
import { SearchSyncService } from '../../../src/shared/services/search-sync.service'
import { Logger } from '@nestjs/common'
import { Client } from '@elastic/elasticsearch'

const prisma = new PrismaClient()
const logger = new Logger('SyncToElasticsearch')

// English content normalized from the original source text.
const ES_CONFIG = {
  node: 'http://103.147.186.84:9200',
  indexName: 'products'
}

/* English content normalized from the original source text. */
async function cleanElasticsearchIndex(): Promise<void> {
  const client = new Client({ node: ES_CONFIG.node })

  try {
    logger.log('English content normalized from the original source text.')

    // English content normalized from the original source text.
    const info = await client.info()
    logger.log(`English content normalized from the original source text.${info.version.number}`)

    // English content normalized from the original source text.
    const indexExists = await client.indices.exists({ index: ES_CONFIG.indexName })

    if (indexExists) {
      // English content normalized from the original source text.
      const count = await client.count({ index: ES_CONFIG.indexName })
      logger.log(`📊 Index ${ES_CONFIG.indexName}English content normalized from the original source text.${count.count} documents`)

      if (count.count > 0) {
        logger.log(`English content normalized from the original source text.${count.count}English content normalized from the original source text.`)

        // English content normalized from the original source text.
        const deleteResult = await client.deleteByQuery({
          index: ES_CONFIG.indexName,
          body: {
            query: {
              match_all: {}
            }
          }
        })

        logger.log(`English content normalized from the original source text.${deleteResult.deleted} documents`)

        // English content normalized from the original source text.
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

/* English content normalized from the original source text. */
async function syncAllProductsToElasticsearch(): Promise<void> {
  let app: any = null

  try {
    logger.log('English content normalized from the original source text.')

    // English content normalized from the original source text.
    await cleanElasticsearchIndex()

    // English content normalized from the original source text.
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        createdById: { not: undefined } // English content normalized from the original source text.
      },
      select: {
        id: true,
        name: true
      }
    })

    logger.log(`English content normalized from the original source text.${products.length}English content normalized from the original source text.`)

    if (products.length === 0) {
      logger.warn('English content normalized from the original source text.')
      return
    }

    // English content normalized from the original source text.
    logger.log('English content normalized from the original source text.')
    app = await NestFactory.createApplicationContext(AppModule)
    const searchSyncService = app.get(SearchSyncService)

    // English content normalized from the original source text.
    const batchSize = 100
    const batches = Array.from({ length: Math.ceil(products.length / batchSize) }, (_, i) =>
      products.slice(i * batchSize, (i + 1) * batchSize)
    )

    logger.log(`English content normalized from the original source text.${products.length} products trong ${batches.length} batches`)

    let successCount = 0
    let failCount = 0

    // English content normalized from the original source text.
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const productIds = batch.map((p) => p.id)

      logger.log(`English content normalized from the original source text.${i + 1}/${batches.length}English content normalized from the original source text.${batch.length} products...`)

      try {
        await searchSyncService.syncProductsBatchToES({
          productIds: productIds,
          action: 'create'
        })

        successCount += batch.length
        logger.log(`English content normalized from the original source text.${i + 1}/${batches.length}`)

        // English content normalized from the original source text.
        batch.forEach((product) => {
          logger.log(`  ✅ Queued sync for product: ${product.name}`)
        })
      } catch (error) {
        failCount += batch.length
        logger.error(`English content normalized from the original source text.${i + 1}/${batches.length}:`, error)
        // English content normalized from the original source text.
      }
    }

    logger.log(`🎉 Sync completed! Success: ${successCount}, Failed: ${failCount}`)
  } catch (error) {
    logger.error('❌ Sync failed:', error)
    throw error
  } finally {
    // English content normalized from the original source text.
    if (app) {
      await app.close()
      logger.log('English content normalized from the original source text.')
    }

    await prisma.$disconnect()
    logger.log('English content normalized from the original source text.')
  }
}

// English content normalized from the original source text.
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
