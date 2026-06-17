import { PaginationMetadata, PaginationRequest } from "../base.interface";

// Interface cho Brand Translation
export interface BrandTranslation {
  id?: number;
  brandId: number;
  languageId: number;
  name: string;
  description?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// English content normalized from the original source text.
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  createdById?: number;
  updatedById?: number | null;
  deletedById?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  brandTranslations: BrandTranslation[];
}

// English content normalized from the original source text.
export interface BrandCreateRequest {
  name: string;
  logo?: string;
  translations?: Array<{
    languageId: number;
    name: string;
    description?: string;
  }>;
}

export interface BrandUpdateRequest {
  name?: string;
  logo?: string;
  translations?: Array<{
    languageId: number;
    name?: string;
    description?: string;
  }>;
}

// Response interface
export interface BrandGetAllResponse {
  data: Brand[];
  metadata: PaginationMetadata;
}

export interface BrandGetByIdResponse {
  data: Brand;
}

// Params interface
export interface BrandParams extends PaginationRequest {
  // English content normalized from the original source text.
}