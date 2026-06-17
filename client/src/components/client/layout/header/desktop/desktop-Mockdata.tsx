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



export const cartItems = [
    {
      id: 1,
      name: 'English content normalized from the original source text.',
      price: '395.000',
      image: '/images/demo/1.webp', // Replace with actual image path
    },
    {
      id: 2,
      name: 'English content normalized from the original source text.',
      price: '49.000',
      image: '/images/demo/2.webp', // Using a different placeholder image
    },
     {
      id: 3,
      name: 'English content normalized from the original source text.',
      price: '339.000',
      image: '/images/demo/3.webp', // Using a different placeholder image
    },
     {
      id: 4,
      name: 'English content normalized from the original source text.',
      price: '19.000',
      image: '/images/demo/4.webp', // Using a different placeholder image
    },
     {
      id: 5,
      name: 'English content normalized from the original source text.',
      price: '219.000',
      image: '/images/demo/5.webp', // Using a different placeholder image
    },
  ];