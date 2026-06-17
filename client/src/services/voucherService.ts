import { privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
  Voucher,
  VoucherCreateRequest,
  VoucherUpdateRequest,
  ValidateVoucherRequest
} from '@/types/admin/voucher.interface';

export const voucherService = {
  // English content normalized from the original source text.
  async getVouchers(params: any = {}) {
    const response = await privateAxios.get(API_ENDPOINTS.DISCOUNT.GETALL, { params });
    return response.data;
  },

  // English content normalized from the original source text.
  async getVoucherById(id: string) {
    const response = await privateAxios.get(
      API_ENDPOINTS.DISCOUNT.GET_BY_ID.replace(':discountId', id)
    );
    return response.data;
  },

  // English content normalized from the original source text.
  async createVoucher(data: VoucherCreateRequest) {
    const response = await privateAxios.post(
      API_ENDPOINTS.DISCOUNT.CREATE,
      data
    );
    return response.data;
  },

  // English content normalized from the original source text.
  async updateVoucher(data: VoucherUpdateRequest) {
    const response = await privateAxios.patch(
      API_ENDPOINTS.DISCOUNT.UPDATE.replace(':discountId', data.id),
      data
    );
    return response.data;
  },

  // English content normalized from the original source text.
  async deleteVoucher(id: string) {
    const response = await privateAxios.delete(
      API_ENDPOINTS.DISCOUNT.DELETE.replace(':discountId', id)
    );
    return response.data;
  },

  // English content normalized from the original source text.
  async getAvailableVouchers(params: any = {}) {
    const response = await privateAxios.get(
      API_ENDPOINTS.DISCOUNT.GUEST_GET_DISCOUNT_LIST,
      { params }
    );
    return response.data;
  },

  // English content normalized from the original source text.
  async validateVoucher(data: ValidateVoucherRequest) {
    const response = await privateAxios.post(
      API_ENDPOINTS.DISCOUNT.VALIDATE_DISCOUNT,
      data
    );
    return response.data;
  },
}