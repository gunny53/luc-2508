import { Logger } from '@nestjs/common'

export interface CacheableOptions {
  
  key: string

  
  ttl?: number

  ttlJitter?: number

  
  scope?: 'global' | 'module'

  
  moduleName?: string

  
  serialize?: boolean

  staleTtl?: number

  
  keyGenerator?: (...args: any[]) => string

  
  condition?: (result: any) => boolean
}

export const REDIS_SERVICE_TOKEN = 'REDIS_SERVICE'

interface CacheServiceLike {
  get(key: string): Promise<unknown>
  set(key: string, value: unknown, ttl?: number): Promise<void>
  deleteByPattern(pattern: string): Promise<number>
  tryAcquireLock(lockKey: string, ttlSeconds?: number): Promise<boolean>
  releaseLock(lockKey: string): Promise<void>
}

interface CacheDecoratorContext {
  redisService?: CacheServiceLike
  cacheService?: CacheServiceLike
}

interface StaleCacheWrapper {
  value: unknown
  expiresAt: string
  staleUntil: string
}

function isStaleCacheWrapper(value: unknown): value is StaleCacheWrapper {
  return (
    typeof value === 'object' && value !== null && 'value' in value && 'expiresAt' in value && 'staleUntil' in value
  )
}

export function Cacheable(options: CacheableOptions) {
  const logger = new Logger('CacheableDecorator')
  const inProgress = new Map<string, Promise<any>>()

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (this: CacheDecoratorContext, ...args: any[]) {
      const redisService = this.redisService || this.cacheService

      if (!redisService) {
        logger.warn(`RedisService not found in ${target.constructor.name}. Executing method without caching.`)
        return method.apply(this, args)
      }

      try {
        
        const cacheKey = buildCacheKey(options, args)

        
        const cachedResult = await redisService.get(cacheKey)
        if (cachedResult !== null) {
          logger.debug(`Cache hit for key: ${cacheKey}`)
          if (options.staleTtl && isStaleCacheWrapper(cachedResult)) {
            const now = Date.now()
            const expiresAt = new Date(cachedResult.expiresAt).getTime()
            const staleUntil = new Date(cachedResult.staleUntil).getTime()
            if (now < expiresAt) {
              return cachedResult.value
            }
            if (now >= expiresAt && now < staleUntil) {
              if (!inProgress.has(cacheKey)) {
                const lockKey = `rebuild:${cacheKey}`
                const gotLock = await redisService.tryAcquireLock(lockKey, 10)
                if (!gotLock) {
                  return cachedResult.value
                }
                const p = (async () => {
                  try {
                    const fresh = await method.apply(this, args)
                    const ttlBase = options.ttl || 300
                    const jitter = Math.floor(Math.random() * (options.ttlJitter || 0))
                    const wrapper = {
                      value: fresh,
                      expiresAt: new Date(Date.now() + ttlBase * 1000).toISOString(),
                      staleUntil: new Date(Date.now() + (ttlBase + (options.staleTtl || 0)) * 1000).toISOString()
                    }
                    await redisService.set(cacheKey, wrapper, ttlBase + (options.staleTtl || 0) + jitter)
                  } catch (e) {
                    logger.warn(`Background rebuild failed for key: ${cacheKey}`)
                  } finally {
                    await redisService.releaseLock(lockKey)
                    inProgress.delete(cacheKey)
                  }
                })()
                inProgress.set(cacheKey, p)
              }
              return cachedResult.value
            }
          } else {
            return options.serialize !== false ? cachedResult : JSON.parse(String(cachedResult))
          }
        }

        logger.debug(`Cache miss for key: ${cacheKey}`)

        
        const result = await method.apply(this, args)

        
        if (options.condition && !options.condition(result)) {
          logger.debug(`Condition not met for caching key: ${cacheKey}`)
          return result
        }

        
        const ttlBase = options.ttl || 300
        const jitter = Math.floor(Math.random() * (options.ttlJitter || 0))
        if (options.staleTtl) {
          const wrapper = {
            value: result,
            expiresAt: new Date(Date.now() + ttlBase * 1000).toISOString(),
            staleUntil: new Date(Date.now() + (ttlBase + options.staleTtl) * 1000).toISOString()
          }
          await redisService.set(cacheKey, wrapper, ttlBase + options.staleTtl + jitter)
        } else {
          const valueToCache = options.serialize !== false ? result : JSON.stringify(result)
          await redisService.set(cacheKey, valueToCache, ttlBase + jitter)
        }

        logger.debug(`Cached result for key: ${cacheKey}`)
        return result
      } catch (error) {
        logger.error(`Cache operation failed for ${target.constructor.name}.${propertyName}:`, error)
        
        return method.apply(this, args)
      }
    }

    return descriptor
  }
}

function buildCacheKey(options: CacheableOptions, args: any[]): string {
  let baseKey = options.key

  
  if (options.scope === 'module' && options.moduleName) {
    baseKey = `${options.moduleName}:${baseKey}`
  }

  
  if (options.keyGenerator) {
    const dynamicSuffix = options.keyGenerator(...args)
    return `${baseKey}:${dynamicSuffix}`
  }

  
  if (args.length > 0) {
    const argsSuffix = args
      .map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg)
        }
        return String(arg)
      })
      .join(':')
    return `${baseKey}:${argsSuffix}`
  }

  return baseKey
}

export function CacheEvict(pattern: string | string[]) {
  const logger = new Logger('CacheEvictDecorator')

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (this: CacheDecoratorContext, ...args: any[]) {
      const redisService = this.redisService || this.cacheService

      try {
        
        const result = await method.apply(this, args)

        if (redisService) {
          const patterns = Array.isArray(pattern) ? pattern : [pattern]

          for (const pat of patterns) {
            await redisService.deleteByPattern(pat)
            logger.debug(`Evicted cache pattern: ${pat}`)
          }
        }

        return result
      } catch (error) {
        logger.error(`Cache eviction failed for ${target.constructor.name}.${propertyName}:`, error)
        
        return method.apply(this, args)
      }
    }

    return descriptor
  }
}

export function CachePut(options: CacheableOptions) {
  const logger = new Logger('CachePutDecorator')

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (this: CacheDecoratorContext, ...args: any[]) {
      const redisService = this.redisService || this.cacheService

      try {
        
        const result = await method.apply(this, args)

        if (redisService) {
          const cacheKey = buildCacheKey(options, args)

          
          if (!options.condition || options.condition(result)) {
            const valueToCache = options.serialize !== false ? result : JSON.stringify(result)
            await redisService.set(cacheKey, valueToCache, options.ttl || 300)
            logger.debug(`Updated cache for key: ${cacheKey}`)
          }
        }

        return result
      } catch (error) {
        logger.error(`Cache put failed for ${target.constructor.name}.${propertyName}:`, error)
        return method.apply(this, args)
      }
    }

    return descriptor
  }
}
