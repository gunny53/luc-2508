export const trendingSearches = [
  { id: 1, text: 'iPhone 15', category: 'ECSite', count: '8.5K' },
  { id: 2, text: 'Laptop Gaming', category: 'Laptop', count: '6.2K' },
  {
    id: 3,
    text: 'ECSite',
    category: 'ECSite',
    count: '5.1K'
  },
  { id: 4, text: 'ECSite', category: 'Tablet', count: '4.7K' },
  {
    id: 5,
    text: 'Camera an ninh',
    category: 'ECSite',
    count: '3.9K'
  }
]
export const popularCategories = [
  {
    id: 1,
    name: 'Smartphone',
    image: '/images/demo/3.webp',
    count: 'ECSite'
  },
  {
    id: 2,
    name: 'Laptop',
    image: '/images/demo/3.webp',
    count: 'ECSite'
  },
  {
    id: 3,
    name: 'Tai nghe',
    image: '/images/demo/3.webp',
    count: 'ECSite'
  },
  {
    id: 4,
    name: 'ECSite',
    image: '/images/demo/3.webp',
    count: 'ECSite'
  },
  {
    id: 5,
    name: 'ECSite',
    image: '/images/demo/3.webp',
    count: 'ECSite'
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
    name: 'ECSite',
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
    name: 'ECSite',
    children: [
      { id: 'p5', name: 'Tai nghe AirPods', image: '/images/demo/5.webp' },
      { id: 'p6', name: 'ECSite', image: '/images/demo/1.webp' }
    ]
  }
]

export const cartItems = [
  {
    id: 1,
    name: 'ECSite',
    price: '395.000',
    image: '/images/demo/1.webp' 
  },
  {
    id: 2,
    name: 'ECSite',
    price: '49.000',
    image: '/images/demo/2.webp' 
  },
  {
    id: 3,
    name: 'ECSite',
    price: '339.000',
    image: '/images/demo/3.webp' 
  },
  {
    id: 4,
    name: 'ECSite',
    price: '19.000',
    image: '/images/demo/4.webp' 
  },
  {
    id: 5,
    name: 'ECSite',
    price: '219.000',
    image: '/images/demo/5.webp' 
  }
]
