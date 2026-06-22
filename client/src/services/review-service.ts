import { publicAxios, privateAxios } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'
import { PaginationRequest } from '@/types/base.interface'
import { CreateReviewRequest, GetReviewsResponse, Review, UpdateReviewRequest } from '@/types/review.interface'

export const reviewService = {
  getReviewsByProductId: (productId: string, params?: PaginationRequest) => {
    const url = API_ENDPOINTS.REVIEW.GET_BY_ID.replace(':productId', productId)
    return privateAxios.get<GetReviewsResponse>(url, { params })
  },
  createReview: (payload: CreateReviewRequest) => {
    return privateAxios.post<Review>(API_ENDPOINTS.REVIEW.CREATE, payload)
  },
  updateReview: (reviewId: string, payload: UpdateReviewRequest) => {
    const url = API_ENDPOINTS.REVIEW.UPDATE.replace(':reviewId', reviewId)
    return privateAxios.patch<Review>(url, payload)
  },
  deleteReview: (reviewId: string) => {
    const url = API_ENDPOINTS.REVIEW.DELETE.replace(':reviewId', reviewId)
    return privateAxios.delete(url)
  }
}
