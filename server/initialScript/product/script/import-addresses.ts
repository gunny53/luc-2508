#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { logger, CONFIG } from './import-utils'

// GHN API Configuration
const GHN_CONFIG = {
  BASE_URL: process.env.GHN_BASE_URL || process.env.APP_URL || 'https://api.ecsite.live',
  ENDPOINTS: {
    PROVINCES: '/shipping/ghn/address/provinces',
    DISTRICTS: '/shipping/ghn/address/districts',
    WARDS: '/shipping/ghn/address/wards'
  },
  TIMEOUT: 30000,
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  }
}

function buildGHNUrl(endpoint: string): string {
  return `${GHN_CONFIG.BASE_URL}${endpoint}`
}

function getEnvironment(): string {
  if (process.env.NODE_ENV) return process.env.NODE_ENV
  if (process.env.APP_ENVIRONMENT) return process.env.APP_ENVIRONMENT

  if (GHN_CONFIG.BASE_URL.includes('localhost') || GHN_CONFIG.BASE_URL.includes('127.0.0.1')) {
    return 'local'
  }
  if (GHN_CONFIG.BASE_URL.includes('ecsite.live')) {
    return 'production'
  }
  if (GHN_CONFIG.BASE_URL.includes('staging') || GHN_CONFIG.BASE_URL.includes('dev')) {
    return 'staging'
  }

  return 'unknown'
}

// GHN API Interfaces
interface GHNProvince {
  ProvinceID: number
  ProvinceName: string
}

interface GHNDistrict {
  DistrictID: number
  DistrictName: string
  ProvinceID: number
}

interface GHNWard {
  WardCode: string
  WardName: string
  DistrictID: number
}

interface GHNAddress {
  province: string
  district: string
  ward: string
  provinceId: number
  districtId: number
  wardCode: string
  street: string
}

