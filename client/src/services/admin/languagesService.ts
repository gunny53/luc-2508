import { publicAxios, privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
    LangCreateRequest,
    LangCreateResponse,
    LangGetAllResponse,
    LangUpdateRequest,
    LangUpdateResponse,
    LangDeleteResponse,
    LangGetByIdResponse,
 } from '@/types/admin/languages.interface';
import { PaginationRequest } from '@/types/base.interface';

class LanguagesService {
    // English content normalized from the original source text.
    async getAll(params?: PaginationRequest, signal?: AbortSignal): Promise<LangGetAllResponse> {
        try {
            const response = await privateAxios.get(API_ENDPOINTS.LANGUAGES.GETALL, {
                params: params,
                signal: signal
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // English content normalized from the original source text.
    async getById(id: string, signal?: AbortSignal): Promise<LangGetByIdResponse> {
        try {
            const response = await privateAxios.get(
                API_ENDPOINTS.LANGUAGES.GETBYID.replace(':id', id),
                { signal }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // English content normalized from the original source text.
    async create(data: LangCreateRequest, signal?: AbortSignal): Promise<LangCreateResponse> {
        try {
            const response = await privateAxios.post(
                API_ENDPOINTS.LANGUAGES.POST,
                data,
                { signal }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // English content normalized from the original source text.
    async update(id: string, data: LangUpdateRequest, signal?: AbortSignal): Promise<LangUpdateResponse> {
        try {
            const response = await privateAxios.put(
                API_ENDPOINTS.LANGUAGES.UPDATE.replace(':id', id),
                data,
                { signal }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // English content normalized from the original source text.
    async deleteById(id: string, signal?: AbortSignal): Promise<LangDeleteResponse> {
        try {
            const response = await privateAxios.delete(
                API_ENDPOINTS.LANGUAGES.DELETE_BY_ID.replace(':id', id),
                { signal }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const languagesService = new LanguagesService();
