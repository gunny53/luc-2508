import { BaseResponse } from '@/types/base.interface'

export interface PaginationMeta {
  itemsPerPage: number
  totalItems: number
  currentPage: number
  totalPages: number
  search?: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  name?: string
  phoneNumber: string
  bio: string
  avatar: string
  countryCode: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedById: string | null
  updatedById: string | null
  createdById: string | null
}












export interface UserRole {
  id: string
  name: string
}

export interface UserAddress {
  id: string
  name: string
  recipient: string
  phoneNumber: string
  province: string
  district: string
  ward: string
  provinceId: number
  districtId: number
  wardCode: string
  street: string
  addressType: string
  createdById: string
  updatedById: null
  deletedById: null
  deletedAt: null
  createdAt: string
  updatedAt: string
  isDefault: false
}
export interface User {
  id: string
  email: string
  name: string
  phoneNumber: string
  avatar: string
  status: string
  roleId: string
  createdById: string | null
  updatedById: string | null
  deletedById: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  role: UserRole
  addresses: UserAddress[]
}
export interface UserGetAllResponse extends BaseResponse {
  data: User[]
  metadata: {
    totalItems: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
export interface UserCreateRequest {
  email: string
  name: string
  phoneNumber: string
  avatar?: string
  password: string
  confirmPassword?: string 
  roleId: string
  status: string
}

export interface UserCreateResponse extends BaseResponse {
  data: User
}
export interface UserUpdateRequest {
  
  email?: string
  name?: string
  phoneNumber?: string
  avatar?: string
  roleId?: string
  status?: string
}

export interface UserUpdateResponse extends BaseResponse {
  data: User
}
export interface UserDeleteResponse extends BaseResponse {}
