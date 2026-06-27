


export interface ProductItem {
  id: string
  name: string
  image: string
  variation: string
  variations?: string[]
  price: number
  originalPrice?: number
  quantity: number
  soldOut?: boolean
}

export interface CartGroup {
  shop: string
  items: ProductItem[]
}

export const mockCartItems: CartGroup[] = [
  {
    shop: 'Gi? h?ng',
    items: [
      {
        id: '1',
        name: 'Gi? h?ng',
        image: '/mock/voi.png',
        variation: 'Gi? h?ng',
        variations: [
          'Gi? h?ng',
          'Gi? h?ng',
          'Gi? h?ng'
        ],
        price: 335000,
        originalPrice: 580000,
        quantity: 1
      },
      {
        id: '2',
        name: 'Gi? h?ng',
        image: '/mock/noi.png',
        variation: '20cm - 24cm - 26cm',
        price: 820000,
        originalPrice: 1050000,
        quantity: 2
      },
      {
        id: '3',
        name: 'Gi? h?ng',
        image: '/mock/gia.png',
        variation: 'Gi? h?ng',
        price: 195000,
        originalPrice: 260000,
        quantity: 1
      }
    ]
  },
  {
    shop: 'HEMERA JEWELRY',
    items: [
      {
        id: '4',
        name: 'Gi? h?ng',
        image: '/mock/khuyen.png',
        variation: 'Gi? h?ng',
        price: 95000,
        quantity: 1,
        soldOut: true
      },
      {
        id: '5',
        name: 'Gi? h?ng',
        image: '/mock/lactay.png',
        variation: 'Size M',
        price: 185000,
        originalPrice: 245000,
        quantity: 1
      }
    ]
  },
  {
    shop: 'Gi? h?ng',
    items: [
      {
        id: '6',
        name: 'Gi? h?ng',
        image: '/mock/son.png',
        variation: 'Gi? h?ng',
        price: 42000,
        quantity: 3
      },
      {
        id: '7',
        name: 'Gi? h?ng',
        image: '/mock/anessa.png',
        variation: '60ml',
        price: 230000,
        originalPrice: 280000,
        quantity: 1
      }
    ]
  }
]

export const trendingSearches = [
  { id: 1, text: 'iPhone 15', category: 'Gi? h?ng', count: '8.5K' },
  { id: 2, text: 'Laptop Gaming', category: 'Laptop', count: '6.2K' },
  {
    id: 3,
    text: 'Gi? h?ng',
    category: 'Gi? h?ng',
    count: '5.1K'
  },
  { id: 4, text: 'Gi? h?ng', category: 'Tablet', count: '4.7K' },
  {
    id: 5,
    text: 'Camera an ninh',
    category: 'Gi? h?ng',
    count: '3.9K'
  }
]
export const popularCategories = [
  {
    id: 1,
    name: 'Smartphone',
    image: '/images/demo/3.webp',
    count: 'Gi? h?ng'
  },
  {
    id: 2,
    name: 'Laptop',
    image: '/images/demo/3.webp',
    count: 'Gi? h?ng'
  },
  {
    id: 3,
    name: 'Tai nghe',
    image: '/images/demo/3.webp',
    count: 'Gi? h?ng'
  },
  {
    id: 4,
    name: 'Gi? h?ng',
    image: '/images/demo/3.webp',
    count: 'Gi? h?ng'
  },
  {
    id: 5,
    name: 'Gi? h?ng',
    image: '/images/demo/3.webp',
    count: 'Gi? h?ng'
  }
]


export interface SubCategory {
  id: string
  name: string
  image: string
}

export interface Category {
  id: string
  name: string
  children: SubCategory[]
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Gi? h?ng',
    children: [
      { id: 'p1', name: 'iPhone 15 Pro', image: '/images/demo/1.webp' },
      { id: 'p2', name: 'Samsung S24', image: '/images/demo/2.webp' }
    ]
  },
  {
    id: '2',
    name: 'Laptop',
    children: [
      { id: 'p3', name: 'MacBook Pro', image: '/images/demo/3.webp' },
      { id: 'p4', name: 'Dell XPS', image: '/images/demo/4.webp' }
    ]
  },
  {
    id: '3',
    name: 'Gi? h?ng',
    children: [
      { id: 'p5', name: 'Tai nghe AirPods', image: '/images/demo/5.webp' },
      { id: 'p6', name: 'Gi? h?ng', image: '/images/demo/1.webp' }
    ]
  }
]
