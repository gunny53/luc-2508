import { publicAxios, privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { PaginationRequest } from '@/types/base.interface';
import {
  CreateReviewRequest,
  GetReviewsResponse,
  Review,
  UpdateReviewRequest,
} from '@/types/review.interface';

export const reviewService = {
  // English content normalized from the original source text.
  getReviewsByProductId: (productId: string, params?: PaginationRequest) => {
    const url = API_ENDPOINTS.REVIEW.GET_BY_ID.replace(':productId', productId);
    return privateAxios.get<GetReviewsResponse>(url, { params });
  },

  // English content normalized from the original source text.
  createReview: (payload: CreateReviewRequest) => {
    // English content normalized from the original source text.
    return privateAxios.post<Review>(API_ENDPOINTS.REVIEW.CREATE, payload);
  },

  // English content normalized from the original source text.
  updateReview: (reviewId: string, payload: UpdateReviewRequest) => {
    const url = API_ENDPOINTS.REVIEW.UPDATE.replace(':reviewId', reviewId);
    return privateAxios.patch<Review>(url, payload);
  },

  // English content normalized from the original source text.
  deleteReview: (reviewId: string) => {
    const url = API_ENDPOINTS.REVIEW.DELETE.replace(':reviewId', reviewId);
    return privateAxios.delete(url);
  },
};
