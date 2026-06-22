import { BaseResponse, PaginationRequest } from '../base.interface'
export interface PermissionDetail {
  id: string
  name: string
  description: string
  module: string
  path: string
  method: string
  action?: string // METHOD - /path format for UI display
  createdById: string
  updatedById: string
  deletedById: string
  deletedAt: string
  createdAt: string
  updatedAt: string
}
export interface PerCreateRequest {
  name: string
  module: string
  path: string
  method: string
}

export interface PerUpdateRequest {
  name: string
  module: string
  path: string
  method: string
}
export interface PerGetAllResponse extends BaseResponse {
  data: PermissionDetail[]
}

export interface PerCreateResponse extends BaseResponse {
  data: PermissionDetail
}

export interface PerUpdateResponse extends BaseResponse {
  data: PermissionDetail
}

export interface PerDeleteResponse extends BaseResponse {
  data: { message: string }
}

export interface PerGetByIdResponse extends BaseResponse {
  data: PermissionDetail
}
export interface PerListResponse {
  data: PermissionDetail[]
  totalItems: number
  page: number
  limit: number
  totalPages: number
}

export interface PerDeleteRequest {
  id: string
}

export interface PermissionItem {
  id: string
  action: string
  description: string
}
