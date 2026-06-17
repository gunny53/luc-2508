import { privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
  UserCreateRequest,
  UserUpdateRequest,
  UserUpdateResponse,
  UserCreateResponse,
  UserGetAllResponse,
  UserDeleteResponse,
  User,
  PaginationMeta
} from '@/types/admin/user.interface';
import { PaginationRequest } from '@/types/base.interface';

export const userService = {
    // English content normalized from the original source text.
    async getAll(params: any): Promise<UserGetAllResponse> {
        const response = await privateAxios.get(API_ENDPOINTS.USERS.GETALL, { params });
        return response.data;
    },
    // English content normalized from the original source text.
    async getById(id: string): Promise<{ data: User }> {
        const response = await privateAxios.get(
            API_ENDPOINTS.USERS.GETBYID.replace(':id', String(id))
        );
        return response.data;
    },
    // English content normalized from the original source text.
    async create(data: UserCreateRequest): Promise<UserCreateResponse> {
        const response = await privateAxios.post(
            API_ENDPOINTS.USERS.POST,
            data
        );
        return response.data;
    },
    // English content normalized from the original source text.
    async update(id: string, data: UserUpdateRequest): Promise<UserUpdateResponse> {
        const response = await privateAxios.put(
            API_ENDPOINTS.USERS.UPDATE.replace(':id', String(id)),
            data
        );
        return response.data;
    },
    // English content normalized from the original source text.
    async delete(id: string): Promise<UserDeleteResponse> {
        const response = await privateAxios.delete(
            API_ENDPOINTS.USERS.DELETE_BY_ID.replace(':id', String(id))
        );
        return response.data;
    }
}
