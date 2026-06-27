import { ClientProduct } from '@/types/client.products.interface'

export const mockSearchProducts: ClientProduct[] = [
  {
    id: '1',
    name: 'T?m ki?m',
    description: 'T?m ki?m',
    basePrice: 120000,
    virtualPrice: 85000,
    brandId: 'brand-1',
    images: ['/images/mock/product-1.jpg'],
    variants: [],
    publishedAt: '2025-07-01T00:00:00.000Z',
    productTranslations: [],
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2025-07-01T00:00:00.000Z',
    createdById: 1,
    updatedById: 2,
    deletedById: null,
    deletedAt: null
  },
  {
    id: '2',
    name: 'T?m ki?m',
    description: 'T?m ki?m',
    basePrice: 300000,
    virtualPrice: 199000,
    brandId: 'brand-2',
    images: ['/images/mock/product-2.jpg'],
    variants: [],
    publishedAt: '2025-07-01T00:00:00.000Z',
    productTranslations: [],
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2025-07-01T00:00:00.000Z',
    createdById: 1,
    updatedById: 1,
    deletedById: null,
    deletedAt: null
  },
  {
    id: '3',
    name: 'T?m ki?m',
    description: 'T?m ki?m',
    basePrice: 500000,
    virtualPrice: 339000,
    brandId: 'brand-3',
    images: ['/images/mock/product-3.jpg'],
    variants: [],
    publishedAt: '2025-07-01T00:00:00.000Z',
    productTranslations: [],
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2025-07-01T00:00:00.000Z',
    createdById: 1,
    updatedById: 1,
    deletedById: null,
    deletedAt: null
  }
]
