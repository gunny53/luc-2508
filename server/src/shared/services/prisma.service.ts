import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { HealthIndicatorResult } from '@nestjs/terminus'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL')

    super({
      log: [
        {
          emit: 'event',
          level: 'query'
        },
        {
          emit: 'stdout',
          level: 'info'
        },
        {
          emit: 'stdout',
          level: 'warn'
        }
      ],
      datasources: {
        db: {
          url: databaseUrl
        }
      }
      // English content normalized from the original source text.
      // English content normalized from the original source text.
      // English content normalized from the original source text.
      // English content normalized from the original source text.
      // English content normalized from the original source text.
      // Connection timeout = 20s
      // Idle timeout = 10s
      // Acquire timeout = 60s
      // English content normalized from the original source text.
    })
  }

  async onModuleInit() {
    // Retry logic cho database connection
    const maxRetries = 10
    const retryDelay = 5000 // 5 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.$connect()
        console.log('✅ Prisma connected to PostgreSQL with optimized configuration')
        break
      } catch (error) {
        console.log(`❌ Database connection attempt ${attempt}/${maxRetries} failed:`, error.message)

        if (attempt === maxRetries) {
          console.error('❌ Max retries reached. Database connection failed.')
          throw error
        }

        console.log(`🔄 Retrying in ${retryDelay / 1000} seconds...`)
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      }
    }

    // Log database info
    const dbInfo = (await this.$queryRaw`SELECT version() as version`) as Array<{ version: string }>
    console.log('📊 Database version:', dbInfo[0]?.version)

    // Log connection pool info
    const poolInfo = (await this.$queryRaw`
      SELECT
        setting as max_connections,
        unit
      FROM pg_settings
      WHERE name = 'max_connections'
    `) as Array<{ max_connections: string; unit: string }>
    console.log('🔗 Max connections:', poolInfo[0]?.max_connections)
  }
  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.$queryRaw`SELECT 1`
      return Promise.resolve({
        prisma: {
          status: 'up'
        }
      })
    } catch {
      return Promise.resolve({
        prisma: {
          status: 'down'
        }
      })
    }
  }
  async onModuleDestroy() {
    await this.$disconnect()
    console.log('🔌 Prisma disconnected from PostgreSQL')
  }

  /* English content normalized from the original source text. */
  async executeTransaction<T>(fn: (prisma: PrismaService) => Promise<T>): Promise<T> {
    return await this.$transaction(fn, {
      maxWait: 5000, // 5s max wait
      timeout: 10000, // 10s timeout
      isolationLevel: 'ReadCommitted' // English content normalized from the original source text.
    })
  }

  /* English content normalized from the original source text. */
  async executeBulkOperations<T>(operations: Array<() => Promise<T>>): Promise<T[]> {
    const results: T[] = []

    // English content normalized from the original source text.
    const batchSize = 100
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map((op) => op()))
      results.push(...batchResults)
    }

    return results
  }

  /* English content normalized from the original source text. */
  async softDeleteMany(model: any, ids: string[], deletedById: string): Promise<number> {
    const batchSize = 100
    let totalUpdated = 0

    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize)
      const result = await model.updateMany({
        where: {
          id: { in: batchIds },
          deletedAt: null // English content normalized from the original source text.
        },
        data: {
          deletedAt: new Date(),
          deletedById
        }
      })
      totalUpdated += result.count
    }

    return totalUpdated
  }

  /* English content normalized from the original source text. */
  async paginateWithOptimization<T>(
    model: any,
    options: {
      page: number
      limit: number
      where?: any
      orderBy?: any
      include?: any
      select?: any
    }
  ): Promise<{
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const { page, limit, where, orderBy, include, select } = options
    const skip = (page - 1) * limit

    // English content normalized from the original source text.
    const [data, total] = await Promise.all([
      model.findMany({
        where,
        orderBy,
        include,
        select,
        skip,
        take: limit
      }),
      model.count({ where })
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  /* English content normalized from the original source text. */
  async searchWithFullText<T>(
    model: any,
    searchTerm: string,
    searchFields: string[],
    options: {
      page?: number
      limit?: number
      where?: any
      orderBy?: any
      include?: any
    } = {}
  ): Promise<T[]> {
    const { page = 1, limit = 20, where = {}, orderBy, include } = options
    const skip = (page - 1) * limit

    // English content normalized from the original source text.
    const searchConditions = searchFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' // Case insensitive search
      }
    }))

    return await model.findMany({
      where: {
        ...where,
        OR: searchConditions
      },
      orderBy,
      include,
      skip,
      take: limit
    })
  }
}