// Main import function
async function importFullAddressesFromGHN(
  users: Array<{ id: string; role: { name: string } }>,
  creatorUserId: string,
  tx: PrismaClient
): Promise<{ addressCount: number; userAddressCount: number }> {
  try {
    logger.log('English content normalized from the original source text.')

    // English content normalized from the original source text.
    logger.log('English content normalized from the original source text.')
    const provincesUrl = buildGHNUrl(GHN_CONFIG.ENDPOINTS.PROVINCES)
    logger.log(`English content normalized from the original source text.${provincesUrl}`)
    const provincesResponse = await fetch(provincesUrl)

    if (!provincesResponse.ok) {
      throw new Error(`English content normalized from the original source text.${provincesResponse.statusText}`)
    }

    const provincesData = await provincesResponse.json()
    const provinces: GHNProvince[] = provincesData.data || []
    logger.log(`English content normalized from the original source text.${provinces.length}English content normalized from the original source text.`)

    // English content normalized from the original source text.
    const realProvinces = provinces.filter(
      (p) =>
        !p.ProvinceName.toLowerCase().includes('test') &&
        !p.ProvinceName.toLowerCase().includes('alert') &&
        !p.ProvinceName.toLowerCase().includes('ngoc')
    )

    logger.log(`English content normalized from the original source text.${realProvinces.length}English content normalized from the original source text.${provinces.length}English content normalized from the original source text.`)

    const allGhnAddresses: GHNAddress[] = []

    // English content normalized from the original source text.
    for (let i = 0; i < realProvinces.length; i++) {
      const province = realProvinces[i]
      logger.log(
        `🔄 [${i + 1}/${realProvinces.length}English content normalized from the original source text.${province.ProvinceName} (ID: ${province.ProvinceID})...`
      )

      try {
        // English content normalized from the original source text.
        const districtsUrl = buildGHNUrl(`${GHN_CONFIG.ENDPOINTS.DISTRICTS}?provinceId=${province.ProvinceID}`)
        const districtsResponse = await fetch(districtsUrl)

        if (!districtsResponse.ok) {
          logger.warn(`English content normalized from the original source text.${province.ProvinceName}`)
          continue
        }

        const districtsData = await districtsResponse.json()
        const districts: GHNDistrict[] = districtsData.data || []

        if (districts.length === 0) {
          logger.warn(`⚠️  ${province.ProvinceName}English content normalized from the original source text.`)
          continue
        }

        logger.log(`  📍 ${province.ProvinceName}: ${districts.length} districts`)

        // English content normalized from the original source text.
        const selectedDistricts = districts.slice(0, Math.min(10, districts.length))

        for (const district of selectedDistricts) {
          try {
            // English content normalized from the original source text.
            const wardsUrl = buildGHNUrl(`${GHN_CONFIG.ENDPOINTS.WARDS}?districtId=${district.DistrictID}`)
            const wardsResponse = await fetch(wardsUrl)

            if (!wardsResponse.ok) {
              logger.warn(`English content normalized from the original source text.${district.DistrictName}`)
              continue
            }

            const wardsData = await wardsResponse.json()
            const wards: GHNWard[] = wardsData.data || []

            if (wards.length === 0) {
              logger.warn(`⚠️  ${district.DistrictName}English content normalized from the original source text.`)
              continue
            }

            // English content normalized from the original source text.
            const selectedWards = wards.slice(0, Math.min(5, wards.length))

            for (const ward of selectedWards) {
              // English content normalized from the original source text.
              const streetVariations = [
                `English content normalized from the original source text.${Math.floor(Math.random() * 100) + 1}`,
                `English content normalized from the original source text.${Math.floor(Math.random() * 50) + 1}`,
                `English content normalized from the original source text.${Math.floor(Math.random() * 200) + 1}`,
                `English content normalized from the original source text.${Math.floor(Math.random() * 500) + 1}`,
                `English content normalized from the original source text.${Math.floor(Math.random() * 100) + 1}`
              ]

              for (const street of streetVariations) {
                allGhnAddresses.push({
                  province: province.ProvinceName,
                  district: district.DistrictName,
                  ward: ward.WardName,
                  provinceId: province.ProvinceID,
                  districtId: district.DistrictID,
                  wardCode: ward.WardCode,
                  street: street
                })
              }
            }

            // English content normalized from the original source text.
            await new Promise((resolve) => setTimeout(resolve, 50))
          } catch (error) {
            logger.warn(`English content normalized from the original source text.${district.DistrictName}: ${error.message}`)
          }
        }

        // English content normalized from the original source text.
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        logger.warn(`English content normalized from the original source text.${province.ProvinceName}: ${error.message}`)
      }
    }

    logger.log(`English content normalized from the original source text.${allGhnAddresses.length}English content normalized from the original source text.${realProvinces.length}English content normalized from the original source text.`)

    if (allGhnAddresses.length === 0) {
      throw new Error('English content normalized from the original source text.')
    }

    // English content normalized from the original source text.
    const addressesToCreate: Array<{
      name: string
      recipient?: string
      phoneNumber: string
      province: string
      district: string
      ward: string
      provinceId: number
      districtId: number
      wardCode: string
      street: string
      addressType: 'HOME' | 'OFFICE'
      createdById: string
      userId: string
      isDefault: boolean
      createdAt: Date
      updatedAt: Date
    }> = []

    logger.log(`English content normalized from the original source text.${users.length} users...`)

    users.forEach((user, userIndex) => {
      // English content normalized from the original source text.
      const numAddresses = Math.floor(Math.random() * 2) + 2 // English content normalized from the original source text.

      for (let i = 0; i < numAddresses; i++) {
        const now = new Date()
        // English content normalized from the original source text.
        const addressData = allGhnAddresses[Math.floor(Math.random() * allGhnAddresses.length)]

        if (user.role.name === 'SELLER') {
          // English content normalized from the original source text.
          addressesToCreate.push({
            name: `Shop ${addressData.province} ${i + 1}`,
            recipient: `ECSite ${addressData.province}`,
            phoneNumber: '+84901234567',
            province: addressData.province,
            district: addressData.district,
            ward: addressData.ward,
            provinceId: addressData.provinceId,
            districtId: addressData.districtId,
            wardCode: addressData.wardCode,
            street: `${100 + i} ${addressData.street}`,
            addressType: 'OFFICE',
            createdById: creatorUserId,
            userId: user.id,
            isDefault: i === 0,
            createdAt: now,
            updatedAt: now
          })
        } else {
          // English content normalized from the original source text.
          addressesToCreate.push({
            name: `English content normalized from the original source text.${addressData.province} ${i + 1}`,
            recipient: `English content normalized from the original source text.${addressData.province} ${i + 1}`,
            phoneNumber:
              '0' +
              Math.floor(Math.random() * 1000000000)
                .toString()
                .padStart(9, '0'),
            province: addressData.province,
            district: addressData.district,
            ward: addressData.ward,
            provinceId: addressData.provinceId,
            districtId: addressData.districtId,
            wardCode: addressData.wardCode,
            street: `${i + 1} ${addressData.street}`,
            addressType: 'HOME',
            createdById: creatorUserId,
            userId: user.id,
            isDefault: i === 0,
            createdAt: now,
            updatedAt: now
          })
        }
      }

      // English content normalized from the original source text.
      if ((userIndex + 1) % 500 === 0) {
        logger.log(`English content normalized from the original source text.${userIndex + 1}/${users.length} users`)
      }
    })

    logger.log(`English content normalized from the original source text.${addressesToCreate.length}English content normalized from the original source text.`)

    // English content normalized from the original source text.
    let addressCount = 0
    let userAddressCount = 0
    const copyBatchSize = CONFIG.COPY_BATCH_SIZE
    const copyChunks = Array.from({ length: Math.ceil(addressesToCreate.length / copyBatchSize) }, (_, i) =>
      addressesToCreate.slice(i * copyBatchSize, (i + 1) * copyBatchSize)
    )

    logger.log(`English content normalized from the original source text.${copyChunks.length}English content normalized from the original source text.`)

    for (let chunkIndex = 0; chunkIndex < copyChunks.length; chunkIndex++) {
      const chunk = copyChunks[chunkIndex]

      try {
        // English content normalized from the original source text.
        const addressData = chunk.map(({ userId, isDefault, ...data }) => data)
        await tx.address.createMany({ data: addressData })

        // English content normalized from the original source text.
        const createdAddressData = await tx.address.findMany({
          where: {
            name: { in: chunk.map((a) => a.name) },
            createdById: creatorUserId
          },
          select: { id: true, name: true }
        })

        // English content normalized from the original source text.
        const userAddresses = chunk
          .map((address) => {
            const createdAddress = createdAddressData.find((a) => a.name === address.name)
            return createdAddress
              ? {
                  userId: address.userId,
                  addressId: createdAddress.id,
                  isDefault: address.isDefault,
                  createdAt: address.createdAt,
                  updatedAt: address.updatedAt
                }
              : null
          })
          .filter(
            (ua): ua is { userId: string; addressId: string; isDefault: boolean; createdAt: Date; updatedAt: Date } =>
              ua !== null
          )

        if (userAddresses.length) {
          await tx.userAddress.createMany({ data: userAddresses, skipDuplicates: true })
        }

        addressCount += chunk.length
        userAddressCount += userAddresses.length

        logger.log(`✅ Batch ${chunkIndex + 1}/${copyChunks.length}: ${chunk.length} addresses`)
      } catch (error) {
        logger.error(`English content normalized from the original source text.${chunkIndex + 1}: ${error.message}`)
        throw error
      }
    }

    logger.log(
      `✅ Imported ${addressCount}English content normalized from the original source text.${userAddressCount}English content normalized from the original source text.${realProvinces.length}English content normalized from the original source text.`
    )

    // English content normalized from the original source text.
    const provinceStats = await tx.address.groupBy({
      by: ['province'],
      _count: { province: true },
      where: { createdById: creatorUserId }
    })

    logger.log(`English content normalized from the original source text.`)
    provinceStats.forEach((stat) => {
      logger.log(`  📍 ${stat.province}: ${stat._count.province} addresses`)
    })

    return { addressCount, userAddressCount }
  } catch (error) {
    logger.error(`English content normalized from the original source text.${error.message}`)
    throw error
  }
}

