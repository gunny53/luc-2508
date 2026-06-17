// app/cart/data/mockCartItems.ts

// Cart item types & mock data
export interface ProductItem {
  id: string;
  name: string;
  image: string;
  variation: string;
  variations?: string[];
  price: number;
  originalPrice?: number;
  quantity: number;
  soldOut?: boolean;
}

export interface CartGroup {
  shop: string;
  items: ProductItem[];
}

export const mockCartItems: CartGroup[] = [
  {
    shop: "English content normalized from the original source text.",
    items: [
      {
        id: "1",
        name: "English content normalized from the original source text.",
        image: "/mock/voi.png",
        variation: "English content normalized from the original source text.",
        variations: ["English content normalized from the original source text.", "English content normalized from the original source text.", "English content normalized from the original source text."],
        price: 335000,
        originalPrice: 580000,
        quantity: 1,
      },
      {
        id: "2",
        name: "English content normalized from the original source text.",
        image: "/mock/noi.png",
        variation: "20cm - 24cm - 26cm",
        price: 820000,
        originalPrice: 1050000,
        quantity: 2,
      },
      {
        id: "3",
        name: "English content normalized from the original source text.",
        image: "/mock/gia.png",
        variation: "English content normalized from the original source text.",
        price: 195000,
        originalPrice: 260000,
        quantity: 1,
      },
    ],
  },
  {
    shop: "HEMERA JEWELRY",
    items: [
      {
        id: "4",
        name: "English content normalized from the original source text.",
        image: "/mock/khuyen.png",
        variation: "English content normalized from the original source text.",
        price: 95000,
        quantity: 1,
        soldOut: true,
      },
      {
        id: "5",
        name: "English content normalized from the original source text.",
        image: "/mock/lactay.png",
        variation: "Size M",
        price: 185000,
        originalPrice: 245000,
        quantity: 1,
      },
    ],
  },
  {
    shop: "English content normalized from the original source text.",
    items: [
      {
        id: "6",
        name: "English content normalized from the original source text.",
        image: "/mock/son.png",
        variation: "English content normalized from the original source text.",
        price: 42000,
        quantity: 3,
      },
      {
        id: "7",
        name: "English content normalized from the original source text.",
        image: "/mock/anessa.png",
        variation: "60ml",
        price: 230000,
        originalPrice: 280000,
        quantity: 1,
      },
    ],
  },
];

export const trendingSearches = [
    { id: 1, text: 'iPhone 15', category: 'English content normalized from the original source text.', count: '8.5K' },
    { id: 2, text: 'Laptop Gaming', category: 'Laptop', count: '6.2K' },
    { id: 3, text: 'English content normalized from the original source text.', category: 'English content normalized from the original source text.', count: '5.1K' },
    { id: 4, text: 'English content normalized from the original source text.', category: 'Tablet', count: '4.7K' },
    { id: 5, text: 'Camera an ninh', category: 'English content normalized from the original source text.', count: '3.9K' },
];

// English content normalized from the original source text.
export const popularCategories = [
    { id: 1, name: 'Smartphone', image: '/images/demo/3.webp', count: 'English content normalized from the original source text.' },
    { id: 2, name: 'Laptop', image: '/images/demo/3.webp', count: 'English content normalized from the original source text.' },
    { id: 3, name: 'Tai nghe', image: '/images/demo/3.webp', count: 'English content normalized from the original source text.' },
    { id: 4, name: 'English content normalized from the original source text.', image: '/images/demo/3.webp', count: 'English content normalized from the original source text.' },
    { id: 5, name: 'English content normalized from the original source text.', image: '/images/demo/3.webp', count: 'English content normalized from the original source text.' },
];


// ---------------------
 export interface SubCategory {
  id: string;
  name: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  children: SubCategory[];
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'English content normalized from the original source text.',
    children: [
      { id: 'p1', name: 'iPhone 15 Pro', image: '/images/demo/1.webp' },
      { id: 'p2', name: 'Samsung S24', image: '/images/demo/2.webp' },
    ],
  },
  {
    id: '2',
    name: 'Laptop',
    children: [
      { id: 'p3', name: 'MacBook Pro', image: '/images/demo/3.webp' },
      { id: 'p4', name: 'Dell XPS', image: '/images/demo/4.webp' },
    ],
  },
  {
    id: '3',
    name: 'English content normalized from the original source text.',
    children: [
      { id: 'p5', name: 'Tai nghe AirPods', image: '/images/demo/5.webp' },
      { id: 'p6', name: 'English content normalized from the original source text.', image: '/images/demo/1.webp' },
    ],
  },
];