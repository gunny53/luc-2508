import { privateAxios } from '@/lib/api';
import {
    SessionGetALLResponse,
    SessionRevokeAllRequest,
    SessionRevokeAllResponse,
    SessionRevokeRequest,
    SessionRevokeResponse
} from '@/types/auth/session.interface';
import { API_ENDPOINTS } from '@/constants/api';
import { PaginationRequest } from '@/types/base.interface';

export const sessionService = {
    // English content normalized from the original source text.
    getAll: async (params?: PaginationRequest): Promise<SessionGetALLResponse> => {
        const response = await privateAxios.get<SessionGetALLResponse>(API_ENDPOINTS.SESSIONS.GETALL, { params });
        return response.data;
    },

    // English content normalized from the original source text.
    revokeAll: async (data: SessionRevokeAllRequest): Promise<SessionRevokeAllResponse> => {
        const response = await privateAxios.post<SessionRevokeAllResponse>(API_ENDPOINTS.SESSIONS.REVOKE_ALL, data);
        return response.data;
    },

    // English content normalized from the original source text.
    revoke: async (data: SessionRevokeRequest): Promise<SessionRevokeResponse> => {
        const response = await privateAxios.post<SessionRevokeResponse>(API_ENDPOINTS.SESSIONS.REVOKE, data);
        return response.data;
    }
};