// Main execution function
async function main() {
  const prisma = new PrismaClient()

  try {
    logger.log('English content normalized from the original source text.')
    logger.log(`🔧 Environment: ${getEnvironment()}`)
    logger.log(`🌐 Base URL: ${GHN_CONFIG.BASE_URL}`)

    await prisma.$connect()

    // English content normalized from the original source text.
    logger.log('English content normalized from the original source text.')
    const deletedUserAddresses = await prisma.userAddress.deleteMany({})
    logger.log(`English content normalized from the original source text.${deletedUserAddresses.count} user-address relationships`)

    // English content normalized from the original source text.
    logger.log('English content normalized from the original source text.')
    const deletedAddresses = await prisma.address.deleteMany({})
    logger.log(`English content normalized from the original source text.${deletedAddresses.count} addresses`)

    // English content normalized from the original source text.
    logger.log('English content normalized from the original source text.')
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        role: { select: { name: true } }
      }
    })
    logger.log(`English content normalized from the original source text.${users.length} users`)

    if (users.length === 0) {
      throw new Error('English content normalized from the original source text.')
    }

    // English content normalized from the original source text.
    const creatorUser = await prisma.user.findFirst({
      where: {
        email: 'admin@ecsite.com',
        deletedAt: null
      }
    })

    if (!creatorUser) {
      throw new Error('English content normalized from the original source text.')
    }

    logger.log(`👤 Creator: ${creatorUser.email} (${creatorUser.id})`)

    // English content normalized from the original source text.
    logger.log('English content normalized from the original source text.')
    const result = await importFullAddressesFromGHN(users, creatorUser.id, prisma)

    logger.log(`English content normalized from the original source text.`)
    logger.log(`English content normalized from the original source text.`)
    logger.log(`English content normalized from the original source text.${result.addressCount}`)
    logger.log(`  - User-address relationships: ${result.userAddressCount}`)

    // English content normalized from the original source text.
    logger.log('English content normalized from the original source text.')

    const totalAddresses = await prisma.address.count()
    const totalUserAddresses = await prisma.userAddress.count()
    const totalDefaultAddresses = await prisma.userAddress.count({
      where: { isDefault: true }
    })
    const totalUsers = await prisma.user.count({
      where: { deletedAt: null }
    })
    const totalProvinces = await prisma.address.groupBy({
      by: ['province'],
      _count: { province: true }
    })

    logger.log(`English content normalized from the original source text.`)
    logger.log(`English content normalized from the original source text.${totalUsers}`)
    logger.log(`English content normalized from the original source text.${totalAddresses}`)
    logger.log(`English content normalized from the original source text.${totalUserAddresses}`)
    logger.log(`English content normalized from the original source text.${totalDefaultAddresses}`)
    logger.log(`English content normalized from the original source text.${totalProvinces.length}`)

    // English content normalized from the original source text.
    const top10Provinces = totalProvinces.sort((a, b) => b._count.province - a._count.province).slice(0, 10)

    logger.log(`English content normalized from the original source text.`)
    top10Provinces.forEach((province, index) => {
      logger.log(`  ${index + 1}. ${province.province}: ${province._count.province} addresses`)
    })

    if (totalDefaultAddresses === totalUsers) {
      logger.log('English content normalized from the original source text.')
    } else {
      logger.warn(`English content normalized from the original source text.${totalUsers - totalDefaultAddresses}English content normalized from the original source text.`)
    }

    logger.log('English content normalized from the original source text.')
  } catch (error) {
    logger.error(`English content normalized from the original source text.${error.message}`)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      logger.log('English content normalized from the original source text.')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(`English content normalized from the original source text.${error.message}`)
      process.exit(1)
    })
}

export { importFullAddressesFromGHN, main }
