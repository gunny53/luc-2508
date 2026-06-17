// import { Brand } from "./brand-Columns"

// export const mockBrandData: Brand[] = [
//   {
//     id: 1,
//     code: "APPLE",
//     name: "Apple",
// English content normalized from the original source text.
//     logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
//     website: "https://www.apple.com",
// English content normalized from the original source text.
//     status: "active",
//     createdAt: "2024-01-15T08:00:00Z",
//     updatedAt: "2024-12-01T10:30:00Z"
//   },
//   {
//     id: 2,
//     code: "SAMSUNG",
//     name: "Samsung",
// English content normalized from the original source text.
//     logo: "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png",
//     website: "https://www.samsung.com",
// English content normalized from the original source text.
//     status: "active",
//     createdAt: "2024-01-20T09:15:00Z",
//     updatedAt: "2024-11-28T14:20:00Z"
//   }
// ]

// // Utility functions for working with brand data
// export const getBrandByCode = (code: string): Brand | undefined => {
//   return mockBrandData.find(brand => brand.code === code)
// }

// export const getBrandById = (id: string | number): Brand | undefined => {
//   return mockBrandData.find(brand => brand.id === id)
// }

// export const getActiveBrands = (): Brand[] => {
//   return mockBrandData.filter(brand => brand.status === "active")
// }

// export const getInactiveBrands = (): Brand[] => {
//   return mockBrandData.filter(brand => brand.status === "inactive")
// }

// export const getBrandsByCountry = (country: string): Brand[] => {
//   return mockBrandData.filter(brand => brand.country === country)
// }

// export const searchBrands = (query: string): Brand[] => {
//   const lowercaseQuery = query.toLowerCase()
//   return mockBrandData.filter(brand =>
//     brand.name.toLowerCase().includes(lowercaseQuery) ||
//     brand.code.toLowerCase().includes(lowercaseQuery) ||
//     brand.description?.toLowerCase().includes(lowercaseQuery) ||
//     brand.country?.toLowerCase().includes(lowercaseQuery)
//   )
// }

// // Export total count
// export const totalBrandsCount = mockBrandData.length
