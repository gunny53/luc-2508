import { BaseResponse, PaginationRequest } from "../base.interface";

// English content normalized from the original source text.
export interface PermissionDetail {
    id: string; // English content normalized from the original source text.
    name: string;
    description: string;
    module: string;
    path: string;
    method: string;
    action?: string;  // METHOD - /path format for UI display
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

// English content normalized from the original source text.
export interface PerCreateRequest {
    name: string;
    module: string;
    path: string;
    method: string;
}

export interface PerUpdateRequest {
    name: string;
    module: string;
    path: string;
    method: string;
}

// English content normalized from the original source text.
export interface PerGetAllResponse extends BaseResponse {
    data: PermissionDetail[]; // English content normalized from the original source text.
}

export interface PerCreateResponse extends BaseResponse {
    data: PermissionDetail; // English content normalized from the original source text.
}

export interface PerUpdateResponse extends BaseResponse {
    data: PermissionDetail;
}

export interface PerDeleteResponse extends BaseResponse {
    data: { message: string };
}

export interface PerGetByIdResponse extends BaseResponse {
    data: PermissionDetail;
}

// English content normalized from the original source text.
export interface PerListResponse {
    data: PermissionDetail[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PerDeleteRequest {
    id: string;
}

export interface PermissionItem {
    id: string; // English content normalized from the original source text.
    action: string;
    description: string;
}