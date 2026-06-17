import { privateAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { PaginationRequest } from "@/types/base.interface";
import {
  Product,
  ProductsResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductDetailResponse,
  ProductDetail
} from "@/types/products.interface";

export const productsService = {
  // English content normalized from the original source text.
  getAll: async (params?: PaginationRequest & {
    minPrice?: number,
    maxPrice?: number,
    categories?: string,
    name?: string
  }, signal?: AbortSignal): Promise<ProductsResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.MANAGE_PRODUCTS.LIST, {
        params: params,
        signal: signal, // Add the AbortSignal support
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // English content normalized from the original source text.
  getById: async (id: string): Promise<ProductDetail> => {
    try {
      const url = API_ENDPOINTS.MANAGE_PRODUCTS.DETAIL.replace(":id", id);
      const response = await privateAxios.get<ProductDetailResponse>(url);
      return response.data.data; // English content normalized from the original source text.
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  // English content normalized from the original source text.
  create: async (data: ProductCreateRequest): Promise<Product> => {
    try {
      const response = await privateAxios.post(API_ENDPOINTS.MANAGE_PRODUCTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // English content normalized from the original source text.
  update: async (
    id: string,
    data: ProductUpdateRequest
  ): Promise<Product> => {
    try {
      const url = API_ENDPOINTS.MANAGE_PRODUCTS.UPDATE.replace(":id", id);
      const response = await privateAxios.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  },

  // English content normalized from the original source text.
  delete: async (id: string): Promise<Product> => {
    try {
      const url = API_ENDPOINTS.MANAGE_PRODUCTS.DELETE.replace(":id", id);
      const response = await privateAxios.delete(url);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },
};