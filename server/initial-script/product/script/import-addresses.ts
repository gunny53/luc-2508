#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { logger, CONFIG } from './import-utils'


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

async function importFullAddressesFromGHN(
  users: Array<{ id: string; role: { name: string } }>,
  creatorUserId: string,
  tx: PrismaClient
): Promise<{ addressCount: number; userAddressCount: number }> {
  try {
    logger.log('Starting GHN address import.')
    logger.log('Fetching provinces from GHN address API.')
    const provincesUrl = buildGHNUrl(GHN_CONFIG.ENDPOINTS.PROVINCES)
    logger.log(`Province API URL: ${provincesUrl}`)
    const provincesResponse = await fetch(provincesUrl)

    if (!provincesResponse.ok) {
      throw new Error(`Failed to fetch GHN provinces: ${provincesResponse.statusText}`)
    }

    const provincesData = await provincesResponse.json()
    const provinces: GHNProvince[] = provincesData.data || []
    logger.log(
      `Fetched ${provinces.length} provinces from GHN.`
    )
    const realProvinces = provinces.filter(
      (p) =>
        !p.ProvinceName.toLowerCase().includes('test') &&
        !p.ProvinceName.toLowerCase().includes('alert') &&
        !p.ProvinceName.toLowerCase().includes('ngoc')
    )

    logger.log(
      `Using ${realProvinces.length} valid provinces after filtering ${provinces.length} records.`
    )

    const allGhnAddresses: GHNAddress[] = []
    for (let i = 0; i < realProvinces.length; i++) {
      const province = realProvinces[i]
      logger.log(`Processing province ${i + 1}/${realProvinces.length}: ${province.ProvinceName} (ID: ${province.ProvinceID}).`)

      try {
        const districtsUrl = buildGHNUrl(`${GHN_CONFIG.ENDPOINTS.DISTRICTS}?provinceId=${province.ProvinceID}`)
        const districtsResponse = await fetch(districtsUrl)

        if (!districtsResponse.ok) {
          logger.warn(`Failed to fetch districts for province ${province.ProvinceName}.`)
          continue
        }

        const districtsData = await districtsResponse.json()
        const districts: GHNDistrict[] = districtsData.data || []

        if (districts.length === 0) {
          logger.warn(`Province ${province.ProvinceName} has no districts.`)
          continue
        }

        logger.log(`  ${province.ProvinceName}: ${districts.length} districts`)
        const selectedDistricts = districts.slice(0, Math.min(10, districts.length))

        for (const district of selectedDistricts) {
          try {
            const wardsUrl = buildGHNUrl(`${GHN_CONFIG.ENDPOINTS.WARDS}?districtId=${district.DistrictID}`)
            const wardsResponse = await fetch(wardsUrl)

            if (!wardsResponse.ok) {
              logger.warn(`Failed to fetch wards for district ${district.DistrictName}.`)
              continue
            }

            const wardsData = await wardsResponse.json()
            const wards: GHNWard[] = wardsData.data || []

            if (wards.length === 0) {
              logger.warn(`District ${district.DistrictName} has no wards.`)
              continue
            }
            const selectedWards = wards.slice(0, Math.min(5, wards.length))

            for (const ward of selectedWards) {
              const streetVariations = [
                `So ${Math.floor(Math.random() * 100) + 1} Duong Trung Tam`,
                `So ${Math.floor(Math.random() * 50) + 1} Duong Nguyen Trai`,
                `So ${Math.floor(Math.random() * 200) + 1} Duong Le Loi`,
                `So ${Math.floor(Math.random() * 500) + 1} Duong Tran Phu`,
                `So ${Math.floor(Math.random() * 100) + 1} Duong Trung Tam`
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
            await new Promise((resolve) => setTimeout(resolve, 50))
          } catch (error) {
            logger.warn(
              `Failed to process wards for district ${district.DistrictName}: ${error.message}`
            )
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        logger.warn(
          `Failed to process province ${province.ProvinceName}: ${error.message}`
        )
      }
    }

    logger.log(
      `Prepared ${allGhnAddresses.length} seed addresses across ${realProvinces.length} provinces.`
    )

    if (allGhnAddresses.length === 0) {
      throw new Error('No GHN addresses were prepared for import.')
    }
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

    logger.log(`Assigning addresses to ${users.length} users.`)

    users.forEach((user, userIndex) => {
      const numAddresses = Math.floor(Math.random() * 2) + 2

      for (let i = 0; i < numAddresses; i++) {
        const now = new Date()
        const addressData = allGhnAddresses[Math.floor(Math.random() * allGhnAddresses.length)]

        if (user.role.name === 'SELLER') {
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
          addressesToCreate.push({
            name: `Dia chi ${addressData.province} ${i + 1}`,
            recipient: `Khach hang ${addressData.province} ${i + 1}`,
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
      if ((userIndex + 1) % 500 === 0) {
        logger.log(`Prepared addresses for ${userIndex + 1}/${users.length} users.`)
      }
    })

    logger.log(
      `Prepared ${addressesToCreate.length} addresses for database import.`
    )
    let addressCount = 0
    let userAddressCount = 0
    const copyBatchSize = CONFIG.COPY_BATCH_SIZE
    const copyChunks = Array.from({ length: Math.ceil(addressesToCreate.length / copyBatchSize) }, (_, i) =>
      addressesToCreate.slice(i * copyBatchSize, (i + 1) * copyBatchSize)
    )

    logger.log(
      `Importing addresses in ${copyChunks.length} batches.`
    )

    for (let chunkIndex = 0; chunkIndex < copyChunks.length; chunkIndex++) {
      const chunk = copyChunks[chunkIndex]

      try {
        const addressData = chunk.map(({ userId, isDefault, ...data }) => data)
        await tx.address.createMany({ data: addressData })
        const createdAddressData = await tx.address.findMany({
          where: {
            name: { in: chunk.map((a) => a.name) },
            createdById: creatorUserId
          },
          select: { id: true, name: true }
        })
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

        logger.log(`Imported address batch ${chunkIndex + 1}/${copyChunks.length}: ${chunk.length} addresses.`)
      } catch (error) {
        logger.error(`Failed to import address batch ${chunkIndex + 1}: ${error.message}`)
        throw error
      }
    }

    logger.log(
      `Imported ${addressCount} addresses and ${userAddressCount} user-address links across ${realProvinces.length} provinces.`
    )
    const provinceStats = await tx.address.groupBy({
      by: ['province'],
      _count: { province: true },
      where: { createdById: creatorUserId }
    })

    logger.log('Top provinces by address count:')
    provinceStats.forEach((stat) => {
      logger.log(`  ${stat.province}: ${stat._count.province} addresses`)
    })

    return { addressCount, userAddressCount }
  } catch (error) {
    logger.error(`GHN address import failed: ${error.message}`)
    throw error
  }
}

async function main() {
  const prisma = new PrismaClient()

  try {
    logger.log('Starting standalone address seed.')
    logger.log(`Environment: ${getEnvironment()}`)
    logger.log(`Base URL: ${GHN_CONFIG.BASE_URL}`)

    await prisma.$connect()
    logger.log('Connected to database.')
    const deletedUserAddresses = await prisma.userAddress.deleteMany({})
    logger.log(
      `Deleted ${deletedUserAddresses.count} existing user-address relationships.`
    )
    logger.log('Deleting existing addresses.')
    const deletedAddresses = await prisma.address.deleteMany({})
    logger.log(`Deleted ${deletedAddresses.count} addresses.`)
    logger.log('Loading active users.')
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        role: { select: { name: true } }
      }
    })
    logger.log(`Found ${users.length} active users.`)

    if (users.length === 0) {
      throw new Error('No active users found. Run the user seed before importing addresses.')
    }
    const creatorUser = await prisma.user.findFirst({
      where: {
        email: 'admin@ecsite.com',
        deletedAt: null
      }
    })

    if (!creatorUser) {
      throw new Error('Creator user admin@ecsite.com was not found.')
    }

    logger.log(`Creator: ${creatorUser.email} (${creatorUser.id})`)
    logger.log('Importing GHN addresses.')
    const result = await importFullAddressesFromGHN(users, creatorUser.id, prisma)

    logger.log('Address seed summary:')
    logger.log('Import completed successfully.')
    logger.log(`  - Addresses: ${result.addressCount}`)
    logger.log(`  - User-address relationships: ${result.userAddressCount}`)
    logger.log('Validating imported address data.')

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

    logger.log('Database totals after address import:')
    logger.log(`  - Active users: ${totalUsers}`)
    logger.log(`  - Addresses: ${totalAddresses}`)
    logger.log(`  - User-address links: ${totalUserAddresses}`)
    logger.log(`  - Default addresses: ${totalDefaultAddresses}`)
    logger.log(`  - Provinces: ${totalProvinces.length}`)
    const top10Provinces = totalProvinces.sort((a, b) => b._count.province - a._count.province).slice(0, 10)

    logger.log('Top provinces by address count:')
    top10Provinces.forEach((province, index) => {
      logger.log(`  ${index + 1}. ${province.province}: ${province._count.province} addresses`)
    })

    if (totalDefaultAddresses === totalUsers) {
      logger.log('Every active user has a default address.')
    } else {
      logger.warn(
        `${totalUsers - totalDefaultAddresses} active users do not have a default address.`
      )
    }

    logger.log('Standalone address seed completed.')
  } catch (error) {
    logger.error(`Standalone address seed failed: ${error.message}`)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
    .then(() => {
      logger.log('Address seed process finished.')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(`Address seed process failed: ${error.message}`)
      process.exit(1)
    })
}

export { importFullAddressesFromGHN, main }
